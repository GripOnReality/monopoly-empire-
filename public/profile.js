/* ═══════════════════════════════════════════════════════════════
   MONOPOLY EMPIRE — profile.js
   User profile, email connection, stats, and settings
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ──────────────────────────────────────
     DEFAULT PROFILE
     ────────────────────────────────────── */
  var defaultProfile = {
    displayName: 'Guest Player',
    email: '',
    emailVerified: false,
    level: 1,
    xp: 250,
    xpToNext: 1000,
    gamesPlayed: 0,
    gamesWon: 0,
    winStreak: 0,
    bestStreak: 0,
    totalEarnings: 0,
    joinDate: Date.now(),
    avatar: '👤',
    settings: {
      sfx: true,
      music: true,
      notifications: false,
      reducedMotion: false
    }
  };

  var profile = {};

  /* ──────────────────────────────────────
     LOAD / SAVE
     ────────────────────────────────────── */
  function loadProfile() {
    var saved = loadSession('richup-profile');
    if (saved && typeof saved === 'object') {
      profile = {};
      for (var key in defaultProfile) {
        if (defaultProfile.hasOwnProperty(key)) {
          profile[key] = saved.hasOwnProperty(key) ? saved[key] : defaultProfile[key];
        }
      }
      // Ensure settings sub-object
      if (!profile.settings || typeof profile.settings !== 'object') {
        profile.settings = Object.assign({}, defaultProfile.settings);
      }
    } else {
      profile = JSON.parse(JSON.stringify(defaultProfile));
    }
  }

  function saveProfile() {
    saveSession('richup-profile', profile);
  }

  /* ──────────────────────────────────────
     XP & LEVEL SYSTEM
     ────────────────────────────────────── */
  function xpForLevel(level) {
    return Math.floor(500 * Math.pow(level, 1.5));
  }

  function addXP(amount) {
    profile.xp += amount;
    while (profile.xp >= profile.xpToNext) {
      profile.xp -= profile.xpToNext;
      profile.level++;
      profile.xpToNext = xpForLevel(profile.level);
      if (typeof showToast === 'function') {
        showToast('🎉 Level Up! You are now Level ' + profile.level + '!', 'success');
      }
      // Bonus coins on level up
      if (window.GameStore && typeof window.GameStore.addCoins === 'function') {
        window.GameStore.addCoins(50 * profile.level);
      }
    }
    saveProfile();
    renderProfileUI();
  }

  function recordGameResult(won, earnings) {
    profile.gamesPlayed++;
    profile.totalEarnings += (earnings || 0);

    if (won) {
      profile.gamesWon++;
      profile.winStreak++;
      if (profile.winStreak > profile.bestStreak) {
        profile.bestStreak = profile.winStreak;
      }
      addXP(200); // XP for winning
      if (window.GameStore && typeof window.GameStore.addCoins === 'function') {
        window.GameStore.addCoins(100); // Coins for winning
      }
    } else {
      profile.winStreak = 0;
      addXP(50); // XP for playing
      if (window.GameStore && typeof window.GameStore.addCoins === 'function') {
        window.GameStore.addCoins(25); // Coins for playing
      }
    }

    saveProfile();
    renderProfileUI();
  }

  /* ──────────────────────────────────────
     EMAIL VALIDATION
     ────────────────────────────────────── */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function connectEmail(email) {
    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    profile.email = email;
    profile.emailVerified = false; // Would need server verification in production
    saveProfile();

    // Award bonus for connecting email
    if (window.GameStore && typeof window.GameStore.addCoins === 'function') {
      window.GameStore.addCoins(200);
    }
    addXP(100);

    return { success: true, message: 'Email connected! You earned 🪙 200 bonus coins!' };
  }

  /* ──────────────────────────────────────
     RENDER PROFILE UI
     ────────────────────────────────────── */
  function renderProfileUI() {
    // Display name
    var nameEl = document.getElementById('profile-display-name');
    if (nameEl) nameEl.textContent = profile.displayName;

    // Level badge
    var levelEl = document.getElementById('profile-level');
    if (levelEl) levelEl.textContent = 'Level ' + profile.level;

    // XP bar
    var xpFill = document.getElementById('profile-xp-fill');
    var xpLabel = document.querySelector('.xp-label');
    if (xpFill) {
      var pct = Math.min(100, Math.round((profile.xp / profile.xpToNext) * 100));
      xpFill.style.width = pct + '%';
    }
    if (xpLabel) {
      xpLabel.textContent = profile.xp + ' / ' + profile.xpToNext + ' XP';
    }

    // Stats
    var statGames = document.getElementById('stat-games');
    var statWins = document.getElementById('stat-wins');
    var statStreak = document.getElementById('stat-streak');
    if (statGames) statGames.textContent = profile.gamesPlayed;
    if (statWins) statWins.textContent = profile.gamesWon;
    if (statStreak) statStreak.textContent = profile.winStreak;

    // Avatar
    var avatarEl = document.querySelector('.profile-avatar-icon');
    if (avatarEl) avatarEl.textContent = profile.avatar;

    // Email field
    var emailInput = document.getElementById('input-email');
    if (emailInput && profile.email) {
      emailInput.value = profile.email;
    }

    // Email status
    var emailStatus = document.getElementById('email-status');
    if (emailStatus) {
      if (profile.email) {
        emailStatus.className = 'email-status success';
        emailStatus.textContent = '✓ Connected: ' + profile.email;
      } else {
        emailStatus.className = 'email-status';
        emailStatus.textContent = '';
      }
    }

    // Settings toggles
    var sfxToggle = document.getElementById('setting-sfx');
    var musicToggle = document.getElementById('setting-music');
    var notifsToggle = document.getElementById('setting-notifs');
    var motionToggle = document.getElementById('setting-reduced-motion');

    if (sfxToggle) sfxToggle.checked = profile.settings.sfx;
    if (musicToggle) musicToggle.checked = profile.settings.music;
    if (notifsToggle) notifsToggle.checked = profile.settings.notifications;
    if (motionToggle) motionToggle.checked = profile.settings.reducedMotion;
  }

  /* ──────────────────────────────────────
     LEADERBOARD (Mock Data)
     ────────────────────────────────────── */
  var MOCK_LEADERBOARD = [
    { name: 'CryptoKing', avatar: '👑', wins: 342, level: 48, score: 28500 },
    { name: 'EmpressNova', avatar: '🌟', wins: 298, level: 44, score: 24200 },
    { name: 'DarkRider', avatar: '🏴', wins: 267, level: 41, score: 21800 },
    { name: 'NeonWolf', avatar: '🐺', wins: 234, level: 38, score: 19100 },
    { name: 'QueenBee', avatar: '🐝', wins: 201, level: 35, score: 16700 },
    { name: 'StormChaser', avatar: '⚡', wins: 189, level: 33, score: 15200 },
    { name: 'GoldPhoenix', avatar: '🔥', wins: 176, level: 31, score: 14100 },
    { name: 'SilverFox', avatar: '🦊', wins: 165, level: 29, score: 13000 },
    { name: 'IceViper', avatar: '🐍', wins: 154, level: 27, score: 11900 },
    { name: 'ShadowMage', avatar: '🧙', wins: 143, level: 25, score: 10800 }
  ];

  function renderLeaderboard(tab) {
    var list = document.getElementById('leaderboard-list');
    if (!list) return;

    var data = MOCK_LEADERBOARD.slice();

    // Sort based on tab
    if (tab === 'richest') {
      data.sort(function(a, b) { return b.score - a.score; });
    } else {
      data.sort(function(a, b) { return b.wins - a.wins; });
    }

    // Add current player
    var myEntry = {
      name: profile.displayName,
      avatar: profile.avatar,
      wins: profile.gamesWon,
      level: profile.level,
      score: profile.totalEarnings,
      isYou: true
    };

    var html = '';
    for (var i = 0; i < data.length; i++) {
      var entry = data[i];
      var rank = i + 1;
      var rankDisplay = rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank;

      html += '<div class="lb-entry">';
      html += '<span class="lb-rank">' + rankDisplay + '</span>';
      html += '<div class="lb-avatar">' + entry.avatar + '</div>';
      html += '<div class="lb-info">';
      html += '<div class="lb-name">' + escHtml(entry.name) + '</div>';
      html += '<div class="lb-sub">Level ' + entry.level + ' • ' + entry.wins + ' wins</div>';
      html += '</div>';
      html += '<span class="lb-score">' + entry.score.toLocaleString() + '</span>';
      html += '</div>';
    }

    // Add player entry
    html += '<div class="lb-entry is-you">';
    html += '<span class="lb-rank">—</span>';
    html += '<div class="lb-avatar">' + myEntry.avatar + '</div>';
    html += '<div class="lb-info">';
    html += '<div class="lb-name">' + escHtml(myEntry.name) + ' (You)</div>';
    html += '<div class="lb-sub">Level ' + myEntry.level + ' • ' + myEntry.wins + ' wins</div>';
    html += '</div>';
    html += '<span class="lb-score">' + myEntry.score.toLocaleString() + '</span>';
    html += '</div>';

    list.innerHTML = html;

    // Update tab active states
    var tabs = document.querySelectorAll('.lb-tab');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].classList.toggle('active', tabs[t].getAttribute('data-lb-tab') === tab);
    }
  }

  /* ──────────────────────────────────────
     MODAL CONTROLS
     ────────────────────────────────────── */
  function openProfile() {
    var modal = document.getElementById('modal-profile');
    if (modal) {
      modal.style.display = 'flex';
      renderProfileUI();
    }
  }

  function closeProfile() {
    var modal = document.getElementById('modal-profile');
    if (modal) modal.style.display = 'none';
  }

  function openLeaderboard() {
    var modal = document.getElementById('modal-leaderboard');
    if (modal) {
      modal.style.display = 'flex';
      renderLeaderboard('weekly');
    }
  }

  function closeLeaderboard() {
    var modal = document.getElementById('modal-leaderboard');
    if (modal) modal.style.display = 'none';
  }

  /* ──────────────────────────────────────
     EVENT BINDINGS
     ────────────────────────────────────── */
  function initProfile() {
    loadProfile();

    // Profile button
    var profileBtn = document.getElementById('nav-profile-btn');
    if (profileBtn) profileBtn.addEventListener('click', openProfile);

    // Close profile
    var closeProfileBtn = document.getElementById('btn-close-profile');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfile);

    // Profile overlay click
    var profileOverlay = document.getElementById('modal-profile');
    if (profileOverlay) {
      profileOverlay.addEventListener('click', function(e) {
        if (e.target === profileOverlay) closeProfile();
      });
    }

    // Leaderboard button
    var lbBtn = document.getElementById('nav-leaderboard');
    if (lbBtn) lbBtn.addEventListener('click', function() {
      openLeaderboard();
    });

    // Close leaderboard
    var closeLbBtn = document.getElementById('btn-close-leaderboard');
    if (closeLbBtn) closeLbBtn.addEventListener('click', closeLeaderboard);

    // Leaderboard overlay click
    var lbOverlay = document.getElementById('modal-leaderboard');
    if (lbOverlay) {
      lbOverlay.addEventListener('click', function(e) {
        if (e.target === lbOverlay) closeLeaderboard();
      });
    }

    // Leaderboard tabs
    var lbTabs = document.querySelectorAll('.lb-tab');
    for (var i = 0; i < lbTabs.length; i++) {
      lbTabs[i].addEventListener('click', function() {
        var tab = this.getAttribute('data-lb-tab');
        renderLeaderboard(tab);
      });
    }

    // Email save button
    var saveEmailBtn = document.getElementById('btn-save-email');
    if (saveEmailBtn) {
      saveEmailBtn.addEventListener('click', function() {
        var emailInput = document.getElementById('input-email');
        if (!emailInput) return;
        var result = connectEmail(emailInput.value.trim());
        var statusEl = document.getElementById('email-status');
        if (statusEl) {
          statusEl.className = 'email-status ' + (result.success ? 'success' : 'error');
          statusEl.textContent = result.success ? ('✓ ' + result.message) : ('✗ ' + result.error);
        }
        if (result.success && typeof showToast === 'function') {
          showToast(result.message, 'success');
        }
      });
    }

    // Settings toggles
    function bindToggle(id, settingKey) {
      var toggle = document.getElementById(id);
      if (toggle) {
        toggle.addEventListener('change', function() {
          profile.settings[settingKey] = this.checked;
          saveProfile();

          // Apply reduced motion
          if (settingKey === 'reducedMotion') {
            document.body.classList.toggle('reduced-motion', this.checked);
          }
        });
      }
    }

    bindToggle('setting-sfx', 'sfx');
    bindToggle('setting-music', 'music');
    bindToggle('setting-notifs', 'notifications');
    bindToggle('setting-reduced-motion', 'reducedMotion');

    // Sync display name with main input
    var nameInput = document.getElementById('input-name');
    if (nameInput) {
      // Pre-fill with saved name
      if (profile.displayName && profile.displayName !== 'Guest Player') {
        nameInput.value = profile.displayName;
      }
      nameInput.addEventListener('blur', function() {
        if (this.value.trim()) {
          profile.displayName = this.value.trim();
          saveProfile();
          renderProfileUI();
        }
      });
    }

    // Apply saved settings
    if (profile.settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    // Initial render
    renderProfileUI();
  }

  /* ──────────────────────────────────────
     INIT ON DOM READY
     ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
  } else {
    initProfile();
  }

  /* ──────────────────────────────────────
     EXPORTS
     ────────────────────────────────────── */
  window.UserProfile = {
    get: function() { return JSON.parse(JSON.stringify(profile)); },
    addXP: addXP,
    recordGameResult: recordGameResult,
    openProfile: openProfile,
    closeProfile: closeProfile,
    openLeaderboard: openLeaderboard,
    closeLeaderboard: closeLeaderboard,
    getName: function() { return profile.displayName; },
    getLevel: function() { return profile.level; }
  };

})();
