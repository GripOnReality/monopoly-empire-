/* Cyberpunk UI SVGs — 6sides.live */
var UI_SVGS = {

  /* ── 1. CROWN (64×64) ── Cyberpunk Crown — game logo icon ── */
  crown: '<svg class="ui-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-gold"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-gold)">' +
      /* Crown body — 3 angular spikes */
      '<path d="M8 48 L16 20 L24 34 L32 8 L40 34 L48 20 L56 48 Z" fill="#0a0e17" stroke="#f0c850" stroke-width="2" stroke-linejoin="bevel"/>' +
      /* Band */
      '<rect x="8" y="44" width="48" height="8" rx="1" fill="#0a0e17" stroke="#f0c850" stroke-width="1.5"/>' +
      /* Circuit traces on band */
      '<line x1="14" y1="48" x2="26" y2="48" stroke="#f0c850" stroke-width="0.6" opacity="0.6"/>' +
      '<line x1="38" y1="48" x2="50" y2="48" stroke="#f0c850" stroke-width="0.6" opacity="0.6"/>' +
      '<circle cx="26" cy="48" r="1" fill="#f0c850" opacity="0.8"/>' +
      '<circle cx="38" cy="48" r="1" fill="#f0c850" opacity="0.8"/>' +
      /* Center gemstone node */
      '<circle cx="32" cy="30" r="3.5" fill="#f0c850" opacity="0.9"/>' +
      '<circle cx="32" cy="30" r="1.5" fill="#fffbe6"/>' +
      /* Spike tip nodes */
      '<circle cx="32" cy="10" r="1.5" fill="#f0c850"/>' +
      '<circle cx="16" cy="22" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="48" cy="22" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      /* Circuit lines inside crown */
      '<line x1="32" y1="14" x2="32" y2="26" stroke="#f0c850" stroke-width="0.5" opacity="0.4"/>' +
      '<line x1="24" y1="34" x2="32" y2="30" stroke="#f0c850" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="40" y1="34" x2="32" y2="30" stroke="#f0c850" stroke-width="0.5" opacity="0.3"/>' +
    '</g>' +
  '</svg>',

  /* ── 2. MONEY (32×32) ── Credit Chip — hexagonal coin ── */
  money: '<svg class="ui-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-gold-s"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-gold-s)">' +
      /* Hex coin */
      '<polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#0a0e17" stroke="#f0c850" stroke-width="1.5"/>' +
      /* Inner hex ring */
      '<polygon points="16,6 24,11 24,21 16,26 8,21 8,11" fill="none" stroke="#f0c850" stroke-width="0.6" opacity="0.5"/>' +
      /* Dollar sign hologram */
      '<text x="16" y="20" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#f0c850" opacity="0.9">$</text>' +
      /* Circuit edge nodes */
      '<circle cx="16" cy="2" r="1" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="28" cy="9" r="1" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="28" cy="23" r="1" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="16" cy="30" r="1" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="4" cy="23" r="1" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="4" cy="9" r="1" fill="#f0c850" opacity="0.7"/>' +
    '</g>' +
  '</svg>',

  /* ── 3. CARD_CHANCE (48×64) ── Glitch Card with "?" ── */
  card_chance: '<svg class="ui-svg" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-mag"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-mag)">' +
      /* Card body */
      '<rect x="2" y="2" width="44" height="60" rx="3" fill="#0a0e17" stroke="#ff2d7b" stroke-width="2"/>' +
      /* Inner border */
      '<rect x="6" y="6" width="36" height="52" rx="1" fill="none" stroke="#ff2d7b" stroke-width="0.5" opacity="0.4"/>' +
      /* Scan lines */
      '<line x1="2" y1="16" x2="46" y2="16" stroke="#ff2d7b" stroke-width="0.3" opacity="0.25"/>' +
      '<line x1="2" y1="24" x2="46" y2="24" stroke="#ff2d7b" stroke-width="0.3" opacity="0.2"/>' +
      '<line x1="2" y1="32" x2="46" y2="32" stroke="#ff2d7b" stroke-width="0.3" opacity="0.25"/>' +
      '<line x1="2" y1="40" x2="46" y2="40" stroke="#ff2d7b" stroke-width="0.3" opacity="0.2"/>' +
      '<line x1="2" y1="48" x2="46" y2="48" stroke="#ff2d7b" stroke-width="0.3" opacity="0.25"/>' +
      /* Question mark */
      '<text x="24" y="40" text-anchor="middle" font-family="monospace" font-size="24" font-weight="bold" fill="#ff2d7b">?</text>' +
      /* Digital corruption artifacts */
      '<rect x="38" y="4" width="6" height="2" fill="#ff2d7b" opacity="0.4"/>' +
      '<rect x="2" y="56" width="8" height="1.5" fill="#ff2d7b" opacity="0.35"/>' +
      '<rect x="34" y="52" width="5" height="1" fill="#ff2d7b" opacity="0.3"/>' +
      '<rect x="4" y="10" width="4" height="1" fill="#ff2d7b" opacity="0.25"/>' +
      /* Corner glitch blocks */
      '<rect x="3" y="3" width="3" height="1" fill="#ff2d7b" opacity="0.5"/>' +
      '<rect x="42" y="58" width="3" height="2" fill="#ff2d7b" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 4. CARD_CHEST (48×64) ── Data Card with lock ── */
  card_chest: '<svg class="ui-svg" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-grn"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-grn)">' +
      /* Card body */
      '<rect x="2" y="2" width="44" height="60" rx="3" fill="#0a0e17" stroke="#39ff14" stroke-width="2"/>' +
      /* Circuit board pattern */
      '<line x1="10" y1="6" x2="10" y2="18" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="10" y1="18" x2="20" y2="18" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="38" y1="6" x2="38" y2="14" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="38" y1="14" x2="30" y2="14" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="10" y1="50" x2="10" y2="58" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="10" y1="50" x2="18" y2="50" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="38" y1="48" x2="38" y2="58" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      '<line x1="30" y1="48" x2="38" y2="48" stroke="#39ff14" stroke-width="0.5" opacity="0.3"/>' +
      /* Circuit nodes */
      '<circle cx="10" cy="18" r="1.2" fill="#39ff14" opacity="0.6"/>' +
      '<circle cx="38" cy="14" r="1.2" fill="#39ff14" opacity="0.6"/>' +
      '<circle cx="10" cy="50" r="1.2" fill="#39ff14" opacity="0.6"/>' +
      '<circle cx="38" cy="48" r="1.2" fill="#39ff14" opacity="0.6"/>' +
      /* Lock icon center */
      '<rect x="19" y="32" width="10" height="9" rx="1" fill="#0a0e17" stroke="#39ff14" stroke-width="1.2"/>' +
      '<path d="M21 32 L21 28 A3 3 0 0 1 27 28 L27 32" fill="none" stroke="#39ff14" stroke-width="1.2"/>' +
      '<circle cx="24" cy="36" r="1.2" fill="#39ff14"/>' +
      /* Data stream lines */
      '<line x1="14" y1="24" x2="34" y2="24" stroke="#39ff14" stroke-width="0.4" opacity="0.2" stroke-dasharray="2 2"/>' +
      '<line x1="14" y1="44" x2="34" y2="44" stroke="#39ff14" stroke-width="0.4" opacity="0.2" stroke-dasharray="2 2"/>' +
    '</g>' +
  '</svg>',

  /* ── 5. DICE_PIP (8×8) ── Neon Pip dot ── */
  dice_pip: '<svg class="ui-svg" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-pip"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<circle cx="4" cy="4" r="2.5" fill="#00f0ff" filter="url(#glow-pip)" opacity="0.95"/>' +
    '<circle cx="4" cy="4" r="1" fill="#e0fcff"/>' +
  '</svg>',

  /* ── 6. PROPERTY_DEED (48×64) ── Title Deed Frame ── */
  property_deed: '<svg class="ui-svg" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-deed"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-deed)">' +
      /* Outer frame */
      '<rect x="1" y="1" width="46" height="62" rx="2" fill="#111827" stroke="#f0c850" stroke-width="1.5"/>' +
      /* Color slot at top */
      '<rect x="1" y="1" width="46" height="14" rx="2" fill="#f0c850" opacity="0.15" stroke="#f0c850" stroke-width="0.8"/>' +
      /* Inner content border */
      '<rect x="5" y="18" width="38" height="42" rx="1" fill="none" stroke="#f0c850" stroke-width="0.5" opacity="0.4"/>' +
      /* Angular corner decorations — top-left */
      '<path d="M1 8 L1 1 L8 1" fill="none" stroke="#f0c850" stroke-width="2" opacity="0.8"/>' +
      /* Top-right */
      '<path d="M40 1 L47 1 L47 8" fill="none" stroke="#f0c850" stroke-width="2" opacity="0.8"/>' +
      /* Bottom-left */
      '<path d="M1 56 L1 63 L8 63" fill="none" stroke="#f0c850" stroke-width="2" opacity="0.8"/>' +
      /* Bottom-right */
      '<path d="M40 63 L47 63 L47 56" fill="none" stroke="#f0c850" stroke-width="2" opacity="0.8"/>' +
      /* Corner circuit nodes */
      '<circle cx="4" cy="4" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="44" cy="4" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="4" cy="60" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="44" cy="60" r="1.2" fill="#f0c850" opacity="0.7"/>' +
      /* Circuit trace decoration */
      '<line x1="8" y1="60" x2="18" y2="60" stroke="#f0c850" stroke-width="0.4" opacity="0.3"/>' +
      '<line x1="30" y1="60" x2="40" y2="60" stroke="#f0c850" stroke-width="0.4" opacity="0.3"/>' +
    '</g>' +
  '</svg>',

  /* ── 7. AUCTION_GAVEL (40×40) ── Cyber Gavel ── */
  auction_gavel: '<svg class="ui-svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-gavel"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-gavel)">' +
      /* Gavel handle */
      '<rect x="16" y="14" width="4" height="20" rx="1" fill="#0a0e17" stroke="#f0c850" stroke-width="1.2" transform="rotate(-30 18 24)"/>' +
      /* Gavel head */
      '<rect x="8" y="6" width="20" height="8" rx="2" fill="#0a0e17" stroke="#f0c850" stroke-width="1.5" transform="rotate(-30 18 10)"/>' +
      /* Head detail line */
      '<line x1="12" y1="10" x2="24" y2="10" stroke="#f0c850" stroke-width="0.6" opacity="0.5" transform="rotate(-30 18 10)"/>' +
      /* Impact point — base */
      '<rect x="22" y="34" width="14" height="3" rx="1" fill="#0a0e17" stroke="#f0c850" stroke-width="1"/>' +
      /* Impact spark ring */
      '<circle cx="29" cy="33" r="4" fill="none" stroke="#00f0ff" stroke-width="0.8" opacity="0.7"/>' +
      '<circle cx="29" cy="33" r="2" fill="#00f0ff" opacity="0.3"/>' +
      /* Spark lines */
      '<line x1="29" y1="27" x2="29" y2="29" stroke="#00f0ff" stroke-width="0.6" opacity="0.6"/>' +
      '<line x1="34" y1="31" x2="33" y2="32" stroke="#00f0ff" stroke-width="0.6" opacity="0.6"/>' +
      '<line x1="24" y1="31" x2="25" y2="32" stroke="#00f0ff" stroke-width="0.6" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 8. TIMER_ICON (24×24) ── Digital Clock ── */
  timer_icon: '<svg class="ui-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-timer"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-timer)">' +
      /* Hexagonal clock face */
      '<polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#0a0e17" stroke="#00f0ff" stroke-width="1.2"/>' +
      /* Tick marks as circuit nodes at hex vertices */
      '<circle cx="12" cy="2" r="1" fill="#00f0ff" opacity="0.8"/>' +
      '<circle cx="21" cy="7" r="1" fill="#00f0ff" opacity="0.6"/>' +
      '<circle cx="21" cy="17" r="1" fill="#00f0ff" opacity="0.6"/>' +
      '<circle cx="12" cy="22" r="1" fill="#00f0ff" opacity="0.8"/>' +
      '<circle cx="3" cy="17" r="1" fill="#00f0ff" opacity="0.6"/>' +
      '<circle cx="3" cy="7" r="1" fill="#00f0ff" opacity="0.6"/>' +
      /* Hour hand */
      '<line x1="12" y1="12" x2="12" y2="6" stroke="#00f0ff" stroke-width="1.4" stroke-linecap="square"/>' +
      /* Minute hand */
      '<line x1="12" y1="12" x2="17" y2="9" stroke="#00f0ff" stroke-width="1" stroke-linecap="square"/>' +
      /* Center node */
      '<circle cx="12" cy="12" r="1.2" fill="#00f0ff"/>' +
      /* Warning variant indicator — small dot (use CSS to toggle red) */
      '<circle cx="18" cy="19" r="1.5" fill="#ff2d2d" opacity="0" class="timer-warn"/>' +
    '</g>' +
  '</svg>',

  /* ── 9. BOT_ICON (32×32) ── Robot Face ── */
  bot_icon: '<svg class="ui-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-bot"><feGaussianBlur stdDeviation="1.2" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-bot)">' +
      /* Antenna */
      '<line x1="16" y1="2" x2="16" y2="7" stroke="#00f0ff" stroke-width="1.2"/>' +
      '<circle cx="16" cy="2" r="1.5" fill="#00f0ff" opacity="0.9"/>' +
      /* Head */
      '<rect x="6" y="7" width="20" height="16" rx="2" fill="#0a0e17" stroke="#00f0ff" stroke-width="1.5"/>' +
      /* Left eye — targeting reticle */
      '<circle cx="12" cy="14" r="3" fill="none" stroke="#00f0ff" stroke-width="0.8"/>' +
      '<line x1="12" y1="10" x2="12" y2="18" stroke="#00f0ff" stroke-width="0.5" opacity="0.5"/>' +
      '<line x1="8" y1="14" x2="16" y2="14" stroke="#00f0ff" stroke-width="0.5" opacity="0.5"/>' +
      '<circle cx="12" cy="14" r="1" fill="#00f0ff"/>' +
      /* Right eye — rectangular */
      '<rect x="18" y="12" width="5" height="4" rx="0.5" fill="#00f0ff" opacity="0.8"/>' +
      '<rect x="19" y="13" width="3" height="2" fill="#e0fcff"/>' +
      /* Circuit jaw */
      '<rect x="8" y="23" width="16" height="4" rx="1" fill="#0a0e17" stroke="#00f0ff" stroke-width="1"/>' +
      '<line x1="11" y1="24" x2="11" y2="26" stroke="#00f0ff" stroke-width="0.6" opacity="0.5"/>' +
      '<line x1="16" y1="24" x2="16" y2="26" stroke="#00f0ff" stroke-width="0.6" opacity="0.5"/>' +
      '<line x1="21" y1="24" x2="21" y2="26" stroke="#00f0ff" stroke-width="0.6" opacity="0.5"/>' +
      /* Ear nodes */
      '<rect x="3" y="12" width="3" height="5" rx="0.5" fill="#0a0e17" stroke="#00f0ff" stroke-width="0.8" opacity="0.6"/>' +
      '<rect x="26" y="12" width="3" height="5" rx="0.5" fill="#0a0e17" stroke="#00f0ff" stroke-width="0.8" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 10. SETTINGS_GEAR (28×28) ── Cyber Gear ── */
  settings_gear: '<svg class="ui-svg" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-gear"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-gear)">' +
      /* Hex gear — outer teeth via polygon-like path */
      '<path d="M14 1 L17 3 L19 1.5 L21 4 L23.5 4 L24 7 L27 8.5 L25.5 11 L27 13.5 L25 15 L26 18 L23 19 L22.5 22 L19.5 22 L18 24.5 L15 23.5 L14 27 L11 23.5 L10 24.5 L8.5 22 L5.5 22 L5 19 L2 18 L3 15 L1 13.5 L2.5 11 L1 8.5 L4 7 L4.5 4 L7 4 L9 1.5 L11 3 Z" fill="#0a0e17" stroke="#f0c850" stroke-width="1.2"/>' +
      /* Inner hexagon */
      '<polygon points="14,8 19,10.5 19,16.5 14,19 9,16.5 9,10.5" fill="none" stroke="#f0c850" stroke-width="1" opacity="0.7"/>' +
      /* Center circle */
      '<circle cx="14" cy="13.5" r="2.5" fill="#0a0e17" stroke="#f0c850" stroke-width="1"/>' +
      '<circle cx="14" cy="13.5" r="0.8" fill="#f0c850"/>' +
      /* Tooth tip nodes */
      '<circle cx="14" cy="1" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="27" cy="8.5" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="27" cy="13.5" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="26" cy="18" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="14" cy="27" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="2" cy="18" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="1" cy="13.5" r="0.8" fill="#f0c850" opacity="0.7"/>' +
      '<circle cx="1" cy="8.5" r="0.8" fill="#f0c850" opacity="0.7"/>' +
    '</g>' +
  '</svg>',

  /* ── 11. TRADE_ARROWS (32×32) ── Exchange cycle arrows ── */
  trade_arrows: '<svg class="ui-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-trade"><feGaussianBlur stdDeviation="1.2" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-trade)">' +
      /* Top arrow — cyan, curves right-to-left */
      '<path d="M24 8 A8 8 0 0 0 8 8" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="square"/>' +
      '<polygon points="6,5 8,8 11,6" fill="#00f0ff"/>' +
      /* Bottom arrow — magenta, curves left-to-right */
      '<path d="M8 24 A8 8 0 0 0 24 24" fill="none" stroke="#ff2d7b" stroke-width="2" stroke-linecap="square"/>' +
      '<polygon points="26,27 24,24 21,26" fill="#ff2d7b"/>' +
      /* Data packets on cyan arrow */
      '<rect x="14" y="3.5" width="3" height="2" rx="0.5" fill="#00f0ff" opacity="0.7"/>' +
      '<rect x="20" y="5" width="2" height="1.5" rx="0.5" fill="#00f0ff" opacity="0.5"/>' +
      /* Data packets on magenta arrow */
      '<rect x="14" y="26" width="3" height="2" rx="0.5" fill="#ff2d7b" opacity="0.7"/>' +
      '<rect x="10" y="25" width="2" height="1.5" rx="0.5" fill="#ff2d7b" opacity="0.5"/>' +
      /* Center divider */
      '<line x1="10" y1="16" x2="22" y2="16" stroke="#b026ff" stroke-width="0.5" opacity="0.3" stroke-dasharray="2 1"/>' +
    '</g>' +
  '</svg>',

  /* ── 12. MORTGAGE_STAMP (32×32) ── Digital Seal with "M" ── */
  mortgage_stamp: '<svg class="ui-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-mort"><feGaussianBlur stdDeviation="1.2" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-mort)">' +
      /* Hex border */
      '<polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#0a0e17" stroke="#ff2d2d" stroke-width="1.5"/>' +
      /* Warning stripe — top */
      '<line x1="8" y1="8" x2="24" y2="8" stroke="#ff2d2d" stroke-width="1" opacity="0.4"/>' +
      /* Warning stripe — bottom */
      '<line x1="8" y1="24" x2="24" y2="24" stroke="#ff2d2d" stroke-width="1" opacity="0.4"/>' +
      /* Diagonal warning stripes */
      '<line x1="6" y1="11" x2="10" y2="7" stroke="#ff2d2d" stroke-width="0.6" opacity="0.25"/>' +
      '<line x1="22" y1="7" x2="26" y2="11" stroke="#ff2d2d" stroke-width="0.6" opacity="0.25"/>' +
      '<line x1="6" y1="21" x2="10" y2="25" stroke="#ff2d2d" stroke-width="0.6" opacity="0.25"/>' +
      '<line x1="22" y1="25" x2="26" y2="21" stroke="#ff2d2d" stroke-width="0.6" opacity="0.25"/>' +
      /* M letter */
      '<text x="16" y="20" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#ff2d2d">M</text>' +
      /* Corner nodes */
      '<circle cx="16" cy="2" r="1" fill="#ff2d2d" opacity="0.6"/>' +
      '<circle cx="28" cy="9" r="1" fill="#ff2d2d" opacity="0.6"/>' +
      '<circle cx="28" cy="23" r="1" fill="#ff2d2d" opacity="0.6"/>' +
      '<circle cx="16" cy="30" r="1" fill="#ff2d2d" opacity="0.6"/>' +
      '<circle cx="4" cy="23" r="1" fill="#ff2d2d" opacity="0.6"/>' +
      '<circle cx="4" cy="9" r="1" fill="#ff2d2d" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 13. BUILD_ICON (28×28) ── Nano Constructor — crossed hammer/wrench ── */
  build_icon: '<svg class="ui-svg" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-build"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-build)">' +
      /* Hammer — handle */
      '<line x1="6" y1="22" x2="16" y2="12" stroke="#39ff14" stroke-width="1.8" stroke-linecap="square"/>' +
      /* Hammer — head */
      '<rect x="13" y="6" width="8" height="5" rx="1" fill="#0a0e17" stroke="#39ff14" stroke-width="1.2" transform="rotate(-45 17 8.5)"/>' +
      /* Wrench — handle */
      '<line x1="22" y1="22" x2="12" y2="12" stroke="#39ff14" stroke-width="1.8" stroke-linecap="square"/>' +
      /* Wrench — head */
      '<path d="M8 4 L6 6 L8 8 L6 10 L4 8 L2 10 L4 12 L10 6 L8 4 Z" fill="#0a0e17" stroke="#39ff14" stroke-width="1" stroke-linejoin="bevel"/>' +
      /* Sparks at intersection */
      '<circle cx="14" cy="14" r="1.5" fill="#39ff14" opacity="0.8"/>' +
      '<line x1="14" y1="10" x2="14" y2="11.5" stroke="#39ff14" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="14" y1="16.5" x2="14" y2="18" stroke="#39ff14" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="10" y1="14" x2="11.5" y2="14" stroke="#39ff14" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="16.5" y1="14" x2="18" y2="14" stroke="#39ff14" stroke-width="0.6" opacity="0.7"/>' +
      /* Diagonal sparks */
      '<line x1="11.5" y1="11.5" x2="12.5" y2="12.5" stroke="#39ff14" stroke-width="0.5" opacity="0.5"/>' +
      '<line x1="15.5" y1="15.5" x2="16.5" y2="16.5" stroke="#39ff14" stroke-width="0.5" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 14. CHAT_ICON (24×24) ── Comms Bubble ── */
  chat_icon: '<svg class="ui-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-chat"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-chat)">' +
      /* Angular speech bubble */
      '<path d="M3 4 L21 4 L21 16 L13 16 L8 21 L8 16 L3 16 Z" fill="#0a0e17" stroke="#00f0ff" stroke-width="1.3" stroke-linejoin="bevel"/>' +
      /* Signal wave lines inside */
      '<line x1="7" y1="8" x2="17" y2="8" stroke="#00f0ff" stroke-width="1" opacity="0.6" stroke-linecap="square"/>' +
      '<line x1="7" y1="11" x2="15" y2="11" stroke="#00f0ff" stroke-width="1" opacity="0.4" stroke-linecap="square"/>' +
      '<line x1="7" y1="14" x2="11" y2="14" stroke="#00f0ff" stroke-width="1" opacity="0.25" stroke-linecap="square"/>' +
      /* Signal broadcast arcs — outside top-right */
      '<path d="M20 3 Q22 1 23 3" fill="none" stroke="#00f0ff" stroke-width="0.6" opacity="0.5"/>' +
      '<path d="M20 1 Q23 -1 24 2" fill="none" stroke="#00f0ff" stroke-width="0.5" opacity="0.3"/>' +
    '</g>' +
  '</svg>',

  /* ── 15. SOUND_ON (24×24) ── Audio Wave — speaker with waves ── */
  sound_on: '<svg class="ui-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="glow-snd"><feGaussianBlur stdDeviation="1" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>' +
    '</defs>' +
    '<g filter="url(#glow-snd)">' +
      /* Speaker body */
      '<path d="M3 9 L7 9 L12 4 L12 20 L7 15 L3 15 Z" fill="#0a0e17" stroke="#00f0ff" stroke-width="1.2" stroke-linejoin="bevel"/>' +
      /* Sound wave 1 — close */
      '<path d="M15 8 Q18 12 15 16" fill="none" stroke="#00f0ff" stroke-width="1.2" opacity="0.8"/>' +
      /* Sound wave 2 — mid */
      '<path d="M18 5 Q22 12 18 19" fill="none" stroke="#00f0ff" stroke-width="1" opacity="0.5"/>' +
      /* Sound wave 3 — far */
      '<path d="M21 3 Q25 12 21 21" fill="none" stroke="#00f0ff" stroke-width="0.7" opacity="0.3"/>' +
    '</g>' +
  '</svg>',

  /* ── 16. SOUND_OFF (24×24) ── Audio Mute — speaker with X ── */
  sound_off: '<svg class="ui-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<g opacity="0.45">' +
      /* Speaker body — dimmed */
      '<path d="M3 9 L7 9 L12 4 L12 20 L7 15 L3 15 Z" fill="#0a0e17" stroke="#00f0ff" stroke-width="1.2" stroke-linejoin="bevel"/>' +
    '</g>' +
    /* X slash */
    '<line x1="15" y1="8" x2="22" y2="16" stroke="#ff2d2d" stroke-width="1.8" stroke-linecap="square"/>' +
    '<line x1="22" y1="8" x2="15" y2="16" stroke="#ff2d2d" stroke-width="1.8" stroke-linecap="square"/>' +
  '</svg>'

};


/**
 * Retrieve a UI SVG string by name, optionally sized.
 * @param {string} name  — key from UI_SVGS
 * @param {number} [size] — set width & height (square)
 * @returns {string} SVG markup or ''
 */
function getUISVG(name, size) {
  var svg = UI_SVGS[name] || '';
  if (!svg) return '';
  if (size) {
    svg = svg.replace(
      'class="ui-svg"',
      'class="ui-svg" width="' + size + '" height="' + size + '"'
    );
  }
  return svg;
}

/* Expose globally */
window.UI_SVGS = UI_SVGS;
window.getUISVG = getUISVG;
