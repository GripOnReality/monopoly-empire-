/* ============================================================
   Cyberpunk Pattern SVGs — 6sides.live
   Circuit traces, neon glow, glitch textures, data streams
   ============================================================ */

var PATTERN_SVGS = {

  /* ----------------------------------------------------------
     1. PROPERTY COLOR BAND PATTERNS (tileable, 16×8 viewBox)
     Subtle circuit/cyber textures over solid color bands.
     ---------------------------------------------------------- */

  // Brown — copper circuit traces
  band_brown: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#a0522d"/>' +
    '<line x1="0" y1="4" x2="6" y2="4" stroke="#c97a45" stroke-width="0.4" opacity="0.35"/>' +
    '<line x1="6" y1="4" x2="8" y2="2" stroke="#c97a45" stroke-width="0.4" opacity="0.35"/>' +
    '<line x1="8" y1="2" x2="16" y2="2" stroke="#c97a45" stroke-width="0.4" opacity="0.35"/>' +
    '<circle cx="6" cy="4" r="0.6" fill="#e8a060" opacity="0.3"/>' +
    '<line x1="0" y1="7" x2="4" y2="7" stroke="#8a4020" stroke-width="0.3" opacity="0.25"/>' +
    '<line x1="4" y1="7" x2="5" y2="6" stroke="#8a4020" stroke-width="0.3" opacity="0.25"/>' +
    '<line x1="5" y1="6" x2="10" y2="6" stroke="#8a4020" stroke-width="0.3" opacity="0.25"/>' +
    '<rect x="14" y="3.5" width="1" height="1" fill="#e8a060" opacity="0.15" rx="0.2"/>' +
    '</svg>',

  // Light Blue — data stream / flowing lines
  band_lightblue: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#5ec4e8"/>' +
    '<line x1="0" y1="2" x2="5" y2="2" stroke="#9ee4ff" stroke-width="0.3" opacity="0.4"/>' +
    '<line x1="5" y1="2" x2="7" y2="4" stroke="#9ee4ff" stroke-width="0.3" opacity="0.4"/>' +
    '<line x1="7" y1="4" x2="16" y2="4" stroke="#9ee4ff" stroke-width="0.3" opacity="0.4"/>' +
    '<line x1="0" y1="6" x2="16" y2="6" stroke="#3aa8d0" stroke-width="0.25" opacity="0.3" stroke-dasharray="1.5 2"/>' +
    '<line x1="10" y1="0" x2="10" y2="3" stroke="#9ee4ff" stroke-width="0.2" opacity="0.25"/>' +
    '<circle cx="10" cy="3" r="0.4" fill="#c0f0ff" opacity="0.3"/>' +
    '</svg>',

  // Pink — heartbeat / pulse monitor
  band_pink: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#ff5faa"/>' +
    '<polyline points="0,4 3,4 4,1 5,7 6,3 7,5 8,4 16,4" fill="none" stroke="#ffa0d0" stroke-width="0.4" opacity="0.4"/>' +
    '<line x1="0" y1="1" x2="16" y2="1" stroke="#ff80c0" stroke-width="0.15" opacity="0.2"/>' +
    '<line x1="0" y1="7" x2="16" y2="7" stroke="#ff80c0" stroke-width="0.15" opacity="0.2"/>' +
    '<circle cx="4" cy="1" r="0.35" fill="#ffd0e8" opacity="0.3"/>' +
    '<circle cx="5" cy="7" r="0.35" fill="#ffd0e8" opacity="0.3"/>' +
    '</svg>',

  // Orange — warning stripe / hazard
  band_orange: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#ff8c00"/>' +
    '<line x1="0" y1="8" x2="4" y2="0" stroke="#ffb040" stroke-width="1.2" opacity="0.2"/>' +
    '<line x1="4" y1="8" x2="8" y2="0" stroke="#ffb040" stroke-width="1.2" opacity="0.2"/>' +
    '<line x1="8" y1="8" x2="12" y2="0" stroke="#ffb040" stroke-width="1.2" opacity="0.2"/>' +
    '<line x1="12" y1="8" x2="16" y2="0" stroke="#ffb040" stroke-width="1.2" opacity="0.2"/>' +
    '<line x1="0" y1="4" x2="16" y2="4" stroke="#cc6600" stroke-width="0.2" opacity="0.25"/>' +
    '</svg>',

  // Red — energy / sharp zigzags
  band_red: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#ff2d2d"/>' +
    '<polyline points="0,6 2,2 4,6 6,2 8,6 10,2 12,6 14,2 16,6" fill="none" stroke="#ff7070" stroke-width="0.4" opacity="0.35"/>' +
    '<polyline points="0,7 2,5 4,7 6,5 8,7 10,5 12,7 14,5 16,7" fill="none" stroke="#cc0000" stroke-width="0.25" opacity="0.2"/>' +
    '<line x1="0" y1="1" x2="16" y2="1" stroke="#ff5050" stroke-width="0.15" opacity="0.2" stroke-dasharray="0.5 3"/>' +
    '</svg>',

  // Yellow — binary rain / matrix
  band_yellow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#ffd700"/>' +
    '<text x="1" y="3" font-family="monospace" font-size="2" fill="#fff8a0" opacity="0.3">01</text>' +
    '<text x="6" y="6" font-family="monospace" font-size="2" fill="#fff8a0" opacity="0.25">10</text>' +
    '<text x="11" y="4" font-family="monospace" font-size="2" fill="#fff8a0" opacity="0.2">11</text>' +
    '<line x1="4" y1="0" x2="4" y2="8" stroke="#e6c000" stroke-width="0.15" opacity="0.2"/>' +
    '<line x1="10" y1="0" x2="10" y2="8" stroke="#e6c000" stroke-width="0.15" opacity="0.2"/>' +
    '</svg>',

  // Green — nature-circuit hybrid (leaf veins as circuits)
  band_green: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#00b347"/>' +
    '<line x1="0" y1="4" x2="8" y2="4" stroke="#40e080" stroke-width="0.4" opacity="0.35"/>' +
    '<line x1="3" y1="4" x2="1" y2="1" stroke="#40e080" stroke-width="0.25" opacity="0.3"/>' +
    '<line x1="5" y1="4" x2="3" y2="7" stroke="#40e080" stroke-width="0.25" opacity="0.3"/>' +
    '<line x1="7" y1="4" x2="5.5" y2="1.5" stroke="#40e080" stroke-width="0.25" opacity="0.3"/>' +
    '<circle cx="8" cy="4" r="0.5" fill="#60ff90" opacity="0.2"/>' +
    '<line x1="10" y1="0" x2="10" y2="8" stroke="#008838" stroke-width="0.2" opacity="0.2" stroke-dasharray="0.8 1.5"/>' +
    '<line x1="14" y1="0" x2="14" y2="8" stroke="#008838" stroke-width="0.2" opacity="0.2" stroke-dasharray="0.8 1.5"/>' +
    '</svg>',

  // Dark Blue — neural network nodes
  band_darkblue: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8">' +
    '<rect width="16" height="8" fill="#3838ff"/>' +
    '<circle cx="2" cy="2" r="0.6" fill="none" stroke="#8080ff" stroke-width="0.3" opacity="0.35"/>' +
    '<circle cx="8" cy="6" r="0.6" fill="none" stroke="#8080ff" stroke-width="0.3" opacity="0.35"/>' +
    '<circle cx="14" cy="3" r="0.6" fill="none" stroke="#8080ff" stroke-width="0.3" opacity="0.35"/>' +
    '<line x1="2.5" y1="2.3" x2="7.5" y2="5.7" stroke="#6060e0" stroke-width="0.25" opacity="0.3"/>' +
    '<line x1="8.5" y1="5.7" x2="13.5" y2="3.3" stroke="#6060e0" stroke-width="0.25" opacity="0.3"/>' +
    '<line x1="2.5" y1="2" x2="13.5" y2="3" stroke="#6060e0" stroke-width="0.15" opacity="0.2" stroke-dasharray="1 2"/>' +
    '</svg>',


  /* ----------------------------------------------------------
     2. BOARD BACKGROUND PATTERN (64×64, subtle circuit board)
     ---------------------------------------------------------- */

  board_bg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" fill="#0a1510"/>' +
    // Horizontal traces
    '<line x1="0" y1="8" x2="20" y2="8" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="20" y1="8" x2="24" y2="12" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="24" y1="12" x2="48" y2="12" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="0" y1="32" x2="12" y2="32" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="12" y1="32" x2="16" y2="28" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="16" y1="28" x2="40" y2="28" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="40" y1="28" x2="44" y2="32" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="44" y1="32" x2="64" y2="32" stroke="#0d2818" stroke-width="0.5"/>' +
    // Vertical traces
    '<line x1="8" y1="0" x2="8" y2="16" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="8" y1="16" x2="12" y2="20" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="12" y1="20" x2="12" y2="44" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="32" y1="40" x2="32" y2="52" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="32" y1="52" x2="36" y2="56" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="36" y1="56" x2="36" y2="64" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="56" y1="0" x2="56" y2="20" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="56" y1="20" x2="52" y2="24" stroke="#0d2818" stroke-width="0.5"/>' +
    '<line x1="52" y1="24" x2="52" y2="48" stroke="#0d2818" stroke-width="0.5"/>' +
    // Junction pads (tiny squares)
    '<rect x="19" y="7" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    '<rect x="11" y="31" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    '<rect x="43" y="31" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    '<rect x="7" y="15" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    '<rect x="31" y="51" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    '<rect x="55" y="19" width="2" height="2" fill="#0d2818" rx="0.3"/>' +
    // Vias (small circles)
    '<circle cx="48" cy="12" r="1.2" fill="none" stroke="#0d2818" stroke-width="0.5"/>' +
    '<circle cx="12" cy="44" r="1.2" fill="none" stroke="#0d2818" stroke-width="0.5"/>' +
    '<circle cx="52" cy="48" r="1.2" fill="none" stroke="#0d2818" stroke-width="0.5"/>' +
    '<circle cx="32" cy="40" r="1.2" fill="none" stroke="#0d2818" stroke-width="0.5"/>' +
    // Faint grid dots
    '<circle cx="16" cy="48" r="0.4" fill="#0d2818" opacity="0.5"/>' +
    '<circle cx="40" cy="8" r="0.4" fill="#0d2818" opacity="0.5"/>' +
    '<circle cx="48" cy="56" r="0.4" fill="#0d2818" opacity="0.5"/>' +
    '<circle cx="24" cy="40" r="0.4" fill="#0d2818" opacity="0.5"/>' +
    '</svg>',


  /* ----------------------------------------------------------
     3. CARD BACK PATTERNS (120×168)
     ---------------------------------------------------------- */

  // Chance — magenta with "?" watermark, scan lines, glitch, angular border
  chance_back: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 168">' +
    // Dark background
    '<rect width="120" height="168" fill="#1a0a1a"/>' +
    // Inner area fill
    '<rect x="6" y="6" width="108" height="156" fill="#220e28" rx="1"/>' +
    // Scan lines
    '<g opacity="0.12">' +
      '<line x1="6" y1="14" x2="114" y2="14" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="22" x2="114" y2="22" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="30" x2="114" y2="30" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="38" x2="114" y2="38" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="46" x2="114" y2="46" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="54" x2="114" y2="54" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="62" x2="114" y2="62" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="70" x2="114" y2="70" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="78" x2="114" y2="78" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="86" x2="114" y2="86" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="94" x2="114" y2="94" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="102" x2="114" y2="102" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="110" x2="114" y2="110" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="118" x2="114" y2="118" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="126" x2="114" y2="126" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="134" x2="114" y2="134" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="142" x2="114" y2="142" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="150" x2="114" y2="150" stroke="#ff40ff" stroke-width="0.5"/>' +
      '<line x1="6" y1="158" x2="114" y2="158" stroke="#ff40ff" stroke-width="0.5"/>' +
    '</g>' +
    // Circuit traces
    '<g stroke="#ff40ff" stroke-width="0.6" opacity="0.15" fill="none">' +
      '<polyline points="10,30 30,30 34,26 70,26"/>' +
      '<polyline points="50,140 80,140 84,136 110,136"/>' +
      '<line x1="20" y1="6" x2="20" y2="40"/>' +
      '<line x1="100" y1="128" x2="100" y2="162"/>' +
    '</g>' +
    // Giant "?" watermark
    '<text x="60" y="108" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="80" ' +
      'fill="none" stroke="#ff40ff" stroke-width="1.5" opacity="0.1">?</text>' +
    '<text x="60" y="108" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="80" ' +
      'fill="#ff40ff" opacity="0.06">?</text>' +
    // Glitch fragments
    '<rect x="15" y="58" width="28" height="3" fill="#ff40ff" opacity="0.08"/>' +
    '<rect x="70" y="100" width="35" height="2" fill="#ff80ff" opacity="0.07"/>' +
    '<rect x="40" y="130" width="18" height="2.5" fill="#ff40ff" opacity="0.06"/>' +
    // Angular border — outer
    '<polygon points="4,12 4,4 12,4" fill="none" stroke="#ff40ff" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="108,4 116,4 116,12" fill="none" stroke="#ff40ff" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="116,156 116,164 108,164" fill="none" stroke="#ff40ff" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="12,164 4,164 4,156" fill="none" stroke="#ff40ff" stroke-width="1.2" opacity="0.6"/>' +
    // Angular border — edges
    '<line x1="12" y1="4" x2="108" y2="4" stroke="#ff40ff" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="12" y1="164" x2="108" y2="164" stroke="#ff40ff" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="4" y1="12" x2="4" y2="156" stroke="#ff40ff" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="116" y1="12" x2="116" y2="156" stroke="#ff40ff" stroke-width="0.7" opacity="0.4"/>' +
    // Neon corner dots
    '<circle cx="4" cy="4" r="1.5" fill="#ff40ff" opacity="0.5"/>' +
    '<circle cx="116" cy="4" r="1.5" fill="#ff40ff" opacity="0.5"/>' +
    '<circle cx="116" cy="164" r="1.5" fill="#ff40ff" opacity="0.5"/>' +
    '<circle cx="4" cy="164" r="1.5" fill="#ff40ff" opacity="0.5"/>' +
    '</svg>',

  // Community Chest — green with lock/vault watermark, circuit traces, data lines, angular border
  chest_back: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 168">' +
    // Dark background
    '<rect width="120" height="168" fill="#0a1a0e"/>' +
    // Inner area fill
    '<rect x="6" y="6" width="108" height="156" fill="#0e2814" rx="1"/>' +
    // Data lines (horizontal)
    '<g opacity="0.1">' +
      '<line x1="10" y1="16" x2="110" y2="16" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="28" x2="110" y2="28" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="40" x2="110" y2="40" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="52" x2="110" y2="52" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="64" x2="110" y2="64" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="76" x2="110" y2="76" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="88" x2="110" y2="88" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="100" x2="110" y2="100" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="112" x2="110" y2="112" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="124" x2="110" y2="124" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="136" x2="110" y2="136" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
      '<line x1="10" y1="148" x2="110" y2="148" stroke="#00ff60" stroke-width="0.4" stroke-dasharray="3 5"/>' +
    '</g>' +
    // Circuit traces
    '<g stroke="#00ff60" stroke-width="0.6" opacity="0.12" fill="none">' +
      '<polyline points="15,50 40,50 44,46 80,46 84,50 110,50"/>' +
      '<polyline points="15,120 35,120 39,116 75,116 79,120 110,120"/>' +
      '<line x1="30" y1="6" x2="30" y2="55"/>' +
      '<line x1="90" y1="115" x2="90" y2="162"/>' +
      '<line x1="60" y1="46" x2="60" y2="70"/>' +
    '</g>' +
    // Lock / vault watermark
    // Lock body
    '<rect x="40" y="82" width="40" height="32" rx="2" fill="none" stroke="#00ff60" stroke-width="1.5" opacity="0.08"/>' +
    '<rect x="40" y="82" width="40" height="32" rx="2" fill="#00ff60" opacity="0.03"/>' +
    // Lock shackle
    '<path d="M48,82 L48,70 C48,60 72,60 72,70 L72,82" fill="none" stroke="#00ff60" stroke-width="1.5" opacity="0.08"/>' +
    // Keyhole
    '<circle cx="60" cy="94" r="5" fill="none" stroke="#00ff60" stroke-width="1" opacity="0.08"/>' +
    '<rect x="58.5" y="96" width="3" height="8" fill="#00ff60" opacity="0.06" rx="0.5"/>' +
    // Glitch fragments
    '<rect x="18" y="70" width="22" height="2" fill="#00ff60" opacity="0.06"/>' +
    '<rect x="78" y="58" width="26" height="2.5" fill="#00ff60" opacity="0.05"/>' +
    '<rect x="30" y="140" width="20" height="2" fill="#00ff60" opacity="0.06"/>' +
    // Angular border — corners
    '<polygon points="4,12 4,4 12,4" fill="none" stroke="#00ff60" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="108,4 116,4 116,12" fill="none" stroke="#00ff60" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="116,156 116,164 108,164" fill="none" stroke="#00ff60" stroke-width="1.2" opacity="0.6"/>' +
    '<polygon points="12,164 4,164 4,156" fill="none" stroke="#00ff60" stroke-width="1.2" opacity="0.6"/>' +
    // Angular border — edges
    '<line x1="12" y1="4" x2="108" y2="4" stroke="#00ff60" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="12" y1="164" x2="108" y2="164" stroke="#00ff60" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="4" y1="12" x2="4" y2="156" stroke="#00ff60" stroke-width="0.7" opacity="0.4"/>' +
    '<line x1="116" y1="12" x2="116" y2="156" stroke="#00ff60" stroke-width="0.7" opacity="0.4"/>' +
    // Neon corner dots
    '<circle cx="4" cy="4" r="1.5" fill="#00ff60" opacity="0.5"/>' +
    '<circle cx="116" cy="4" r="1.5" fill="#00ff60" opacity="0.5"/>' +
    '<circle cx="116" cy="164" r="1.5" fill="#00ff60" opacity="0.5"/>' +
    '<circle cx="4" cy="164" r="1.5" fill="#00ff60" opacity="0.5"/>' +
    '</svg>',


  /* ----------------------------------------------------------
     4. CORNER DECORATIVE FRAMES (16×16 angular brackets)
     ---------------------------------------------------------- */

  // Top-left corner bracket
  corner_tl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
    '<polyline points="1,12 1,3 3,1 12,1" fill="none" stroke="#00ffcc" stroke-width="1.2" opacity="0.7"/>' +
    '<circle cx="1" cy="12" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="12" cy="1" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '</svg>',

  // Top-right corner bracket
  corner_tr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
    '<polyline points="4,1 13,1 15,3 15,12" fill="none" stroke="#00ffcc" stroke-width="1.2" opacity="0.7"/>' +
    '<circle cx="4" cy="1" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="15" cy="12" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '</svg>',

  // Bottom-left corner bracket
  corner_bl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
    '<polyline points="1,4 1,13 3,15 12,15" fill="none" stroke="#00ffcc" stroke-width="1.2" opacity="0.7"/>' +
    '<circle cx="1" cy="4" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="12" cy="15" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '</svg>',

  // Bottom-right corner bracket
  corner_br: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
    '<polyline points="15,4 15,13 13,15 4,15" fill="none" stroke="#00ffcc" stroke-width="1.2" opacity="0.7"/>' +
    '<circle cx="15" cy="4" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="4" cy="15" r="1" fill="#00ffcc" opacity="0.5"/>' +
    '</svg>',


  /* ----------------------------------------------------------
     5. DIVIDER LINES
     ---------------------------------------------------------- */

  // Horizontal cyberpunk divider — circuit line with node pulses
  divider_h: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 4">' +
    '<line x1="0" y1="2" x2="200" y2="2" stroke="#00ffcc" stroke-width="0.4" opacity="0.3"/>' +
    '<line x1="0" y1="2" x2="40" y2="2" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="40" y1="2" x2="45" y2="0.5" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="45" y1="0.5" x2="55" y2="3.5" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="55" y1="3.5" x2="60" y2="2" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="60" y1="2" x2="140" y2="2" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="140" y1="2" x2="145" y2="0.5" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="145" y1="0.5" x2="155" y2="3.5" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="155" y1="3.5" x2="160" y2="2" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="160" y1="2" x2="200" y2="2" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    // Nodes at intervals
    '<circle cx="20" cy="2" r="1.2" fill="#00ffcc" opacity="0.6"/>' +
    '<circle cx="50" cy="2" r="1.5" fill="#00ffcc" opacity="0.8"/>' +
    '<circle cx="100" cy="2" r="1.8" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="150" cy="2" r="1.5" fill="#00ffcc" opacity="0.8"/>' +
    '<circle cx="180" cy="2" r="1.2" fill="#00ffcc" opacity="0.6"/>' +
    // Glow halos on center nodes
    '<circle cx="50" cy="2" r="3" fill="#00ffcc" opacity="0.08"/>' +
    '<circle cx="100" cy="2" r="3.5" fill="#00ffcc" opacity="0.06"/>' +
    '<circle cx="150" cy="2" r="3" fill="#00ffcc" opacity="0.08"/>' +
    '</svg>',

  // Vertical cyberpunk divider — same concept rotated
  divider_v: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 200">' +
    '<line x1="2" y1="0" x2="2" y2="200" stroke="#00ffcc" stroke-width="0.4" opacity="0.3"/>' +
    '<line x1="2" y1="0" x2="2" y2="40" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="2" y1="40" x2="0.5" y2="45" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="0.5" y1="45" x2="3.5" y2="55" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="3.5" y1="55" x2="2" y2="60" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="2" y1="60" x2="2" y2="140" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="2" y1="140" x2="0.5" y2="145" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="0.5" y1="145" x2="3.5" y2="155" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="3.5" y1="155" x2="2" y2="160" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    '<line x1="2" y1="160" x2="2" y2="200" stroke="#00ffcc" stroke-width="0.8" opacity="0.6"/>' +
    // Nodes at intervals
    '<circle cx="2" cy="20" r="1.2" fill="#00ffcc" opacity="0.6"/>' +
    '<circle cx="2" cy="50" r="1.5" fill="#00ffcc" opacity="0.8"/>' +
    '<circle cx="2" cy="100" r="1.8" fill="#00ffcc" opacity="0.5"/>' +
    '<circle cx="2" cy="150" r="1.5" fill="#00ffcc" opacity="0.8"/>' +
    '<circle cx="2" cy="180" r="1.2" fill="#00ffcc" opacity="0.6"/>' +
    // Glow halos
    '<circle cx="2" cy="50" r="3" fill="#00ffcc" opacity="0.08"/>' +
    '<circle cx="2" cy="100" r="3.5" fill="#00ffcc" opacity="0.06"/>' +
    '<circle cx="2" cy="150" r="3" fill="#00ffcc" opacity="0.08"/>' +
    '</svg>'
};


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

/**
 * Convert an SVG string to a CSS-safe data URI for background-image.
 * @param {string} svgString — raw SVG markup
 * @returns {string} — 'url("data:image/svg+xml,...")'
 */
function svgToDataURI(svgString) {
  return 'url("data:image/svg+xml,' + encodeURIComponent(svgString) + '")';
}

/**
 * Get a named pattern as a ready-to-use CSS background-image value.
 * @param {string} name — key from PATTERN_SVGS
 * @returns {string} — CSS background-image value, or empty string
 */
function getPatternBG(name) {
  var svg = PATTERN_SVGS[name];
  if (!svg) return '';
  return svgToDataURI(svg);
}

/**
 * Apply a band pattern as background to an element, composited
 * over the element's existing solid background color.
 * @param {HTMLElement} el — target element
 * @param {string} colorGroup — e.g. 'brown', 'red', 'darkblue'
 */
function applyBandPattern(el, colorGroup) {
  var key = 'band_' + colorGroup;
  var bg = getPatternBG(key);
  if (bg) {
    el.style.backgroundImage = bg;
    el.style.backgroundRepeat = 'repeat';
    el.style.backgroundSize = '16px 8px';
  }
}

/* ============================================================
   EXPOSE GLOBALLY
   ============================================================ */

window.PATTERN_SVGS   = PATTERN_SVGS;
window.svgToDataURI   = svgToDataURI;
window.getPatternBG   = getPatternBG;
window.applyBandPattern = applyBandPattern;
