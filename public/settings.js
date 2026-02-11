/* ═══════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — settings.js
   Game Settings module for the waiting room.
   Host configures; guests see read-only.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────
     SETTINGS SCHEMA
     Each entry defines key, label, icon,
     the list of allowed values, the
     display label for each value, and
     the default value.
     ────────────────────────────────────── */
  var SETTINGS_SCHEMA = [
    {
      key: 'startingMoney',
      label: 'Starting Money',
      icon: '💰',
      options: [
        { value: 500,  display: '$500' },
        { value: 1000, display: '$1,000' },
        { value: 1500, display: '$1,500' },
        { value: 2000, display: '$2,000' },
        { value: 3000, display: '$3,000' }
      ],
      defaultValue: 1500
    },
    {
      key: 'freeParkingRule',
      label: 'Free Parking Rule',
      icon: '🅿️',
      options: [
        { value: 'classic',       display: 'Classic (nothing)' },
        { value: 'tax-collection', display: 'Tax Collection' }
      ],
      defaultValue: 'tax-collection'
    },
    {
      key: 'auctionProperties',
      label: 'Auction Properties',
      icon: '🔨',
      options: [
        { value: 'on',  display: 'On' },
        { value: 'off', display: 'Off' }
      ],
      defaultValue: 'on'
    },
    {
      key: 'turnTimer',
      label: 'Turn Timer',
      icon: '⏱️',
      options: [
        { value: 0,   display: 'Off' },
        { value: 30,  display: '30 s' },
        { value: 60,  display: '60 s' },
        { value: 90,  display: '90 s' },
        { value: 120, display: '120 s' }
      ],
      defaultValue: 60
    },
    {
      key: 'startingPosition',
      label: 'Starting Position',
      icon: '📍',
      options: [
        { value: 'go',     display: 'All on GO' },
        { value: 'random', display: 'Random' }
      ],
      defaultValue: 'go'
    },
    {
      key: 'goSalary',
      label: 'Salary (Passing GO)',
      icon: '🏦',
      options: [
        { value: 100, display: '$100' },
        { value: 200, display: '$200' },
        { value: 400, display: '$400' }
      ],
      defaultValue: 200
    },
    {
      key: 'maxTurns',
      label: 'Max Turns',
      icon: '🔄',
      options: [
        { value: 0,   display: 'Unlimited' },
        { value: 50,  display: '50' },
        { value: 100, display: '100' },
        { value: 200, display: '200' }
      ],
      defaultValue: 0
    }
  ];

  /* ──────────────────────────────────────
     CSS (injected once)
     ────────────────────────────────────── */
  var _cssInjected = false;

  function injectCSS() {
    if (_cssInjected) return;
    _cssInjected = true;

    var style = document.createElement('style');
    style.textContent = [
      '/* ═══ Game Settings Panel ═══ */',

      '.settings-card {',
      '  background: rgba(21, 34, 49, 0.8);',
      '  backdrop-filter: blur(12px);',
      '  -webkit-backdrop-filter: blur(12px);',
      '  border: 1px solid var(--border, #2a3f55);',
      '  border-radius: var(--radius-xl, 20px);',
      '  padding: 1.5rem;',
      '  width: 100%;',
      '  box-shadow: var(--shadow, 0 4px 24px rgba(0,0,0,.45));',
      '  transition: opacity 0.3s ease;',
      '}',

      '.settings-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  margin-bottom: 1rem;',
      '}',

      '.settings-header h3 {',
      '  font-family: "Outfit", sans-serif;',
      '  font-size: 1.1rem;',
      '  color: var(--gold, #f0c850);',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.1em;',
      '  margin: 0;',
      '}',

      '.settings-reset-btn {',
      '  background: rgba(255,255,255,0.06);',
      '  border: 1px solid var(--border, #2a3f55);',
      '  border-radius: 8px;',
      '  color: var(--text-dim, #8da0b8);',
      '  font-size: 0.7rem;',
      '  padding: 4px 10px;',
      '  cursor: pointer;',
      '  font-family: "Outfit", sans-serif;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.05em;',
      '  transition: var(--transition, 0.22s cubic-bezier(0.4,0,0.2,1));',
      '}',

      '.settings-reset-btn:hover {',
      '  background: rgba(255,255,255,0.12);',
      '  color: var(--text, #e8edf2);',
      '  border-color: var(--border-light, #3a5570);',
      '}',

      '.settings-list {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 6px;',
      '}',

      '.settings-row {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 8px 12px;',
      '  background: rgba(255,255,255,0.04);',
      '  border-radius: 10px;',
      '  border: 1px solid transparent;',
      '  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;',
      '}',

      '.settings-row:hover {',
      '  background: rgba(255,255,255,0.07);',
      '}',

      '.settings-row.settings-changed {',
      '  border-color: var(--gold, #f0c850);',
      '  background: rgba(240,200,80,0.06);',
      '  animation: settings-flash 0.4s ease;',
      '}',

      '@keyframes settings-flash {',
      '  0%   { transform: scale(1); }',
      '  50%  { transform: scale(1.015); }',
      '  100% { transform: scale(1); }',
      '}',

      '.settings-label {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  font-family: "Outfit", sans-serif;',
      '  font-size: 0.85rem;',
      '  color: var(--text, #e8edf2);',
      '  font-weight: 500;',
      '  white-space: nowrap;',
      '}',

      '.settings-label-icon {',
      '  font-size: 1rem;',
      '  width: 22px;',
      '  text-align: center;',
      '  flex-shrink: 0;',
      '}',

      /* Host dropdown */
      '.settings-select {',
      '  background: var(--bg-input, #1e3044);',
      '  color: var(--text, #e8edf2);',
      '  border: 1px solid var(--border, #2a3f55);',
      '  border-radius: 8px;',
      '  padding: 5px 28px 5px 10px;',
      '  font-family: "Outfit", sans-serif;',
      '  font-size: 0.8rem;',
      '  font-weight: 500;',
      '  cursor: pointer;',
      '  appearance: none;',
      '  -webkit-appearance: none;',
      '  -moz-appearance: none;',
      '  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' fill=\'%238da0b8\'%3E%3Cpath d=\'M0 0l5 6 5-6z\'/%3E%3C/svg%3E");',
      '  background-repeat: no-repeat;',
      '  background-position: right 10px center;',
      '  min-width: 110px;',
      '  transition: border-color 0.2s ease, box-shadow 0.2s ease;',
      '}',

      '.settings-select:focus {',
      '  outline: none;',
      '  border-color: var(--gold, #f0c850);',
      '  box-shadow: 0 0 0 2px rgba(240,200,80,0.15);',
      '}',

      '.settings-select:hover {',
      '  border-color: var(--border-light, #3a5570);',
      '}',

      /* Read-only value for guests */
      '.settings-value-ro {',
      '  font-family: "Outfit", sans-serif;',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '  color: var(--gold, #f0c850);',
      '  background: rgba(240,200,80,0.08);',
      '  padding: 5px 12px;',
      '  border-radius: 8px;',
      '  white-space: nowrap;',
      '  min-width: 110px;',
      '  text-align: center;',
      '  transition: color 0.2s ease, background 0.2s ease;',
      '}',

      '.settings-host-badge {',
      '  font-size: 0.6rem;',
      '  color: var(--text-muted, #5a7088);',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.06em;',
      '  font-family: "Outfit", sans-serif;',
      '  margin-top: 4px;',
      '  text-align: center;',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  /* ──────────────────────────────────────
     HELPER: find schema entry by key
     ────────────────────────────────────── */
  function getSchema(key) {
    for (var i = 0; i < SETTINGS_SCHEMA.length; i++) {
      if (SETTINGS_SCHEMA[i].key === key) return SETTINGS_SCHEMA[i];
    }
    return null;
  }

  /* Helper: get display string for a value */
  function displayFor(key, value) {
    var schema = getSchema(key);
    if (!schema) return String(value);
    for (var i = 0; i < schema.options.length; i++) {
      // Loose comparison to handle string/number from <select>
      if (String(schema.options[i].value) === String(value)) {
        return schema.options[i].display;
      }
    }
    return String(value);
  }

  /* Helper: cast a value to its proper type (number/string) */
  function castValue(key, raw) {
    var schema = getSchema(key);
    if (!schema) return raw;
    var expected = schema.defaultValue;
    if (typeof expected === 'number') {
      var n = Number(raw);
      return isNaN(n) ? raw : n;
    }
    return String(raw);
  }

  /* Helper: validate a single key/value pair */
  function isValidOption(key, value) {
    var schema = getSchema(key);
    if (!schema) return false;
    for (var i = 0; i < schema.options.length; i++) {
      if (String(schema.options[i].value) === String(value)) return true;
    }
    return false;
  }

  /* ══════════════════════════════════════
     GameSettings CLASS
     ══════════════════════════════════════ */

  /**
   * @constructor
   * @param {boolean} isHost  — true if this client is the room host
   * @param {object}  socket  — Socket.IO socket instance
   */
  function GameSettings(isHost, socket) {
    this.isHost = !!isHost;
    this.socket = socket || null;
    this.settings = this.getDefaults();
    this._containerEl = null;
    this._boundSocketHandler = null;

    injectCSS();

    // Auto-listen for incoming socket events
    if (this.socket) {
      this._attachSocketListeners();
    }
  }

  /* ──────────────────────────────────────
     getDefaults()
     ────────────────────────────────────── */
  GameSettings.prototype.getDefaults = function () {
    var defaults = {};
    for (var i = 0; i < SETTINGS_SCHEMA.length; i++) {
      defaults[SETTINGS_SCHEMA[i].key] = SETTINGS_SCHEMA[i].defaultValue;
    }
    return defaults;
  };

  /* ──────────────────────────────────────
     get(key)
     ────────────────────────────────────── */
  GameSettings.prototype.get = function (key) {
    if (this.settings.hasOwnProperty(key)) {
      return this.settings[key];
    }
    var schema = getSchema(key);
    return schema ? schema.defaultValue : undefined;
  };

  /* ──────────────────────────────────────
     set(key, value)
     Host-only. Emits 'settings-update'.
     ────────────────────────────────────── */
  GameSettings.prototype.set = function (key, value) {
    if (!this.isHost) {
      console.warn('[GameSettings] Only the host can change settings.');
      return false;
    }

    value = castValue(key, value);

    if (!isValidOption(key, value)) {
      console.warn('[GameSettings] Invalid value for "' + key + '":', value);
      return false;
    }

    var oldValue = this.settings[key];
    this.settings[key] = value;

    // Broadcast to all players in the room
    if (this.socket) {
      this.socket.emit('game-action', {
        action: 'settings-update',
        payload: { key: key, value: value }
      });
    }

    // Update DOM if panel is rendered
    this.updateSettingsPanel(key, oldValue);

    return true;
  };

  /* ──────────────────────────────────────
     getAll()
     ────────────────────────────────────── */
  GameSettings.prototype.getAll = function () {
    // Return a shallow copy
    var copy = {};
    for (var k in this.settings) {
      if (this.settings.hasOwnProperty(k)) copy[k] = this.settings[k];
    }
    return copy;
  };

  /* ──────────────────────────────────────
     setAll(obj)
     Bulk-set (used for sync from host).
     ────────────────────────────────────── */
  GameSettings.prototype.setAll = function (obj) {
    if (!obj || typeof obj !== 'object') return;
    var defaults = this.getDefaults();
    for (var k in defaults) {
      if (defaults.hasOwnProperty(k)) {
        if (obj.hasOwnProperty(k) && isValidOption(k, obj[k])) {
          this.settings[k] = castValue(k, obj[k]);
        } else {
          this.settings[k] = defaults[k];
        }
      }
    }
    // Full DOM refresh
    this._rerenderPanel();
  };

  /* ──────────────────────────────────────
     reset()
     Host-only. Resets all to defaults,
     broadcasts full sync.
     ────────────────────────────────────── */
  GameSettings.prototype.reset = function () {
    if (!this.isHost) {
      console.warn('[GameSettings] Only the host can reset settings.');
      return;
    }
    this.settings = this.getDefaults();

    if (this.socket) {
      this.socket.emit('game-action', {
        action: 'settings-sync',
        payload: { settings: this.getAll() }
      });
    }

    this._rerenderPanel();

    if (typeof showToast === 'function') {
      showToast('Settings reset to defaults', 'info');
    }
  };

  /* ──────────────────────────────────────
     isValid()
     ────────────────────────────────────── */
  GameSettings.prototype.isValid = function () {
    for (var i = 0; i < SETTINGS_SCHEMA.length; i++) {
      var s = SETTINGS_SCHEMA[i];
      if (!this.settings.hasOwnProperty(s.key)) return false;
      if (!isValidOption(s.key, this.settings[s.key])) return false;
    }
    return true;
  };

  /* ──────────────────────────────────────
     renderSettingsPanel()
     Returns an HTML string for the
     settings card.
     ────────────────────────────────────── */
  GameSettings.prototype.renderSettingsPanel = function () {
    var isHost = this.isHost;
    var html = '';

    html += '<div class="settings-card" id="settings-panel">';

    // Header
    html += '<div class="settings-header">';
    html += '  <h3>⚙️ Game Settings</h3>';
    if (isHost) {
      html += '  <button class="settings-reset-btn" id="btn-settings-reset" title="Reset all settings to defaults">Reset</button>';
    }
    html += '</div>';

    // Settings rows
    html += '<div class="settings-list">';
    for (var i = 0; i < SETTINGS_SCHEMA.length; i++) {
      var s = SETTINGS_SCHEMA[i];
      var currentVal = this.settings[s.key];

      html += '<div class="settings-row" data-setting-key="' + s.key + '">';

      // Label
      html += '<span class="settings-label">';
      html += '<span class="settings-label-icon">' + s.icon + '</span>';
      html += '<span>' + s.label + '</span>';
      html += '</span>';

      if (isHost) {
        // Interactive dropdown for host
        html += '<select class="settings-select" data-setting-select="' + s.key + '">';
        for (var j = 0; j < s.options.length; j++) {
          var opt = s.options[j];
          var selected = (String(opt.value) === String(currentVal)) ? ' selected' : '';
          html += '<option value="' + opt.value + '"' + selected + '>' + opt.display + '</option>';
        }
        html += '</select>';
      } else {
        // Read-only display for guests
        html += '<span class="settings-value-ro" data-setting-display="' + s.key + '">';
        html += displayFor(s.key, currentVal);
        html += '</span>';
      }

      html += '</div>'; // .settings-row
    }
    html += '</div>'; // .settings-list

    // Footer hint for non-host
    if (!isHost) {
      html += '<p class="settings-host-badge" style="margin-top:10px;">Only the host can change settings</p>';
    }

    html += '</div>'; // .settings-card

    return html;
  };

  /* ──────────────────────────────────────
     updateSettingsPanel(changedKey, oldVal)
     Updates a single setting row in the
     DOM and plays flash animation.
     ────────────────────────────────────── */
  GameSettings.prototype.updateSettingsPanel = function (changedKey, oldValue) {
    if (!this._containerEl) return;

    var row = this._containerEl.querySelector('[data-setting-key="' + changedKey + '"]');
    if (!row) return;

    var newValue = this.settings[changedKey];

    if (this.isHost) {
      // Sync the select element (in case set() was called programmatically)
      var sel = row.querySelector('[data-setting-select="' + changedKey + '"]');
      if (sel && sel.value !== String(newValue)) {
        sel.value = String(newValue);
      }
    } else {
      // Update read-only display
      var disp = row.querySelector('[data-setting-display="' + changedKey + '"]');
      if (disp) {
        disp.textContent = displayFor(changedKey, newValue);
      }
    }

    // Flash animation if the value actually changed
    if (oldValue !== undefined && String(oldValue) !== String(newValue)) {
      row.classList.remove('settings-changed');
      // Force reflow so the animation replays
      void row.offsetWidth;
      row.classList.add('settings-changed');
      // Remove after animation ends
      setTimeout(function () {
        row.classList.remove('settings-changed');
      }, 500);
    }
  };

  /* ──────────────────────────────────────
     _rerenderPanel()
     Full DOM refresh (e.g. after setAll
     or reset).
     ────────────────────────────────────── */
  GameSettings.prototype._rerenderPanel = function () {
    if (!this._containerEl) return;

    // Find the existing panel inside the container
    var existing = this._containerEl.querySelector('#settings-panel');
    if (existing) {
      // Create a temp wrapper, inject new HTML, swap
      var temp = document.createElement('div');
      temp.innerHTML = this.renderSettingsPanel();
      var newPanel = temp.firstElementChild;
      existing.parentNode.replaceChild(newPanel, existing);
      // Re-bind events on the new panel
      this.bindEvents(this._containerEl);
    }
  };

  /* ──────────────────────────────────────
     bindEvents(containerEl)
     Binds change/click events to the
     settings controls inside containerEl.
     ────────────────────────────────────── */
  GameSettings.prototype.bindEvents = function (containerEl) {
    if (!containerEl) return;
    this._containerEl = containerEl;

    var self = this;

    if (this.isHost) {
      // Bind all <select> elements
      var selects = containerEl.querySelectorAll('[data-setting-select]');
      for (var i = 0; i < selects.length; i++) {
        (function (sel) {
          // Remove previous listeners by cloning
          var clone = sel.cloneNode(true);
          sel.parentNode.replaceChild(clone, sel);

          clone.addEventListener('change', function () {
            var key = clone.getAttribute('data-setting-select');
            var value = clone.value;
            self.set(key, value);
          });
        })(selects[i]);
      }

      // Reset button
      var resetBtn = containerEl.querySelector('#btn-settings-reset');
      if (resetBtn) {
        var resetClone = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(resetClone, resetBtn);
        resetClone.addEventListener('click', function () {
          self.reset();
        });
      }
    }
  };

  /* ──────────────────────────────────────
     handleAction(data)
     Handles incoming socket 'game-action'
     events with settings actions.
     Returns true if the event was handled.
     ────────────────────────────────────── */
  GameSettings.prototype.handleAction = function (data) {
    if (!data || !data.action) return false;

    if (data.action === 'settings-update') {
      var payload = data.payload || {};
      var key = payload.key;
      var value = payload.value;

      if (key && isValidOption(key, value)) {
        var oldValue = this.settings[key];
        this.settings[key] = castValue(key, value);
        this.updateSettingsPanel(key, oldValue);

        if (typeof showToast === 'function') {
          showToast(
            displayFor(key, value) + ' — ' + (getSchema(key) || {}).label,
            'info'
          );
        }
      }
      return true;
    }

    if (data.action === 'settings-sync') {
      var settingsPayload = (data.payload || {}).settings;
      if (settingsPayload) {
        this.setAll(settingsPayload);
      }
      return true;
    }

    return false;
  };

  /* ──────────────────────────────────────
     _attachSocketListeners()
     Listens on 'game-action' for settings
     events. Non-host only processes
     settings-update / settings-sync.
     ────────────────────────────────────── */
  GameSettings.prototype._attachSocketListeners = function () {
    var self = this;

    // We use a named handler so we can detach later if needed
    this._boundSocketHandler = function (data) {
      self.handleAction(data);
    };

    this.socket.on('game-action', this._boundSocketHandler);
  };

  /* ──────────────────────────────────────
     detachSocketListeners()
     Clean up socket listener.
     ────────────────────────────────────── */
  GameSettings.prototype.detachSocketListeners = function () {
    if (this.socket && this._boundSocketHandler) {
      this.socket.off('game-action', this._boundSocketHandler);
      this._boundSocketHandler = null;
    }
  };

  /* ──────────────────────────────────────
     applyToEngine(engine)
     Applies the current settings to a
     MonopolyEngine instance before the
     game starts.
     ────────────────────────────────────── */
  GameSettings.prototype.applyToEngine = function (engine) {
    if (!engine) return;

    var s = this.settings;

    // 1. Starting Money — adjust each player's money
    var startMoney = s.startingMoney || 1500;
    for (var i = 0; i < engine.players.length; i++) {
      engine.players[i].money = startMoney;
    }

    // 2. Free Parking Rule
    //    'classic'        → engine should NOT collect taxes into pot
    //    'tax-collection' → engine collects taxes into pot (default behaviour)
    if (s.freeParkingRule === 'classic') {
      engine.freeParkingPot = 0;
      engine._freeParkingClassic = true;
    } else {
      engine._freeParkingClassic = false;
    }

    // 3. Auction Properties flag
    engine._auctionEnabled = (s.auctionProperties === 'on');

    // 4. Turn Timer (seconds, 0 = off)
    engine._turnTimer = s.turnTimer || 0;

    // 5. Starting Position
    if (s.startingPosition === 'random') {
      // Place each player on a random non-corner, non-jail, non-go-to-jail space
      var safePositions = [];
      for (var p = 0; p < 40; p++) {
        // Avoid corners and Go-to-Jail
        if (p !== 0 && p !== 10 && p !== 20 && p !== 30) {
          safePositions.push(p);
        }
      }
      for (var j = 0; j < engine.players.length; j++) {
        var rIdx = Math.floor(Math.random() * safePositions.length);
        engine.players[j].position = safePositions[rIdx];
      }
    }
    // else: players stay at 0 (GO) — the default

    // 6. GO Salary
    engine._goSalary = s.goSalary || 200;

    // 7. Max Turns (0 = unlimited)
    engine._maxTurns = s.maxTurns || 0;
    engine._turnCount = 0;

    // Store full settings on engine for later reference
    engine._gameSettings = this.getAll();
  };

  /* ──────────────────────────────────────
     Serialisation helpers
     ────────────────────────────────────── */

  /** Returns a JSON-safe object for sending over the network. */
  GameSettings.prototype.serialize = function () {
    return JSON.parse(JSON.stringify(this.settings));
  };

  /** Alias */
  GameSettings.prototype.serialise = GameSettings.prototype.serialize;

  /** Loads settings from a plain object (e.g. from network). */
  GameSettings.prototype.deserialize = function (obj) {
    this.setAll(obj);
  };

  /** Alias */
  GameSettings.prototype.deserialise = GameSettings.prototype.deserialize;

  /* ──────────────────────────────────────
     sendFullSync()
     Host sends current settings to all
     players (e.g. when a new player joins).
     ────────────────────────────────────── */
  GameSettings.prototype.sendFullSync = function () {
    if (!this.isHost || !this.socket) return;
    this.socket.emit('game-action', {
      action: 'settings-sync',
      payload: { settings: this.getAll() }
    });
  };

  /* ──────────────────────────────────────
     updateHostStatus(isHost)
     Update the host flag. Used when host
     changes (e.g. reconnection).
     ────────────────────────────────────── */
  GameSettings.prototype.updateHostStatus = function (isHost) {
    var changed = this.isHost !== !!isHost;
    this.isHost = !!isHost;
    if (changed) {
      this._rerenderPanel();
    }
  };

  /* ══════════════════════════════════════
     EXPOSE GLOBALLY
     ══════════════════════════════════════ */
  window.GameSettings = GameSettings;

})();
