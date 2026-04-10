/* ── ALGORITHMIC ACADEMY — Authentication Gate (Starter / Premium) ── */
(function() {
  const HASH_STARTER = '6b64024fbc826d7d0e658aea20266a65bcf2a1f9a44f322674856692db4d9656'; // Algorithmic
  const HASH_PREMIUM = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49'; // ton ancien mdp

  const SESSION_KEY = 'aa_auth';
  const TIER_KEY = 'aa_tier';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Check if already logged in
  var savedHash = sessionStorage.getItem(SESSION_KEY);
  var savedTier = sessionStorage.getItem(TIER_KEY);

  if (savedHash === HASH_PREMIUM || savedHash === HASH_STARTER) {
    window.AA_TIER = savedTier || 'starter';
    // Block starter from premium pages
    var pageTier = document.documentElement.getAttribute('data-tier');
    if (pageTier === 'premium' && window.AA_TIER === 'starter') {
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
    return;
  }

  // Not logged in - show login screen
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
    box.innerHTML = '<div style="margin-bottom:32px;"><svg viewBox="0 0 400 320" width="180" height="144" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="160" r="155" fill="#0a0e1a"/><circle cx="200" cy="160" r="155" fill="none" stroke="#141e35" stroke-width="1"/><polygon points="200,105 235,125 235,160 200,180 165,160 165,125" fill="rgba(15,25,50,0.9)" stroke="#3455a8" stroke-width="2"/><text x="200" y="158" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="42" font-weight="800" opacity="0.9">A</text><text x="200" y="226" text-anchor="middle" fill="#e4e8f2" font-family="Inter,sans-serif" font-size="28" font-weight="800" letter-spacing="3">ALGORITHMIC</text><text x="200" y="250" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="14" font-weight="600" letter-spacing="8">ACADEMY</text></svg></div><p style="color:#6c7a9c;font-size:13px;margin-bottom:28px;">Entrez votre mot de passe pour acceder a la formation.</p><form id="authForm" style="display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto;"><input type="password" id="authPwd" placeholder="Mot de passe" autocomplete="off" style="width:100%;padding:14px 18px;background:rgba(74,124,255,0.04);border:1px solid #162040;border-radius:10px;color:#e4e8f2;font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'#4a7cff\'" onblur="this.style.borderColor=\'#162040\'"><button type="submit" style="padding:14px;background:#4a7cff;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(74,124,255,0.25);" onmouseover="this.style.background=\'#6b9aff\'" onmouseout="this.style.background=\'#4a7cff\'">Acceder</button><p id="authErr" style="color:#e05030;font-size:12px;min-height:18px;"></p><p id="authTier" style="color:#2ec974;font-size:12px;min-height:18px;"></p></form>';
    document.body.appendChild(box);

    document.getElementById('authPwd').focus();
    document.getElementById('authForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var pwd = document.getElementById('authPwd').value;
      var hash = await sha256(pwd);

      if (hash === HASH_PREMIUM) {
        sessionStorage.setItem(SESSION_KEY, hash);
        sessionStorage.setItem(TIER_KEY, 'premium');
        location.reload();
      } else if (hash === HASH_STARTER) {
        sessionStorage.setItem(SESSION_KEY, hash);
        sessionStorage.setItem(TIER_KEY, 'starter');
        location.reload();
      } else {
        document.getElementById('authErr').textContent = 'Mot de passe incorrect.';
        document.getElementById('authPwd').value = '';
        document.getElementById('authPwd').focus();
      }
    });
  });
})();
