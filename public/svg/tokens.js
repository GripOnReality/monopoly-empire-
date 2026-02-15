/* Cyberpunk Token SVGs — 6sides.live */
var TOKEN_SVGS = {

  /* ── 1. Crimson — Cyber Samurai Helmet ────────────────────────── */
  crimson: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gc" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#e74c3c" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gc)">' +
      /* Helmet dome */
      '<path d="M14 28 L14 18 Q14 11 24 10 Q34 11 34 18 L34 28 Z" fill="#111827" stroke="#e74c3c" stroke-width="1.2"/>' +
      /* Visor slit */
      '<path d="M16 21 L32 21 L30 24 L18 24 Z" fill="#1a0a0a" stroke="#e74c3c" stroke-width="0.8"/>' +
      /* Red neon visor stripe */
      '<line x1="17" y1="22.5" x2="31" y2="22.5" stroke="#ff4444" stroke-width="1.5" opacity="0.95"/>' +
      '<line x1="17" y1="22.5" x2="31" y2="22.5" stroke="#e74c3c" stroke-width="0.6"/>' +
      /* Side vents left */
      '<line x1="14" y1="25" x2="11" y2="26" stroke="#e74c3c" stroke-width="0.7"/>' +
      '<line x1="14" y1="26.5" x2="11" y2="27.5" stroke="#e74c3c" stroke-width="0.7"/>' +
      '<line x1="14" y1="28" x2="11" y2="29" stroke="#e74c3c" stroke-width="0.7"/>' +
      /* Side vents right */
      '<line x1="34" y1="25" x2="37" y2="26" stroke="#e74c3c" stroke-width="0.7"/>' +
      '<line x1="34" y1="26.5" x2="37" y2="27.5" stroke="#e74c3c" stroke-width="0.7"/>' +
      '<line x1="34" y1="28" x2="37" y2="29" stroke="#e74c3c" stroke-width="0.7"/>' +
      /* Chin guard */
      '<path d="M18 28 L24 32 L30 28" fill="none" stroke="#e74c3c" stroke-width="0.9"/>' +
      /* Forehead crest */
      '<path d="M20 14 L24 11 L28 14" fill="none" stroke="#ff4444" stroke-width="0.8"/>' +
      /* Center line */
      '<line x1="24" y1="11" x2="24" y2="18" stroke="#e74c3c" stroke-width="0.5" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 2. Ocean — Neural Interface Plug ─────────────────────────── */
  ocean: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="go" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#3498db" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#go)">' +
      /* Outer ring */
      '<circle cx="24" cy="24" r="11" fill="#0d1520" stroke="#3498db" stroke-width="1.4"/>' +
      /* Inner jack port */
      '<circle cx="24" cy="24" r="5" fill="#0a0e17" stroke="#5dade2" stroke-width="1.2"/>' +
      /* Center contact */
      '<circle cx="24" cy="24" r="1.8" fill="#3498db" opacity="0.9"/>' +
      /* Radiating circuit lines */
      '<line x1="24" y1="13" x2="24" y2="8" stroke="#3498db" stroke-width="0.8"/>' +
      '<line x1="24" y1="35" x2="24" y2="40" stroke="#3498db" stroke-width="0.8"/>' +
      '<line x1="13" y1="24" x2="8" y2="24" stroke="#3498db" stroke-width="0.8"/>' +
      '<line x1="35" y1="24" x2="40" y2="24" stroke="#3498db" stroke-width="0.8"/>' +
      /* Diagonal circuit lines */
      '<line x1="16.2" y1="16.2" x2="12" y2="12" stroke="#3498db" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="31.8" y1="16.2" x2="36" y2="12" stroke="#3498db" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="16.2" y1="31.8" x2="12" y2="36" stroke="#3498db" stroke-width="0.6" opacity="0.7"/>' +
      '<line x1="31.8" y1="31.8" x2="36" y2="36" stroke="#3498db" stroke-width="0.6" opacity="0.7"/>' +
      /* Circuit nodes */
      '<circle cx="24" cy="8" r="1" fill="#5dade2"/>' +
      '<circle cx="24" cy="40" r="1" fill="#5dade2"/>' +
      '<circle cx="8" cy="24" r="1" fill="#5dade2"/>' +
      '<circle cx="40" cy="24" r="1" fill="#5dade2"/>' +
      /* Notch marks on ring */
      '<line x1="20" y1="13.5" x2="20" y2="15.5" stroke="#5dade2" stroke-width="0.5"/>' +
      '<line x1="28" y1="13.5" x2="28" y2="15.5" stroke="#5dade2" stroke-width="0.5"/>' +
      '<line x1="20" y1="32.5" x2="20" y2="34.5" stroke="#5dade2" stroke-width="0.5"/>' +
      '<line x1="28" y1="32.5" x2="28" y2="34.5" stroke="#5dade2" stroke-width="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 3. Emerald — Hacker Skull ────────────────────────────────── */
  emerald: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="ge" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#2ecc71" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#ge)">' +
      /* Cranium */
      '<path d="M15 26 L15 17 Q15 10 24 9 Q33 10 33 17 L33 26 Q33 28 30 29 L18 29 Q15 28 15 26 Z" fill="#111827" stroke="#2ecc71" stroke-width="1.1"/>' +
      /* Left eye socket — angular */
      '<path d="M18 17 L22 17 L22 22 L18 22 Z" fill="#0a0e17" stroke="#39ff14" stroke-width="0.9"/>' +
      /* Right eye socket — angular */
      '<path d="M26 17 L30 17 L30 22 L26 22 Z" fill="#0a0e17" stroke="#39ff14" stroke-width="0.9"/>' +
      /* Eye glow left */
      '<circle cx="20" cy="19.5" r="1.2" fill="#39ff14" opacity="0.85"/>' +
      /* Eye glow right */
      '<circle cx="28" cy="19.5" r="1.2" fill="#39ff14" opacity="0.85"/>' +
      /* Nose */
      '<path d="M23 23 L24 25 L25 23" fill="none" stroke="#2ecc71" stroke-width="0.6"/>' +
      /* Circuit jaw */
      '<path d="M17 29 L17 32 L24 35 L31 32 L31 29" fill="none" stroke="#2ecc71" stroke-width="0.9"/>' +
      /* Jaw circuit lines — teeth/grid */
      '<line x1="20" y1="29" x2="20" y2="33" stroke="#2ecc71" stroke-width="0.5" opacity="0.7"/>' +
      '<line x1="24" y1="29" x2="24" y2="35" stroke="#2ecc71" stroke-width="0.5" opacity="0.7"/>' +
      '<line x1="28" y1="29" x2="28" y2="33" stroke="#2ecc71" stroke-width="0.5" opacity="0.7"/>' +
      '<line x1="17" y1="31" x2="31" y2="31" stroke="#2ecc71" stroke-width="0.4" opacity="0.5"/>' +
      /* Cranium circuit detail */
      '<line x1="24" y1="9" x2="24" y2="14" stroke="#39ff14" stroke-width="0.5" opacity="0.5"/>' +
      '<line x1="19" y1="12" x2="29" y2="12" stroke="#39ff14" stroke-width="0.4" opacity="0.4"/>' +
    '</g>' +
  '</svg>',

  /* ── 4. Amber — Neon Katana ───────────────────────────────────── */
  amber: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="ga" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="blade" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#ffe066"/>' +
        '<stop offset="100%" stop-color="#f39c12"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#f39c12" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#ga)" transform="rotate(-35 24 24)">' +
      /* Blade */
      '<path d="M24 6 L25.8 28 L24 30 L22.2 28 Z" fill="url(#blade)" stroke="#f39c12" stroke-width="0.6" opacity="0.95"/>' +
      /* Blade center line */
      '<line x1="24" y1="8" x2="24" y2="27" stroke="#fffbe6" stroke-width="0.5" opacity="0.6"/>' +
      /* Crossguard */
      '<rect x="18" y="29" width="12" height="2.5" rx="0.5" fill="#111827" stroke="#f39c12" stroke-width="0.9"/>' +
      /* Crossguard diamond accent */
      '<path d="M23 30.2 L24 29.2 L25 30.2 L24 31.2 Z" fill="#f0c850"/>' +
      /* Handle wrap */
      '<rect x="22.5" y="31.5" width="3" height="9" rx="0.4" fill="#111827" stroke="#f39c12" stroke-width="0.7"/>' +
      /* Handle wrap lines */
      '<line x1="22.5" y1="33.5" x2="25.5" y2="33.5" stroke="#f39c12" stroke-width="0.4" opacity="0.6"/>' +
      '<line x1="22.5" y1="35.5" x2="25.5" y2="35.5" stroke="#f39c12" stroke-width="0.4" opacity="0.6"/>' +
      '<line x1="22.5" y1="37.5" x2="25.5" y2="37.5" stroke="#f39c12" stroke-width="0.4" opacity="0.6"/>' +
      /* Pommel */
      '<circle cx="24" cy="41.5" r="1.5" fill="#111827" stroke="#f0c850" stroke-width="0.7"/>' +
      /* Blade tip glow */
      '<circle cx="24" cy="7" r="1" fill="#ffe066" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 5. Violet — Cyber Eye ────────────────────────────────────── */
  violet: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gv" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#9b59b6" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gv)">' +
      /* Outer mechanical housing */
      '<circle cx="24" cy="24" r="12" fill="#111827" stroke="#9b59b6" stroke-width="1.2"/>' +
      /* Mechanical ring segments */
      '<path d="M24 12 A12 12 0 0 1 36 24" fill="none" stroke="#b026ff" stroke-width="0.6" stroke-dasharray="2 3"/>' +
      '<path d="M36 24 A12 12 0 0 1 24 36" fill="none" stroke="#b026ff" stroke-width="0.6" stroke-dasharray="2 3"/>' +
      /* Iris ring */
      '<circle cx="24" cy="24" r="7" fill="#0d0818" stroke="#b026ff" stroke-width="1.4"/>' +
      /* Iris segments */
      '<path d="M20 18 L24 21" stroke="#9b59b6" stroke-width="0.6"/>' +
      '<path d="M28 18 L24 21" stroke="#9b59b6" stroke-width="0.6"/>' +
      '<path d="M20 30 L24 27" stroke="#9b59b6" stroke-width="0.6"/>' +
      '<path d="M28 30 L24 27" stroke="#9b59b6" stroke-width="0.6"/>' +
      /* Pupil */
      '<circle cx="24" cy="24" r="3" fill="#1a0a2e" stroke="#b026ff" stroke-width="0.8"/>' +
      /* Pupil core */
      '<circle cx="24" cy="24" r="1.2" fill="#b026ff" opacity="0.9"/>' +
      /* Scanner beam — horizontal */
      '<line x1="10" y1="24" x2="38" y2="24" stroke="#b026ff" stroke-width="0.5" opacity="0.4"/>' +
      /* Scanner beam — vertical sweep */
      '<line x1="24" y1="10" x2="24" y2="38" stroke="#9b59b6" stroke-width="0.3" opacity="0.3"/>' +
      /* Corner brackets — top-left */
      '<path d="M13 16 L13 13 L16 13" fill="none" stroke="#9b59b6" stroke-width="0.7" opacity="0.6"/>' +
      /* Corner brackets — top-right */
      '<path d="M35 16 L35 13 L32 13" fill="none" stroke="#9b59b6" stroke-width="0.7" opacity="0.6"/>' +
      /* Corner brackets — bottom-left */
      '<path d="M13 32 L13 35 L16 35" fill="none" stroke="#9b59b6" stroke-width="0.7" opacity="0.6"/>' +
      /* Corner brackets — bottom-right */
      '<path d="M35 32 L35 35 L32 35" fill="none" stroke="#9b59b6" stroke-width="0.7" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 6. Teal — Circuit Chip ───────────────────────────────────── */
  teal: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gt" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#1abc9c" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gt)">' +
      /* Chip body */
      '<rect x="14" y="14" width="20" height="20" rx="1" fill="#111827" stroke="#1abc9c" stroke-width="1.2"/>' +
      /* Inner die */
      '<rect x="19" y="19" width="10" height="10" rx="0.5" fill="#0a0e17" stroke="#00ffd5" stroke-width="0.9"/>' +
      /* Center glow */
      '<circle cx="24" cy="24" r="2.5" fill="#00ffd5" opacity="0.3"/>' +
      '<circle cx="24" cy="24" r="1.2" fill="#00ffd5" opacity="0.7"/>' +
      /* Top pins */
      '<line x1="18" y1="14" x2="18" y2="10" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="22" y1="14" x2="22" y2="10" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="26" y1="14" x2="26" y2="10" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="30" y1="14" x2="30" y2="10" stroke="#1abc9c" stroke-width="0.9"/>' +
      /* Bottom pins */
      '<line x1="18" y1="34" x2="18" y2="38" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="22" y1="34" x2="22" y2="38" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="26" y1="34" x2="26" y2="38" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="30" y1="34" x2="30" y2="38" stroke="#1abc9c" stroke-width="0.9"/>' +
      /* Left pins */
      '<line x1="14" y1="18" x2="10" y2="18" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="14" y1="22" x2="10" y2="22" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="14" y1="26" x2="10" y2="26" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="14" y1="30" x2="10" y2="30" stroke="#1abc9c" stroke-width="0.9"/>' +
      /* Right pins */
      '<line x1="34" y1="18" x2="38" y2="18" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="34" y1="22" x2="38" y2="22" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="34" y1="26" x2="38" y2="26" stroke="#1abc9c" stroke-width="0.9"/>' +
      '<line x1="34" y1="30" x2="38" y2="30" stroke="#1abc9c" stroke-width="0.9"/>' +
      /* Die circuit traces */
      '<line x1="21" y1="21" x2="24" y2="24" stroke="#00ffd5" stroke-width="0.4" opacity="0.6"/>' +
      '<line x1="27" y1="21" x2="24" y2="24" stroke="#00ffd5" stroke-width="0.4" opacity="0.6"/>' +
      '<line x1="21" y1="27" x2="24" y2="24" stroke="#00ffd5" stroke-width="0.4" opacity="0.6"/>' +
      '<line x1="27" y1="27" x2="24" y2="24" stroke="#00ffd5" stroke-width="0.4" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 7. Fuchsia — Neon Dragon ─────────────────────────────────── */
  fuchsia: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gf" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#e91e8b" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gf)">' +
      /* Dragon head profile — angular */
      '<path d="M30 14 L34 10 L33 15 L36 18 L33 19 L34 24 L30 28 L26 32 L20 34 L16 32 L14 28 L16 24 L14 20 L17 18 L20 14 L24 12 Z" fill="#111827" stroke="#e91e8b" stroke-width="1.1"/>' +
      /* Jaw line */
      '<path d="M16 28 L20 30 L26 32 L30 28" fill="none" stroke="#ff2d7b" stroke-width="0.8"/>' +
      /* Snout top */
      '<path d="M30 18 L36 18" fill="none" stroke="#e91e8b" stroke-width="0.7"/>' +
      /* Eye */
      '<path d="M22 19 L25 18 L25 21 L22 21 Z" fill="#1a0a14" stroke="#ff2d7b" stroke-width="0.8"/>' +
      '<circle cx="23.5" cy="19.5" r="1" fill="#ff2d7b" opacity="0.9"/>' +
      /* Horn spikes */
      '<path d="M20 14 L18 9 L22 13" fill="none" stroke="#e91e8b" stroke-width="0.7"/>' +
      '<path d="M24 12 L25 7 L27 12" fill="none" stroke="#e91e8b" stroke-width="0.7"/>' +
      /* Nostril */
      '<circle cx="32" cy="20" r="0.8" fill="#ff2d7b" opacity="0.6"/>' +
      /* Jaw teeth */
      '<path d="M22 28 L24 30 L26 28 L28 30 L30 28" fill="none" stroke="#ff2d7b" stroke-width="0.5" opacity="0.7"/>' +
      /* Glow trail — behind head */
      '<path d="M14 28 L11 32 L10 36" stroke="#e91e8b" stroke-width="0.8" fill="none" opacity="0.5"/>' +
      '<path d="M16 32 L13 36 L12 39" stroke="#ff2d7b" stroke-width="0.6" fill="none" opacity="0.35"/>' +
      '<path d="M14 20 L10 18 L8 16" stroke="#e91e8b" stroke-width="0.6" fill="none" opacity="0.35"/>' +
      /* Neck scale lines */
      '<line x1="17" y1="24" x2="20" y2="23" stroke="#e91e8b" stroke-width="0.4" opacity="0.5"/>' +
      '<line x1="16" y1="26" x2="19" y2="25" stroke="#e91e8b" stroke-width="0.4" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 8. Ivory — Hologram Ghost ────────────────────────────────── */
  ivory: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gi" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#bdc3c7" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gi)">' +
      /* Ghost body — translucent figure */
      '<path d="M18 36 L18 20 Q18 11 24 10 Q30 11 30 20 L30 36 L27 33 L24 36 L21 33 Z" fill="#111827" stroke="#e0e8ff" stroke-width="1.0" opacity="0.85"/>' +
      /* Inner fill glow */
      '<path d="M19 35 L19 20 Q19 12.5 24 11.5 Q29 12.5 29 20 L29 35 L27 32.5 L24 35 L21 32.5 Z" fill="#1a1e2e" opacity="0.5"/>' +
      /* Eyes */
      '<circle cx="21" cy="20" r="2" fill="#0a0e17" stroke="#e0e8ff" stroke-width="0.8"/>' +
      '<circle cx="27" cy="20" r="2" fill="#0a0e17" stroke="#e0e8ff" stroke-width="0.8"/>' +
      /* Eye pupils — glowing */
      '<circle cx="21" cy="20" r="0.9" fill="#e0e8ff" opacity="0.8"/>' +
      '<circle cx="27" cy="20" r="0.9" fill="#e0e8ff" opacity="0.8"/>' +
      /* Mouth */
      '<ellipse cx="24" cy="25" rx="2" ry="1.5" fill="#0a0e17" stroke="#bdc3c7" stroke-width="0.6"/>' +
      /* Glitch lines — horizontal scan distortion */
      '<line x1="15" y1="16" x2="33" y2="16" stroke="#e0e8ff" stroke-width="0.4" opacity="0.25"/>' +
      '<line x1="13" y1="22" x2="35" y2="22" stroke="#e0e8ff" stroke-width="0.5" opacity="0.2"/>' +
      '<line x1="16" y1="28" x2="32" y2="28" stroke="#e0e8ff" stroke-width="0.4" opacity="0.2"/>' +
      '<line x1="14" y1="33" x2="34" y2="33" stroke="#bdc3c7" stroke-width="0.3" opacity="0.15"/>' +
      /* Shimmer particles */
      '<rect x="16" y="14" width="1.5" height="0.5" fill="#e0e8ff" opacity="0.4"/>' +
      '<rect x="31" y="18" width="1.5" height="0.5" fill="#e0e8ff" opacity="0.35"/>' +
      '<rect x="14" y="26" width="1" height="0.5" fill="#bdc3c7" opacity="0.3"/>' +
      '<rect x="33" y="30" width="1.2" height="0.5" fill="#e0e8ff" opacity="0.3"/>' +
      /* Offset glitch block */
      '<rect x="25" y="15" width="3" height="1" fill="#e0e8ff" opacity="0.1"/>' +
      '<rect x="18" y="30" width="4" height="0.8" fill="#bdc3c7" opacity="0.1"/>' +
    '</g>' +
  '</svg>',

  /* ── 9. Diamond — Gold Diamond ──────────────────────────────── */
  diamond: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gdi" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="dgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#FFE566"/>' +
        '<stop offset="100%" stop-color="#FF8C00"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#FFD700" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gdi)">' +
      '<polygon points="24,7 37,24 24,41 11,24" fill="url(#dgr)" stroke="#FFE566" stroke-width="0.8" opacity="0.9"/>' +
      '<line x1="24" y1="7" x2="17" y2="24" stroke="#FFFDE0" stroke-width="0.5" opacity="0.5"/>' +
      '<line x1="24" y1="7" x2="31" y2="24" stroke="#FFFDE0" stroke-width="0.5" opacity="0.5"/>' +
      '<line x1="11" y1="24" x2="37" y2="24" stroke="#FFFDE0" stroke-width="0.4" opacity="0.4"/>' +
      '<line x1="24" y1="41" x2="17" y2="24" stroke="#FFFDE0" stroke-width="0.4" opacity="0.3"/>' +
      '<line x1="24" y1="41" x2="31" y2="24" stroke="#FFFDE0" stroke-width="0.4" opacity="0.3"/>' +
      '<circle cx="24" cy="7" r="0.8" fill="#00FFFF" opacity="0.8"/>' +
      '<circle cx="37" cy="24" r="0.8" fill="#00FFFF" opacity="0.8"/>' +
      '<circle cx="24" cy="41" r="0.8" fill="#00FFFF" opacity="0.8"/>' +
      '<circle cx="11" cy="24" r="0.8" fill="#00FFFF" opacity="0.8"/>' +
    '</g>' +
  '</svg>',

  /* ── 10. Club — Red Club ────────────────────────────────────── */
  club: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gcl" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="cgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#FF4466"/>' +
        '<stop offset="100%" stop-color="#990018"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#FF2244" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gcl)">' +
      '<circle cx="24" cy="13" r="6.5" fill="url(#cgr)" stroke="#FF4466" stroke-width="0.8"/>' +
      '<circle cx="15" cy="22" r="6.5" fill="url(#cgr)" stroke="#FF4466" stroke-width="0.8"/>' +
      '<circle cx="33" cy="22" r="6.5" fill="url(#cgr)" stroke="#FF4466" stroke-width="0.8"/>' +
      '<path d="M21 27 L21 37 L27 37 L27 27 Z" fill="url(#cgr)" stroke="#FF4466" stroke-width="0.6"/>' +
      '<path d="M18 36 L30 36 L30 39 L18 39 Z" fill="#111827" stroke="#FF4466" stroke-width="0.5"/>' +
      '<circle cx="24" cy="13" r="2" fill="#FF6680" opacity="0.5"/>' +
      '<circle cx="15" cy="22" r="2" fill="#FF6680" opacity="0.5"/>' +
      '<circle cx="33" cy="22" r="2" fill="#FF6680" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 11. Spade — Green Spade ────────────────────────────────── */
  spade: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gsp" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="sgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#00ff88"/>' +
        '<stop offset="100%" stop-color="#008844"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#00ff88" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gsp)">' +
      '<path d="M24 7 C24 7 36 17 37 25 C38 31 34 35 29 33 C26 32 25 30 24 28 C23 30 22 32 19 33 C14 35 10 31 11 25 C12 17 24 7 24 7 Z" fill="url(#sgr)" stroke="#00ffaa" stroke-width="0.8"/>' +
      '<path d="M21 33 L21 39 L27 39 L27 33" fill="url(#sgr)" stroke="#00ffaa" stroke-width="0.6"/>' +
      '<path d="M18 38 L30 38 L30 40 L18 40 Z" fill="#111827" stroke="#00ffaa" stroke-width="0.5"/>' +
      '<circle cx="24" cy="20" r="1.5" fill="#00ffaa" opacity="0.6"/>' +
      '<line x1="24" y1="9" x2="24" y2="15" stroke="#66ffcc" stroke-width="0.4" opacity="0.4"/>' +
    '</g>' +
  '</svg>',

  /* ── 12. Heart — Blue Heart ─────────────────────────────────── */
  heart: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="ght" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="hgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#00ccff"/>' +
        '<stop offset="100%" stop-color="#006699"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#00ccff" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#ght)">' +
      '<path d="M24 38 C24 38 8 27 8 16 C8 10 13 7 18 7 C21 7 24 10 24 10 C24 10 27 7 30 7 C35 7 40 10 40 16 C40 27 24 38 24 38 Z" fill="url(#hgr)" stroke="#00bbff" stroke-width="0.8"/>' +
      '<path d="M24 14 C24 14 19 9 15 12 C11 16 12 22 24 33" fill="none" stroke="#66ddff" stroke-width="0.5" opacity="0.4"/>' +
      '<circle cx="24" cy="22" r="1.5" fill="#00ccff" opacity="0.6"/>' +
      '<circle cx="16" cy="14" r="0.6" fill="#66ddff" opacity="0.5"/>' +
      '<circle cx="32" cy="14" r="0.6" fill="#66ddff" opacity="0.5"/>' +
    '</g>' +
  '</svg>',

  /* ── 13. X-Mark — Purple X ──────────────────────────────────── */
  xmark: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gx" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="xgr1" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#c77dff"/>' +
        '<stop offset="100%" stop-color="#7b2cbf"/>' +
      '</linearGradient>' +
      '<linearGradient id="xgr2" x1="1" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#c77dff"/>' +
        '<stop offset="100%" stop-color="#7b2cbf"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#9d4edd" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gx)">' +
      '<line x1="11" y1="11" x2="37" y2="37" stroke="url(#xgr1)" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="11" y1="11" x2="37" y2="37" stroke="#e0aaff" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="37" y1="11" x2="11" y2="37" stroke="url(#xgr2)" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="37" y1="11" x2="11" y2="37" stroke="#e0aaff" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="24" cy="24" r="2" fill="#e0aaff" opacity="0.9"/>' +
      '<circle cx="11" cy="11" r="1.2" fill="#e0aaff" opacity="0.8"/>' +
      '<circle cx="37" cy="11" r="1.2" fill="#e0aaff" opacity="0.8"/>' +
      '<circle cx="11" cy="37" r="1.2" fill="#e0aaff" opacity="0.8"/>' +
      '<circle cx="37" cy="37" r="1.2" fill="#e0aaff" opacity="0.8"/>' +
    '</g>' +
  '</svg>',

  /* ── 14. Hexagram — Pink Hexagram ───────────────────────────── */
  hexagram: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="ghx" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="hxgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#ff69b4"/>' +
        '<stop offset="100%" stop-color="#d90368"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#ff1485" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#ghx)">' +
      '<polygon points="24,8 35,27 13,27" fill="none" stroke="url(#hxgr)" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<polygon points="24,40 13,21 35,21" fill="none" stroke="url(#hxgr)" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<polygon points="24,8 35,27 13,27" fill="none" stroke="#ffb3d9" stroke-width="0.8" stroke-linejoin="round"/>' +
      '<polygon points="24,40 13,21 35,21" fill="none" stroke="#ffb3d9" stroke-width="0.8" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="24" r="2" fill="#ffb3d9" opacity="0.9"/>' +
      '<circle cx="24" cy="8" r="1" fill="#ffb3d9" opacity="0.8"/>' +
      '<circle cx="24" cy="40" r="1" fill="#ffb3d9" opacity="0.8"/>' +
      '<circle cx="13" cy="27" r="1" fill="#ffb3d9" opacity="0.8"/>' +
      '<circle cx="35" cy="27" r="1" fill="#ffb3d9" opacity="0.8"/>' +
      '<circle cx="13" cy="21" r="1" fill="#ffb3d9" opacity="0.8"/>' +
      '<circle cx="35" cy="21" r="1" fill="#ffb3d9" opacity="0.8"/>' +
    '</g>' +
  '</svg>',

  /* ── 15. Square — Orange Square ─────────────────────────────── */
  square: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gsq" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="sqgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#ffb366"/>' +
        '<stop offset="100%" stop-color="#ff4500"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#ff8c00" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gsq)">' +
      '<rect x="10" y="10" width="28" height="28" rx="1.5" fill="url(#sqgr)" stroke="#ff8c00" stroke-width="0.8" opacity="0.85"/>' +
      '<rect x="14" y="14" width="20" height="20" rx="1" fill="none" stroke="#ffcc99" stroke-width="0.7" opacity="0.6"/>' +
      '<rect x="18" y="18" width="12" height="12" rx="0.5" fill="none" stroke="#ffcc99" stroke-width="0.5" opacity="0.4"/>' +
      '<circle cx="24" cy="24" r="2" fill="#ffcc99" opacity="0.7"/>' +
      '<circle cx="10" cy="10" r="1.2" fill="#ffcc99" opacity="0.7"/>' +
      '<circle cx="38" cy="10" r="1.2" fill="#ffcc99" opacity="0.7"/>' +
      '<circle cx="10" cy="38" r="1.2" fill="#ffcc99" opacity="0.7"/>' +
      '<circle cx="38" cy="38" r="1.2" fill="#ffcc99" opacity="0.7"/>' +
      '<circle cx="24" cy="10" r="0.8" fill="#ffcc99" opacity="0.6"/>' +
      '<circle cx="38" cy="24" r="0.8" fill="#ffcc99" opacity="0.6"/>' +
      '<circle cx="24" cy="38" r="0.8" fill="#ffcc99" opacity="0.6"/>' +
      '<circle cx="10" cy="24" r="0.8" fill="#ffcc99" opacity="0.6"/>' +
    '</g>' +
  '</svg>',

  /* ── 16. Question — Neon Question Mark ──────────────────────── */
  question: '<svg class="token-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<filter id="gq" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur"/>' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
      '</filter>' +
      '<linearGradient id="qgr" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#ccff99"/>' +
        '<stop offset="100%" stop-color="#39ff14"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<circle cx="24" cy="24" r="22" fill="#0a0e17" stroke="#7fff00" stroke-width="1.2" opacity="0.9"/>' +
    '<g filter="url(#gq)">' +
      '<path d="M19 14 Q19 9 24 9 Q32 9 32 16 Q32 21 26 24 L26 28" fill="none" stroke="url(#qgr)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M19 14 Q19 9 24 9 Q32 9 32 16 Q32 21 26 24 L26 28" fill="none" stroke="#ccff99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="26" cy="35" r="3" fill="url(#qgr)"/>' +
      '<circle cx="26" cy="35" r="1.2" fill="#ccff99" opacity="0.9"/>' +
      '<circle cx="19" cy="14" r="0.8" fill="#ccff99" opacity="0.7"/>' +
      '<circle cx="32" cy="16" r="0.8" fill="#ccff99" opacity="0.7"/>' +
      '<circle cx="26" cy="24" r="0.8" fill="#ccff99" opacity="0.7"/>' +
    '</g>' +
  '</svg>'
};

// Helper: get token SVG by character ID, optionally sized
function getTokenSVG(charId, size) {
  size = size || 24;
  var svg = TOKEN_SVGS[charId] || '';
  return svg.replace('class="token-svg"', 'class="token-svg" width="' + size + '" height="' + size + '"');
}

window.TOKEN_SVGS = TOKEN_SVGS;
window.getTokenSVG = getTokenSVG;
