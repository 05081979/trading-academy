/* ── ALGORITHMIC ACADEMY — Shared Navigation Bar (Dropdown Categories) ── */
(function() {
  const CATS = [
    { name: 'Formation', items: [
      { id: 'ict-trainer',         label: 'Fondations ICT' },
      { id: 'ict-mentorship',      label: 'ICT Mentorship' },
      { id: 'time-cycles-protocol',label: 'Time Cycles Video' },
      { id: 'ipda-trainer',        label: 'Framework IPDA' },
      { id: 'inducement-theorem',  label: 'Inducement Theorem' },
      { id: 'cycle-trading',        label: 'Cycle Trading Operationnel' },
      { id: 'digital-time-theory',  label: 'Digital Time Theory' },
      { id: 'niveaux-algorithmiques', label: 'Niveaux Algorithmiques' },
      { id: 'ranges-fractals',      label: 'Ranges Fractals' },
    ]},
    { name: 'Protocole', items: [
      { id: 'hub-cours',     label: 'Bibliotheque' },
      { id: 'methodologie',  label: 'Methodologie' },
      { id: 'role-outils',   label: 'Outils Pratiques' },
      { id: 'psychologie',   label: 'Psychologie' },
      { id: 'maitrise-liquidite', label: 'Maitrise de la Liquidite' },
    ]},
    { name: 'Outils', items: [
      { id: 'time-price',      label: 'Calculateur Time x Price' },
      { id: 'calculatrice',    label: 'Calculatrice de Lots' },
      { id: 'financial-juice', label: 'News Live' },
    ]},
    { name: 'Fiches', items: [
      { id: 'fiches-ict',       label: 'Fiches ICT' },
      { id: 'fiches-avancees',  label: 'Fiches Avancees' },
      { id: 'fiches-visuelles', label: 'Fiches Visuelles' },
      { id: 'fiches-catalogue', label: 'Catalogue PDFs' },
    ]},
    { name: 'Indicateurs', items: [
      { id: 'ict-macro-news',          label: 'AA — Macro & News' },
      { id: 'aa-liquidity-inducement', label: 'AA — MS + IDM' },
      { id: 'htf-structure-org',       label: 'AA — HTF Structure & ORG' },
      { id: 'dr-ote-mtf',             label: 'AA — DR OTE MTF' },
      { id: 'qt-cycles',              label: 'AA — QT Cycles' },
    ]},
  ];

  const filename = window.location.pathname.split('/').pop().replace('.html', '');

  const ICON = `<svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" fill="rgba(10,14,26,0.95)" stroke="#4a7cff" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="16" font-weight="800">A</text>
    <ellipse cx="20" cy="18" rx="18" ry="7" fill="none" stroke="#3455a8" stroke-width="0.6" transform="rotate(-25 20 18)" opacity="0.5"/>
    <circle cx="8" cy="14" r="1.5" fill="#4a7cff" opacity="0.7"/>
    <circle cx="32" cy="16" r="1.5" fill="#e05030" opacity="0.7"/>
  </svg>`;

  const ARROW = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-left:4px;"><path d="M1 1l4 4 4-4"/></svg>`;

  function isActive(cat) {
    return cat.items.some(m => m.id === filename);
  }

  function buildDropdowns() {
    return CATS.map(cat => {
      const active = isActive(cat);
      const items = cat.items.map(m =>
        `<a href="${m.id}.html" class="aa-drop-item ${filename === m.id ? 'aa-on' : ''}">${m.label}</a>`
      ).join('');
      return `<div class="aa-dropdown">
        <button class="aa-cat ${active ? 'aa-cat-on' : ''}">${cat.name}${ARROW}</button>
        <div class="aa-drop-menu">${items}</div>
      </div>`;
    }).join('');
  }

  const nav = document.createElement('div');
  nav.id = 'aa-nav';
  nav.innerHTML = `
    <div class="aa-inner">
      <a href="../index.html" class="aa-brand">
        ${ICON}
        <span><b>Algorithmic</b> Academy</span>
      </a>
      <div class="aa-links">
        ${buildDropdowns()}
      </div>
      <a href="../index.html" class="aa-home">Accueil</a>
      <button class="aa-menu" onclick="document.getElementById('aa-nav').classList.toggle('open')">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
      </button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #aa-nav{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(6,10,18,0.92);backdrop-filter:blur(16px);border-bottom:1px solid rgba(74,124,255,0.1);font-family:Inter,system-ui,sans-serif;}
    .aa-inner{display:flex;align-items:center;height:48px;padding:0 16px;gap:6px;}
    .aa-brand{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;}
    .aa-brand span{font-size:13px;color:#e4e8f2;font-weight:400;}
    .aa-brand b{color:#4a7cff;font-weight:700;}
    .aa-links{display:flex;align-items:center;gap:2px;flex:1;padding:0 8px;}
    .aa-dropdown{position:relative;}
    .aa-cat{font-size:12px;font-weight:600;color:#8892ab;background:none;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;display:flex;align-items:center;white-space:nowrap;transition:all 0.15s;}
    .aa-cat:hover{background:rgba(255,255,255,0.06);color:#e4e8f2;}
    .aa-cat-on{color:#4a7cff;}
    .aa-drop-menu{display:none;position:absolute;top:100%;left:0;min-width:220px;background:rgba(12,16,28,0.96);backdrop-filter:blur(20px);border:1px solid rgba(74,124,255,0.15);border-radius:8px;padding:6px;margin-top:4px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:100000;}
    .aa-dropdown:hover .aa-drop-menu{display:block;}
    .aa-drop-item{display:block;font-size:12px;font-weight:500;color:#8892ab;text-decoration:none;padding:8px 14px;border-radius:6px;transition:all 0.15s;white-space:nowrap;}
    .aa-drop-item:hover{background:rgba(74,124,255,0.1);color:#e4e8f2;}
    .aa-drop-item.aa-on{background:rgba(74,124,255,0.12);color:#4a7cff;font-weight:600;}
    .aa-home{font-size:11px;font-weight:600;color:#4a7cff;text-decoration:none;padding:6px 14px;border:1px solid rgba(74,124,255,0.3);border-radius:6px;flex-shrink:0;transition:all 0.15s;}
    .aa-home:hover{background:rgba(74,124,255,0.1);}
    .aa-menu{display:none;background:none;border:none;color:#6c7a9c;cursor:pointer;padding:4px;margin-left:auto;}
    body{padding-top:52px!important;}
    @media(max-width:900px){
      .aa-menu{display:block;}
      .aa-links{display:none;position:absolute;top:48px;left:0;right:0;background:rgba(6,10,18,0.96);border-bottom:1px solid rgba(74,124,255,0.1);flex-direction:column;padding:8px;max-height:80vh;overflow-y:auto;}
      #aa-nav.open .aa-links{display:flex;}
      .aa-dropdown{width:100%;}
      .aa-cat{width:100%;justify-content:space-between;padding:10px 14px;}
      .aa-drop-menu{display:none;position:static;background:rgba(20,24,38,0.8);border:none;box-shadow:none;margin:0 0 4px 12px;padding:4px;}
      .aa-dropdown.mob-open .aa-drop-menu{display:block;}
      .aa-drop-item{padding:8px 14px;}
    }
  `;

  // Mobile: toggle dropdowns on click
  const script = document.createElement('script');
  script.textContent = `
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        var cat = e.target.closest('.aa-cat');
        if (cat) {
          e.preventDefault();
          var dd = cat.closest('.aa-dropdown');
          dd.classList.toggle('mob-open');
        }
      }
    });
  `;

  document.head.appendChild(style);
  if (document.body.firstChild) document.body.insertBefore(nav, document.body.firstChild);
  else document.body.appendChild(nav);
  document.body.appendChild(script);
})();
