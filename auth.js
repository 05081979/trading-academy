/* ── ALGORITHMIC ACADEMY — Authentication Gate (Unique per user) ── */
(function() {
  // Admin password (toi) - ton ancien mot de passe
  const HASH_ADMIN = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49';

  const SESSION_KEY = 'aa_auth_v2';
  const TIER_KEY = 'aa_tier';
  const USER_KEY = 'aa_user';
  const ALLOW_KEY = 'aa_allow';

  // Tokens révoqués par (username + tier) — bloque tous les tokens d'un user (starter/premium/custom)
  const REVOKED = [
    { user: 'elgavacho8421', tier: 'premium' },
    { user: 'elgavacho8421', tier: 'starter' }
  ];
  // Tokens complets révoqués (chaîne exacte AA-X-...) — pour révoquer un Custom précis
  const REVOKED_TOKENS = [
    // Ancien AA-C- de elgavacho8421 avec 2 modules (architecture-niveaux + niveaux-algorithmiques)
    'AA-C-ZWxnYXZhY2hvODQyMXxhcmNoaXRlY3R1cmUtbml2ZWF1eCxuaXZlYXV4LWFsZ29yaXRobWlxdWVz'
  ];
  function isRevoked(username, tier) {
    for (var i = 0; i < REVOKED.length; i++) {
      if (REVOKED[i].user === username && REVOKED[i].tier === tier) return true;
    }
    return false;
  }
  function isRevokedToken(token) {
    for (var i = 0; i < REVOKED_TOKENS.length; i++) {
      if (REVOKED_TOKENS[i] === token) return true;
    }
    return false;
  }

  // Nettoyage ponctuel: invalide les sessions sur l'ancienne clé
  try { sessionStorage.removeItem('aa_auth'); } catch(e) {}

  // Reset de session si ?reset=1 dans l'URL
  if (location.search.indexOf('reset=1') !== -1) {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TIER_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ALLOW_KEY);
    } catch(e) {}
    var cleanUrl = location.pathname;
    location.replace(cleanUrl);
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Decode unique token:
  //   AA-S-<b64(username)>              → Starter (full starter access)
  //   AA-P-<b64(username)>              → Premium (full premium access)
  //   AA-C-<b64(username|slug1,slug2)>  → Custom Premium (partiel - whitelist de slugs)
  function decodeToken(pwd) {
    try {
      if (!pwd.startsWith('AA-')) return null;
      if (isRevokedToken(pwd)) return null; // Token exact révoqué
      var parts = pwd.split('-');
      if (parts.length < 3) return null;
      var tier = parts[1].toLowerCase();
      var encoded = parts.slice(2).join('-');
      var decoded = atob(encoded);
      if (!decoded || decoded.length < 2) return null;

      if (tier === 'c') {
        // Format: username|slug1,slug2,slug3
        var pipe = decoded.indexOf('|');
        if (pipe < 0) return null;
        var username = decoded.slice(0, pipe);
        if (isRevoked(username, 'custom')) return null; // User revoqué pour custom
        var slugs = decoded.slice(pipe + 1).split(',').filter(function(x){ return x.trim().length > 0; });
        return { username: username, tier: 'custom', allow: slugs };
      }
      var t = tier === 'p' ? 'premium' : 'starter';
      if (isRevoked(decoded, t)) return null; // Token révoqué
      return { username: decoded, tier: t, allow: [] };
    } catch(e) { return null; }
  }

  // Helper: page slug depuis l'URL
  function getPageSlug() {
    return (location.pathname.split('/').pop() || '').replace('.html', '');
  }

  // Already logged in?
  var savedAuth = sessionStorage.getItem(SESSION_KEY);
  var savedTier = sessionStorage.getItem(TIER_KEY);
  var savedUser = sessionStorage.getItem(USER_KEY);
  var savedAllow = [];
  try { savedAllow = JSON.parse(sessionStorage.getItem(ALLOW_KEY) || '[]'); } catch(e) {}

  // Si la session active correspond à un token révoqué, on force un relogin
  function forceLogout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TIER_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ALLOW_KEY);
      // Aussi les anciennes clés par précaution
      sessionStorage.removeItem('aa_auth');
      localStorage.removeItem('aa_auth');
      localStorage.removeItem('aa_tier');
      localStorage.removeItem('aa_user');
    } catch(e) {}
  }

  // Si la session correspond à un ancien Custom révoqué (même user + même liste)
  function isRevokedCustomSession(user, tier, allow) {
    if (tier !== 'custom') return false;
    var signature = user + '|' + (allow || []).slice().sort().join(',');
    var REVOKED_CUSTOM_SIG = [
      'elgavacho8421|architecture-niveaux,niveaux-algorithmiques'
    ];
    for (var i = 0; i < REVOKED_CUSTOM_SIG.length; i++) {
      if (REVOKED_CUSTOM_SIG[i] === signature) return true;
    }
    return false;
  }

  if (savedAuth === 'valid' && savedUser && savedTier && (isRevoked(savedUser, savedTier) || isRevokedCustomSession(savedUser, savedTier, savedAllow))) {
    forceLogout();
    location.reload();
    return;
  }

  // Back-forward cache: re-vérifier à chaque retour de page
  window.addEventListener('pageshow', function(e) {
    var t = sessionStorage.getItem(TIER_KEY);
    var u = sessionStorage.getItem(USER_KEY);
    var a = [];
    try { a = JSON.parse(sessionStorage.getItem(ALLOW_KEY) || '[]'); } catch(e2) {}
    if (u && t && (isRevoked(u, t) || isRevokedCustomSession(u, t, a))) {
      forceLogout();
      location.reload();
    }
  });

  if (savedAuth === 'valid' && savedTier && savedUser) {
    window.AA_TIER = savedTier;
    window.AA_USER = savedUser;
    window.AA_ALLOW = savedAllow;

    // Blocage pages tiered — redirection silencieuse
    var pageTier = document.documentElement.getAttribute('data-tier');
    var pageSlug = getPageSlug();
    var denied = false;
    if (pageTier === 'premium') {
      // Premium pages: starter bloqué. Custom: whitelist. Premium/admin OK.
      if (savedTier === 'starter') denied = true;
      if (savedTier === 'custom' && savedAllow.indexOf(pageSlug) === -1) denied = true;
    }
    if (pageTier === 'indicator') {
      // Indicator pages: uniquement Custom (avec slug whitelisté) ou Admin
      if (savedUser === 'Admin') {
        denied = false;
      } else if (savedTier === 'custom' && savedAllow.indexOf(pageSlug) !== -1) {
        denied = false;
      } else {
        denied = true;
      }
    }
    if (denied) {
      // Au lieu d'une redirection silencieuse (confuse pour l'eleve), on affiche un message explicite
      document.documentElement.style.display = 'none';
      window.addEventListener('DOMContentLoaded', function() {
        document.documentElement.style.display = '';
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0;min-height:100vh;background:#f5f7fa;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;padding:20px;';
        var tierLabel = savedTier === 'starter' ? 'Starter' : (savedTier === 'custom' ? 'Custom (acces partiel)' : savedTier);
        var card = document.createElement('div');
        card.style.cssText = 'max-width:520px;background:#fff;border-radius:16px;padding:40px 36px;box-shadow:0 8px 32px rgba(0,0,0,0.08);text-align:center;border:1px solid #e2e5ea;';
        card.innerHTML = '<div style="font-size:48px;margin-bottom:16px;">🔒</div>'
          + '<h1 style="font-family:Syne,sans-serif;font-size:22px;color:#1a1a2e;margin:0 0 12px;">Module non inclus dans ton acces</h1>'
          + '<p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 20px;">Ton acces <strong>' + tierLabel + '</strong> ne comprend pas ce module. '
          + (savedTier === 'custom' ? 'Ton abonnement couvre une selection specifique de modules. Pour debloquer celui-ci, contacte l\'administrateur.' : 'Passe en Premium pour y acceder.')
          + '</p>'
          + '<a href="' + (location.pathname.includes('/modules/') ? 'hub-cours.html' : 'index.html') + '" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">← Retour au hub</a>';
        document.body.appendChild(card);
      });
      return;
    }

    window.addEventListener('DOMContentLoaded', function() { addProtection(savedUser); });
    return;
  }

  // ── NOT LOGGED IN ──
  document.documentElement.style.display = 'none';

  window.addEventListener('DOMContentLoaded', function() {
    document.documentElement.style.display = '';
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;min-height:100vh;background:#f5f7fa;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;overflow:hidden;';

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    function initP() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight; particles = [];
      for (var i = 0; i < 40; i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.2+0.3,dx:(Math.random()-0.5)*0.12,dy:(Math.random()-0.5)*0.08,o:Math.random()*0.15+0.05});
    }
    function drawP() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (var p of particles) { p.x+=p.dx;p.y+=p.dy;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(74,124,255,'+p.o+')';ctx.fill(); }
      requestAnimationFrame(drawP);
    }
    window.addEventListener('resize',initP); initP(); drawP();

    var box = document.createElement('div');
    box.style.cssText = 'position:relative;z-index:1;text-align:center;max-width:420px;padding:40px;';
    box.innerHTML = '<div style="margin-bottom:32px;"><svg viewBox="0 0 400 320" width="180" height="144" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="160" r="155" fill="#eef1f6"/><polygon points="200,105 235,125 235,160 200,180 165,160 165,125" fill="#fff" stroke="#2563eb" stroke-width="2"/><text x="200" y="158" text-anchor="middle" fill="#2563eb" font-family="Inter,sans-serif" font-size="42" font-weight="800">A</text><text x="200" y="226" text-anchor="middle" fill="#111" font-family="Inter,sans-serif" font-size="28" font-weight="800" letter-spacing="3">ALGORITHMIC</text><text x="200" y="250" text-anchor="middle" fill="#2563eb" font-family="Inter,sans-serif" font-size="14" font-weight="600" letter-spacing="8">ACADEMY</text></svg></div><p style="color:#555;font-size:13px;margin-bottom:28px;">Entrez votre code d\'acces personnel.</p><form id="authForm" style="display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto;"><input type="password" id="authPwd" placeholder="Code personnel" autocomplete="off" style="width:100%;padding:14px 18px;background:#fff;border:1px solid #d1d5db;border-radius:10px;color:#000;font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'#2563eb\'" onblur="this.style.borderColor=\'#d1d5db\'"><button type="submit" style="padding:14px;background:#2563eb;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(37,99,235,0.25);" onmouseover="this.style.background=\'#3b82f6\'" onmouseout="this.style.background=\'#2563eb\'">Acceder</button><p id="authErr" style="color:#dc2626;font-size:12px;min-height:18px;"></p></form>';
    document.body.appendChild(box);

    document.getElementById('authPwd').focus();
    document.getElementById('authForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var pwd = document.getElementById('authPwd').value.trim();
      var hash = await sha256(pwd);

      // Admin (toi)
      if (hash === HASH_ADMIN) {
        sessionStorage.setItem(SESSION_KEY, 'valid');
        sessionStorage.setItem(TIER_KEY, 'premium');
        sessionStorage.setItem(USER_KEY, 'Admin');
        sessionStorage.setItem('aa_token', 'AA-P-' + btoa('Admin'));
        location.reload();
        return;
      }

      // Unique token (AA-S-/AA-P-/AA-C-)
      var decoded = decodeToken(pwd);
      if (decoded) {
        sessionStorage.setItem(SESSION_KEY, 'valid');
        sessionStorage.setItem(TIER_KEY, decoded.tier);
        sessionStorage.setItem(USER_KEY, decoded.username);
        sessionStorage.setItem(ALLOW_KEY, JSON.stringify(decoded.allow || []));
        sessionStorage.setItem('aa_token', pwd);
        location.reload();
        return;
      }

      document.getElementById('authErr').textContent = 'Code incorrect.';
      document.getElementById('authPwd').value = '';
      document.getElementById('authPwd').focus();
    });
  });

  // ── PROTECTION: Anti-screenshot (pas de watermark pour Admin) ──
  function addProtection(username) {
    // Admin = pas de watermark, pas de restrictions
    if (username === 'Admin') return;

    // 1. WATERMARK : désactivé (demande utilisateur — pas de filigrane visible)

    // 2. ANTI-SCREENSHOT
    var shield = document.createElement('div');
    shield.id = 'aa-shield';
    shield.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(245,247,250,0.97);display:none;align-items:center;justify-content:center;';
    shield.innerHTML = '<div style="text-align:center;color:#6b7280;font-family:Inter,sans-serif;"><div style="font-size:36px;margin-bottom:16px;">&#x1F6E1;</div><div style="font-size:16px;color:#111;">Contenu protege</div><div style="font-size:12px;margin-top:8px;color:#6b7280;">Revenez sur cette fenetre pour continuer</div></div>';
    document.body.appendChild(shield);

    // Shield avec délai minimum 3s après retour — empêche les outils de capture
    // qui déclenchent brièvement le shield puis le referment trop vite
    var shieldUntil = 0;
    function triggerShield(ms) {
      shield.style.display = 'flex';
      shieldUntil = Math.max(shieldUntil, Date.now() + (ms || 3000));
    }
    function checkShield() {
      if (Date.now() >= shieldUntil) shield.style.display = 'none';
    }
    setInterval(checkShield, 200);
    window.addEventListener('blur', function() { triggerShield(3000); });
    window.addEventListener('focus', function() { /* géré par checkShield */ });
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) triggerShield(3000);
    });
    // Mouseleave disabled (too aggressive — fires when user reads off-screen or checks email)
    // Auto-blur apres 2 minutes d'inactivite (plus permissif)
    var lastActivity = Date.now();
    function markActivity() { lastActivity = Date.now(); document.body.style.filter = ''; }
    ['mousemove','mousedown','keydown','scroll','touchstart'].forEach(function(ev) {
      document.addEventListener(ev, markActivity, { passive: true });
    });
    setInterval(function() {
      if (Date.now() - lastActivity > 120000) {
        document.body.style.filter = 'blur(14px)';
      }
    }, 5000);
    // Bloque impression via CSS (print media = vide total)
    var printStyle = document.createElement('style');
    printStyle.textContent = '@media print { html, body { display: none !important; visibility: hidden !important; } *, *::before, *::after { display: none !important; } }';
    document.head.appendChild(printStyle);
    // Flash le shield au beforeprint aussi
    window.addEventListener('beforeprint', function() { shield.style.display = 'flex'; });

    // 3. Protections clavier (élargies) — laisse la selection dans le widget IA
    document.addEventListener('contextmenu', function(e) {
      // Autorise clic droit dans le widget IA (pour copier/coller)
      if (e.target && e.target.closest && e.target.closest('#aa-tutor-panel')) return;
      e.preventDefault();
    });
    // Bloque selection globale MAIS autorise dans le widget IA via CSS (voir aa-tutor-panel override)
    var protStyle = document.createElement('style');
    protStyle.textContent = 'body { user-select: none; -webkit-user-select: none; } #aa-tutor-panel, #aa-tutor-panel * { user-select: text !important; -webkit-user-select: text !important; }';
    document.head.appendChild(protStyle);
    // Anti PrintScreen: écrase le presse-papier en permanence après PrintScreen
    function overwriteClipboard() {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('-- Contenu protégé : ' + username + ' --').catch(function(){});
        }
      } catch(e) {}
    }
    document.addEventListener('keyup', function(e) {
      if (e.key === 'PrintScreen') {
        e.preventDefault(); triggerShield(4000); overwriteClipboard();
        // Écrase plusieurs fois pour vider même si la capture s'y est mise
        setTimeout(overwriteClipboard, 50);
        setTimeout(overwriteClipboard, 200);
        setTimeout(overwriteClipboard, 500);
      }
    });
    document.addEventListener('keydown', function(e) {
      // Screenshot / capture
      if (e.key === 'PrintScreen') { e.preventDefault(); triggerShield(4000); overwriteClipboard(); }
      // Win+Shift+S (Snipping Tool Windows)
      if (e.shiftKey && (e.key === 'S' || e.key === 's') && (e.metaKey || e.getModifierState('Meta'))) { e.preventDefault(); triggerShield(4000); }
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); triggerShield(4000); }
      // Cmd+Shift+3/4/5 (Mac)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) { e.preventDefault(); triggerShield(4000); }
      // Save / Print
      if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); triggerShield(2000); }
      if (e.metaKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); triggerShield(2000); }
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) e.preventDefault();
      if (e.metaKey && (e.key === 's' || e.key === 'S')) e.preventDefault();
      // Devtools
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) e.preventDefault();
      if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) e.preventDefault();
      // View source
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) e.preventDefault();
      if (e.metaKey && (e.key === 'u' || e.key === 'U')) e.preventDefault();
      // Select all (empêche copier-coller du texte) — autorise dans widget IA
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        if (e.target && e.target.closest && e.target.closest('#aa-tutor-panel')) return;
        e.preventDefault();
      }
    });
    // Anti-copy via événement clipboard — autorise copie depuis le widget IA
    document.addEventListener('copy', function(e) {
      if (e.target && e.target.closest && e.target.closest('#aa-tutor-panel')) return;
      e.preventDefault(); overwriteClipboard();
    });
    document.addEventListener('cut', function(e) {
      if (e.target && e.target.closest && e.target.closest('#aa-tutor-panel')) return;
      e.preventDefault();
    });
    // Détection devtools ouverte via taille fenêtre — shield activé
    var devtoolsCheck = setInterval(function() {
      var threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        shield.style.display = 'flex';
      }
    }, 1000);
  }
})();
