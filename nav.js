/* ── ALGORITHMIC ACADEMY — Shared Navigation Bar ── */
(function() {
  const MODULES = [
    { id: 'ict-trainer',        label: '1. Fondations ICT' },
    { id: 'ict-mentorship',     label: '2. ICT Mentorship' },
    { id: 'ipda-trainer',       label: '3. Framework IPDA' },
    { id: 'inducement-theorem', label: '4. Inducement' },
    { id: 'hub-cours',          label: '5. Bibliotheque' },
    { id: 'methodologie',       label: '6. Methodologie' },
    { id: 'role-outils',        label: '7. Outils Pratiques' },
    { id: 'time-price',         label: '8. Calculateur' },
    { id: 'psychologie',        label: '9. Psychologie' },
    { id: 'calculatrice',       label: '10. Calculatrice' },
    { id: 'financial-juice',    label: '11. News Live' },
  ];

  const filename = window.location.pathname.split('/').pop().replace('.html', '');

  const ICON = `<svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" fill="rgba(10,14,26,0.95)" stroke="#4a7cff" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="16" font-weight="800">A</text>
    <ellipse cx="20" cy="18" rx="18" ry="7" fill="none" stroke="#3455a8" stroke-width="0.6" transform="rotate(-25 20 18)" opacity="0.5"/>
    <circle cx="8" cy="14" r="1.5" fill="#4a7cff" opacity="0.7"/>
    <circle cx="32" cy="16" r="1.5" fill="#e05030" opacity="0.7"/>
  </svg>`;

  const nav = document.createElement('div');
  nav.id = 'aa-nav';
  nav.innerHTML = `
    <div class="aa-inner">
      <a href="../index.html" class="aa-brand">
        ${ICON}
        <span><b>Algorithmic</b> Academy</span>
      </a>
      <div class="aa-links">
        ${MODULES.map(m => `<a href="${m.id}.html" class="aa-link ${filename === m.id ? 'aa-on' : ''}">${m.label}</a>`).join('')}
      </div>
      <a href="../index.html" class="aa-home">Accueil</a>
      <button class="aa-menu" onclick="document.getElementById('aa-nav').classList.toggle('open')">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
      </button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #aa-nav{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(6,10,18,0.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(74,124,255,0.1);font-family:Inter,system-ui,sans-serif;}
    .aa-inner{display:flex;align-items:center;height:48px;padding:0 16px;gap:8px;}
    .aa-brand{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;}
    .aa-brand span{font-size:13px;color:#e4e8f2;font-weight:400;}
    .aa-brand b{color:#4a7cff;font-weight:700;}
    .aa-links{display:flex;align-items:center;gap:2px;overflow-x:auto;flex:1;padding:0 8px;scrollbar-width:none;}
    .aa-links::-webkit-scrollbar{display:none;}
    .aa-link{font-size:11px;font-weight:500;color:#6c7a9c;text-decoration:none;padding:6px 10px;border-radius:6px;white-space:nowrap;transition:all 0.15s;}
    .aa-link:hover{background:rgba(255,255,255,0.05);color:#e4e8f2;}
    .aa-link.aa-on{background:rgba(74,124,255,0.12);color:#4a7cff;font-weight:600;}
    .aa-home{font-size:11px;font-weight:600;color:#4a7cff;text-decoration:none;padding:6px 14px;border:1px solid rgba(74,124,255,0.3);border-radius:6px;flex-shrink:0;transition:all 0.15s;}
    .aa-home:hover{background:rgba(74,124,255,0.1);}
    .aa-menu{display:none;background:none;border:none;color:#6c7a9c;cursor:pointer;padding:4px;margin-left:auto;}
    body{padding-top:52px!important;}
    @media(max-width:900px){
      .aa-menu{display:block;}
      .aa-links{display:none;position:absolute;top:48px;left:0;right:0;background:rgba(6,10,18,0.96);border-bottom:1px solid rgba(74,124,255,0.1);flex-direction:column;padding:8px;}
      #aa-nav.open .aa-links{display:flex;}
      .aa-link{padding:10px 14px;width:100%;}
    }
  `;

  document.head.appendChild(style);
  if (document.body.firstChild) document.body.insertBefore(nav, document.body.firstChild);
  else document.body.appendChild(nav);
})();
