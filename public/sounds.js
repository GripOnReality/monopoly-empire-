/**
 * Monopoly Empire — Synthesized Sound Effects (Web Audio API)
 * Usage: SFX.play('dice')  |  SFX.toggle()  |  SFX.enabled
 *        SFX.setVolume(0.5)  |  SFX.getVolume()
 */
window.SFX = (function () {
  'use strict';
  var ctx, masterGain, volume = 1.0, enabled = true;

  function getCtx() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (_) { return null; }
  }

  /** Returns the master gain node (creates context if needed). */
  function getMaster() {
    var c = getCtx();
    return c ? masterGain : null;
  }

  function tone(freq, type, start, dur, vol) {
    var c = getCtx(); if (!c) return;
    var m = getMaster(); if (!m) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.3, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
    o.connect(g); g.connect(m);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }

  function noise(dur, vol) {
    var c = getCtx(); if (!c) return;
    var m = getMaster(); if (!m) return;
    var len = c.sampleRate * dur, buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
    var s = c.createBufferSource(), g = c.createGain();
    s.buffer = buf; g.gain.setValueAtTime(vol || 0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    s.connect(g); g.connect(m);
    s.start(); s.stop(c.currentTime + dur + 0.01);
  }

  /** Frequency-sweep oscillator routed through master gain. */
  function sweep(freqStart, freqEnd, type, start, dur, vol) {
    var c = getCtx(); if (!c) return;
    var m = getMaster(); if (!m) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freqStart, c.currentTime + start);
    o.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + start + dur);
    g.gain.setValueAtTime(vol || 0.2, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
    o.connect(g); g.connect(m);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }

  /* ────────────── Sound definitions ────────────── */

  var sounds = {
    /* ---- Existing sounds (unchanged behaviour) ---- */

    dice: function () {
      noise(0.15, 0.2); noise(0.1, 0.15);
      for (var i = 0; i < 5; i++) tone(200 + Math.random() * 400, 'square', i * 0.04, 0.03, 0.08);
    },
    money: function () {
      tone(1200, 'sine', 0, 0.08, 0.25);
      tone(1600, 'sine', 0.08, 0.08, 0.25);
      tone(2000, 'sine', 0.16, 0.15, 0.2);
    },
    buy: function () {
      tone(880, 'sine', 0, 0.12, 0.25);
      tone(1100, 'sine', 0.1, 0.2, 0.2);
    },
    rent: function () {
      tone(600, 'sawtooth', 0, 0.15, 0.15);
      tone(400, 'sawtooth', 0.12, 0.15, 0.12);
      tone(250, 'sawtooth', 0.24, 0.25, 0.1);
    },
    jail: function () {
      tone(150, 'sawtooth', 0, 0.3, 0.2);
      tone(100, 'sawtooth', 0.2, 0.4, 0.25);
      tone(70, 'square', 0.4, 0.5, 0.15);
    },
    go: function () {
      tone(523, 'sine', 0, 0.12, 0.25);
      tone(659, 'sine', 0.1, 0.12, 0.25);
      tone(784, 'sine', 0.2, 0.12, 0.25);
      tone(1047, 'sine', 0.3, 0.25, 0.2);
    },
    build: function () {
      noise(0.04, 0.25);
      tone(300, 'square', 0, 0.04, 0.15);
      noise(0.03, 0.18);
      tone(350, 'square', 0.08, 0.04, 0.12);
    },
    card: function () {
      var c = getCtx(); if (!c) return;
      var m = getMaster(); if (!m) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(300, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.15);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      o.connect(g); g.connect(m);
      o.start(); o.stop(c.currentTime + 0.25);
    },
    bid: function () {
      tone(800, 'square', 0, 0.05, 0.15);
      tone(1000, 'square', 0.04, 0.06, 0.12);
    },
    bankrupt: function () {
      tone(440, 'sawtooth', 0, 0.25, 0.2);
      tone(370, 'sawtooth', 0.2, 0.25, 0.18);
      tone(311, 'sawtooth', 0.4, 0.25, 0.16);
      tone(261, 'sawtooth', 0.6, 0.5, 0.2);
    },
    win: function () {
      tone(523, 'sine', 0, 0.15, 0.25);
      tone(659, 'sine', 0.12, 0.15, 0.25);
      tone(784, 'sine', 0.24, 0.15, 0.25);
      tone(1047, 'sine', 0.36, 0.3, 0.3);
      tone(784, 'sine', 0.56, 0.1, 0.2);
      tone(1047, 'sine', 0.64, 0.4, 0.3);
      tone(1319, 'sine', 0.64, 0.4, 0.2);
    },

    /* ---- New sounds ---- */

    /** BUG FIX: "turn" — pleasant ascending two-note notification chime */
    turn: function () {
      tone(660, 'sine', 0, 0.15, 0.22);
      tone(880, 'sine', 0.13, 0.22, 0.25);
      // soft shimmer overtone
      tone(1320, 'sine', 0.13, 0.18, 0.08);
    },

    /** Urgent ticking for turn timer's last 10 seconds */
    timer_warning: function () {
      tone(1000, 'square', 0, 0.04, 0.18);
      tone(1000, 'square', 0.08, 0.04, 0.12);
    },

    /** Buzzer / horn for timer expiration */
    timer_expire: function () {
      tone(220, 'sawtooth', 0, 0.25, 0.22);
      tone(200, 'sawtooth', 0.05, 0.25, 0.18);
      tone(185, 'square', 0.08, 0.3, 0.12);
    },

    /** Gavel bang to start auction */
    auction_start: function () {
      noise(0.06, 0.3);
      tone(180, 'square', 0, 0.08, 0.2);
      tone(120, 'sine', 0.02, 0.15, 0.15);
      // second lighter tap
      noise(0.04, 0.15);
      tone(200, 'square', 0.18, 0.05, 0.12);
    },

    /** Quick ascending note for placing a bid (brighter than existing 'bid') */
    auction_bid: function () {
      tone(700, 'triangle', 0, 0.06, 0.18);
      tone(1050, 'triangle', 0.05, 0.1, 0.2);
    },

    /** Celebratory ding for winning auction */
    auction_win: function () {
      tone(880, 'sine', 0, 0.1, 0.25);
      tone(1100, 'sine', 0.08, 0.1, 0.25);
      tone(1320, 'sine', 0.16, 0.2, 0.22);
    },

    /** Subtle mechanical click for bot making a move */
    bot_action: function () {
      noise(0.02, 0.1);
      tone(600, 'square', 0, 0.02, 0.08);
      tone(800, 'square', 0.025, 0.03, 0.06);
    },

    /** Notification for incoming trade offer — two-tone doorbell */
    trade_offer: function () {
      tone(784, 'sine', 0, 0.15, 0.2);
      tone(588, 'sine', 0.14, 0.2, 0.2);
    },

    /** Happy confirmation for accepted trade */
    trade_accept: function () {
      tone(523, 'sine', 0, 0.1, 0.2);
      tone(659, 'sine', 0.08, 0.1, 0.2);
      tone(784, 'sine', 0.16, 0.18, 0.22);
    },

    /** Negative / decline sound for rejected trade */
    trade_reject: function () {
      tone(400, 'sawtooth', 0, 0.12, 0.15);
      tone(300, 'sawtooth', 0.1, 0.2, 0.15);
    },

    /** Subtle click/toggle for changing game settings */
    settings_change: function () {
      tone(1200, 'sine', 0, 0.04, 0.12);
      tone(900, 'sine', 0.035, 0.05, 0.08);
    },

    /** Soft pop / notification for new chat message */
    chat_message: function () {
      tone(1400, 'sine', 0, 0.06, 0.15);
      tone(1800, 'sine', 0.04, 0.08, 0.1);
    },

    /** Welcome / join sound — bright ascending arpeggio */
    player_join: function () {
      tone(440, 'sine', 0, 0.1, 0.18);
      tone(554, 'sine', 0.08, 0.1, 0.18);
      tone(659, 'sine', 0.16, 0.1, 0.18);
      tone(880, 'sine', 0.24, 0.18, 0.22);
    },

    /** Error / invalid action buzz */
    error: function () {
      tone(180, 'square', 0, 0.12, 0.18);
      tone(160, 'square', 0.08, 0.15, 0.15);
      noise(0.05, 0.08);
    }
  };

  /* ────────────── Public API ────────────── */

  return {
    enabled: enabled,

    /** Toggle mute on/off. Returns new enabled state. */
    toggle: function () {
      this.enabled = !this.enabled;
      return this.enabled;
    },

    /** Alias for !enabled, for callers that check SFX.muted */
    get muted() { return !this.enabled; },
    set muted(v) { this.enabled = !v; },

    /** Play a named sound effect. Silently ignores unknown names. */
    play: function (name) {
      try {
        if (!this.enabled) return;
        if (sounds[name]) sounds[name]();
      } catch (_) { /* silent fail */ }
    },

    /**
     * Set master volume.
     * @param {number} v — value between 0 (silent) and 1 (full).
     */
    setVolume: function (v) {
      volume = Math.max(0, Math.min(1, v));
      var m = getMaster();
      if (m) m.gain.setValueAtTime(volume, ctx.currentTime);
    },

    /** Get current master volume (0–1). */
    getVolume: function () {
      return volume;
    }
  };
})();
