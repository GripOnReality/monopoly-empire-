// ═══════════════════════════════════════════════════════════════════════════
// 6SIDES.LIVE — Multiplayer Server
// Express + Socket.IO  •  Room system  •  Chat  •  Reconnection  •  Cleanup
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────
const PORT              = process.env.PORT || 3000;
const MIN_PLAYERS       = 2;
const MAX_PLAYERS       = 6;
const MAX_NAME_LENGTH   = 24;
const MAX_CHAT_LENGTH   = 280;
const CHAT_HISTORY_SIZE = 100;           // messages kept per room
const CHAT_RATE_LIMIT   = 500;           // ms between messages per socket
const RECONNECT_GRACE   = 2 * 60 * 1000; // 2 min before an in-game slot is freed
const STALE_ROOM_MS     = 3 * 60 * 60 * 1000; // 3 hours
const CLEANUP_INTERVAL  = 10 * 60 * 1000;      // check every 10 min

const PLAYER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c',
];

// ─── App + Socket.IO Setup ──────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingInterval: 25000,
  pingTimeout:  20000,
});

// Serve the static client from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health-check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    rooms:  rooms.size,
    connections: io.engine.clientsCount,
  });
});

// Debug: list active rooms (player names only, no socket ids)
app.get('/rooms', (_req, res) => {
  const list = [];
  for (const [code, room] of rooms) {
    list.push({
      code,
      host:       room.players[0]?.name || '?',
      players:    room.players.length,
      connected:  room.players.filter(p => p.connected).length,
      started:    room.started,
      createdAt:  room.createdAt,
      lastActive: room.lastActivity,
    });
  }
  res.json(list);
});

// ─── Store API (mock — serves static catalog) ────────────────────────────────
app.get('/api/store', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Store catalog served from client-side. This endpoint validates purchases in production.',
  });
});

// ─── Profile API (mock — in production, persists to database) ────────────────
app.use(express.json({ limit: '10kb' }));

app.post('/api/profile/email', (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  // In production: save to DB, send verification email
  console.log(`[PROFILE] Email registered: ${email}`);
  res.json({ success: true, message: 'Email connected successfully', email });
});

app.get('/api/leaderboard', (_req, res) => {
  // Mock leaderboard — in production, fetch from database
  res.json({
    weekly: [
      { rank: 1, name: 'CryptoKing', wins: 342, score: 28500 },
      { rank: 2, name: 'EmpressNova', wins: 298, score: 24200 },
      { rank: 3, name: 'DarkRider', wins: 267, score: 21800 },
    ],
    message: 'Full leaderboard served from client-side mock data.'
  });
});

// ─── Open Rooms (for Quick Play matchmaking) ─────────────────────────────────
app.get('/api/quick-play', (_req, res) => {
  const openRooms = [];
  for (const [code, room] of rooms) {
    if (!room.started && !room.isPrivate && room.players.length < 6 && room.players.length >= 1) {
      openRooms.push({
        code,
        players: room.players.length,
        host: room.players[0]?.name || '?',
      });
    }
  }
  // Return a random open room or null
  if (openRooms.length > 0) {
    const pick = openRooms[Math.floor(Math.random() * openRooms.length)];
    res.json({ success: true, room: pick });
  } else {
    res.json({ success: false, message: 'No open rooms. Create a new one!' });
  }
});

// ─── Room Storage ───────────────────────────────────────────────────────────
const rooms = new Map(); // roomCode -> RoomState

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Generate a 6-char room code from unambiguous characters. */
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

/** Sanitise a player name. */
function sanitiseName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/[<>&"'/\\]/g, '').trim().slice(0, MAX_NAME_LENGTH);
}

/** Sanitise a chat message. */
function sanitiseChat(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/[<>&"'/\\]/g, '').trim().slice(0, MAX_CHAT_LENGTH);
}

/** Pick a player colour that hasn't been taken in this room. */
function nextAvailableColor(room) {
  const usedColors = new Set(room.players.map(p => p.color));
  return PLAYER_COLORS.find(c => !usedColors.has(c)) || PLAYER_COLORS[room.players.length % PLAYER_COLORS.length];
}

/** Return a response object via callback or named event. */
function respond(socket, eventName, data, callback) {
  if (typeof callback === 'function') callback(data);
  else socket.emit(eventName, data);
}

/** Touch room activity timestamp. */
function touch(room) {
  room.lastActivity = Date.now();
}

/** Build the serialisable snapshot of a room (hides internal timers). */
function roomSnapshot(room) {
  return {
    roomCode:     room.roomCode,
    hostId:       room.hostId,
    players:      room.players.map(p => ({
      id:         p.id,
      name:       p.name,
      connected:  p.connected,
      position:   p.position,
      money:      p.money,
      properties: [...p.properties],
      color:      p.color,
      seatIndex:  p.seatIndex,
    })),
    started:      room.started,
    currentTurn:  room.currentTurn,
    createdAt:    room.createdAt,
    chatHistory:  room.chatHistory,
  };
}

// ─── Room Lifecycle ─────────────────────────────────────────────────────────

function createRoom(hostId, hostName, isPrivate, password) {
  const roomCode = generateRoomCode();
  const room = {
    roomCode,
    hostId,
    players: [{
      id:         hostId,
      name:       hostName,
      connected:  true,
      position:   0,
      money:      1500,
      properties: [],
      color:      PLAYER_COLORS[0],
      seatIndex:  0,
      // Reconnection token: a random string the client stores
      reconnectToken: generateReconnectToken(),
    }],
    started:       false,
    currentTurn:   0,
    createdAt:     Date.now(),
    lastActivity:  Date.now(),
    chatHistory:   [],             // { playerName, playerId, message, timestamp }
    _disconnectTimers: new Map(),  // playerId -> setTimeout handle
    // Game settings (synced from host client)
    settings: {
      startingMoney: 1500,
      freeParkingRule: 'tax-collection',
      auctionProperties: 'on',
      turnTimer: 60,
      startingPosition: 'go',
      goSalary: 200,
      maxTurns: 0,
    },
    // Private room
    isPrivate: !!isPrivate,
    password: password || null,
    // Server-side turn timer
    _turnTimer: null,
    _turnTimerDuration: 0,
  };
  rooms.set(roomCode, room);
  return room;
}

function generateReconnectToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  return token;
}

/**
 * Try to free a player slot from an in-progress game.
 * Called after the grace period expires with no reconnection.
 */
function expireDisconnectedPlayer(roomCode, seatIndex) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const player = room.players[seatIndex];
  if (!player || player.connected) return;

  console.log(`[EXPIRE] ${player.name} timed out from room ${roomCode}`);

  // If the game hasn't started we already removed them on disconnect,
  // so this only fires for in-progress games.
  // We mark them as "abandoned" — the client game engine treats them as bankrupt.
  player.abandoned = true;

  io.to(roomCode).emit('player-abandoned', {
    seatIndex,
    playerName: player.name,
    gameState:  roomSnapshot(room),
  });

  // Advance turn if it was their go
  advanceTurnIfNeeded(room, seatIndex);
  tryCleanup(roomCode);
}

/** Move the turn forward if the given seat was the active player. */
function advanceTurnIfNeeded(room, seatIndex) {
  if (room.currentTurn !== seatIndex) return;
  const eligible = room.players
    .map((p, i) => (p.connected && !p.abandoned) ? i : -1)
    .filter(i => i !== -1);
  if (eligible.length === 0) return;

  const curIdx = eligible.indexOf(room.currentTurn);
  const nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % eligible.length;
  room.currentTurn = eligible[nextIdx];

  io.to(room.roomCode).emit('turn-changed', {
    currentTurn: room.currentTurn,
    gameState:   roomSnapshot(room),
  });
}

/** Delete room if everyone is gone. */
function tryCleanup(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const alive = room.players.filter(p => p.connected);
  if (alive.length === 0) {
    // Clear any pending disconnect timers
    for (const timer of room._disconnectTimers.values()) clearTimeout(timer);
    rooms.delete(roomCode);
    console.log(`[CLEANUP] Room ${roomCode} deleted (empty)`);
  }
}

// ─── Socket.IO Connection Handler ───────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  // Per-socket rate-limit tracker for chat
  let lastChatTime = 0;

  // ── Create Room ──────────────────────────────────────────────────────────
  socket.on('create-room', (data, callback) => {
    // Guard: already in a room?
    if (socket.data.roomCode) {
      return respond(socket, 'room-created', {
        success: false, error: 'You are already in a room',
      }, callback);
    }

    const playerName = sanitiseName(data?.playerName) || 'Host';
    const isPrivate = !!data?.isPrivate;
    const password = data?.password ? String(data.password).slice(0, 20) : null;
    const room = createRoom(socket.id, playerName, isPrivate, password);

    socket.join(room.roomCode);
    socket.data.roomCode = room.roomCode;
    socket.data.seatIndex = 0;

    console.log(`[ROOM] "${playerName}" created room ${room.roomCode}`);

    respond(socket, 'room-created', {
      success:        true,
      roomCode:       room.roomCode,
      reconnectToken: room.players[0].reconnectToken,
      gameState:      roomSnapshot(room),
    }, callback);
  });

  // ── Join Room ────────────────────────────────────────────────────────────
  socket.on('join-room', (data, callback) => {
    const code = ((data?.roomCode) || '').toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return respond(socket, 'room-joined', {
        success: false, error: 'Room not found',
      }, callback);
    }

    const playerName = sanitiseName(data?.playerName) || `Player ${room.players.length + 1}`;

    // ── Reconnection attempt (token-based, falls back to name) ───────────
    const reconnectToken = data?.reconnectToken || null;
    if (room.started) {
      let existing = null;
      if (reconnectToken) {
        existing = room.players.find(p => p.reconnectToken === reconnectToken && !p.connected);
      }
      if (!existing) {
        // Fallback: match by name (for players who lost their token)
        existing = room.players.find(p => p.name === playerName && !p.connected);
      }

      if (existing) {
        // Cancel disconnect expiry timer
        const timer = room._disconnectTimers.get(existing.seatIndex);
        if (timer) { clearTimeout(timer); room._disconnectTimers.delete(existing.seatIndex); }

        existing.id = socket.id;
        existing.connected = true;
        existing.abandoned = false;

        socket.join(code);
        socket.data.roomCode  = code;
        socket.data.seatIndex = existing.seatIndex;
        touch(room);

        console.log(`[RECONNECT] "${existing.name}" rejoined room ${code}`);

        io.to(code).emit('player-reconnected', {
          seatIndex:  existing.seatIndex,
          playerName: existing.name,
          gameState:  roomSnapshot(room),
        });

        return respond(socket, 'room-joined', {
          success:        true,
          roomCode:       code,
          reconnected:    true,
          reconnectToken: existing.reconnectToken,
          seatIndex:      existing.seatIndex,
          gameState:      roomSnapshot(room),
        }, callback);
      }

      // Not reconnecting — game in progress, can't add new players
      return respond(socket, 'room-joined', {
        success: false, error: 'Game already in progress',
      }, callback);
    }

    // ── Normal join (pre-game lobby) ─────────────────────────────────────
    // Check private room password
    if (room.isPrivate && room.password) {
      const joinPassword = data?.password || '';
      if (joinPassword !== room.password) {
        return respond(socket, 'room-joined', {
          success: false, error: 'Incorrect room password', needsPassword: true,
        }, callback);
      }
    }

    if (room.players.length >= MAX_PLAYERS) {
      return respond(socket, 'room-joined', {
        success: false, error: `Room is full (max ${MAX_PLAYERS} players)`,
      }, callback);
    }
    if (room.players.some(p => p.id === socket.id)) {
      return respond(socket, 'room-joined', {
        success: false, error: 'You are already in this room',
      }, callback);
    }

    const seatIndex = room.players.length;
    const player = {
      id:             socket.id,
      name:           playerName,
      connected:      true,
      position:       0,
      money:          1500,
      properties:     [],
      color:          nextAvailableColor(room),
      seatIndex,
      reconnectToken: generateReconnectToken(),
    };

    room.players.push(player);
    socket.join(code);
    socket.data.roomCode  = code;
    socket.data.seatIndex = seatIndex;
    touch(room);

    console.log(`[JOIN] "${player.name}" joined room ${code} (${room.players.length}/${MAX_PLAYERS})`);

    // Broadcast to everyone (including the joiner via their callback)
    io.to(code).emit('player-joined', {
      seatIndex,
      player: {
        id: player.id, name: player.name, connected: true,
        position: 0, money: 1500, properties: [], color: player.color, seatIndex,
      },
      gameState: roomSnapshot(room),
    });

    respond(socket, 'room-joined', {
      success:        true,
      roomCode:       code,
      reconnectToken: player.reconnectToken,
      seatIndex,
      gameState:      roomSnapshot(room),
    }, callback);
  });

  // ── Game Actions (authoritative state sync) ──────────────────────────────
  socket.on('game-action', (data) => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;
    touch(room);

    const { action, payload } = data || {};
    if (!action) return;

    switch (action) {

      // ── Start Game ─────────────────────────────────────────────────────
      case 'start-game': {
        if (socket.id !== room.hostId) {
          return socket.emit('error-message', { error: 'Only the host can start the game' });
        }
        const connected = room.players.filter(p => p.connected);
        if (connected.length < MIN_PLAYERS) {
          return socket.emit('error-message', {
            error: `Need at least ${MIN_PLAYERS} connected players to start`,
          });
        }
        room.started = true;
        room.currentTurn = 0;
        room._turnTimerDuration = parseInt(room.settings.turnTimer) || 0;
        console.log(`[START] Room ${roomCode} — ${connected.length} players (timer: ${room._turnTimerDuration}s)`);
        io.to(roomCode).emit('game-started', roomSnapshot(room));
        // Start the server-side backup timer
        startServerTurnTimer(room);
        break;
      }

      // ── Roll Dice (server-authoritative) ───────────────────────────────
      case 'roll-dice': {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        io.to(roomCode).emit('dice-rolled', {
          playerId:  socket.id,
          seatIndex: socket.data.seatIndex,
          die1, die2,
          total:   die1 + die2,
          doubles: die1 === die2,
        });
        break;
      }

      // ── End Turn ───────────────────────────────────────────────────────
      case 'end-turn': {
        // Clear server-side turn timer
        if (room._turnTimer) { clearTimeout(room._turnTimer); room._turnTimer = null; }

        const eligible = room.players
          .map((p, i) => (p.connected && !p.abandoned) ? i : -1)
          .filter(i => i !== -1);
        if (eligible.length === 0) break;
        const curIdx = eligible.indexOf(room.currentTurn);
        const nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % eligible.length;
        room.currentTurn = eligible[nextIdx];
        io.to(roomCode).emit('turn-changed', {
          currentTurn: room.currentTurn,
          gameState:   roomSnapshot(room),
        });

        // Start server-side backup timer for next turn
        startServerTurnTimer(room);
        break;
      }

      // ── Settings Sync (from host) ─────────────────────────────────────
      case 'settings-update': {
        if (socket.id === room.hostId && payload) {
          if (payload.key && payload.value !== undefined) {
            room.settings[payload.key] = payload.value;
          }
          // Update turn timer duration
          if (payload.key === 'turnTimer') {
            room._turnTimerDuration = parseInt(payload.value) || 0;
          }
        }
        // Broadcast to others (default handler below will do this)
        socket.to(roomCode).emit('game-action', { action, payload, playerId: socket.id, seatIndex: socket.data.seatIndex });
        break;
      }

      case 'settings-sync': {
        if (socket.id === room.hostId && payload && payload.settings) {
          room.settings = { ...room.settings, ...payload.settings };
          room._turnTimerDuration = parseInt(room.settings.turnTimer) || 0;
        }
        socket.to(roomCode).emit('game-action', { action, payload, playerId: socket.id, seatIndex: socket.data.seatIndex });
        break;
      }

      // ── Force End Turn (server timer expired) ──────────────────────────
      case 'force-end-turn': {
        // Only server itself triggers this via the timer, but accept from host too
        if (socket.id === room.hostId) {
          if (room._turnTimer) { clearTimeout(room._turnTimer); room._turnTimer = null; }
          const eligibleF = room.players
            .map((p, i) => (p.connected && !p.abandoned) ? i : -1)
            .filter(i => i !== -1);
          if (eligibleF.length === 0) break;
          const curIdxF = eligibleF.indexOf(room.currentTurn);
          const nextIdxF = curIdxF === -1 ? 0 : (curIdxF + 1) % eligibleF.length;
          room.currentTurn = eligibleF[nextIdxF];
          io.to(roomCode).emit('turn-changed', {
            currentTurn: room.currentTurn,
            gameState: roomSnapshot(room),
            forced: true,
          });
          startServerTurnTimer(room);
        }
        break;
      }

      // ── Client-Authoritative State Push ────────────────────────────────
      // The current-turn client sends the full game state after it resolves
      // its local engine step.  Everyone else replaces their local state.
      case 'update-state': {
        if (payload) {
          // Merge scalar/array fields the client is allowed to update
          const allowed = [
            'currentTurn', 'players', 'propertyState',
            'housesAvailable', 'hotelsAvailable', 'freeParkingPot',
            'turnNumber', 'gamePhase', 'lastDice',
          ];
          for (const key of allowed) {
            if (payload[key] !== undefined) room[key] = payload[key];
          }
        }
        socket.to(roomCode).emit('game-state-update', {
          ...roomSnapshot(room),
          ...(payload || {}),
        });
        break;
      }

      // ── Generic / Custom Actions ───────────────────────────────────────
      default:
        socket.to(roomCode).emit('game-action', {
          action,
          payload,
          playerId:  socket.id,
          seatIndex: socket.data.seatIndex,
        });
        break;
    }
  });

  // ── Chat Message ─────────────────────────────────────────────────────────
  socket.on('chat-message', (data) => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    // Rate-limit
    const now = Date.now();
    if (now - lastChatTime < CHAT_RATE_LIMIT) return;
    lastChatTime = now;

    const message = sanitiseChat(data?.message);
    if (!message) return;

    const player = room.players.find(p => p.id === socket.id);
    const entry = {
      playerName: player?.name || 'Unknown',
      playerId:   socket.id,
      seatIndex:  socket.data.seatIndex ?? -1,
      color:      player?.color || '#888',
      message,
      timestamp:  now,
    };

    // Store in room history (ring buffer)
    room.chatHistory.push(entry);
    if (room.chatHistory.length > CHAT_HISTORY_SIZE) {
      room.chatHistory.shift();
    }

    touch(room);
    io.to(roomCode).emit('chat-message', entry);
  });

  // ── Leave Room (voluntary) ───────────────────────────────────────────────
  socket.on('leave-room', () => {
    handleDisconnect(socket, true);
  });

  // ── Socket Disconnect ────────────────────────────────────────────────────
  socket.on('disconnect', (reason) => {
    console.log(`[DISCONNECT] ${socket.id} (${reason})`);
    handleDisconnect(socket, false);
  });

  // ── Disconnect Logic (shared between leave-room and disconnect) ──────────
  function handleDisconnect(sock, voluntary) {
    const roomCode = sock.data.roomCode;
    if (!roomCode) return;
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === sock.id);
    if (!player) return;

    player.connected = false;
    const seatIndex = player.seatIndex;
    console.log(`[LEAVE] "${player.name}" left room ${roomCode}${voluntary ? ' (voluntary)' : ''}`);

    // ── Pre-game lobby: remove the player slot entirely ─────────────────
    if (!room.started) {
      room.players = room.players.filter(p => p.id !== sock.id);

      // Re-index seat numbers
      room.players.forEach((p, i) => { p.seatIndex = i; });

      // Reassign host
      if (room.hostId === sock.id && room.players.length > 0) {
        room.hostId = room.players[0].id;
      }

      io.to(roomCode).emit('player-left', {
        seatIndex,
        playerName: player.name,
        gameState:  roomSnapshot(room),
      });

      tryCleanup(roomCode);
      return;
    }

    // ── In-game: keep the slot but start the grace timer ────────────────
    io.to(roomCode).emit('player-disconnected', {
      seatIndex,
      playerName:    player.name,
      gracePeriodMs: voluntary ? 0 : RECONNECT_GRACE,
      gameState:     roomSnapshot(room),
    });

    // Advance turn immediately so the game isn't stuck
    advanceTurnIfNeeded(room, seatIndex);

    if (voluntary) {
      // No grace period — treat as abandoned right away
      player.abandoned = true;
      io.to(roomCode).emit('player-abandoned', {
        seatIndex,
        playerName: player.name,
        gameState:  roomSnapshot(room),
      });
      tryCleanup(roomCode);
    } else {
      // Start grace timer — if they don't reconnect, mark abandoned
      const timer = setTimeout(() => {
        room._disconnectTimers.delete(seatIndex);
        expireDisconnectedPlayer(roomCode, seatIndex);
      }, RECONNECT_GRACE);
      room._disconnectTimers.set(seatIndex, timer);
    }
  }
});

// ─── Server-Side Turn Timer (Backup) ────────────────────────────────────────
function startServerTurnTimer(room) {
  if (room._turnTimer) { clearTimeout(room._turnTimer); room._turnTimer = null; }
  const duration = room._turnTimerDuration;
  if (!duration || duration <= 0) return; // Timer disabled

  const gracePeriod = 5000; // 5 seconds grace beyond client timer
  const totalMs = (duration * 1000) + gracePeriod;
  const roomCode = room.roomCode;
  const expectedSeat = room.currentTurn;

  room._turnTimer = setTimeout(() => {
    room._turnTimer = null;
    const currentRoom = rooms.get(roomCode);
    if (!currentRoom || !currentRoom.started) return;
    // Only force if the turn hasn't changed (client didn't handle it)
    if (currentRoom.currentTurn !== expectedSeat) return;

    console.log(`[TIMER] Force-ending turn for seat ${expectedSeat} in room ${roomCode}`);
    const eligible = currentRoom.players
      .map((p, i) => (p.connected && !p.abandoned) ? i : -1)
      .filter(i => i !== -1);
    if (eligible.length === 0) return;
    const curIdx = eligible.indexOf(currentRoom.currentTurn);
    const nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % eligible.length;
    currentRoom.currentTurn = eligible[nextIdx];
    io.to(roomCode).emit('turn-changed', {
      currentTurn: currentRoom.currentTurn,
      gameState: roomSnapshot(currentRoom),
      forced: true,
    });
    startServerTurnTimer(currentRoom);
  }, totalMs);
}

// ─── Periodic Stale-Room Cleanup ────────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const age      = now - room.createdAt;
    const idle     = now - room.lastActivity;
    const allGone  = room.players.every(p => !p.connected);

    if (age > STALE_ROOM_MS || (allGone && idle > 5 * 60 * 1000)) {
      for (const timer of room._disconnectTimers.values()) clearTimeout(timer);
      rooms.delete(code);
      console.log(`[CLEANUP] Stale room ${code} removed (age: ${Math.round(age / 60000)}m, idle: ${Math.round(idle / 60000)}m)`);
    }
  }
}, CLEANUP_INTERVAL);

// ─── Start ──────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n  ♛  6sides.live server`);
  console.log(`     http://localhost:${PORT}`);
  console.log(`     Health:  http://localhost:${PORT}/health`);
  console.log(`     Rooms:   http://localhost:${PORT}/rooms\n`);
});
