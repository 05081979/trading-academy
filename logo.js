/* ── ALGORITHMIC ACADEMY — Logo SVG Generator ── */
const AA_LOGO = {
  /* Full logo with orbits, hexagon, text — for hero/login */
  full(size = 220) {
    return `<svg viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="200" cy="200" r="195" fill="#0a0e1a"/>
      <circle cx="200" cy="200" r="195" fill="none" stroke="#141e35" stroke-width="1"/>

      <!-- Binary decorations -->
      <text x="80" y="145" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">10110</text>
      <text x="300" y="140" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">01001</text>
      <text x="70" y="260" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">0101</text>
      <text x="320" y="235" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">10</text>
      <text x="100" y="340" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">11010</text>
      <text x="290" y="345" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">10111</text>

      <!-- Orbit 1 — blue solid, tilted left -->
      <ellipse cx="200" cy="185" rx="145" ry="65" fill="none" stroke="#3455a8" stroke-width="1.2" transform="rotate(-30 200 185)" opacity="0.7"/>

      <!-- Orbit 2 — red/orange dashed -->
      <ellipse cx="200" cy="185" rx="120" ry="55" fill="none" stroke="#d04830" stroke-width="1" stroke-dasharray="6 4" transform="rotate(35 200 185)" opacity="0.6"/>

      <!-- Orbit 3 — dark blue dashed -->
      <ellipse cx="200" cy="185" rx="130" ry="50" fill="none" stroke="#1e3060" stroke-width="1" stroke-dasharray="8 5" transform="rotate(-60 200 185)" opacity="0.5"/>

      <!-- Orbital dots — blue -->
      <circle cx="120" cy="155" r="5" fill="#4a7cff"/>
      <circle cx="185" cy="135" r="4" fill="#4a7cff"/>
      <circle cx="165" cy="310" r="4.5" fill="#4a7cff"/>
      <circle cx="200" cy="305" r="3" fill="#4a7cff"/>

      <!-- Orbital dots — orange/red -->
      <circle cx="265" cy="155" r="5" fill="#e05030"/>
      <circle cx="230" cy="215" r="3.5" fill="#e05030"/>
      <circle cx="290" cy="305" r="5" fill="#e05030"/>

      <!-- Orbital dots — white/gray -->
      <circle cx="255" cy="175" r="2.5" fill="#8892a8"/>
      <circle cx="145" cy="195" r="2.5" fill="#8892a8"/>

      <!-- Connector lines -->
      <line x1="165" y1="310" x2="290" y2="305" stroke="#3455a8" stroke-width="0.8" opacity="0.4"/>
      <line x1="80" y1="310" x2="165" y2="310" stroke="#3455a8" stroke-width="0.8" opacity="0.3"/>

      <!-- Central hexagon -->
      <polygon points="200,145 235,165 235,200 200,220 165,200 165,165" fill="rgba(15,25,50,0.9)" stroke="#3455a8" stroke-width="2"/>
      <polygon points="200,152 229,169 229,197 200,214 171,197 171,169" fill="none" stroke="#253a6a" stroke-width="0.8" opacity="0.5"/>

      <!-- Letter A -->
      <text x="200" y="198" text-anchor="middle" fill="#4a7cff" font-family="'Inter','Segoe UI',sans-serif" font-size="42" font-weight="800" opacity="0.9">A</text>

      <!-- ALGORITHMIC text -->
      <text x="200" y="266" text-anchor="middle" fill="#e4e8f2" font-family="'Inter','Segoe UI',sans-serif" font-size="28" font-weight="800" letter-spacing="3">ALGORITHMIC</text>

      <!-- ACADEMY text -->
      <text x="200" y="290" text-anchor="middle" fill="#4a7cff" font-family="'Inter','Segoe UI',sans-serif" font-size="14" font-weight="600" letter-spacing="8">ACADEMY</text>

      <!-- Version -->
      <text x="200" y="320" text-anchor="middle" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.5">v2.0 :: build_2026</text>
    </svg>`;
  },

  /* Small icon — for navbar -->  */
  icon(size = 32) {
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" fill="rgba(10,14,26,0.95)" stroke="#4a7cff" stroke-width="1.5"/>
      <text x="20" y="24" text-anchor="middle" fill="#4a7cff" font-family="'Inter','Segoe UI',sans-serif" font-size="16" font-weight="800">A</text>
      <ellipse cx="20" cy="18" rx="18" ry="7" fill="none" stroke="#3455a8" stroke-width="0.6" transform="rotate(-25 20 18)" opacity="0.5"/>
      <circle cx="8" cy="14" r="1.5" fill="#4a7cff" opacity="0.7"/>
      <circle cx="32" cy="16" r="1.5" fill="#e05030" opacity="0.7"/>
    </svg>`;
  }
};

if (typeof module !== 'undefined') module.exports = AA_LOGO;
