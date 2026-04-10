/* ── ALGORITHMIC ACADEMY — Authentication Gate (Unique per user) ── */
(function() {
  // Admin password (toi) - ton ancien mot de passe
  const HASH_ADMIN = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49';

  const SESSION_KEY = 'aa_auth';
  const TIER_KEY = 'aa_tier';
  const USER_KEY = 'aa_user';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Decode unique token: AA-TIER-base64(username)
  function decodeToken(pwd) {
    try {
      if (!pwd.startsWith('AA-')) return null;
      var parts = pwd.split('-');
      if (parts.length < 3) return null;
      var tier = parts[1].toLowerCase(); // S or P
      var encoded = parts.slice(2).join('-');
      var username = atob(encoded);
      if (!username || username.length < 2) return null;
      var t = tier === 'p' ? 'premium' : 'starter';
      return { username: username, tier: t };
    } catch(e) { return null; }
  }

  // Already logged in?
  var savedAuth = sessionStorage.getItem(SESSION_KEY);
  var savedTier = sessionStorage.getItem(TIER_KEY);
  var savedUser = sessionStorage.getItem(USER_KEY);

  if (savedAuth === 'valid' && savedTier && savedUser) {
    window.AA_TIER = savedTier;
    window.AA_USER = savedUser;

    // Block starter from premium pages
    var pageTier = document.documentElement.getAttribute('data-tier');
    if (pageTier === 'premium' && savedTier === 'starter') {
      document.documentElement.style.display = 'none';
      window.addEventListener('DOMContentLoaded', function() {
        document.documentElement.style.display = '';
        document.body.innerHTML = '';
        document.body.style.cssText = 'margin:0;min-height:100vh;background:#060a12;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;';
        var box = document.createElement('div');
        box.style.cssText = 'text-align:center;padding:60px 40px;max-width:500px;';
        box.innerHTML = '<div style="font-size:64px;margin-bottom:20px;">🔒</div><h2 style="color:#e4e8f2;font-size:24px;margin-bottom:12px;">Contenu Premium</h2><p style="color:#6c7a9c;font-size:14px;line-height:1.7;margin-bottom:24px;">Ce cours est reserve aux membres <span style="color:#c9a84c;font-weight:700;">Premium</span>.<br>Ton abonnement actuel est <span style="color:#2ec974;font-weight:700;">Starter</span>.</p><a href="hub-cours.html" style="display:inline-block;padding:12px 28px;background:#4a7cff;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Retour au Hub</a>';
        document.body.appendChild(box);
      });
      return;
    }

    // Add watermark + anti-screenshot after DOM loads
    window.addEventListener('DOMContentLoaded', function() { addProtection(savedUser); });
    return;
  }

  // ── NOT LOGGED IN ──
  document.documentElement.style.display = 'none';

  window.addEventListener('DOMContentLoaded', function() {
    document.documentElement.style.display = '';
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;min-height:100vh;background:#060a12;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;overflow:hidden;';

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    function initP() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight; particles = [];
      for (var i = 0; i < 80; i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.2+0.3,dx:(Math.random()-0.5)*0.12,dy:(Math.random()-0.5)*0.08,o:Math.random()*0.4+0.1});
    }
    function drawP() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (var p of particles) { p.x+=p.dx;p.y+=p.dy;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(74,124,255,'+p.o+')';ctx.fill(); }
      requestAnimationFrame(drawP);
    }
    window.addEventListener('resize',initP); initP(); drawP();

    var box = document.createElement('div');
    box.style.cssText = 'position:relative;z-index:1;text-align:center;max-width:420px;padding:40px;';
    box.innerHTML = '<div style="margin-bottom:32px;"><svg viewBox="0 0 400 320" width="180" height="144" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="160" r="155" fill="#0a0e1a"/><polygon points="200,105 235,125 235,160 200,180 165,160 165,125" fill="rgba(15,25,50,0.9)" stroke="#3455a8" stroke-width="2"/><text x="200" y="158" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="42" font-weight="800" opacity="0.9">A</text><text x="200" y="226" text-anchor="middle" fill="#e4e8f2" font-family="Inter,sans-serif" font-size="28" font-weight="800" letter-spacing="3">ALGORITHMIC</text><text x="200" y="250" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="14" font-weight="600" letter-spacing="8">ACADEMY</text></svg></div><p style="color:#6c7a9c;font-size:13px;margin-bottom:28px;">Entrez votre code d\'acces personnel.</p><form id="authForm" style="display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto;"><input type="password" id="authPwd" placeholder="Code personnel" autocomplete="off" style="width:100%;padding:14px 18px;background:rgba(74,124,255,0.04);border:1px solid #162040;border-radius:10px;color:#e4e8f2;font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'#4a7cff\'" onblur="this.style.borderColor=\'#162040\'"><button type="submit" style="padding:14px;background:#4a7cff;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(74,124,255,0.25);" onmouseover="this.style.background=\'#6b9aff\'" onmouseout="this.style.background=\'#4a7cff\'">Acceder</button><p id="authErr" style="color:#e05030;font-size:12px;min-height:18px;"></p></form>';
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

      // Unique token (AA-S-base64 or AA-P-base64)
      var decoded = decodeToken(pwd);
      if (decoded) {
        sessionStorage.setItem(SESSION_KEY, 'valid');
        sessionStorage.setItem(TIER_KEY, decoded.tier);
        sessionStorage.setItem(USER_KEY, decoded.username);
        location.reload();
        return;
      }

      document.getElementById('authErr').textContent = 'Code incorrect.';
      document.getElementById('authPwd').value = '';
      document.getElementById('authPwd').focus();
    });
  });

  // ── PROTECTION: Watermark + Anti-screenshot ──
  function addProtection(username) {
    // 1. WATERMARK - diagonal text across the page
    var wm = document.createElement('div');
    wm.id = 'aa-watermark';
    wm.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden;';
    var wmText = '';
    for (var i = 0; i < 30; i++) {
      wmText += '<div style="white-space:nowrap;transform:rotate(-25deg);color:rgba(255,255,255,0.03);font-size:14px;font-family:monospace;letter-spacing:4px;line-height:60px;margin-left:' + ((i%3)*-100) + 'px;">';
      for (var j = 0; j < 8; j++) {
        wmText += username + ' &nbsp;&nbsp;&nbsp; ';
      }
      wmText += '</div>';
    }
    wm.innerHTML = wmText;
    document.body.appendChild(wm);

    // 2. ANTI-SCREENSHOT - blur when window loses focus
    var shield = document.createElement('div');
    shield.id = 'aa-shield';
    shield.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(6,10,18,0.97);display:none;align-items:center;justify-content:center;';
    shield.innerHTML = '<div style="text-align:center;color:#4a5568;font-family:Inter,sans-serif;"><div style="font-size:48px;margin-bottom:16px;">🛡️</div><div style="font-size:16px;">Contenu protege</div><div style="font-size:12px;margin-top:8px;">Revenez sur cette fenetre pour continuer</div></div>';
    document.body.appendChild(shield);

    window.addEventListener('blur', function() {
      shield.style.display = 'flex';
    });
    window.addEventListener('focus', function() {
      shield.style.display = 'none';
    });

    // 3. DISABLE right-click
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    // 4. DISABLE text selection on content
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // 5. DISABLE common screenshot shortcuts
    document.addEventListener('keydown', function(e) {
      // PrintScreen
      if (e.key === 'PrintScreen') { e.preventDefault(); shield.style.display = 'flex'; }
      // Ctrl+Shift+S (Windows screenshot)
      if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); }
      // Ctrl+P (print)
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); }
      // Ctrl+S (save)
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); }
      // F12 (dev tools)
      if (e.key === 'F12') { e.preventDefault(); }
      // Ctrl+Shift+I (dev tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') { e.preventDefault(); }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); }
    });
  }
})();
