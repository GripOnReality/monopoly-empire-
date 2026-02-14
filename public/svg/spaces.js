/* Cyberpunk Space SVGs — 6sides.live */
var SPACE_SVGS = {

  /* ── Maglev Monorail Train ─────────────────────────────────── */
  railroad: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gr"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<line x1="4" y1="26" x2="28" y2="26" stroke="#0a4a5a" stroke-width="2"/>' +
    '<rect x="6" y="24" width="3" height="3" rx="1" fill="#00f0ff" opacity=".4"/>' +
    '<rect x="23" y="24" width="3" height="3" rx="1" fill="#00f0ff" opacity=".4"/>' +
    '<path d="M6 20h20l3-4-2-4H8L5 16Z" fill="#0b1e2e" stroke="#00f0ff" stroke-width="1" filter="url(#gr)"/>' +
    '<rect x="9" y="13.5" width="3" height="2" rx=".5" fill="#00f0ff" opacity=".7"/>' +
    '<rect x="14" y="13.5" width="3" height="2" rx=".5" fill="#00f0ff" opacity=".7"/>' +
    '<rect x="19" y="13.5" width="3" height="2" rx=".5" fill="#00f0ff" opacity=".5"/>' +
    '<polygon points="26,14 29,12 29,16" fill="#00f0ff" opacity=".6"/>' +
    '<line x1="2" y1="10" x2="8" y2="14" stroke="#00f0ff" stroke-width=".5" opacity=".5"/>' +
    '<line x1="1" y1="12" x2="7" y2="16" stroke="#00f0ff" stroke-width=".5" opacity=".4"/>' +
    '<line x1="0" y1="14" x2="6" y2="18" stroke="#00f0ff" stroke-width=".5" opacity=".3"/>' +
    '</svg>',

  /* ── Power Cell — Lightning in Hexagon ─────────────────────── */
  electric: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="ge"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#f0c850" stroke-width="1.2" filter="url(#ge)"/>' +
    '<polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#1a1400" opacity=".5"/>' +
    '<polygon points="18,6 12,16 17,16 14,26 22,14 17,14" fill="#f0c850" filter="url(#ge)"/>' +
    '<line x1="8" y1="28" x2="10" y2="24" stroke="#f0c850" stroke-width=".5" opacity=".4"/>' +
    '<line x1="24" y1="28" x2="22" y2="24" stroke="#f0c850" stroke-width=".5" opacity=".4"/>' +
    '<line x1="8" y1="29" x2="24" y2="29" stroke="#f0c850" stroke-width=".6" opacity=".3"/>' +
    '<circle cx="10" cy="29" r=".8" fill="#f0c850" opacity=".5"/>' +
    '<circle cx="22" cy="29" r=".8" fill="#f0c850" opacity=".5"/>' +
    '<line x1="5" y1="5" x2="7" y2="8" stroke="#f0c850" stroke-width=".4" opacity=".3"/>' +
    '<line x1="27" y1="5" x2="25" y2="8" stroke="#f0c850" stroke-width=".4" opacity=".3"/>' +
    '</svg>',

  /* ── Data Flow — Digital Water Droplet ─────────────────────── */
  water: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gw"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<path d="M16 3L8 18a8 8 0 0 0 16 0Z" fill="#001a17" stroke="#00ffd5" stroke-width="1.2" filter="url(#gw)"/>' +
    '<line x1="12" y1="12" x2="12" y2="16" stroke="#00ffd5" stroke-width=".6" opacity=".5"/>' +
    '<line x1="16" y1="9" x2="16" y2="20" stroke="#00ffd5" stroke-width=".6" opacity=".6"/>' +
    '<line x1="20" y1="12" x2="20" y2="16" stroke="#00ffd5" stroke-width=".6" opacity=".5"/>' +
    '<text x="10.5" y="15" font-size="2.5" fill="#00ffd5" opacity=".5" font-family="monospace">01</text>' +
    '<text x="17" y="19" font-size="2.5" fill="#00ffd5" opacity=".4" font-family="monospace">10</text>' +
    '<text x="13" y="23" font-size="2.5" fill="#00ffd5" opacity=".3" font-family="monospace">11</text>' +
    '<line x1="10" y1="27" x2="22" y2="27" stroke="#00ffd5" stroke-width=".5" opacity=".3"/>' +
    '<circle cx="10" cy="27" r=".6" fill="#00ffd5" opacity=".4"/>' +
    '<circle cx="22" cy="27" r=".6" fill="#00ffd5" opacity=".4"/>' +
    '</svg>',

  /* ── Glitch Card — Corrupted Question Mark ─────────────────── */
  chance: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gc"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<rect x="5" y="3" width="22" height="26" rx="2" fill="#1a0011" stroke="#ff2d7b" stroke-width="1" filter="url(#gc)"/>' +
    '<line x1="5" y1="8" x2="27" y2="8" stroke="#ff2d7b" stroke-width=".3" opacity=".3"/>' +
    '<line x1="5" y1="14" x2="27" y2="14" stroke="#ff2d7b" stroke-width=".3" opacity=".2"/>' +
    '<line x1="5" y1="20" x2="27" y2="20" stroke="#ff2d7b" stroke-width=".3" opacity=".3"/>' +
    '<text x="11" y="22" font-size="16" font-weight="bold" fill="#ff2d7b" font-family="monospace" filter="url(#gc)">?</text>' +
    '<rect x="12" y="9" width="8" height="3" fill="#ff2d7b" opacity=".25"/>' +
    '<rect x="14" y="15" width="6" height="2" fill="#ff2d7b" opacity=".2" transform="translate(1,0)"/>' +
    '<rect x="10" y="22" width="5" height="1.5" fill="#ff2d7b" opacity=".2" transform="translate(-1,0)"/>' +
    '<line x1="19" y1="10" x2="22" y2="10" stroke="#ff2d7b" stroke-width=".8" opacity=".5"/>' +
    '<line x1="9" y1="18" x2="12" y2="18" stroke="#ff2d7b" stroke-width=".8" opacity=".4"/>' +
    '</svg>',

  /* ── Data Vault — Locked Digital Chest ─────────────────────── */
  chest: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gv"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<rect x="4" y="10" width="24" height="18" rx="1" fill="#001a06" stroke="#39ff14" stroke-width="1" filter="url(#gv)"/>' +
    '<path d="M10 10V7a6 6 0 0 1 12 0v3" fill="none" stroke="#39ff14" stroke-width="1.2"/>' +
    '<rect x="13" y="16" width="6" height="5" rx="1" fill="none" stroke="#39ff14" stroke-width=".8"/>' +
    '<circle cx="16" cy="18" r="1.2" fill="#39ff14"/>' +
    '<line x1="16" y1="18" x2="16" y2="20" stroke="#39ff14" stroke-width=".8"/>' +
    '<line x1="6" y1="13" x2="10" y2="13" stroke="#39ff14" stroke-width=".4" opacity=".4"/>' +
    '<line x1="22" y1="13" x2="26" y2="13" stroke="#39ff14" stroke-width=".4" opacity=".4"/>' +
    '<line x1="6" y1="25" x2="10" y2="25" stroke="#39ff14" stroke-width=".4" opacity=".4"/>' +
    '<line x1="22" y1="25" x2="26" y2="25" stroke="#39ff14" stroke-width=".4" opacity=".4"/>' +
    '<circle cx="7" cy="13" r=".6" fill="#39ff14" opacity=".5"/>' +
    '<circle cx="25" cy="13" r=".6" fill="#39ff14" opacity=".5"/>' +
    '<circle cx="7" cy="25" r=".6" fill="#39ff14" opacity=".5"/>' +
    '<circle cx="25" cy="25" r=".6" fill="#39ff14" opacity=".5"/>' +
    '</svg>',

  /* ── Credit Drain — Dissolving Downward Arrow ──────────────── */
  tax_income: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gt"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="16,28 6,18 12,18 12,4 20,4 20,18 26,18" fill="#1a0000" stroke="#ff2d2d" stroke-width="1" filter="url(#gt)"/>' +
    '<rect x="13" y="5" width="6" height="2" rx=".5" fill="#ff2d2d" opacity=".8"/>' +
    '<rect x="13" y="8.5" width="6" height="2" rx=".5" fill="#ff2d2d" opacity=".6"/>' +
    '<rect x="13" y="12" width="6" height="2" rx=".5" fill="#ff2d2d" opacity=".4"/>' +
    '<rect x="8" y="20" width="3" height="1.5" fill="#ff2d2d" opacity=".3"/>' +
    '<rect x="21" y="20" width="3" height="1.5" fill="#ff2d2d" opacity=".3"/>' +
    '<rect x="14" y="22" width="1" height="1" fill="#ff2d2d" opacity=".5"/>' +
    '<rect x="17" y="23" width="1" height="1" fill="#ff2d2d" opacity=".4"/>' +
    '<rect x="15" y="25" width="1" height="1" fill="#ff2d2d" opacity=".3"/>' +
    '<rect x="10" y="24" width=".8" height=".8" fill="#ff2d2d" opacity=".2"/>' +
    '<rect x="21" y="23" width=".8" height=".8" fill="#ff2d2d" opacity=".2"/>' +
    '</svg>',

  /* ── Diamond Scanner — Diamond in Targeting Reticle ────────── */
  tax_luxury: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gd"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<circle cx="16" cy="16" r="12" fill="none" stroke="#f0c850" stroke-width=".5" opacity=".3"/>' +
    '<line x1="16" y1="2" x2="16" y2="7" stroke="#f0c850" stroke-width=".6" opacity=".5"/>' +
    '<line x1="16" y1="25" x2="16" y2="30" stroke="#f0c850" stroke-width=".6" opacity=".5"/>' +
    '<line x1="2" y1="16" x2="7" y2="16" stroke="#f0c850" stroke-width=".6" opacity=".5"/>' +
    '<line x1="25" y1="16" x2="30" y2="16" stroke="#f0c850" stroke-width=".6" opacity=".5"/>' +
    '<path d="M5 6h4V4M27 6h-4V4M5 26h4v2M27 26h-4v2" fill="none" stroke="#f0c850" stroke-width=".8" opacity=".6"/>' +
    '<polygon points="16,7 24,14 16,26 8,14" fill="#1a1400" stroke="#f0c850" stroke-width="1" filter="url(#gd)"/>' +
    '<line x1="8" y1="14" x2="24" y2="14" stroke="#f0c850" stroke-width=".6" opacity=".6"/>' +
    '<line x1="12" y1="8" x2="14" y2="14" stroke="#f0c850" stroke-width=".4" opacity=".4"/>' +
    '<line x1="20" y1="8" x2="18" y2="14" stroke="#f0c850" stroke-width=".4" opacity=".4"/>' +
    '<line x1="14" y1="14" x2="16" y2="26" stroke="#f0c850" stroke-width=".4" opacity=".4"/>' +
    '<line x1="18" y1="14" x2="16" y2="26" stroke="#f0c850" stroke-width=".4" opacity=".4"/>' +
    '</svg>',

  /* ── Neon Arrow — GO Arrow with Speed Lines ────────────────── */
  go_arrow: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="ga"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="18,4 30,16 18,28 18,21 4,21 4,11 18,11" fill="#1a1400" stroke="#f0c850" stroke-width="1.2" filter="url(#ga)"/>' +
    '<polygon points="18,7 27,16 18,25 18,21 7,21 7,11 18,11" fill="#f0c850" opacity=".15"/>' +
    '<line x1="1" y1="11" x2="8" y2="11" stroke="#f0c850" stroke-width=".7" opacity=".5"/>' +
    '<line x1="3" y1="14" x2="7" y2="14" stroke="#f0c850" stroke-width=".5" opacity=".4"/>' +
    '<line x1="1" y1="21" x2="8" y2="21" stroke="#f0c850" stroke-width=".7" opacity=".5"/>' +
    '<line x1="3" y1="18" x2="7" y2="18" stroke="#f0c850" stroke-width=".5" opacity=".4"/>' +
    '<line x1="0" y1="16" x2="6" y2="16" stroke="#f0c850" stroke-width=".6" opacity=".6"/>' +
    '<circle cx="8" cy="11" r=".5" fill="#f0c850" opacity=".6"/>' +
    '<circle cx="8" cy="21" r=".5" fill="#f0c850" opacity=".6"/>' +
    '</svg>',

  /* ── Digital Cell — Matrix Code Bars ───────────────────────── */
  jail_bars: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gj"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<rect x="3" y="3" width="26" height="26" rx="1" fill="#1a0d00" stroke="#ff6b00" stroke-width=".8" opacity=".5"/>' +
    '<line x1="8" y1="3" x2="8" y2="29" stroke="#ff6b00" stroke-width="1.5" filter="url(#gj)"/>' +
    '<line x1="14" y1="3" x2="14" y2="29" stroke="#ff6b00" stroke-width="1.5" filter="url(#gj)"/>' +
    '<line x1="20" y1="3" x2="20" y2="29" stroke="#ff6b00" stroke-width="1.5" filter="url(#gj)"/>' +
    '<line x1="26" y1="3" x2="26" y2="29" stroke="#ff6b00" stroke-width="1.5" filter="url(#gj)"/>' +
    '<text x="6.5" y="10" font-size="3" fill="#ff6b00" opacity=".4" font-family="monospace">1</text>' +
    '<text x="12.5" y="16" font-size="3" fill="#ff6b00" opacity=".3" font-family="monospace">0</text>' +
    '<text x="18.5" y="22" font-size="3" fill="#ff6b00" opacity=".4" font-family="monospace">1</text>' +
    '<text x="24.5" y="12" font-size="3" fill="#ff6b00" opacity=".3" font-family="monospace">0</text>' +
    '<text x="6.5" y="20" font-size="3" fill="#ff6b00" opacity=".3" font-family="monospace">0</text>' +
    '<text x="18.5" y="8" font-size="3" fill="#ff6b00" opacity=".3" font-family="monospace">1</text>' +
    '</svg>',

  /* ── Hover Car — Futuristic Vehicle with Anti-Grav Rings ───── */
  free_parking: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gf"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<path d="M6 17h20l2-3-1-3H22l-2-4H12l-2 4H5L4 14Z" fill="#0b1e2e" stroke="#00f0ff" stroke-width="1" filter="url(#gf)"/>' +
    '<rect x="8" y="9" width="3" height="2" rx=".5" fill="#00f0ff" opacity=".6"/>' +
    '<rect x="13" y="9" width="4" height="2" rx=".5" fill="#00f0ff" opacity=".5"/>' +
    '<polygon points="24,13 27,11 27,15" fill="#00f0ff" opacity=".5"/>' +
    '<ellipse cx="11" cy="22" rx="4" ry="1" fill="none" stroke="#00f0ff" stroke-width=".6" opacity=".5"/>' +
    '<ellipse cx="21" cy="22" rx="4" ry="1" fill="none" stroke="#00f0ff" stroke-width=".6" opacity=".5"/>' +
    '<ellipse cx="11" cy="24" rx="3" ry=".7" fill="none" stroke="#00f0ff" stroke-width=".4" opacity=".3"/>' +
    '<ellipse cx="21" cy="24" rx="3" ry=".7" fill="none" stroke="#00f0ff" stroke-width=".4" opacity=".3"/>' +
    '<line x1="11" y1="17" x2="11" y2="21" stroke="#00f0ff" stroke-width=".4" opacity=".3" stroke-dasharray="1,1"/>' +
    '<line x1="21" y1="17" x2="21" y2="21" stroke="#00f0ff" stroke-width=".4" opacity=".3" stroke-dasharray="1,1"/>' +
    '</svg>',

  /* ── Alert Badge — Warning Police Badge ────────────────────── */
  go_to_jail: '<svg class="space-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gb"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="16,2 20,10 28,10 22,16 24,24 16,20 8,24 10,16 4,10 12,10" fill="#1a0000" stroke="#ff2d2d" stroke-width="1" filter="url(#gb)"/>' +
    '<polygon points="16,2 20,10 28,10 22,16 24,24 16,20 8,24 10,16 4,10 12,10" fill="#ff2d2d" opacity=".1"/>' +
    '<circle cx="16" cy="13" r="4" fill="none" stroke="#ff2d2d" stroke-width=".8"/>' +
    '<rect x="15" y="10" width="2" height="4.5" rx=".5" fill="#ff2d2d"/>' +
    '<circle cx="16" cy="16" r=".8" fill="#ff2d2d"/>' +
    '<line x1="4" y1="2" x2="7" y2="5" stroke="#ff2d2d" stroke-width=".5" opacity=".4"/>' +
    '<line x1="28" y1="2" x2="25" y2="5" stroke="#ff2d2d" stroke-width=".5" opacity=".4"/>' +
    '<line x1="4" y1="28" x2="7" y2="25" stroke="#ff2d2d" stroke-width=".5" opacity=".4"/>' +
    '<line x1="28" y1="28" x2="25" y2="25" stroke="#ff2d2d" stroke-width=".5" opacity=".4"/>' +
    '<rect x="3" y="27" width="26" height="2" rx=".5" fill="#ff2d2d" opacity=".3"/>' +
    '</svg>',

  /* ── Cyber Module — Small Angular Building ────── 16×16 ────── */
  house: '<svg class="space-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="gh"><feGaussianBlur stdDeviation="1" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="8,1 14,6 14,15 2,15 2,6" fill="#001a0d" stroke="#2ecc71" stroke-width=".8" filter="url(#gh)"/>' +
    '<rect x="6" y="7" width="4" height="3" rx=".5" fill="none" stroke="#2ecc71" stroke-width=".6"/>' +
    '<line x1="8" y1="7" x2="8" y2="10" stroke="#2ecc71" stroke-width=".4" opacity=".5"/>' +
    '<line x1="6" y1="8.5" x2="10" y2="8.5" stroke="#2ecc71" stroke-width=".4" opacity=".5"/>' +
    '<rect x="6" y="11" width="4" height="4" rx=".3" fill="#2ecc71" opacity=".2"/>' +
    '<line x1="3" y1="14" x2="5" y2="14" stroke="#2ecc71" stroke-width=".3" opacity=".4"/>' +
    '<circle cx="4" cy="14" r=".4" fill="#2ecc71" opacity=".5"/>' +
    '</svg>',

  /* ── Mega Tower — Tall Angular Tower ────────── 16×16 ──────── */
  hotel: '<svg class="space-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><filter id="ht"><feGaussianBlur stdDeviation="1" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<polygon points="8,0 11,3 11,15 5,15 5,3" fill="#1a0008" stroke="#e63946" stroke-width=".8" filter="url(#ht)"/>' +
    '<rect x="6" y="4" width="1.5" height="1" fill="#e63946" opacity=".8"/>' +
    '<rect x="8.5" y="4" width="1.5" height="1" fill="#e63946" opacity=".7"/>' +
    '<rect x="6" y="6.5" width="1.5" height="1" fill="#e63946" opacity=".7"/>' +
    '<rect x="8.5" y="6.5" width="1.5" height="1" fill="#e63946" opacity=".6"/>' +
    '<rect x="6" y="9" width="1.5" height="1" fill="#e63946" opacity=".6"/>' +
    '<rect x="8.5" y="9" width="1.5" height="1" fill="#e63946" opacity=".5"/>' +
    '<rect x="7" y="12" width="2" height="3" rx=".3" fill="#e63946" opacity=".3"/>' +
    '<line x1="8" y1="0" x2="8" y2="2" stroke="#e63946" stroke-width=".6" opacity=".7"/>' +
    '<circle cx="8" cy="0" r=".5" fill="#e63946" opacity=".8"/>' +
    '</svg>'

};

/**
 * Get a space SVG string with optional sizing.
 * @param {string} type  — key from SPACE_SVGS
 * @param {number} [size=20] — width and height in px
 * @returns {string} SVG markup (empty string if type unknown)
 */
function getSpaceSVG(type, size) {
  size = size || 20;
  var svg = SPACE_SVGS[type] || '';
  return svg.replace(
    'class="space-svg"',
    'class="space-svg" width="' + size + '" height="' + size + '"'
  );
}

/* expose globally */
window.SPACE_SVGS = SPACE_SVGS;
window.getSpaceSVG = getSpaceSVG;
