/* ═══════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — Turn Timer Module
   Self-contained timer with visual countdown bar, auto-actions,
   warning flash/sound, auction pause, and server-sync support.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     CSS — injected once into <head>
     ──────────────────────────────────────────────────────────── */
  var TIMER_CSS = [
    /* Container */
    '.turn-timer-container {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 8px;',
    '  width: 100%;',
    '  padding: 6px 0;',
    '  user-select: none;',
    '}',

    /* Bar track */
    '.turn-timer-bar {',
    '  flex: 1;',
    '  height: 8px;',
    '  background: rgba(255, 255, 255, 0.08);',
    '  border-radius: 4px;',
    '  overflow: hidden;',
    '  position: relative;',
    '}',

    /* Fill — smooth CSS transition drives the visual depletion */
    '.turn-timer-fill {',
    '  height: 100%;',
    '  width: 100%;',
    '  background: linear-gradient(90deg, #2ecc71, #27ae60);',
    '  border-radius: 4px;',
    '  transition: width 1s linear;',
    '  will-change: width;',
    '}',

    /* Text label */
    '.turn-timer-text {',
    '  font-family: "Outfit", sans-serif;',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  min-width: 36px;',
    '  text-align: right;',
    '  color: var(--text, #e8edf2);',
    '  white-space: nowrap;',
    '}',

    /* ── Warning state (< 10 s) ── */
    '.turn-timer-container.turn-timer-warning .turn-timer-fill {',
    '  background: linear-gradient(90deg, #e74c3c, #c0392b);',
    '  animation: timerPulse 0.6s ease-in-out infinite alternate;',
    '}',
    '.turn-timer-container.turn-timer-warning .turn-timer-text {',
    '  color: #e74c3c;',
    '  animation: timerTextPulse 0.6s ease-in-out infinite alternate;',
    '}',

    /* ── Paused state ── */
    '.turn-timer-container.turn-timer-paused .turn-timer-fill {',
    '  opacity: 0.45;',
    '  animation: none;',
    '  transition: none;',
    '}',
    '.turn-timer-container.turn-timer-paused .turn-timer-text {',
    '  opacity: 0.5;',
    '}',

    /* ── Expired state ── */
    '.turn-timer-container.turn-timer-expired .turn-timer-fill {',
    '  width: 0% !important;',
    '  background: #555;',
    '  animation: none;',
    '  transition: none;',
    '}',
    '.turn-timer-container.turn-timer-expired .turn-timer-text {',
    '  color: var(--text-muted, #5a7088);',
    '}',

    /* ── Unlimited / hidden ── */
    '.turn-timer-container.turn-timer-unlimited {',
    '  display: none;',
    '}',

    /* ── Keyframes ── */
    '@keyframes timerPulse {',
    '  0%   { opacity: 1; transform: scaleY(1); }',
    '  100% { opacity: 0.65; transform: scaleY(1.3); }',
    '}',
    '@keyframes timerTextPulse {',
    '  0%   { opacity: 1; }',
    '  100% { opacity: 0.5; }',
    '}',
  ].join('\n');

  var _cssInjected = false;
  function injectCSS() {
    if (_cssInjected) return;
    _cssInjected = true;
    var style = document.createElement('style');
    style.setAttribute('data-module', 'turn-timer');
    style.textContent = TIMER_CSS;
    document.head.appendChild(style);
  }

  /* ────────────────────────────────────────────────────────────
     DURATION PRESETS
     ──────────────────────────────────────────────────────────── */
  var VALID_DURATIONS = [30, 60, 90, 120, 0]; // 0 = unlimited

  /* ────────────────────────────────────────────────────────────
     TurnTimer constructor
     ──────────────────────────────────────────────────────────── */
  function TurnTimer(options) {
    options = options || {};

    // Configuration
    this._duration     = (typeof options.duration === 'number')  ? options.duration  : 60;
    this._warningAt    = (typeof options.warningAt === 'number') ? options.warningAt : 10;
    this._onExpired    = options.onExpired  || null;
    this._onWarning    = options.onWarning  || null;
    this._onTick       = options.onTick     || null;

    // Internal state
    this._remaining    = this._duration;   // seconds remaining (integer)
    this._running      = false;
    this._paused       = false;
    this._expired      = false;
    this._warned       = false;
    this._intervalId   = null;

    // Fraction of a second remaining when paused (for sub-second accuracy)
    this._subSecond    = 0;

    // Last tick timestamp (for drift correction)
    this._lastTickMs   = 0;

    // DOM references (lazily resolved)
    this._containerEl  = null;
    this._fillEl       = null;
    this._textEl       = null;

    // Inject CSS on first instantiation
    injectCSS();
  }

  /* ──────────────────────────────
     Static helpers
     ────────────────────────────── */
  TurnTimer.VALID_DURATIONS = VALID_DURATIONS;

  TurnTimer.formatTime = function (seconds) {
    if (seconds <= 0) return '0s';
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    if (m > 0) return m + ':' + (s < 10 ? '0' : '') + s;
    return s + 's';
  };

  /* ──────────────────────────────
     .renderTimerBar()
     Returns an HTML string for the timer bar element.
     ────────────────────────────── */
  TurnTimer.prototype.renderTimerBar = function () {
    var unlimited = (this._duration === 0);
    var cls = 'turn-timer-container';
    if (unlimited) cls += ' turn-timer-unlimited';
    if (this._paused) cls += ' turn-timer-paused';
    if (this._expired) cls += ' turn-timer-expired';
    if (this._warned && !this._expired) cls += ' turn-timer-warning';

    var pct = unlimited ? 100 : (this._duration > 0 ? Math.max(0, (this._remaining / this._duration) * 100) : 100);
    var label = unlimited ? '∞' : TurnTimer.formatTime(this._remaining);

    return (
      '<div class="' + cls + '">' +
        '<div class="turn-timer-bar">' +
          '<div class="turn-timer-fill" style="width:' + pct.toFixed(2) + '%;' +
            (this._paused || this._expired ? 'transition:none;' : '') + '"></div>' +
        '</div>' +
        '<span class="turn-timer-text">' + label + '</span>' +
      '</div>'
    );
  };

  /* ──────────────────────────────
     .updateTimerBar(containerId)
     Updates an existing timer bar DOM inside a container.
     If no timer bar exists yet inside the container, it is created.
     ────────────────────────────── */
  TurnTimer.prototype.updateTimerBar = function (containerId) {
    var wrapper = document.getElementById(containerId);
    if (!wrapper) return;

    // Look for (or create) our container element
    this._containerEl = wrapper.querySelector('.turn-timer-container');
    if (!this._containerEl) {
      wrapper.insertAdjacentHTML('beforeend', this.renderTimerBar());
      this._containerEl = wrapper.querySelector('.turn-timer-container');
      if (!this._containerEl) return;
    }

    this._fillEl = this._containerEl.querySelector('.turn-timer-fill');
    this._textEl = this._containerEl.querySelector('.turn-timer-text');

    var unlimited = (this._duration === 0);

    /* ── class list ── */
    var cl = this._containerEl.classList;
    // unlimited
    unlimited ? cl.add('turn-timer-unlimited') : cl.remove('turn-timer-unlimited');
    // paused
    this._paused ? cl.add('turn-timer-paused') : cl.remove('turn-timer-paused');
    // expired
    this._expired ? cl.add('turn-timer-expired') : cl.remove('turn-timer-expired');
    // warning
    (this._warned && !this._expired) ? cl.add('turn-timer-warning') : cl.remove('turn-timer-warning');

    /* ── fill width ── */
    if (this._fillEl) {
      if (this._expired) {
        this._fillEl.style.transition = 'none';
        this._fillEl.style.width = '0%';
      } else if (this._paused) {
        // Freeze at current position
        var pausePct = unlimited ? 100 : (this._duration > 0 ? Math.max(0, (this._remaining / this._duration) * 100) : 100);
        this._fillEl.style.transition = 'none';
        this._fillEl.style.width = pausePct.toFixed(2) + '%';
      } else if (unlimited) {
        this._fillEl.style.transition = 'none';
        this._fillEl.style.width = '100%';
      } else if (this._running) {
        // Animate smoothly to the NEXT second's position.
        // The bar should reach (remaining - 1) / duration by the time the next tick fires.
        var nextPct = Math.max(0, ((this._remaining - 1) / this._duration) * 100);
        this._fillEl.style.transition = 'width 1s linear';
        this._fillEl.style.width = nextPct.toFixed(2) + '%';
      } else {
        // Stopped / idle — snap to current value
        var pct = this._duration > 0 ? Math.max(0, (this._remaining / this._duration) * 100) : 100;
        this._fillEl.style.transition = 'none';
        this._fillEl.style.width = pct.toFixed(2) + '%';
      }
    }

    /* ── text ── */
    if (this._textEl) {
      this._textEl.textContent = unlimited ? '∞' : TurnTimer.formatTime(this._remaining);
    }
  };

  /* ──────────────────────────────
     .start(duration?)
     Starts (or restarts) the timer.
     If duration is provided it overrides the current setting.
     ────────────────────────────── */
  TurnTimer.prototype.start = function (duration) {
    if (typeof duration === 'number' && duration >= 0) {
      this._duration = duration;
    }

    // Unlimited → no-op (just reset visual flags)
    if (this._duration === 0) {
      this._clearInterval();
      this._remaining = 0;
      this._running   = false;
      this._paused    = false;
      this._expired   = false;
      this._warned    = false;
      return;
    }

    this._remaining  = this._duration;
    this._running    = true;
    this._paused     = false;
    this._expired    = false;
    this._warned     = false;
    this._subSecond  = 0;
    this._lastTickMs = Date.now();

    this._clearInterval();
    var self = this;
    this._intervalId = setInterval(function () { self._tick(); }, 1000);
  };

  /* ──────────────────────────────
     .stop()
     ────────────────────────────── */
  TurnTimer.prototype.stop = function () {
    this._clearInterval();
    this._running = false;
    this._paused  = false;
  };

  /* ──────────────────────────────
     .pause()
     ────────────────────────────── */
  TurnTimer.prototype.pause = function () {
    if (!this._running || this._paused || this._expired) return;
    this._paused = true;
    this._clearInterval();
  };

  /* ──────────────────────────────
     .resume()
     ────────────────────────────── */
  TurnTimer.prototype.resume = function () {
    if (!this._paused || this._expired) return;
    if (this._duration === 0) return; // unlimited

    this._paused     = false;
    this._running    = true;
    this._lastTickMs = Date.now();

    this._clearInterval();
    var self = this;
    this._intervalId = setInterval(function () { self._tick(); }, 1000);
  };

  /* ──────────────────────────────
     .reset(duration?)
     Resets to full duration without auto-starting.
     ────────────────────────────── */
  TurnTimer.prototype.reset = function (duration) {
    this._clearInterval();
    if (typeof duration === 'number' && duration >= 0) {
      this._duration = duration;
    }
    this._remaining = this._duration;
    this._running   = false;
    this._paused    = false;
    this._expired   = false;
    this._warned    = false;
    this._subSecond = 0;
  };

  /* ──────────────────────────────
     .getRemaining()
     ────────────────────────────── */
  TurnTimer.prototype.getRemaining = function () {
    return this._remaining;
  };

  /* ──────────────────────────────
     .isRunning()
     ────────────────────────────── */
  TurnTimer.prototype.isRunning = function () {
    return this._running && !this._paused;
  };

  /* ──────────────────────────────
     .isPaused()
     ────────────────────────────── */
  TurnTimer.prototype.isPaused = function () {
    return this._paused;
  };

  /* ──────────────────────────────
     .setDuration(seconds)
     Changes the duration setting (takes effect on next start/reset).
     ────────────────────────────── */
  TurnTimer.prototype.setDuration = function (seconds) {
    if (typeof seconds !== 'number' || seconds < 0) return;
    this._duration = seconds;
  };

  /* ──────────────────────────────
     .getDuration()
     ────────────────────────────── */
  TurnTimer.prototype.getDuration = function () {
    return this._duration;
  };

  /* ──────────────────────────────
     .isUnlimited()
     ────────────────────────────── */
  TurnTimer.prototype.isUnlimited = function () {
    return this._duration === 0;
  };

  /* ──────────────────────────────
     .destroy()
     Clean up interval & DOM references
     ────────────────────────────── */
  TurnTimer.prototype.destroy = function () {
    this._clearInterval();
    this._running      = false;
    this._containerEl  = null;
    this._fillEl       = null;
    this._textEl       = null;
  };

  /* ────────────────────────────────────────────────────────────
     INTERNAL: tick (runs every ~1 s via setInterval)
     ──────────────────────────────────────────────────────────── */
  TurnTimer.prototype._tick = function () {
    if (!this._running || this._paused || this._expired) return;
    if (this._duration === 0) return; // unlimited

    // Drift correction: compute actual elapsed seconds since last tick
    var now     = Date.now();
    var elapsed = Math.round((now - this._lastTickMs) / 1000);
    if (elapsed < 1) elapsed = 1;
    this._lastTickMs = now;

    this._remaining = Math.max(0, this._remaining - elapsed);

    /* ── Warning threshold ── */
    if (!this._warned && this._remaining > 0 && this._remaining <= this._warningAt) {
      this._warned = true;
      if (typeof this._onWarning === 'function') {
        try { this._onWarning(this._remaining); } catch (e) { /* silent */ }
      }
    }

    /* ── Tick callback ── */
    if (typeof this._onTick === 'function') {
      try { this._onTick(this._remaining); } catch (e) { /* silent */ }
    }

    /* ── Expiry ── */
    if (this._remaining <= 0) {
      this._remaining = 0;
      this._expired   = true;
      this._running   = false;
      this._clearInterval();

      if (typeof this._onExpired === 'function') {
        try { this._onExpired(); } catch (e) { /* silent */ }
      }
    }
  };

  /* ────────────────────────────────────────────────────────────
     INTERNAL: clear the setInterval
     ──────────────────────────────────────────────────────────── */
  TurnTimer.prototype._clearInterval = function () {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  };

  /* ════════════════════════════════════════════════════════════
     TurnTimerManager
     High-level integration with MonopolyClient / MonopolyEngine.
     Handles: auto-actions on expiry, warning SFX, auction pause,
     turn-change reset, server-side backup, cross-client sync.
     ════════════════════════════════════════════════════════════ */
  function TurnTimerManager(options) {
    options = options || {};

    this.client   = options.client   || null;   // MonopolyClient instance
    this.engine   = options.engine   || null;   // MonopolyEngine instance
    this.socket   = options.socket   || null;   // socket.io socket
    this.mySeat   = (typeof options.mySeat === 'number') ? options.mySeat : null;

    this._containerId = options.containerId || 'turn-banner-timer'; // DOM id

    var dur = (typeof options.duration === 'number') ? options.duration : 60;
    var self = this;

    this.timer = new TurnTimer({
      duration:  dur,
      warningAt: (typeof options.warningAt === 'number') ? options.warningAt : 10,

      onExpired: function ()   { self._handleExpired(); },
      onWarning: function (r)  { self._handleWarning(r); },
      onTick:    function (r)  { self._handleTick(r); },
    });

    this._auctionActive = false;
    this._boundEvents   = false;
  }

  /* ──────────────────────────────
     .attach()
     Wire up socket events and start observing game state.
     Call once after the game screen is visible.
     ────────────────────────────── */
  TurnTimerManager.prototype.attach = function () {
    if (this._boundEvents) return;
    this._boundEvents = true;

    var self = this;

    // Ensure a container element exists inside the turn-banner
    this._ensureContainer();

    // ── Socket listeners (synced across clients) ──
    if (this.socket) {
      // When the server tells us the turn changed, reset the timer.
      this.socket.on('turn-changed', function () {
        self._onTurnChanged();
      });

      // Timer sync from the active player → everyone else sees the same countdown
      this.socket.on('game-action', function (data) {
        if (!data) return;
        var p = data.payload || {};
        switch (data.action) {
          case 'timer-sync':
            // Don't overwrite our own timer
            if (data.seatIndex !== self.mySeat) {
              self.timer._remaining = (typeof p.remaining === 'number') ? p.remaining : self.timer._remaining;
              self.timer._warned    = !!p.warned;
              self.timer._expired   = !!p.expired;
              self.timer._running   = !!p.running;
              self.timer._paused    = !!p.paused;
              // We don't run a local interval for someone else's timer,
              // but we DO start one so the bar animates between syncs.
              if (p.running && !p.paused && !p.expired && !self._isMyTurn()) {
                self.timer._clearInterval();
                self.timer._lastTickMs = Date.now();
                var tmr = self.timer;
                tmr._intervalId = setInterval(function () { tmr._tick(); }, 1000);
              } else {
                self.timer._clearInterval();
              }
              self._updateBar();
            }
            break;
          case 'timer-pause':
            self._auctionActive = true;
            self.timer.pause();
            self._updateBar();
            break;
          case 'timer-resume':
            self._auctionActive = false;
            self.timer.resume();
            self._updateBar();
            break;
        }
      });

      // Server-side force-end backup
      this.socket.on('force-end-turn', function (data) {
        // Server forced the turn because client didn't respond in time
        if (self.engine) {
          self.engine.gamePhase = 'waiting';
        }
        self.timer.stop();
        self._updateBar();
      });
    }
  };

  /* ──────────────────────────────
     .startForCurrentTurn()
     Call this whenever a new turn begins (after turn-changed
     or game-started).
     ────────────────────────────── */
  TurnTimerManager.prototype.startForCurrentTurn = function () {
    this.timer.start();
    this._auctionActive = false;
    this._updateBar();

    // Broadcast initial sync so other clients see the bar
    this._broadcastSync();
  };

  /* ──────────────────────────────
     .pauseForAuction()
     .resumeAfterAuction()
     ────────────────────────────── */
  TurnTimerManager.prototype.pauseForAuction = function () {
    this._auctionActive = true;
    this.timer.pause();
    this._updateBar();
    this._broadcastAction('timer-pause', {});
  };

  TurnTimerManager.prototype.resumeAfterAuction = function () {
    this._auctionActive = false;
    this.timer.resume();
    this._updateBar();
    this._broadcastAction('timer-resume', {});
  };

  /* ──────────────────────────────
     .setDuration(seconds)
     ────────────────────────────── */
  TurnTimerManager.prototype.setDuration = function (seconds) {
    this.timer.setDuration(seconds);
  };

  /* ──────────────────────────────
     .stopTimer()
     ────────────────────────────── */
  TurnTimerManager.prototype.stopTimer = function () {
    this.timer.stop();
    this._updateBar();
  };

  /* ──────────────────────────────
     .updateSeat(seat)
     Call when mySeat changes (reconnect, etc.)
     ────────────────────────────── */
  TurnTimerManager.prototype.updateSeat = function (seat) {
    this.mySeat = seat;
  };

  /* ──────────────────────────────
     .destroy()
     ────────────────────────────── */
  TurnTimerManager.prototype.destroy = function () {
    this.timer.destroy();
    this._boundEvents = false;
  };

  /* ────────────────────────────────────────────────────────────
     INTERNAL: helpers
     ──────────────────────────────────────────────────────────── */

  TurnTimerManager.prototype._isMyTurn = function () {
    if (this.mySeat === null || this.mySeat === undefined) return false;
    if (this.engine) return this.engine.currentTurn === this.mySeat;
    return false;
  };

  TurnTimerManager.prototype._ensureContainer = function () {
    // Insert a div with the correct id inside .turn-banner if it doesn't exist
    var existing = document.getElementById(this._containerId);
    if (existing) return;

    // Attempt to find the turn-banner in the left panel
    var banner = document.querySelector('.turn-banner');
    if (!banner) return;

    var div = document.createElement('div');
    div.id = this._containerId;
    banner.appendChild(div);
  };

  TurnTimerManager.prototype._updateBar = function () {
    this._ensureContainer();
    this.timer.updateTimerBar(this._containerId);
  };

  TurnTimerManager.prototype._onTurnChanged = function () {
    // Timer is reset and restarted for whoever's turn it is.
    // If it's MY turn, I'm the authoritative ticker.
    // Otherwise, I passively display based on syncs.
    if (this._isMyTurn()) {
      this.startForCurrentTurn();
    } else {
      // Start a passive display timer — the active player will sync us.
      this.timer.start();
      this._updateBar();
    }
  };

  TurnTimerManager.prototype._broadcastSync = function () {
    if (!this._isMyTurn()) return;
    this._broadcastAction('timer-sync', {
      remaining: this.timer._remaining,
      duration:  this.timer._duration,
      warned:    this.timer._warned,
      expired:   this.timer._expired,
      running:   this.timer._running,
      paused:    this.timer._paused,
    });
  };

  TurnTimerManager.prototype._broadcastAction = function (action, payload) {
    if (!this.socket) return;
    this.socket.emit('game-action', { action: action, payload: payload });
  };

  /* ────────────────────────────────────────────────────────────
     INTERNAL: callbacks
     ──────────────────────────────────────────────────────────── */

  /** Fires every second. Update the bar and broadcast sync (if my turn). */
  TurnTimerManager.prototype._handleTick = function (remaining) {
    this._updateBar();

    // Broadcast sync every tick if it's my turn so other clients stay updated
    if (this._isMyTurn()) {
      this._broadcastSync();
    }
  };

  /** Warning threshold reached. Flash + sound. */
  TurnTimerManager.prototype._handleWarning = function (remaining) {
    this._updateBar();

    // Play warning sound via the SFX system
    if (typeof sfx === 'function') {
      sfx('warning');
    } else if (window.SFX && typeof window.SFX.play === 'function') {
      window.SFX.play('warning');
    }
    // Fallback: generate a quick beep if no 'warning' sound is registered
    this._playWarningBeep();

    if (typeof showToast === 'function') {
      showToast('⏰ Hurry up! ' + remaining + 's left!', 'error');
    }
  };

  /** Timer expired on MY turn → auto-act based on game phase. */
  TurnTimerManager.prototype._handleExpired = function () {
    this._updateBar();

    // Only the active player performs auto-actions.
    if (!this._isMyTurn()) return;

    var engine = this.engine;
    var client = this.client;
    if (!engine || !client) return;

    var phase = engine.gamePhase;

    // 1. Close any open modal first
    this._closeAllModals();

    // 2. Act based on game phase
    switch (phase) {
      case 'rolling':
        // Auto-roll the dice
        this._autoRoll();
        break;

      case 'landed':
        // Auto-pass (don't buy) then auto-end turn
        this._autoPassAndEndTurn();
        break;

      case 'action':
        // Auto-end turn
        this._autoEndTurn();
        break;

      default:
        // Any other phase → try to end turn
        this._autoEndTurn();
        break;
    }
  };

  /* ────────────────────────────────────────────────────────────
     INTERNAL: auto-action helpers
     ──────────────────────────────────────────────────────────── */

  TurnTimerManager.prototype._autoRoll = function () {
    // Simulate clicking the roll dice button
    var client = this.client;
    if (client && typeof client.rollDice === 'function') {
      client.rollDice();
    } else {
      // Fallback: click the button directly
      var btn = document.getElementById('btn-roll-dice');
      if (btn && !btn.disabled) btn.click();
    }
  };

  TurnTimerManager.prototype._autoEndTurn = function () {
    var client = this.client;
    if (client && typeof client.endTurn === 'function') {
      client.endTurn();
    } else {
      var btn = document.getElementById('btn-end-turn');
      if (btn && !btn.disabled) btn.click();
    }
  };

  TurnTimerManager.prototype._autoPassAndEndTurn = function () {
    var client = this.client;

    // If the buy modal is visible, click Pass
    var buyModal = document.getElementById('modal-buy');
    if (buyModal && buyModal.style.display !== 'none') {
      var passBtn = document.getElementById('btn-modal-pass');
      if (passBtn) passBtn.click();
    } else if (client && typeof client.passBuy === 'function') {
      client.passBuy();
    }

    // Set phase to action then end turn
    if (this.engine) {
      this.engine.gamePhase = 'action';
    }

    // Small delay so the pass processes before ending the turn
    var self = this;
    setTimeout(function () {
      self._autoEndTurn();
    }, 200);
  };

  TurnTimerManager.prototype._closeAllModals = function () {
    // Close every modal-overlay that's currently visible
    var modals = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < modals.length; i++) {
      if (modals[i].style.display !== 'none') {
        modals[i].style.display = 'none';
      }
    }
  };

  /** Fallback warning beep using Web Audio API if SFX.play('warning') doesn't exist. */
  TurnTimerManager.prototype._playWarningBeep = function () {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Two-tone alert beep
      function beep(freq, start, dur) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.01);
      }

      beep(880, 0, 0.12);
      beep(660, 0.14, 0.12);
      beep(880, 0.28, 0.15);

      // Close context after sounds finish
      setTimeout(function () {
        try { ctx.close(); } catch (e) { /* silent */ }
      }, 1000);
    } catch (e) { /* silent fail */ }
  };

  /* ════════════════════════════════════════════════════════════
     SERVER-SIDE TIMER UTILITY
     Helper object that can be used in server/index.js to run a
     backup timer per room. Not executed in the browser — exposed
     so the server can require/copy this logic.
     ════════════════════════════════════════════════════════════ */
  function ServerTurnTimer(options) {
    options = options || {};
    this.duration    = options.duration    || 60;  // seconds
    this.gracePeriod = options.gracePeriod || 5;   // extra seconds before force-end
    this._timerId    = null;
    this._onForce    = options.onForceEnd  || null; // callback(roomCode, seatIndex)
    this._roomCode   = options.roomCode    || null;
    this._seatIndex  = null;
  }

  ServerTurnTimer.prototype.start = function (seatIndex) {
    this.stop();
    if (this.duration <= 0) return; // unlimited
    this._seatIndex = seatIndex;
    var self = this;
    var totalMs = (this.duration + this.gracePeriod) * 1000;
    this._timerId = setTimeout(function () {
      self._timerId = null;
      if (typeof self._onForce === 'function') {
        self._onForce(self._roomCode, self._seatIndex);
      }
    }, totalMs);
  };

  ServerTurnTimer.prototype.stop = function () {
    if (this._timerId !== null) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
    this._seatIndex = null;
  };

  ServerTurnTimer.prototype.reset = function (seatIndex) {
    this.start(seatIndex);
  };

  ServerTurnTimer.prototype.setDuration = function (seconds) {
    this.duration = seconds;
  };

  /* ════════════════════════════════════════════════════════════
     EXPORTS — globally accessible
     ════════════════════════════════════════════════════════════ */
  window.TurnTimer        = TurnTimer;
  window.TurnTimerManager = TurnTimerManager;
  window.ServerTurnTimer  = ServerTurnTimer;

})();
