/* ═══════════════════════════════════════════════════════════
   ALGORITHMIC ACADEMY — Bootcamp Bar
   Injecte automatiquement en haut de chaque module formation:
   - En-tête Bootcamp (icône bleue + titre + progression)
   - Barre 4 boutons (Précédent / Marquer vu / Suivant / Synthèse)
   - Progression persistée en localStorage (clé "aa-progress")
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Séquence des modules de formation (ordre pédagogique)
  const SEQUENCE = [
    { id: 'fondamentaux-smc',      label: 'Les Bases SMC',                     cat: 'Fondations' },
    { id: 'comprendre-liquidite',  label: 'Comprendre la Liquidité',           cat: 'Fondations' },
    { id: 'inducement-theorem',    label: 'Pièges & Inducements',              cat: 'Fondations' },
    { id: 'fiches-reference',      label: 'Fiches de Référence',               cat: 'Fondations' },
    { id: 'zones-de-prix',         label: 'Zones de Prix & Dealing Ranges',    cat: 'Structure' },
    { id: 'candle-range-theory',   label: 'Bougies, Ranges & Profils',         cat: 'Structure' },
    { id: 'ranges-fractals',       label: 'Ranges & Fractales',                cat: 'Structure' },
    { id: 'analyse-mtf-avancee',   label: 'Analyse Multi-Timeframe',           cat: 'Structure' },
    { id: 'sessions-killzones',    label: 'Sessions, Killzones & Macros',      cat: 'Temps' },
    { id: 'cycles-temporels',      label: 'Cycles Temporels & GB Time',        cat: 'Temps' },
    { id: 'digital-time-theory',   label: 'Théorie du Temps Numérique',        cat: 'Temps' },
    { id: 'temps-prix-protocole',  label: 'Temps & Prix — Protocole',          cat: 'Temps' },
    { id: 'sequences-fractales',   label: 'Séquences & Fractales',             cat: 'Temps' },
    { id: 'architecture-niveaux',  label: 'Architecture des Niveaux',          cat: 'Architecture' },
    { id: 'niveaux-algorithmiques',label: 'Niveaux Algorithmiques',            cat: 'Architecture' },
    { id: 'ipda-trainer',          label: 'Algorithme de Livraison du Prix',   cat: 'Architecture' },
    { id: 'modeles-de-marche',     label: 'Modèles de Marché',                 cat: 'Exécution' },
    { id: 'protocole-trading',     label: 'Protocole Complet',                 cat: 'Exécution' },
    { id: 'modeles-execution',     label: 'Playbooks & Modèles',               cat: 'Exécution' },
    { id: 'strategie-entree',      label: "Stratégies d'Entrée",               cat: 'Exécution' },
    { id: 'execution-avancee',     label: 'Exécution Avancée',                 cat: 'Exécution' },
    { id: 'execution-live-series', label: 'Sessions Live',                     cat: 'Exécution' },
    { id: 'etudes-de-cas',         label: 'Études de Cas',                     cat: 'Exécution' },
  ];

  const filename = window.location.pathname.split('/').pop().replace('.html', '');
  const idx = SEQUENCE.findIndex(m => m.id === filename);
  if (idx === -1) return; // Page non-formation, on n'injecte rien

  const total = SEQUENCE.length;
  const current = SEQUENCE[idx];
  const prev = idx > 0 ? SEQUENCE[idx - 1] : null;
  const next = idx < total - 1 ? SEQUENCE[idx + 1] : null;

  // Lecture progression
  function getProgress() {
    try { return JSON.parse(localStorage.getItem('aa-progress') || '{}'); }
    catch { return {}; }
  }
  function setProgress(p) {
    try { localStorage.setItem('aa-progress', JSON.stringify(p)); } catch {}
  }
  const progress = getProgress();
  const doneCount = SEQUENCE.filter(m => progress[m.id]).length;
  const pct = Math.round((doneCount / total) * 100);
  const isDone = !!progress[current.id];

  // Injection CSS (scoppé .bcb-*)
  const css = `
    .bcb-wrap { max-width: 1100px; margin: 0 auto; padding: 20px 20px 0; font-family: 'Inter', system-ui, sans-serif; }
    .bcb-header { display:flex; align-items:center; gap:14px; padding:18px 22px; background:#ffffff; border:1px solid #e2e5ea; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.04); margin-bottom:16px; }
    .bcb-icon { flex:0 0 44px; width:44px; height:44px; background:#2563eb; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; box-shadow:0 4px 16px rgba(37,99,235,0.35); }
    .bcb-titles { flex:1; min-width:0; }
    .bcb-titles h2 { font-size:16px; font-weight:700; color:#0f172a; margin:0 0 4px; line-height:1.3; font-family:inherit; }
    .bcb-sub { font-size:13px; color:#64748b; }
    .bcb-sub .sep { color:#cbd5e1; margin:0 6px; }
    .bcb-badge { display:inline-flex; align-items:center; gap:6px; padding:3px 10px; background:rgba(37,99,235,0.08); color:#2563eb; border-radius:20px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; }
    .bcb-btn-row { display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:20px; }
    .bcb-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:13px 20px; border:none; border-radius:10px; font-family:inherit; font-size:14px; font-weight:600; color:#fff; text-decoration:none; cursor:pointer; transition:transform .15s, filter .15s, box-shadow .15s; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
    .bcb-btn:hover { transform:translateY(-1px); filter:brightness(1.08); box-shadow:0 4px 16px rgba(0,0,0,0.18); }
    .bcb-btn[disabled], .bcb-btn.is-disabled { opacity:0.5; cursor:not-allowed; pointer-events:none; }
    .bcb-btn-prev { background:#e5e7eb; color:#64748b; }
    .bcb-btn-done { background:linear-gradient(90deg,#2fd67c 0%,#0ea89a 100%); }
    .bcb-btn-done.is-active { background:linear-gradient(90deg,#64748b,#475569); }
    .bcb-btn-next { background:linear-gradient(90deg,#0a8da3 0%,#127895 100%); }
    .bcb-btn-synth { background:linear-gradient(90deg,#9844e0 0%,#ee4d9a 100%); }
    @media (min-width: 720px) {
      .bcb-btn-row { grid-template-columns: 1fr 1.2fr 1fr; grid-template-areas: "prev done next" "synth synth synth"; }
      .bcb-btn-prev { grid-area: prev; }
      .bcb-btn-done { grid-area: done; }
      .bcb-btn-next { grid-area: next; }
      .bcb-btn-synth { grid-area: synth; }
    }
    .bcb-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#0f172a; color:#fff; padding:12px 20px; border-radius:8px; font-size:13px; font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:99998; opacity:0; transition:opacity .3s; pointer-events:none; }
    .bcb-toast.show { opacity:1; }
    /* ── Modale Synthèse ── */
    .bcb-modal { position:fixed; inset:0; background:rgba(15,23,42,0.55); backdrop-filter:blur(4px); z-index:99997; display:none; align-items:center; justify-content:center; padding:20px; }
    .bcb-modal.show { display:flex; }
    .bcb-modal-box { width:100%; max-width:640px; background:#ffffff; border-radius:14px; box-shadow:0 24px 64px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:90vh; }
    .bcb-modal-head { padding:18px 22px; background:linear-gradient(90deg,#9844e0 0%,#ee4d9a 100%); color:#fff; display:flex; align-items:center; justify-content:space-between; }
    .bcb-modal-head h3 { margin:0; font-size:16px; font-weight:700; font-family:inherit; }
    .bcb-modal-close { background:rgba(255,255,255,0.2); border:none; color:#fff; width:30px; height:30px; border-radius:8px; cursor:pointer; font-size:16px; line-height:1; }
    .bcb-modal-close:hover { background:rgba(255,255,255,0.32); }
    .bcb-modal-body { padding:20px 22px; overflow-y:auto; }
    .bcb-modal-label { display:block; font-size:12px; font-weight:600; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em; }
    .bcb-modal-textarea { width:100%; min-height:180px; padding:14px; border:1px solid #e2e5ea; border-radius:10px; font-family:inherit; font-size:14px; line-height:1.6; color:#0f172a; resize:vertical; outline:none; transition:border-color .15s; }
    .bcb-modal-textarea:focus { border-color:#9844e0; }
    .bcb-modal-foot { padding:14px 22px; border-top:1px solid #e2e5ea; display:flex; gap:10px; justify-content:flex-end; }
    .bcb-modal-btn { padding:10px 18px; border-radius:8px; border:none; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:filter .15s; }
    .bcb-modal-btn:hover { filter:brightness(1.08); }
    .bcb-modal-btn.ghost { background:#f1f5f9; color:#475569; }
    .bcb-modal-btn.primary { background:linear-gradient(90deg,#9844e0 0%,#ee4d9a 100%); color:#fff; box-shadow:0 2px 8px rgba(152,68,224,0.3); }
    .bcb-syntheses-list { margin-top:18px; padding-top:18px; border-top:1px dashed #e2e5ea; }
    .bcb-syntheses-list h4 { margin:0 0 10px; font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.04em; }
    .bcb-synth-item { background:#f8fafc; border:1px solid #e2e5ea; border-radius:8px; padding:10px 12px; margin-bottom:8px; font-size:13px; color:#0f172a; position:relative; }
    .bcb-synth-date { font-size:11px; color:#94a3b8; margin-bottom:4px; }
    .bcb-synth-del { position:absolute; top:8px; right:8px; background:none; border:none; color:#cbd5e1; cursor:pointer; font-size:14px; line-height:1; padding:2px 6px; border-radius:4px; }
    .bcb-synth-del:hover { background:#fee2e2; color:#dc2626; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Construction HTML
  const wrap = document.createElement('div');
  wrap.className = 'bcb-wrap';
  wrap.innerHTML = `
    <div class="bcb-header">
      <div class="bcb-icon">☰</div>
      <div class="bcb-titles">
        <h2><span class="bcb-badge">${current.cat}</span>&nbsp; ${current.label}</h2>
        <div class="bcb-sub">
          <span>Module ${idx + 1} sur ${total}</span>
          <span class="sep">•</span>
          <span>${pct}% terminé (${doneCount}/${total})</span>
        </div>
      </div>
    </div>
    <div class="bcb-btn-row">
      ${prev
        ? `<a class="bcb-btn bcb-btn-prev" href="${prev.id}.html">◁ Précédent</a>`
        : `<button class="bcb-btn bcb-btn-prev is-disabled" disabled>◁ Précédent</button>`}
      <button class="bcb-btn bcb-btn-done ${isDone ? 'is-active' : ''}" id="bcbDone">
        ${isDone ? '✓ Marqué comme vu' : 'Marquer comme vu'}
      </button>
      ${next
        ? `<a class="bcb-btn bcb-btn-next" href="${next.id}.html">Suivant ▷</a>`
        : `<button class="bcb-btn bcb-btn-next is-disabled" disabled>Suivant ▷</button>`}
      <button class="bcb-btn bcb-btn-synth" id="bcbSynth">📖 Déposer une Synthèse</button>
    </div>
  `;

  // Insère dans la zone de contenu principal (évite le chevauchement avec sidebar)
  function inject() {
    // Essaye de trouver le conteneur de contenu principal (hors sidebar)
    const candidates = [
      'main', '[role="main"]',
      '.main-content', '.main', '.content-main', '.content-wrap', '.content',
      '.viewer-content', '.lesson', '.lesson-content', '.module-content',
      'article', '.article', '.page-content', '.container'
    ];
    let host = null;
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.offsetWidth > 400) { host = el; break; }
    }
    if (host) {
      host.insertBefore(wrap, host.firstChild);
      return;
    }
    // Fallback: après le nav du haut, mais largeur auto pour éviter chevauchement
    wrap.style.position = 'relative';
    wrap.style.zIndex = '10';
    const nav = document.getElementById('aa-nav');
    if (nav && nav.nextSibling) document.body.insertBefore(wrap, nav.nextSibling);
    else if (document.body.firstChild) document.body.insertBefore(wrap, document.body.firstChild);
    else document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // Toast helper
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'bcb-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
  }

  // ── Gestion des synthèses ──
  function getSyntheses() {
    try { return JSON.parse(localStorage.getItem('aa-syntheses') || '{}'); }
    catch { return {}; }
  }
  function setSyntheses(s) {
    try { localStorage.setItem('aa-syntheses', JSON.stringify(s)); } catch {}
  }
  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  function openSynthModal() {
    const all = getSyntheses();
    const list = all[current.id] || [];
    const listHtml = list.length
      ? list.map((it, i) => `
          <div class="bcb-synth-item">
            <button class="bcb-synth-del" data-i="${i}" title="Supprimer">✕</button>
            <div class="bcb-synth-date">${formatDate(it.at)}</div>
            <div>${it.text.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
          </div>`).join('')
      : '<div style="color:#94a3b8;font-size:13px;font-style:italic;">Aucune synthèse pour ce module.</div>';

    const modal = document.createElement('div');
    modal.className = 'bcb-modal show';
    modal.innerHTML = `
      <div class="bcb-modal-box">
        <div class="bcb-modal-head">
          <h3>📖 Synthèse — ${current.label}</h3>
          <button class="bcb-modal-close" id="bcbClose">✕</button>
        </div>
        <div class="bcb-modal-body">
          <label class="bcb-modal-label">Ta synthèse du module</label>
          <textarea class="bcb-modal-textarea" id="bcbTxt" placeholder="Ce que tu retiens, les concepts clés, tes questions, tes observations..."></textarea>
          <div class="bcb-syntheses-list">
            <h4>Synthèses précédentes (${list.length})</h4>
            <div id="bcbList">${listHtml}</div>
          </div>
        </div>
        <div class="bcb-modal-foot">
          <button class="bcb-modal-btn ghost" id="bcbCancel">Fermer</button>
          <button class="bcb-modal-btn primary" id="bcbSave">Enregistrer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('#bcbTxt').focus(), 50);

    const close = () => modal.remove();
    modal.querySelector('#bcbClose').onclick = close;
    modal.querySelector('#bcbCancel').onclick = close;
    modal.onclick = (ev) => { if (ev.target === modal) close(); };

    modal.querySelector('#bcbSave').onclick = () => {
      const txt = modal.querySelector('#bcbTxt').value.trim();
      if (!txt) { toast('Écris ta synthèse avant de sauvegarder'); return; }
      const all2 = getSyntheses();
      if (!all2[current.id]) all2[current.id] = [];
      all2[current.id].unshift({ text: txt, at: Date.now() });
      setSyntheses(all2);
      toast('Synthèse enregistrée ✓');
      close();
    };

    modal.querySelector('#bcbList').onclick = (ev) => {
      const del = ev.target.closest('.bcb-synth-del');
      if (!del) return;
      const i = parseInt(del.dataset.i, 10);
      const all2 = getSyntheses();
      if (all2[current.id]) {
        all2[current.id].splice(i, 1);
        setSyntheses(all2);
      }
      close();
      openSynthModal();
    };
  }

  // Bouton "Marquer comme vu"
  document.addEventListener('click', function (e) {
    if (e.target.closest('#bcbSynth')) { openSynthModal(); return; }
    const btn = e.target.closest('#bcbDone');
    if (!btn) return;
    const p = getProgress();
    if (p[current.id]) {
      delete p[current.id];
      setProgress(p);
      btn.classList.remove('is-active');
      btn.innerHTML = 'Marquer comme vu';
      toast('Module retiré des vus');
    } else {
      p[current.id] = { at: Date.now() };
      setProgress(p);
      btn.classList.add('is-active');
      btn.innerHTML = '✓ Marqué comme vu';
      toast('Module marqué comme vu ✓');
    }
  });
})();
