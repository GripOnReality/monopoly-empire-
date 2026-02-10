/**
 * Monopoly Empire — Synthesized Sound Effects (Web Audio API)
 * Usage: SFX.play('dice')  |  SFX.toggle()  |  SFX.enabled
 */
window.SFX = (function () {
  'use strict';
  var ctx, enabled = true;

  function getCtx() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (_) { return null; }
  }

  function tone(freq, type, start, dur, vol) {
    var c = getCtx(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.3, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }

  function noise(dur, vol) {
    var c = getCtx(); if (!c) return;
    var len = c.sampleRate * dur, buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
    var s = c.createBufferSource(), g = c.createGain();
    s.buffer = buf; g.gain.setValueAtTime(vol || 0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    s.connect(g); g.connect(c.destination);
    s.start(); s.stop(c.currentTime + dur + 0.01);
  }

  var sounds = {
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
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(300, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.15);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      o.connect(g); g.connect(c.destination);
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
    }
  };

  return {
    enabled: enabled,
    toggle: function () { this.enabled = !this.enabled; return this.enabled; },
    play: function (name) {
      try {
        if (!this.enabled) return;
        if (sounds[name]) sounds[name]();
      } catch (_) { /* silent fail */ }
    }
  };
})();
