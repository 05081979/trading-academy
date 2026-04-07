/* ── ALGORITHMIC ACADEMY — Authentication Gate ── */
(function() {
  const HASH = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49';
  const SESSION_KEY = 'aa_auth';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  if (sessionStorage.getItem(SESSION_KEY) === HASH) return;

  document.documentElement.style.display = 'none';

  window.addEventListener('DOMContentLoaded', function() {
    document.documentElement.style.display = '';
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;min-height:100vh;background:#060a12;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;overflow:hidden;';

    // Particle background
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    function initParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.3,
          dx: (Math.random() - 0.5) * 0.12,
          dy: (Math.random() - 0.5) * 0.08,
          o: Math.random() * 0.4 + 0.1
        });
      }
    }
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,124,255,${p.o})`; ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    window.addEventListener('resize', initParticles);
    initParticles(); drawParticles();

    const box = document.createElement('div');
    box.style.cssText = 'position:relative;z-index:1;text-align:center;max-width:420px;padding:40px;';
    box.innerHTML = `
      <div style="margin-bottom:32px;">
        <svg viewBox="0 0 400 400" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="195" fill="#0a0e1a"/>
          <circle cx="200" cy="200" r="195" fill="none" stroke="#141e35" stroke-width="1"/>
          <text x="80" y="145" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">10110</text>
          <text x="300" y="140" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">01001</text>
          <text x="70" y="260" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">0101</text>
          <text x="100" y="340" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">11010</text>
          <text x="290" y="345" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.6">10111</text>
          <ellipse cx="200" cy="185" rx="145" ry="65" fill="none" stroke="#3455a8" stroke-width="1.2" transform="rotate(-30 200 185)" opacity="0.7"/>
          <ellipse cx="200" cy="185" rx="120" ry="55" fill="none" stroke="#d04830" stroke-width="1" stroke-dasharray="6 4" transform="rotate(35 200 185)" opacity="0.6"/>
          <ellipse cx="200" cy="185" rx="130" ry="50" fill="none" stroke="#1e3060" stroke-width="1" stroke-dasharray="8 5" transform="rotate(-60 200 185)" opacity="0.5"/>
          <circle cx="120" cy="155" r="5" fill="#4a7cff"/>
          <circle cx="185" cy="135" r="4" fill="#4a7cff"/>
          <circle cx="165" cy="310" r="4.5" fill="#4a7cff"/>
          <circle cx="265" cy="155" r="5" fill="#e05030"/>
          <circle cx="230" cy="215" r="3.5" fill="#e05030"/>
          <circle cx="290" cy="305" r="5" fill="#e05030"/>
          <circle cx="255" cy="175" r="2.5" fill="#8892a8"/>
          <circle cx="145" cy="195" r="2.5" fill="#8892a8"/>
          <polygon points="200,145 235,165 235,200 200,220 165,200 165,165" fill="rgba(15,25,50,0.9)" stroke="#3455a8" stroke-width="2"/>
          <polygon points="200,152 229,169 229,197 200,214 171,197 171,169" fill="none" stroke="#253a6a" stroke-width="0.8" opacity="0.5"/>
          <text x="200" y="198" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="42" font-weight="800" opacity="0.9">A</text>
          <text x="200" y="266" text-anchor="middle" fill="#e4e8f2" font-family="Inter,sans-serif" font-size="28" font-weight="800" letter-spacing="3">ALGORITHMIC</text>
          <text x="200" y="290" text-anchor="middle" fill="#4a7cff" font-family="Inter,sans-serif" font-size="14" font-weight="600" letter-spacing="8">ACADEMY</text>
          <text x="200" y="320" text-anchor="middle" fill="#2a3a5c" font-family="monospace" font-size="10" opacity="0.5">v2.0 :: build_2026</text>
        </svg>
      </div>
      <p style="color:#6c7a9c;font-size:13px;margin-bottom:28px;">Entrez votre mot de passe pour acceder a la formation.</p>
      <form id="authForm" style="display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto;">
        <input type="password" id="authPwd" placeholder="Mot de passe" autocomplete="off" style="
          width:100%;padding:14px 18px;background:rgba(74,124,255,0.04);border:1px solid #162040;border-radius:10px;
          color:#e4e8f2;font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s;
        " onfocus="this.style.borderColor='#4a7cff'" onblur="this.style.borderColor='#162040'">
        <button type="submit" style="
          padding:14px;background:#4a7cff;border:none;border-radius:10px;
          color:#fff;font-size:14px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;transition:all 0.2s;
          box-shadow:0 4px 20px rgba(74,124,255,0.25);
        " onmouseover="this.style.background='#6b9aff'" onmouseout="this.style.background='#4a7cff'">Acceder</button>
        <p id="authErr" style="color:#e05030;font-size:12px;min-height:18px;"></p>
      </form>
    `;
    document.body.appendChild(box);

    document.getElementById('authPwd').focus();
    document.getElementById('authForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const pwd = document.getElementById('authPwd').value;
      const hash = await sha256(pwd);
      if (hash === HASH) {
        sessionStorage.setItem(SESSION_KEY, HASH);
        location.reload();
      } else {
        document.getElementById('authErr').textContent = 'Mot de passe incorrect.';
        document.getElementById('authPwd').value = '';
        document.getElementById('authPwd').focus();
      }
    });
  });
})();
