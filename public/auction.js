/* ═══════════════════════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — auction.js
   Auction System Module
   ═══════════════════════════════════════════════════════════════════════════════

   API
   ───
   Constructor:
     new AuctionManager(engine, socket, mySeat)
       engine  — MonopolyEngine instance (players[], propertyState{}, etc.)
       socket  — Socket.IO client socket
       mySeat  — this player's seatIndex (Number)

   Methods:
     startAuction(propertyPos, declinedBySeat)
       Initiates an auction for the property at `propertyPos`.
       `declinedBySeat` is the seat that declined the direct buy.
       Emits 'auction-start' to all clients.

     placeBid(amount)
       Places a bid from the local player. Validates amount > current bid,
       amount >= 10, and player can afford it. Emits 'auction-bid'.

     receiveBid(seatIndex, amount)
       Processes an incoming bid from the network (another player).

     tick()
       Called every second internally. Manages the countdown timer.
       When timer reaches 0 with no new bids, resolves the auction.

     resolveAuction()
       Ends the auction. Highest bidder wins and pays their bid amount.
       If no one bid, the property returns to the bank.
       Emits 'auction-end'. Cleans up modal and state.

     renderAuctionModal()
       Returns the HTML string for the full auction modal (initial render).

     updateAuctionUI()
       Updates the existing auction modal DOM in-place (timer, bids, etc.).

     isActive()
       Returns Boolean — whether an auction is currently in progress.

     getState()
       Returns a plain-object snapshot of the current auction state
       (for serialisation / sync).

     setState(state)
       Restores auction state from a snapshot. Used for late-joiners.

     handleAction(data)
       Dispatches an incoming socket `game-action` whose action starts with
       'auction-'. Called by the host MonopolyClient._handleGameAction.
       data = { action: 'auction-bid'|'auction-pass'|..., payload: {...} }

   Socket events emitted (via broadcastAction pattern):
     'auction-start'  { pos, startedBy }
     'auction-bid'    { seat, amount }
     'auction-pass'   { seat }
     'auction-end'    { winner (seatIndex|null), amount, pos }

   Integration notes:
     • Include <script src="auction.js"></script> AFTER game.js in index.html.
     • In MonopolyClient, wire up:
         - passBuy() → this.auctionManager.startAuction(this._buyPos, this.mySeat)
         - _handleGameAction: delegate 'auction-*' to auctionManager.handleAction(data)
     • The modal is created dynamically if #modal-auction doesn't exist in the DOM.
     • Uses existing helpers: $(), escHtml(), showToast(), sfx(), BOARD_DATA,
       PLAYER_COLORS, GROUP_COLORS, getCharacter().
   ═══════════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CONSTANTS ─── */
  var TIMER_SECONDS    = 15;   // seconds per bidding round
  var MIN_BID          = 10;   // minimum opening bid
  var MIN_INCREMENT    = 1;    // minimum raise above current bid
  var QUICK_INCREMENTS = [10, 50, 100, 500];

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  CONSTRUCTOR                                                             */
  /* ═════════════════════════════════════════════════════════════════════════ */
  function AuctionManager(engine, socket, mySeat) {
    this.engine = engine;
    this.socket = socket;
    this.mySeat = mySeat;

    // Auction state
    this._active       = false;
    this._propertyPos  = null;
    this._startedBy    = null;   // seat that declined to buy
    this._highBid      = 0;
    this._highBidder   = null;   // seatIndex or null
    this._timer        = 0;      // seconds remaining
    this._participants = {};     // seatIndex → { active: bool, lastBid: Number }
    this._intervalId   = null;

    // Callback the host client can set to run after auction resolves
    this.onAuctionEnd  = null;   // function(winnerSeat, amount, pos)
  }

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  START AUCTION                                                           */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.startAuction = function (propertyPos, declinedBySeat) {
    if (this._active) return;

    var space = BOARD_DATA[propertyPos];
    if (!space || !space.price) return;

    this._active      = true;
    this._propertyPos = propertyPos;
    this._startedBy   = declinedBySeat;
    this._highBid     = 0;
    this._highBidder  = null;
    this._timer       = TIMER_SECONDS;

    // Build participants — all non-bankrupt players (including the decliner)
    this._participants = {};
    var players = this.engine.activePlayers();
    for (var i = 0; i < players.length; i++) {
      this._participants[players[i].seatIndex] = {
        active: true,
        lastBid: 0
      };
    }

    // Broadcast
    this._broadcast('auction-start', {
      pos: propertyPos,
      startedBy: declinedBySeat
    });

    // Set game phase so normal actions are blocked
    this.engine.gamePhase = 'auction';

    // Show modal & start ticker
    this._ensureModalElement();
    this._showModal();
    this._startTicker();

    sfx('notification');
    showToast('Auction started for ' + space.name + '!', 'info');
    this._addLog(this.engine.getPlayer(declinedBySeat).name + ' declined — ' + space.name + ' goes to auction!');
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  RECEIVE START (remote player started the auction)                       */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype._receiveStart = function (payload) {
    if (this._active) return;

    var pos = payload.pos;
    var space = BOARD_DATA[pos];
    if (!space) return;

    this._active      = true;
    this._propertyPos = pos;
    this._startedBy   = payload.startedBy;
    this._highBid     = 0;
    this._highBidder  = null;
    this._timer       = TIMER_SECONDS;

    this._participants = {};
    var players = this.engine.activePlayers();
    for (var i = 0; i < players.length; i++) {
      this._participants[players[i].seatIndex] = {
        active: true,
        lastBid: 0
      };
    }

    this.engine.gamePhase = 'auction';

    this._ensureModalElement();
    this._showModal();
    this._startTicker();

    sfx('notification');
    var decliner = this.engine.getPlayer(payload.startedBy);
    showToast('Auction started for ' + space.name + '!', 'info');
    this._addLog((decliner ? decliner.name : 'Someone') + ' declined — ' + space.name + ' goes to auction!');
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  PLACE BID (local player)                                                */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.placeBid = function (amount) {
    if (!this._active) return false;

    amount = Math.floor(amount);

    // Validation
    var me = this.engine.getPlayer(this.mySeat);
    if (!me || me.bankrupt) return false;

    var participant = this._participants[this.mySeat];
    if (!participant || !participant.active) {
      showToast('You passed on this auction', 'error');
      return false;
    }

    if (amount < MIN_BID) {
      showToast('Minimum bid is $' + MIN_BID, 'error');
      return false;
    }

    if (this._highBid > 0 && amount <= this._highBid) {
      showToast('Bid must be higher than $' + this._highBid, 'error');
      return false;
    }

    if (amount > me.money) {
      showToast("You can't bid more than you have ($" + me.money + ')', 'error');
      return false;
    }

    // Apply locally
    this._applyBid(this.mySeat, amount);

    // Broadcast
    this._broadcast('auction-bid', {
      seat: this.mySeat,
      amount: amount
    });

    sfx('click');
    return true;
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  RECEIVE BID (remote player)                                             */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.receiveBid = function (seatIndex, amount) {
    if (!this._active) return;
    if (seatIndex === this.mySeat) return; // already applied locally
    this._applyBid(seatIndex, amount);
  };

  /* ── apply bid (shared logic) ── */
  AuctionManager.prototype._applyBid = function (seatIndex, amount) {
    this._highBid    = amount;
    this._highBidder = seatIndex;
    this._timer      = TIMER_SECONDS; // reset countdown

    if (this._participants[seatIndex]) {
      this._participants[seatIndex].lastBid = amount;
    }

    var player = this.engine.getPlayer(seatIndex);
    var name   = player ? player.name : ('Seat ' + seatIndex);
    this._addLog(name + ' bids $' + amount + ' for ' + BOARD_DATA[this._propertyPos].name);

    sfx('notification');
    this.updateAuctionUI();
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  PASS (opt-out)                                                          */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.passAuction = function () {
    if (!this._active) return;

    var participant = this._participants[this.mySeat];
    if (!participant || !participant.active) return;

    participant.active = false;

    this._broadcast('auction-pass', { seat: this.mySeat });

    var me = this.engine.getPlayer(this.mySeat);
    this._addLog((me ? me.name : 'You') + ' passed on the auction');

    sfx('click');
    this._checkAllPassed();
    this.updateAuctionUI();
  };

  AuctionManager.prototype._receivePass = function (seatIndex) {
    if (!this._active) return;
    if (seatIndex === this.mySeat) return; // already applied locally

    if (this._participants[seatIndex]) {
      this._participants[seatIndex].active = false;
    }

    var player = this.engine.getPlayer(seatIndex);
    this._addLog((player ? player.name : ('Seat ' + seatIndex)) + ' passed on the auction');

    this._checkAllPassed();
    this.updateAuctionUI();
  };

  AuctionManager.prototype._checkAllPassed = function () {
    // If all participants have passed, resolve immediately
    var anyActive = false;
    for (var seat in this._participants) {
      if (this._participants.hasOwnProperty(seat) && this._participants[seat].active) {
        anyActive = true;
        break;
      }
    }
    if (!anyActive) {
      this.resolveAuction();
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  TICK (countdown)                                                        */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.tick = function () {
    if (!this._active) return;

    this._timer--;

    if (this._timer <= 0) {
      this.resolveAuction();
      return;
    }

    // Play a tick sound in final 5 seconds
    if (this._timer <= 5) {
      sfx('click');
    }

    this.updateAuctionUI();
  };

  AuctionManager.prototype._startTicker = function () {
    this._stopTicker();
    var self = this;
    this._intervalId = setInterval(function () {
      self.tick();
    }, 1000);
  };

  AuctionManager.prototype._stopTicker = function () {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  RESOLVE AUCTION                                                         */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.resolveAuction = function () {
    if (!this._active) return;

    this._stopTicker();
    this._active = false;

    var pos      = this._propertyPos;
    var space    = BOARD_DATA[pos];
    var winner   = this._highBidder;
    var amount   = this._highBid;

    if (winner !== null && amount > 0) {
      // Winner pays and receives the property
      var player = this.engine.getPlayer(winner);
      if (player) {
        player.money -= amount;
        player.properties.push(pos);
        this.engine.propertyState[pos] = { owner: winner, houses: 0, mortgaged: false };

        sfx('buy');
        showToast(player.name + ' won ' + space.name + ' for $' + amount + '!', 'success');
        this._addLog(player.name + ' won auction for ' + space.name + ' — $' + amount);
      }
    } else {
      // No one bid — property stays unowned
      showToast(space.name + ' returned to the bank — no bids!', 'info');
      this._addLog('No bids on ' + space.name + ' — returned to bank');
    }

    // Broadcast auction end
    this._broadcast('auction-end', {
      winner: winner,
      amount: amount,
      pos: pos
    });

    // Restore game phase
    this.engine.gamePhase = 'action';

    // Update UI
    this._hideModal();

    // Sync state (will trigger renderGame on all clients)
    if (typeof window.monopoly !== 'undefined' && window.monopoly.syncState) {
      window.monopoly.syncState();
      window.monopoly.renderGame();
    }

    // Fire callback if set
    if (typeof this.onAuctionEnd === 'function') {
      this.onAuctionEnd(winner, amount, pos);
    }
  };

  /* ── receive end (remote) ── */
  AuctionManager.prototype._receiveEnd = function (payload) {
    if (!this._active) return;

    this._stopTicker();
    this._active = false;

    var pos    = payload.pos;
    var space  = BOARD_DATA[pos];
    var winner = payload.winner;
    var amount = payload.amount;

    if (winner !== null && amount > 0) {
      var player = this.engine.getPlayer(winner);
      if (player) {
        // Only apply if not already applied (avoid double-apply)
        if (!this.engine.propertyState[pos] || this.engine.propertyState[pos].owner !== winner) {
          player.money -= amount;
          player.properties.push(pos);
          this.engine.propertyState[pos] = { owner: winner, houses: 0, mortgaged: false };
        }

        sfx('buy');
        showToast(player.name + ' won ' + space.name + ' for $' + amount + '!', 'success');
        this._addLog(player.name + ' won auction for ' + space.name + ' — $' + amount);
      }
    } else {
      showToast(space.name + ' returned to the bank — no bids!', 'info');
      this._addLog('No bids on ' + space.name + ' — returned to bank');
    }

    this.engine.gamePhase = 'action';
    this._hideModal();

    if (typeof window.monopoly !== 'undefined') {
      window.monopoly.renderGame();
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  HANDLE ACTION (dispatch incoming socket events)                         */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.handleAction = function (data) {
    if (!data || !data.action) return false;
    var payload = data.payload || {};

    switch (data.action) {
      case 'auction-start':
        this._receiveStart(payload);
        return true;

      case 'auction-bid':
        this.receiveBid(payload.seat, payload.amount);
        return true;

      case 'auction-pass':
        this._receivePass(payload.seat);
        return true;

      case 'auction-end':
        this._receiveEnd(payload);
        return true;

      default:
        return false;
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  STATE ACCESSORS                                                         */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.isActive = function () {
    return this._active;
  };

  AuctionManager.prototype.getState = function () {
    return {
      active:       this._active,
      propertyPos:  this._propertyPos,
      startedBy:    this._startedBy,
      highBid:      this._highBid,
      highBidder:   this._highBidder,
      timer:        this._timer,
      participants: JSON.parse(JSON.stringify(this._participants))
    };
  };

  AuctionManager.prototype.setState = function (state) {
    if (!state) return;

    this._active       = state.active || false;
    this._propertyPos  = state.propertyPos !== undefined ? state.propertyPos : null;
    this._startedBy    = state.startedBy !== undefined ? state.startedBy : null;
    this._highBid      = state.highBid || 0;
    this._highBidder   = state.highBidder !== undefined ? state.highBidder : null;
    this._timer        = state.timer || 0;
    this._participants = state.participants ? JSON.parse(JSON.stringify(state.participants)) : {};

    if (this._active) {
      this.engine.gamePhase = 'auction';
      this._ensureModalElement();
      this._showModal();
      this._startTicker();
    } else {
      this._hideModal();
      this._stopTicker();
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  RENDER AUCTION MODAL (HTML string)                                      */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.renderAuctionModal = function () {
    var space = BOARD_DATA[this._propertyPos] || {};
    var groupColor = (space.group && GROUP_COLORS[space.group]) ? GROUP_COLORS[space.group] : '#555';
    var timerPct = Math.max(0, Math.min(100, (this._timer / TIMER_SECONDS) * 100));

    var bidderName = '—';
    if (this._highBidder !== null) {
      var bp = this.engine.getPlayer(this._highBidder);
      bidderName = bp ? escHtml(bp.name) : ('Seat ' + this._highBidder);
    }

    var me = this.engine.getPlayer(this.mySeat);
    var myMoney = me ? me.money : 0;
    var myParticipant = this._participants[this.mySeat];
    var iAmActive = myParticipant && myParticipant.active;

    // Compute suggested bid
    var suggestedBid = this._highBid > 0 ? this._highBid + MIN_INCREMENT : MIN_BID;

    var html = '';

    // ── Modal inner ──
    html += '<div class="modal-header" style="position:relative;">';
    html += '  <h3>🔨 Auction</h3>';
    html += '</div>';

    html += '<div class="modal-body" style="padding:0;">';

    // Property card preview
    html += '<div class="auction-property" style="text-align:center;padding:16px 20px 12px;">';
    html += '  <div class="auction-color-band" style="height:8px;border-radius:4px;margin:0 auto 10px;max-width:220px;background:' + groupColor + ';"></div>';
    html += '  <h4 class="auction-property-name" style="margin:0 0 4px;font-size:1.1rem;color:#fff;">' + escHtml(space.name || '?') + '</h4>';
    html += '  <span style="font-size:0.85rem;color:#aaa;">List price: $' + (space.price || 0) + '</span>';
    html += '</div>';

    // Timer bar
    html += '<div class="auction-timer-wrap" style="padding:0 20px;margin-bottom:14px;">';
    html += '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
    html += '    <span style="font-size:0.8rem;color:#aaa;">Time remaining</span>';
    html += '    <span id="auction-timer-text" style="font-size:0.85rem;font-weight:700;color:' + this._timerColor() + ';">' + this._timer + 's</span>';
    html += '  </div>';
    html += '  <div style="background:rgba(255,255,255,0.08);border-radius:6px;height:8px;overflow:hidden;">';
    html += '    <div id="auction-timer-bar" style="height:100%;border-radius:6px;transition:width 1s linear, background 0.3s;width:' + timerPct + '%;background:' + this._timerColor() + ';"></div>';
    html += '  </div>';
    html += '</div>';

    // Current bid
    html += '<div class="auction-bid-info" style="text-align:center;padding:0 20px 14px;">';
    html += '  <div style="font-size:0.8rem;color:#aaa;margin-bottom:2px;">Highest Bid</div>';
    html += '  <div id="auction-high-bid" style="font-size:1.8rem;font-weight:800;color:#f0c850;">' + (this._highBid > 0 ? '$' + this._highBid : 'No bids') + '</div>';
    html += '  <div id="auction-high-bidder" style="font-size:0.85rem;color:#ccc;margin-top:2px;">by ' + bidderName + '</div>';
    html += '</div>';

    // Player status list
    html += '<div class="auction-players" style="padding:0 20px 14px;">';
    html += '  <div style="font-size:0.8rem;color:#aaa;margin-bottom:6px;">Bidders</div>';
    html += '  <div id="auction-player-list" style="display:flex;flex-wrap:wrap;gap:6px;">';
    html += this._renderPlayerChips();
    html += '  </div>';
    html += '</div>';

    // Bid controls (only if I'm still active)
    html += '<div id="auction-controls" style="padding:12px 20px 6px;border-top:1px solid rgba(255,255,255,0.08);' + (!iAmActive ? 'opacity:0.4;pointer-events:none;' : '') + '">';

    // Quick bid buttons
    html += '  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;justify-content:center;">';
    for (var q = 0; q < QUICK_INCREMENTS.length; q++) {
      var inc = QUICK_INCREMENTS[q];
      var qBid = this._highBid > 0 ? this._highBid + inc : Math.max(MIN_BID, inc);
      var qDisabled = qBid > myMoney ? ' disabled style="opacity:0.35;cursor:not-allowed;background:rgba(255,255,255,0.06);color:#888;font-size:0.8rem;padding:6px 12px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;"' : ' style="background:rgba(255,255,255,0.06);color:#ddd;font-size:0.8rem;padding:6px 12px;border:1px solid rgba(255,255,255,0.12);border-radius:6px;cursor:pointer;transition:background 0.15s;"';
      html += '    <button class="auction-quick-btn" data-increment="' + inc + '"' + qDisabled + '>+$' + inc + '</button>';
    }
    html += '  </div>';

    // Custom bid input + place bid
    html += '  <div style="display:flex;gap:8px;align-items:center;">';
    html += '    <input type="number" id="auction-bid-input" min="' + suggestedBid + '" max="' + myMoney + '" value="' + suggestedBid + '" step="1" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 12px;color:#fff;font-size:1rem;font-weight:600;text-align:center;outline:none;-moz-appearance:textfield;" />';
    html += '    <button id="auction-bid-btn" class="btn btn-success" style="padding:8px 18px;font-weight:700;white-space:nowrap;">💰 Bid</button>';
    html += '  </div>';

    html += '  <div style="text-align:center;margin-top:4px;font-size:0.75rem;color:#777;">Your cash: $' + myMoney + '</div>';
    html += '</div>';

    // Footer: Pass button
    html += '<div class="modal-footer" style="padding:10px 20px 16px;display:flex;justify-content:center;">';
    if (iAmActive) {
      html += '  <button id="auction-pass-btn" class="btn btn-secondary" style="padding:8px 28px;">🚫 Pass</button>';
    } else {
      html += '  <span style="color:#e74c3c;font-size:0.85rem;font-weight:600;">You passed — waiting for others…</span>';
    }
    html += '</div>';

    html += '</div>'; // end modal-body

    return html;
  };

  /* ── player status chips ── */
  AuctionManager.prototype._renderPlayerChips = function () {
    var html = '';
    for (var seat in this._participants) {
      if (!this._participants.hasOwnProperty(seat)) continue;
      var p = this.engine.getPlayer(Number(seat));
      if (!p) continue;
      var par = this._participants[seat];
      var ch = getCharacter(p.characterId);
      var color = ch ? ch.color : (p.color || PLAYER_COLORS[p.seatIndex] || '#888');
      var isHighest = (this._highBidder === Number(seat));

      var bg, border, textCol;
      if (!par.active) {
        // Passed
        bg = 'rgba(231,76,60,0.12)';
        border = 'rgba(231,76,60,0.3)';
        textCol = '#e74c3c';
      } else if (isHighest) {
        // Leading
        bg = 'rgba(240,200,80,0.15)';
        border = 'rgba(240,200,80,0.4)';
        textCol = '#f0c850';
      } else {
        // Active
        bg = 'rgba(255,255,255,0.06)';
        border = 'rgba(255,255,255,0.12)';
        textCol = '#ccc';
      }

      var label = escHtml(p.name);
      if (Number(seat) === this.mySeat) label += ' (you)';
      if (!par.active) label += ' ✗';
      if (isHighest) label += ' 👑';

      html += '<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:0.78rem;font-weight:600;background:' + bg + ';border:1px solid ' + border + ';color:' + textCol + ';">';
      html += '<span style="width:8px;height:8px;border-radius:50%;background:' + color + ';display:inline-block;"></span>';
      html += label;
      html += '</span>';
    }
    return html;
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  UPDATE AUCTION UI (in-place DOM updates)                                */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype.updateAuctionUI = function () {
    if (!this._active) return;

    var modal = document.getElementById('modal-auction');
    if (!modal) return;

    var timerPct = Math.max(0, Math.min(100, (this._timer / TIMER_SECONDS) * 100));
    var timerColor = this._timerColor();

    // Timer text
    var timerText = document.getElementById('auction-timer-text');
    if (timerText) {
      timerText.textContent = this._timer + 's';
      timerText.style.color = timerColor;
    }

    // Timer bar
    var timerBar = document.getElementById('auction-timer-bar');
    if (timerBar) {
      timerBar.style.width = timerPct + '%';
      timerBar.style.background = timerColor;
    }

    // High bid
    var highBidEl = document.getElementById('auction-high-bid');
    if (highBidEl) {
      highBidEl.textContent = this._highBid > 0 ? '$' + this._highBid : 'No bids';
    }

    // High bidder
    var highBidderEl = document.getElementById('auction-high-bidder');
    if (highBidderEl) {
      var bidderName = '—';
      if (this._highBidder !== null) {
        var bp = this.engine.getPlayer(this._highBidder);
        bidderName = bp ? escHtml(bp.name) : ('Seat ' + this._highBidder);
      }
      highBidderEl.textContent = 'by ' + bidderName;
    }

    // Player list
    var playerList = document.getElementById('auction-player-list');
    if (playerList) {
      playerList.innerHTML = this._renderPlayerChips();
    }

    // Update controls enabled/disabled state
    var myParticipant = this._participants[this.mySeat];
    var iAmActive = myParticipant && myParticipant.active;
    var controls = document.getElementById('auction-controls');
    if (controls) {
      controls.style.opacity = iAmActive ? '1' : '0.4';
      controls.style.pointerEvents = iAmActive ? '' : 'none';
    }

    // Update quick bid buttons
    var me = this.engine.getPlayer(this.mySeat);
    var myMoney = me ? me.money : 0;
    var quickBtns = modal.querySelectorAll('.auction-quick-btn');
    for (var i = 0; i < quickBtns.length; i++) {
      var inc = parseInt(quickBtns[i].getAttribute('data-increment'), 10);
      var qBid = this._highBid > 0 ? this._highBid + inc : Math.max(MIN_BID, inc);
      quickBtns[i].disabled = qBid > myMoney;
      quickBtns[i].style.opacity = qBid > myMoney ? '0.35' : '1';
      quickBtns[i].style.cursor = qBid > myMoney ? 'not-allowed' : 'pointer';
    }

    // Update bid input min / value hint
    var bidInput = document.getElementById('auction-bid-input');
    if (bidInput) {
      var suggestedBid = this._highBid > 0 ? this._highBid + MIN_INCREMENT : MIN_BID;
      bidInput.min = suggestedBid;
      bidInput.max = myMoney;
      // Only auto-update if the user hasn't typed a custom value or if their value is now too low
      var currentVal = parseInt(bidInput.value, 10) || 0;
      if (currentVal <= this._highBid) {
        bidInput.value = suggestedBid;
      }
    }

    // If I passed, re-render footer
    if (!iAmActive) {
      var footer = modal.querySelector('.modal-footer');
      if (footer) {
        var passBtn = document.getElementById('auction-pass-btn');
        if (passBtn) {
          footer.innerHTML = '<span style="color:#e74c3c;font-size:0.85rem;font-weight:600;">You passed — waiting for others…</span>';
        }
      }
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  MODAL DOM MANAGEMENT                                                    */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype._ensureModalElement = function () {
    if (document.getElementById('modal-auction')) return;

    var overlay = document.createElement('div');
    overlay.id = 'modal-auction';
    overlay.className = 'modal-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);justify-content:center;align-items:center;';

    var modal = document.createElement('div');
    modal.className = 'modal modal-auction';
    modal.id = 'modal-auction-inner';
    modal.style.cssText = 'background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:16px;max-width:420px;width:92%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Inject scoped CSS for auction UI
    this._injectStyles();
  };

  AuctionManager.prototype._injectStyles = function () {
    if (document.getElementById('auction-styles')) return;

    var style = document.createElement('style');
    style.id = 'auction-styles';
    style.textContent = [
      '#modal-auction .modal-header { padding:16px 20px 10px; border-bottom:1px solid rgba(255,255,255,0.06); }',
      '#modal-auction .modal-header h3 { margin:0; font-size:1.15rem; color:#fff; font-weight:700; }',
      '#modal-auction .modal-footer { border-top:1px solid rgba(255,255,255,0.06); }',
      '#modal-auction input[type=number]::-webkit-outer-spin-button,',
      '#modal-auction input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }',
      '#modal-auction input[type=number] { -moz-appearance:textfield; }',
      '#modal-auction .auction-quick-btn:hover:not(:disabled) { background:rgba(255,255,255,0.12) !important; }',
      '#auction-timer-bar { will-change: width; }',
      '@keyframes auction-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }',
      '#auction-high-bid { animation: auction-pulse 0.4s ease; }'
    ].join('\n');
    document.head.appendChild(style);
  };

  AuctionManager.prototype._showModal = function () {
    var overlay = document.getElementById('modal-auction');
    var inner   = document.getElementById('modal-auction-inner');
    if (!overlay || !inner) return;

    inner.innerHTML = this.renderAuctionModal();
    overlay.style.display = 'flex';

    this._bindModalEvents();
  };

  AuctionManager.prototype._hideModal = function () {
    var overlay = document.getElementById('modal-auction');
    if (overlay) overlay.style.display = 'none';
  };

  /* ── bind button events inside the modal ── */
  AuctionManager.prototype._bindModalEvents = function () {
    var self = this;

    // Place bid
    var bidBtn = document.getElementById('auction-bid-btn');
    if (bidBtn) {
      bidBtn.addEventListener('click', function () {
        var input = document.getElementById('auction-bid-input');
        var amount = input ? parseInt(input.value, 10) : 0;
        if (amount > 0) {
          self.placeBid(amount);
        }
      });
    }

    // Quick bid buttons
    var quickBtns = document.querySelectorAll('.auction-quick-btn');
    for (var i = 0; i < quickBtns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var inc = parseInt(btn.getAttribute('data-increment'), 10);
          var qBid = self._highBid > 0 ? self._highBid + inc : Math.max(MIN_BID, inc);
          self.placeBid(qBid);
        });
      })(quickBtns[i]);
    }

    // Pass button
    var passBtn = document.getElementById('auction-pass-btn');
    if (passBtn) {
      passBtn.addEventListener('click', function () {
        self.passAuction();
      });
    }

    // Enter key on bid input
    var bidInput = document.getElementById('auction-bid-input');
    if (bidInput) {
      bidInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var amount = parseInt(bidInput.value, 10) || 0;
          if (amount > 0) {
            self.placeBid(amount);
          }
        }
      });
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  HELPERS                                                                 */
  /* ═════════════════════════════════════════════════════════════════════════ */
  AuctionManager.prototype._timerColor = function () {
    if (this._timer > 10) return '#2ecc71';
    if (this._timer > 5)  return '#f39c12';
    return '#e74c3c';
  };

  AuctionManager.prototype._broadcast = function (action, payload) {
    if (!this.socket) return;
    this.socket.emit('game-action', { action: action, payload: payload });
  };

  AuctionManager.prototype._addLog = function (msg) {
    if (typeof window.monopoly !== 'undefined' && window.monopoly.addLog) {
      window.monopoly.addLog(msg);
    }
  };

  /* ═════════════════════════════════════════════════════════════════════════ */
  /*  EXPOSE GLOBALLY                                                         */
  /* ═════════════════════════════════════════════════════════════════════════ */
  window.AuctionManager = AuctionManager;

})();
