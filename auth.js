/* ── TRADING ACADEMY — Authentication Gate ── */
(function() {
  const HASH = '3b38fdddc696def68a4cadfa18d9c5470995d47495fd09371d5787e08ec04f49';
  const SESSION_KEY = 'ta_auth';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Already authenticated this session
  if (sessionStorage.getItem(SESSION_KEY) === HASH) return;

  // Block the page
  document.documentElement.style.display = 'none';

  // Create login overlay
  window.addEventListener('DOMContentLoaded', function() {
    document.documentElement.style.display = '';
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;min-height:100vh;background:#060a12;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';

    const box = document.createElement('div');
    box.innerHTML = `
      <div style="text-align:center;max-width:400px;padding:40px;">
        <div style="width:64px;height:64px;margin:0 auto 24px;background:linear-gradient(135deg,#e9b84c,#c49b2e);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#0a0d14;">TA</div>
        <h1 style="color:#e8eaf0;font-size:24px;font-weight:700;margin-bottom:8px;">Trading Academy</h1>
        <p style="color:#6c7a9c;font-size:13px;margin-bottom:32px;">Entrez le mot de passe pour acceder a la formation.</p>
        <form id="authForm" style="display:flex;flex-direction:column;gap:12px;">
          <input type="password" id="authPwd" placeholder="Mot de passe" autocomplete="off" style="
            width:100%;padding:14px 18px;background:#0d1220;border:1px solid #1e2d44;border-radius:10px;
            color:#e8eaf0;font-size:15px;outline:none;transition:border-color 0.2s;
          " onfocus="this.style.borderColor='#e9b84c'" onblur="this.style.borderColor='#1e2d44'">
          <button type="submit" style="
            padding:14px;background:linear-gradient(135deg,#e9b84c,#c49b2e);border:none;border-radius:10px;
            color:#0a0d14;font-size:14px;font-weight:700;cursor:pointer;transition:opacity 0.2s;
          " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Acceder</button>
          <p id="authErr" style="color:#f04545;font-size:12px;min-height:18px;"></p>
        </form>
      </div>
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
