# 🎩 Monopoly Empire

A real-time multiplayer Monopoly board game powered by Node.js, Express, and Socket.IO.

## Features

- **Multiplayer rooms** — Create or join games with a 6-character room code
- **2–6 players** per room
- **Real-time sync** — Game state broadcast instantly to all players via WebSockets
- **In-game chat** — Send messages to other players in your room
- **Dice rolling** — Server-side dice rolls to keep things fair
- **Reconnection support** — Rejoin a game in progress if you disconnect
- **Auto-cleanup** — Empty and stale rooms are removed automatically
- **Graceful disconnection** — Turns are skipped for disconnected players

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm (comes with Node.js)

## Installation

```bash
cd monopoly-game
npm install
```

## Running the Server

**Production:**

```bash
npm start
```

**Development (auto-restart on file changes):**

```bash
npm run dev
```

The server starts on **http://localhost:3000** by default.
Set the `PORT` environment variable to change it:

```bash
PORT=8080 npm start
```

## Project Structure

```
monopoly-game/
├── package.json
├── README.md
├── server/
│   └── index.js          # Express + Socket.IO server
└── public/               # Static frontend files (HTML/CSS/JS)
    ├── index.html
    ├── style.css
    └── game.js
```

## How to Play

1. **Start the server** and open `http://localhost:3000` in your browser.
2. **Create a room** — You'll get a 6-character code (e.g. `K4WR7N`).
3. **Share the code** with friends (2–6 players).
4. Friends **join the room** by entering the code.
5. The host **starts the game** once everyone has joined.
6. Players take turns rolling dice, buying properties, and collecting rent.
7. Game state syncs automatically — everyone sees moves in real time.

## Socket Events

| Event              | Direction       | Description                          |
|--------------------|-----------------|--------------------------------------|
| `create-room`      | Client → Server | Create a new game room               |
| `join-room`        | Client → Server | Join an existing room by code        |
| `game-action`      | Client → Server | Send a game action (roll, buy, etc.) |
| `chat-message`     | Both ways       | In-game chat                         |
| `game-state-update`| Server → Client | Broadcast updated game state         |
| `player-joined`    | Server → Client | New player joined the room           |
| `player-disconnected`| Server → Client | A player left                      |
| `dice-rolled`      | Server → Client | Dice roll result                     |
| `turn-changed`     | Server → Client | Next player's turn                   |

## License

MIT
