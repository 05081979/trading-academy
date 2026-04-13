/* ── ALGORITHMIC ACADEMY — Shared Navigation Bar (Dropdown Categories) ── */
(function() {
  const CATS = [
    { name: 'Fondations', items: [
      { id: 'fondamentaux-smc',     label: 'Les Bases SMC' },
      { id: 'comprendre-liquidite', label: 'Comprendre la Liquidite' },
      { id: 'inducement-theorem',   label: 'Pieges & Inducements' },
      { id: 'fiches-reference',     label: 'Fiches de Reference' },
    ]},
    { name: 'Structure du Prix', items: [
      { id: 'zones-de-prix',       label: 'Zones de Prix & Dealing Ranges' },
      { id: 'candle-range-theory',  label: 'Bougies, Ranges & Profils' },
      { id: 'ranges-fractals',     label: 'Ranges & Fractales' },
      { id: 'analyse-mtf-avancee', label: 'Analyse Multi-Timeframe' },
    ]},
    { name: 'Temps & Cycles', items: [
      { id: 'sessions-killzones',  label: 'Sessions, Killzones & Macros' },
      { id: 'cycles-temporels',    label: 'Cycles Temporels' },
      { id: 'digital-time-theory', label: 'Theorie du Temps Numerique' },
      { id: 'temps-prix-protocole',label: 'Temps & Prix — Protocole' },
      { id: 'sequences-fractales', label: 'Sequences & Fractales' },
    ]},
    { name: 'Architecture', items: [
      { id: 'architecture-niveaux',    label: 'Architecture des Niveaux' },
      { id: 'niveaux-algorithmiques',  label: 'Niveaux Algorithmiques' },
      { id: 'gb-time',                 label: 'GB Time', href: 'cycles-temporels.html#gb-time' },
      { id: 'ipda-trainer',            label: 'Algorithme de Livraison du Prix' },
    ]},
    { name: 'Execution', items: [
      { id: 'hub-cours',           label: 'Bibliotheque des Cours' },
      { id: 'modeles-de-marche',   label: 'Modeles de Marche' },
      { id: 'protocole-trading',   label: 'Protocole Complet' },
      { id: 'modeles-execution',   label: 'Playbooks & Modeles' },
      { id: 'strategie-entree',    label: 'Strategies d\'Entree' },
      { id: 'execution-avancee',   label: 'Execution Avancee' },
      { id: 'execution-live-series',label: 'Sessions Live' },
      { id: 'etudes-de-cas',       label: 'Etudes de Cas' },
    ]},
    { name: 'Psychologie', items: [
      { id: 'psychologie-trader',  label: 'Psychologie du Trader' },
    ]},
    { name: 'Outils', items: [
      { id: 'trainer-interactif',  label: 'Trainer Interactif' },
      { id: 'role-outils',        label: 'Role de Chaque Outil' },
      { id: 'calculatrice',       label: 'Calculatrice de Position' },
      { id: 'journal-trading',    label: 'Journal de Trading' },
      { id: 'financial-juice',    label: 'News en Direct' },
      { id: 'macros-annonces',    label: 'Macros & Annonces' },
      { id: 'index-cours',        label: 'Index des Cours' },
    ]},
  ];

  const filename = window.location.pathname.split('/').pop().replace('.html', '');

  const ICON = `<svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" fill="rgba(245,247,250,0.95)" stroke="#2563eb" stroke-width="1.5"/>
    <text x="20" y="24" text-anchor="middle" fill="#2563eb" font-family="Inter,sans-serif" font-size="16" font-weight="800">A</text>
    <ellipse cx="20" cy="18" rx="18" ry="7" fill="none" stroke="#93b4f0" stroke-width="0.6" transform="rotate(-25 20 18)" opacity="0.4"/>
    <circle cx="8" cy="14" r="1.5" fill="#2563eb" opacity="0.6"/>
    <circle cx="32" cy="16" r="1.5" fill="#d97706" opacity="0.6"/>
  </svg>`;

  const ARROW = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-left:4px;"><path d="M1 1l4 4 4-4"/></svg>`;

  function isActive(cat) {
    return cat.items.some(m => m.id === filename);
  }

  function buildDropdowns() {
    return CATS.map(cat => {
      const active = isActive(cat);
      const items = cat.items.map(m => {
        const href = m.href || (m.id + '.html');
        return `<a href="${href}" class="aa-drop-item ${filename === m.id ? 'aa-on' : ''}">${m.label}</a>`;
      }).join('');
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
    #aa-nav{position:fixed;top:0;left:0;right:0;z-index:99999;background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);border-bottom:1px solid #e5e7eb;font-family:Inter,system-ui,sans-serif;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
    .aa-inner{display:flex;align-items:center;height:48px;padding:0 16px;gap:6px;}
    .aa-brand{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;}
    .aa-brand span{font-size:13px;color:#1a1a2e;font-weight:400;}
    .aa-brand b{color:#2563eb;font-weight:700;}
    .aa-links{display:flex;align-items:center;gap:2px;flex:1;padding:0 8px;}
    .aa-dropdown{position:relative;}
    .aa-cat{font-size:12px;font-weight:600;color:#6b7280;background:none;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;display:flex;align-items:center;white-space:nowrap;transition:all 0.15s;}
    .aa-cat:hover{background:rgba(37,99,235,0.06);color:#1a1a2e;}
    .aa-cat-on{color:#2563eb;}
    .aa-drop-menu{display:none;position:absolute;top:100%;left:0;min-width:220px;background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);border:1px solid #e5e7eb;border-radius:8px;padding:6px;margin-top:4px;box-shadow:0 8px 32px rgba(0,0,0,0.1);z-index:100000;}
    .aa-dropdown:hover .aa-drop-menu{display:block;}
    .aa-drop-item{display:block;font-size:12px;font-weight:500;color:#6b7280;text-decoration:none;padding:8px 14px;border-radius:6px;transition:all 0.15s;white-space:nowrap;}
    .aa-drop-item:hover{background:rgba(37,99,235,0.06);color:#1a1a2e;}
    .aa-drop-item.aa-on{background:rgba(37,99,235,0.08);color:#2563eb;font-weight:600;}
    .aa-home{font-size:11px;font-weight:600;color:#2563eb;text-decoration:none;padding:6px 14px;border:1px solid rgba(37,99,235,0.3);border-radius:6px;flex-shrink:0;transition:all 0.15s;}
    .aa-home:hover{background:rgba(37,99,235,0.06);}
    .aa-menu{display:none;background:none;border:none;color:#6b7280;cursor:pointer;padding:4px;margin-left:auto;}
    body{padding-top:52px!important;}
    @media(max-width:900px){
      .aa-menu{display:block;}
      .aa-links{display:none;position:absolute;top:48px;left:0;right:0;background:rgba(255,255,255,0.98);border-bottom:1px solid #e5e7eb;flex-direction:column;padding:8px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.08);}
      #aa-nav.open .aa-links{display:flex;}
      .aa-dropdown{width:100%;}
      .aa-cat{width:100%;justify-content:space-between;padding:10px 14px;}
      .aa-drop-menu{display:none;position:static;background:rgba(245,247,250,0.95);border:none;box-shadow:none;margin:0 0 4px 12px;padding:4px;}
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
