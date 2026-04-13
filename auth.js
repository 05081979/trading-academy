/* ── ALGORITHMIC ACADEMY — Authentication Gate (Unique per user) ── */
(function() {
  // Admin password (toi) - ton ancien mot de passe
  const HASH_ADMIN = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49';

  const SESSION_KEY = 'aa_auth';
  const TIER_KEY = 'aa_tier';
  const USER_KEY = 'aa_user';
  const ALLOW_KEY = 'aa_allow';

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
        var slugs = decoded.slice(pipe + 1).split(',').filter(function(x){ return x.trim().length > 0; });
        return { username: username, tier: 'custom', allow: slugs };
      }
      var t = tier === 'p' ? 'premium' : 'starter';
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
      var redirect = location.pathname.includes('/modules/') ? 'hub-cours.html' : 'index.html';
      location.replace(redirect);
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

    // 1. WATERMARK ultra-discret (uniquement pour les eleves)
    var wm = document.createElement('div');
    wm.id = 'aa-watermark';
    wm.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden;opacity:0.02;';
    var wmText = '';
    for (var i = 0; i < 15; i++) {
      wmText += '<div style="white-space:nowrap;transform:rotate(-25deg);color:#000;font-size:11px;font-family:monospace;letter-spacing:6px;line-height:100px;margin-left:' + ((i%3)*-100) + 'px;">';
      for (var j = 0; j < 5; j++) {
        wmText += username + ' &nbsp;&nbsp;&nbsp;&nbsp; ';
      }
      wmText += '</div>';
    }
    wm.innerHTML = wmText;
    document.body.appendChild(wm);

    // 2. ANTI-SCREENSHOT
    var shield = document.createElement('div');
    shield.id = 'aa-shield';
    shield.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(245,247,250,0.97);display:none;align-items:center;justify-content:center;';
    shield.innerHTML = '<div style="text-align:center;color:#6b7280;font-family:Inter,sans-serif;"><div style="font-size:36px;margin-bottom:16px;">&#x1F6E1;</div><div style="font-size:16px;color:#111;">Contenu protege</div><div style="font-size:12px;margin-top:8px;color:#6b7280;">Revenez sur cette fenetre pour continuer</div></div>';
    document.body.appendChild(shield);

    window.addEventListener('blur', function() { shield.style.display = 'flex'; });
    window.addEventListener('focus', function() { shield.style.display = 'none'; });

    // 3. Protections clavier
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.addEventListener('keydown', function(e) {
      if (e.key === 'PrintScreen') { e.preventDefault(); shield.style.display = 'flex'; }
      if (e.ctrlKey && e.shiftKey && e.key === 'S') e.preventDefault();
      if (e.ctrlKey && e.key === 'p') e.preventDefault();
      if (e.ctrlKey && e.key === 's') e.preventDefault();
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
    });
  }
})();
