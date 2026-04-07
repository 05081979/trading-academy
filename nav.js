/* ── TRADING ACADEMY — Shared Navigation Bar ── */
(function() {
  const MODULES = [
    { id: 'hub-cours',          label: 'Hub de Cours',         cat: 'cours',  color: '#e9b84c' },
    { id: 'ict-trainer',        label: 'ICT Trainer',          cat: 'cours',  color: '#2dd67a' },
    { id: 'ipda-trainer',       label: 'IPDA Trainer',         cat: 'cours',  color: '#9b6cf0' },
    { id: 'time-price',         label: 'Time x Price',         cat: 'cours',  color: '#4b9cf4' },
    { id: 'modules-interactifs',label: 'Modules Interactifs',  cat: 'cours',  color: '#f08044' },
    { id: 'inducement-theorem', label: 'Inducement Theorem',   cat: 'cours',  color: '#f04545' },
    { id: 'trading-hub-v8',     label: 'Trading Hub NQ v8',    cat: 'outils', color: '#4b9cf4' },
    { id: 'financial-juice',    label: 'Financial Juice',      cat: 'outils', color: '#2dd67a' },
    { id: 'methodologie',       label: 'Methodologie',         cat: 'method', color: '#e9b84c' },
    { id: 'role-outils',        label: 'Role Outils',          cat: 'method', color: '#f08044' },
  ];

  // Detect current page
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  const isIndex = filename === 'index' || filename === '' || path.endsWith('/');

  // Build nav bar
  const nav = document.createElement('div');
  nav.id = 'ta-nav';
  nav.innerHTML = `
    <div class="ta-nav-inner">
      <a href="../index.html" class="ta-brand">
        <div class="ta-logo">TA</div>
        <span class="ta-title">TRADING ACADEMY</span>
      </a>
      <div class="ta-links">
        ${MODULES.map(m => {
          const active = filename === m.id;
          return `<a href="${m.id}.html" class="ta-link ${active ? 'ta-active' : ''}" style="--dot:${m.color}">
            <span class="ta-dot"></span>${m.label}
          </a>`;
        }).join('')}
      </div>
      <button class="ta-toggle" onclick="document.getElementById('ta-nav').classList.toggle('ta-expanded')" aria-label="Menu">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
      </button>
    </div>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #ta-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(8,10,16,0.92); backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(233,184,76,0.15);
      font-family: 'Segoe UI', system-ui, sans-serif;
      transition: all 0.3s;
    }
    .ta-nav-inner {
      max-width: 100%; display: flex; align-items: center;
      padding: 0 16px; height: 44px; gap: 12px;
    }
    .ta-brand {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; flex-shrink: 0;
    }
    .ta-logo {
      width: 28px; height: 28px;
      background: linear-gradient(135deg, #e9b84c, #c49b2e);
      border-radius: 6px; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; color: #0a0d14;
    }
    .ta-title {
      font-size: 12px; font-weight: 700; color: #e9b84c;
      letter-spacing: 0.06em;
    }
    .ta-links {
      display: flex; align-items: center; gap: 2px;
      overflow-x: auto; flex: 1;
      scrollbar-width: none; -ms-overflow-style: none;
      padding: 0 8px;
    }
    .ta-links::-webkit-scrollbar { display: none; }
    .ta-link {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 600; color: #8a96a8;
      text-decoration: none; white-space: nowrap;
      transition: all 0.15s;
    }
    .ta-link:hover { background: rgba(255,255,255,0.06); color: #cdd6f4; }
    .ta-link.ta-active {
      background: rgba(233,184,76,0.12); color: #e9b84c;
    }
    .ta-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--dot); flex-shrink: 0; opacity: 0.7;
    }
    .ta-link.ta-active .ta-dot { opacity: 1; box-shadow: 0 0 6px var(--dot); }
    .ta-toggle {
      display: none; background: none; border: none;
      color: #8a96a8; cursor: pointer; padding: 4px;
    }

    /* Push page content down */
    body { padding-top: 48px !important; }

    /* Mobile */
    @media (max-width: 900px) {
      .ta-toggle { display: block; margin-left: auto; }
      .ta-links {
        display: none; position: absolute; top: 44px; left: 0; right: 0;
        background: rgba(8,10,16,0.97); border-bottom: 1px solid rgba(233,184,76,0.15);
        flex-direction: column; padding: 8px; gap: 2px;
      }
      #ta-nav.ta-expanded .ta-links { display: flex; }
      .ta-link { padding: 10px 14px; width: 100%; }
    }
  `;

  // Insert at top of body
  document.head.appendChild(style);
  if (document.body.firstChild) {
    document.body.insertBefore(nav, document.body.firstChild);
  } else {
    document.body.appendChild(nav);
  }
})();
