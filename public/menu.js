/* ═══════════════════════════════════════════════════════════════
   6SIDES.LIVE — menu.js
   Animated background symbols, navigation, private rooms, quick play
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ──────────────────────────────────────
     1. ANIMATED BACKGROUND SYMBOLS
     Cute Monopoly-themed symbols floating
     up from the bottom of the screen
     ────────────────────────────────────── */
  var SYMBOLS = [
    // Money & wealth
    '💰', '💵', '💎', '🪙', '💳', '🏦',
    // Properties & buildings
    '🏠', '🏡', '🏢', '🏗️', '🏰', '🏛️',
    // Game pieces
    '🎲', '🎯', '🃏', '♛', '♟️', '🏆',
    // Transport (railroads)
    '🚂', '🚃', '🚄', '✈️',
    // Fun & celebration
    '⭐', '✨', '🌟', '🎉', '🎊',
    // Nature (board theme)
    '🌃', '🌆', '🔥', '⚡', '🌙',
    // Cute extras
    '🎩', '👑', '💼', '🗝️', '🎪'
  ];

  var SYMBOL_COLORS = ['symbol-gold', 'symbol-blue', 'symbol-green', 'symbol-pink', 'symbol-white'];

  var bgContainer = null;
  var symbolInterval = null;
  var activeSymbols = 0;
  var MAX_SYMBOLS = 25;
  var symbolsEnabled = true;

  function createSymbol() {
    if (!bgContainer || !symbolsEnabled) return;
    if (activeSymbols >= MAX_SYMBOLS) return;
    if (document.body.classList.contains('reduced-motion')) return;

    var el = document.createElement('div');
    el.className = 'bg-symbol ' + SYMBOL_COLORS[Math.floor(Math.random() * SYMBOL_COLORS.length)];
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    // Random horizontal position
    el.style.left = (Math.random() * 100) + '%';

    // Random size variation
    var size = 0.8 + Math.random() * 1.5;
    el.style.fontSize = size + 'rem';

    // Random animation duration (slow floating)
    var duration = 12 + Math.random() * 20;
    el.style.animationDuration = duration + 's';

    // Random delay for staggered appearance
    el.style.animationDelay = (Math.random() * 3) + 's';

    // Random horizontal drift via slight rotation
    var drift = -20 + Math.random() * 40;
    el.style.setProperty('--drift', drift + 'px');

    bgContainer.appendChild(el);
    activeSymbols++;

    // Remove after animation completes
    var removeTime = (duration + 5) * 1000;
    setTimeout(function() {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        activeSymbols--;
      }
    }, removeTime);
  }

  function startSymbols() {
    bgContainer = document.getElementById('bg-symbols');
    if (!bgContainer) return;

    // Create initial batch
    for (var i = 0; i < 8; i++) {
      setTimeout(createSymbol, i * 400);
    }

    // Continue creating symbols
    symbolInterval = setInterval(function() {
      if (activeSymbols < MAX_SYMBOLS) {
        createSymbol();
      }
    }, 2000);
  }

  function stopSymbols() {
    if (symbolInterval) {
      clearInterval(symbolInterval);
      symbolInterval = null;
    }
    symbolsEnabled = false;
  }

  function resumeSymbols() {
    symbolsEnabled = true;
    if (!symbolInterval) {
      symbolInterval = setInterval(function() {
        if (activeSymbols < MAX_SYMBOLS) {
          createSymbol();
        }
      }, 2000);
    }
  }

  /* ──────────────────────────────────────
     2. NAVIGATION BAR
     Show/hide nav based on screen, handle
     tab clicks
     ────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('top-nav');
    if (!nav) return;

    // Nav link clicks
    var navLinks = nav.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        var tab = this.getAttribute('data-tab');
        handleNavTab(tab, navLinks, this);
      });
    }

    // Hide nav during game
    observeScreenChanges(nav);
  }

  function handleNavTab(tab, allLinks, activeLink) {
    // Update active state
    for (var i = 0; i < allLinks.length; i++) {
      allLinks[i].classList.toggle('active', allLinks[i] === activeLink);
    }

    switch (tab) {
      case 'home':
        // Already on home, just scroll up or show landing
        break;
      case 'play':
        // Focus the name input if on landing
        var nameInput = document.getElementById('input-name');
        if (nameInput) nameInput.focus();
        break;
      case 'leaderboard':
        if (window.UserProfile && typeof window.UserProfile.openLeaderboard === 'function') {
          window.UserProfile.openLeaderboard();
        }
        break;
    }
  }

  function observeScreenChanges(nav) {
    // Use MutationObserver to detect screen changes
    var screens = document.querySelectorAll('.screen');
    var observer = new MutationObserver(function() {
      var gameScreen = document.getElementById('screen-game');
      if (gameScreen && gameScreen.classList.contains('active')) {
        nav.classList.add('nav-hidden');
        // Reduce background symbols during game
        MAX_SYMBOLS = 8;
      } else {
        nav.classList.remove('nav-hidden');
        MAX_SYMBOLS = 25;
      }
    });

    for (var i = 0; i < screens.length; i++) {
      observer.observe(screens[i], { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* ──────────────────────────────────────
     3. PRIVATE ROOM SYSTEM
     Toggle between public/private, handle
     password fields
     ────────────────────────────────────── */
  var isPrivateRoom = false;

  function initPrivateRooms() {
    var publicTab = document.getElementById('tab-public');
    var privateTab = document.getElementById('tab-private');
    var privateOptions = document.getElementById('private-room-options');
    var passwordToggle = document.getElementById('toggle-password');
    var passwordInput = document.getElementById('input-room-password');

    if (publicTab && privateTab) {
      publicTab.addEventListener('click', function() {
        isPrivateRoom = false;
        publicTab.classList.add('active');
        privateTab.classList.remove('active');
        if (privateOptions) privateOptions.style.display = 'none';
      });

      privateTab.addEventListener('click', function() {
        isPrivateRoom = true;
        privateTab.classList.add('active');
        publicTab.classList.remove('active');
        if (privateOptions) {
          privateOptions.style.display = 'block';
          if (passwordInput) passwordInput.focus();
        }
      });
    }

    // Password visibility toggle
    if (passwordToggle && passwordInput) {
      passwordToggle.addEventListener('click', function() {
        var isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.textContent = isPassword ? '🙈' : '👁';
      });
    }

    // Listen for room code input to show join password field
    var codeInput = document.getElementById('input-code');
    var joinPwGroup = document.getElementById('join-password-group');
    if (codeInput && joinPwGroup) {
      codeInput.addEventListener('input', function() {
        // Show password field when code is entered (in case it's a private room)
        if (this.value.trim().length >= 4) {
          joinPwGroup.style.display = 'block';
        } else {
          joinPwGroup.style.display = 'none';
        }
      });
    }
  }

  /* ──────────────────────────────────────
     4. QUICK PLAY
     Auto-match with an open public room
     or create a new one
     ────────────────────────────────────── */
  function initQuickPlay() {
    var btn = document.getElementById('btn-quick-play');
    if (!btn) return;

    btn.addEventListener('click', function() {
      var nameInput = document.getElementById('input-name');
      var name = nameInput ? nameInput.value.trim() : '';

      if (!name) {
        if (typeof showToast === 'function') showToast('Please enter your name first!', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      // Quick play: just create a new room (in a full implementation,
      // this would search for open rooms first via the server)
      if (typeof showToast === 'function') showToast('Finding a game...', 'info');

      btn.disabled = true;
      btn.innerHTML = '<span class="btn-icon-left">⏳</span> Searching...';

      // Simulate search delay, then create room
      setTimeout(function() {
        var createBtn = document.getElementById('btn-create');
        if (createBtn && !createBtn.disabled) {
          createBtn.click();
        } else {
          btn.disabled = false;
          btn.innerHTML = '<span class="btn-icon-left">🎲</span> Quick Play <span class="quick-play-badge">BETA</span>';
          if (typeof showToast === 'function') showToast('Please enter your name to play', 'error');
        }
      }, 1500);
    });
  }

  /* ──────────────────────────────────────
     5. KEYBOARD SHORTCUTS
     ────────────────────────────────────── */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // ESC to close modals
      if (e.key === 'Escape') {
        var modals = document.querySelectorAll('.modal-overlay');
        for (var i = 0; i < modals.length; i++) {
          if (modals[i].style.display !== 'none' && modals[i].style.display !== '') {
            modals[i].style.display = 'none';
            return;
          }
        }
      }
    });
  }

  /* ──────────────────────────────────────
     6. PARTICLE BURST EFFECT
     Used when purchasing items, leveling up, etc.
     ────────────────────────────────────── */
  function particleBurst(x, y, emoji, count) {
    count = count || 8;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.textContent = emoji || '✨';
      el.style.cssText = 'position:fixed;font-size:1.2rem;pointer-events:none;z-index:99999;' +
        'left:' + x + 'px;top:' + y + 'px;' +
        'transition:all 0.8s cubic-bezier(0.2,0.8,0.3,1);opacity:1;';
      document.body.appendChild(el);

      var angle = (Math.PI * 2 / count) * i;
      var distance = 40 + Math.random() * 60;
      var dx = Math.cos(angle) * distance;
      var dy = Math.sin(angle) * distance;

      requestAnimationFrame(function(element, deltaX, deltaY) {
        return function() {
          element.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(0.3) rotate(' + (Math.random() * 360) + 'deg)';
          element.style.opacity = '0';
        };
      }(el, dx, dy));

      setTimeout(function(element) {
        return function() {
          if (element.parentNode) element.parentNode.removeChild(element);
        };
      }(el), 900);
    }
  }

  /* ──────────────────────────────────────
     7. WELCOME TOAST
     ────────────────────────────────────── */
  function showWelcome() {
    setTimeout(function() {
      var saved = loadSession('6sides-profile');
      var name = (saved && saved.displayName && saved.displayName !== 'Guest Player') ? saved.displayName : null;

      if (name) {
        if (typeof showToast === 'function') showToast('Welcome back, ' + name + '! 👋', 'info');
      }
    }, 1000);
  }

  /* ──────────────────────────────────────
     INIT
     ────────────────────────────────────── */
  function initMenu() {
    startSymbols();
    initNav();
    initPrivateRooms();
    initQuickPlay();
    initKeyboardShortcuts();
    showWelcome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }

  /* ──────────────────────────────────────
     EXPORTS
     ────────────────────────────────────── */
  window.MenuSystem = {
    particleBurst: particleBurst,
    isPrivateRoom: function() { return isPrivateRoom; },
    getPassword: function() {
      var input = document.getElementById('input-room-password');
      return input ? input.value : '';
    },
    getJoinPassword: function() {
      var input = document.getElementById('input-join-password');
      return input ? input.value : '';
    },
    stopSymbols: stopSymbols,
    resumeSymbols: resumeSymbols
  };

})();
