/* ============================================================
   SVG Injection — Cyberpunk Monopoly Empire
   Replaces emoji placeholders with cyberpunk SVG icons.
   Runs after all SVG modules (tokens.js, spaces.js, ui.js,
   patterns.js) are loaded.
   ============================================================ */

(function() {
  'use strict';

  /* ----------------------------------------------------------
     Character ID → Token SVG key mapping.
     CHARACTERS uses ids like "red", "blue", etc.
     TOKEN_SVGS uses names like "crimson", "ocean", etc.
     ---------------------------------------------------------- */
  var CHAR_ID_TO_TOKEN = {
    red:    'crimson',
    blue:   'ocean',
    green:  'emerald',
    orange: 'amber',
    purple: 'violet',
    teal:   'teal',
    pink:   'fuchsia',
    white:  'ivory'
  };

  /* ----------------------------------------------------------
     1. INJECT SPACE ICONS
     Replace emoji placeholders in .space-icon[data-svg] elements
     with cyberpunk SVG icons from spaces.js
     ---------------------------------------------------------- */
  function injectSpaceIcons() {
    if (!window.getSpaceSVG) {
      console.warn('[SVG] getSpaceSVG not available — skipping space icon injection');
      return;
    }

    var icons = document.querySelectorAll('.space-icon[data-svg]');
    if (!icons.length) return;

    for (var i = 0; i < icons.length; i++) {
      try {
        var type = icons[i].getAttribute('data-svg');
        if (!type) continue;

        var svg = window.getSpaceSVG(type, 20);
        if (svg) {
          icons[i].innerHTML = svg;
        }
      } catch (err) {
        console.warn('[SVG] Failed to inject space icon:', type, err);
      }
    }
  }

  /* ----------------------------------------------------------
     2. INJECT CORNER ICONS
     Replace emoji placeholders in corner spaces:
     - go_arrow (pos 0) — GO corner
     - jail_bars (pos 10) — Jail corner
     - free_parking (pos 20) — Free Parking corner
     - go_to_jail (pos 30) — Go To Jail corner
     ---------------------------------------------------------- */
  function injectCornerIcons() {
    if (!window.getSpaceSVG) {
      console.warn('[SVG] getSpaceSVG not available — skipping corner icon injection');
      return;
    }

    // GO arrow — slightly smaller to fit the corner layout
    var goArrow = document.querySelector('.corner-arrow[data-svg="go_arrow"]');
    if (goArrow) {
      try {
        var arrowSvg = window.getSpaceSVG('go_arrow', 28);
        if (arrowSvg) goArrow.innerHTML = arrowSvg;
      } catch (err) {
        console.warn('[SVG] Failed to inject go_arrow:', err);
      }
    }

    // Other corner icons embedded in .corner-big elements
    var corners = [
      { key: 'jail_bars',    size: 32 },
      { key: 'free_parking', size: 32 },
      { key: 'go_to_jail',   size: 32 }
    ];

    for (var i = 0; i < corners.length; i++) {
      try {
        var el = document.querySelector('.corner-big[data-svg="' + corners[i].key + '"]');
        if (!el) continue;

        var svg = window.getSpaceSVG(corners[i].key, corners[i].size);
        if (svg) {
          // Preserve the text content as an aria-label for accessibility
          var label = el.textContent.trim();
          el.innerHTML = svg;
          if (label) {
            el.setAttribute('aria-label', label);
          }
        }
      } catch (err) {
        console.warn('[SVG] Failed to inject corner icon:', corners[i].key, err);
      }
    }
  }

  /* ----------------------------------------------------------
     3. INJECT UI ICONS (crown, etc.)
     Replace emoji placeholders for crown icons in the landing
     page header and board center.
     ---------------------------------------------------------- */
  function injectUIIcons() {
    if (!window.getUISVG) {
      console.warn('[SVG] getUISVG not available — skipping UI icon injection');
      return;
    }

    var crownElements = document.querySelectorAll('[data-svg="crown"]');
    for (var i = 0; i < crownElements.length; i++) {
      try {
        var el = crownElements[i];
        // Board center crown gets a slightly smaller size to fit the layout
        var isCenterCrown = el.classList.contains('center-crown');
        var size = isCenterCrown ? 48 : 52;

        var svg = window.getUISVG('crown', size);
        if (svg) {
          el.innerHTML = svg;
        }
      } catch (err) {
        console.warn('[SVG] Failed to inject crown icon:', err);
      }
    }
  }

  /* ----------------------------------------------------------
     4. APPLY CYBERPUNK COLOR BAND PATTERNS
     Overlay circuit-trace patterns on property color bands
     using SVG patterns from patterns.js
     ---------------------------------------------------------- */
  function applyColorBandPatterns() {
    if (!window.getPatternBG) {
      console.warn('[SVG] getPatternBG not available — skipping color band patterns');
      return;
    }

    var bands = document.querySelectorAll('.color-band');
    if (!bands.length) return;

    // Map CSS variable names found in inline styles to pattern keys
    var varToPattern = {
      '--prop-brown':     'band_brown',
      '--prop-lightblue': 'band_lightblue',
      '--prop-pink':      'band_pink',
      '--prop-orange':    'band_orange',
      '--prop-red':       'band_red',
      '--prop-yellow':    'band_yellow',
      '--prop-green':     'band_green',
      '--prop-darkblue':  'band_darkblue'
    };

    for (var i = 0; i < bands.length; i++) {
      try {
        var band = bands[i];
        var bgStyle = band.getAttribute('style') || '';

        // Find which color group this band belongs to
        for (var varName in varToPattern) {
          if (varToPattern.hasOwnProperty(varName) && bgStyle.indexOf(varName) !== -1) {
            var pattern = window.getPatternBG(varToPattern[varName]);
            if (pattern) {
              band.style.backgroundImage = pattern;
              band.style.backgroundSize = '16px 8px';
              band.style.backgroundRepeat = 'repeat';
              band.style.backgroundBlendMode = 'overlay';
            }
            break;
          }
        }
      } catch (err) {
        console.warn('[SVG] Failed to apply color band pattern:', err);
      }
    }
  }

  /* ----------------------------------------------------------
     5. PATCH TOKEN RENDERING
     Override the global makeToken() function to render
     cyberpunk SVG tokens instead of plain colored circles.
     Falls back to the original implementation when SVG is
     not available for a given character.
     ---------------------------------------------------------- */
  function patchTokenRendering() {
    if (!window.getTokenSVG) {
      console.warn('[SVG] getTokenSVG not available — skipping token patch');
      return;
    }

    if (!window.TOKEN_SVGS) {
      console.warn('[SVG] TOKEN_SVGS not available — skipping token patch');
      return;
    }

    // Capture the original makeToken before overriding
    var origMakeToken = window.makeToken;

    if (typeof origMakeToken !== 'function') {
      console.warn('[SVG] Original makeToken not found — creating standalone SVG token renderer');
    }

    window.makeToken = function(seatIndex, characterId) {
      // Resolve the token SVG key from character ID
      var tokenKey = characterId ? (CHAR_ID_TO_TOKEN[characterId] || null) : null;

      // If we have a valid SVG token, render it
      if (tokenKey && window.TOKEN_SVGS[tokenKey]) {
        var el = document.createElement('div');
        el.className = 'board-token svg-token';
        el.setAttribute('data-seat', seatIndex);

        try {
          el.innerHTML = window.getTokenSVG(tokenKey, 20);
          // Override the default board-token styling for SVG tokens
          el.style.background = 'transparent';
          el.style.border = 'none';
          el.style.boxShadow = 'none';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.fontSize = '0';
          el.style.lineHeight = '0';

          // Add character info for debugging / accessibility
          el.setAttribute('aria-label', 'Player ' + (seatIndex + 1));
          el.title = 'Player ' + (seatIndex + 1);

          return el;
        } catch (err) {
          console.warn('[SVG] Failed to render SVG token for', characterId, err);
          // Fall through to original
        }
      }

      // Fallback to original makeToken if available
      if (typeof origMakeToken === 'function') {
        return origMakeToken(seatIndex, characterId);
      }

      // Last-resort fallback: plain numbered token
      var PLAYER_COLORS = [
        '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
        '#9b59b6', '#1abc9c', '#e91e8b', '#bdc3c7'
      ];
      var fallback = document.createElement('div');
      fallback.className = 'board-token';
      fallback.setAttribute('data-seat', seatIndex);
      fallback.textContent = seatIndex + 1;
      fallback.style.background = PLAYER_COLORS[seatIndex] || '#888';
      fallback.style.color = '#fff';
      return fallback;
    };
  }

  /* ----------------------------------------------------------
     6. INJECT BOARD BACKGROUND PATTERN
     Apply the circuit board pattern to the board center area.
     ---------------------------------------------------------- */
  function injectBoardBackground() {
    if (!window.getPatternBG) return;

    try {
      var boardCenter = document.getElementById('board-center');
      if (boardCenter) {
        var bgPattern = window.getPatternBG('board_bg');
        if (bgPattern) {
          boardCenter.style.backgroundImage = bgPattern;
          boardCenter.style.backgroundSize = '64px 64px';
          boardCenter.style.backgroundRepeat = 'repeat';
        }
      }
    } catch (err) {
      console.warn('[SVG] Failed to inject board background:', err);
    }
  }

  /* ----------------------------------------------------------
     7. RE-INJECTION HOOK
     Expose a global function that can be called after dynamic
     board updates (e.g., after re-rendering token positions)
     to re-inject any SVGs that were lost.
     ---------------------------------------------------------- */
  function reinjectAll() {
    injectSpaceIcons();
    injectCornerIcons();
    injectUIIcons();
    applyColorBandPatterns();
    injectBoardBackground();
  }

  /* ----------------------------------------------------------
     MAIN INJECTION ENTRY POINT
     ---------------------------------------------------------- */
  function injectAll() {
    try {
      injectSpaceIcons();
      injectCornerIcons();
      injectUIIcons();
      applyColorBandPatterns();
      patchTokenRendering();
      injectBoardBackground();
      console.log('[SVG] Cyberpunk assets injected successfully');
    } catch (err) {
      console.error('[SVG] Critical error during injection:', err);
    }
  }

  /* ----------------------------------------------------------
     RUN ON DOM READY
     ---------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAll);
  } else {
    // DOM already loaded (script deferred or loaded late)
    injectAll();
  }

  /* ----------------------------------------------------------
     EXPOSE GLOBALS
     ---------------------------------------------------------- */
  window.reinjectSVGs = reinjectAll;
  window.CHAR_ID_TO_TOKEN = CHAR_ID_TO_TOKEN;

})();
