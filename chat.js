/* Algorithmic Academy - AI Tutor Widget
   S'active uniquement si eleve authentifie (aa_auth_v2).
   Envoie le token AA au Worker Cloudflare qui decode tier + rate-limit.
*/
(function () {
  // URL du Worker a mettre a jour apres deploy (ex: https://aa-tutor.<subdomain>.workers.dev)
  const WORKER_URL = window.AA_TUTOR_URL || "https://aa-tutor.alorithmicacademy.workers.dev";

  function getAuth() {
    try {
      const ok = sessionStorage.getItem("aa_auth_v2") === "ok";
      const tier = sessionStorage.getItem("aa_tier");
      const user = sessionStorage.getItem("aa_user");
      const token = sessionStorage.getItem("aa_token");
      return ok && tier && user ? { tier, user, token } : null;
    } catch (_) {
      return null;
    }
  }

  function injectCSS() {
    const css = `
#aa-tutor-btn { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(99,102,241,.35); z-index: 99998; display: flex; align-items: center; justify-content: center; font-size: 26px; transition: transform .15s; }
#aa-tutor-btn:hover { transform: scale(1.08); }
#aa-tutor-panel { position: fixed; bottom: 92px; right: 24px; width: min(400px, calc(100vw - 48px)); height: min(600px, calc(100vh - 120px)); background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,.25); display: none; flex-direction: column; z-index: 99999; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
#aa-tutor-panel.open { display: flex; }
.aa-tutor-head { padding: 14px 16px; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; display: flex; justify-content: space-between; align-items: center; }
.aa-tutor-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
.aa-tutor-head small { font-size: 11px; opacity: .85; display: block; }
.aa-tutor-close { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; padding: 0 4px; line-height: 1; }
.aa-tutor-msgs { flex: 1; overflow-y: auto; padding: 14px; background: #f8fafc; }
.aa-tutor-msg { margin-bottom: 12px; display: flex; }
.aa-tutor-msg.user { justify-content: flex-end; }
.aa-tutor-bubble { max-width: 85%; padding: 10px 13px; border-radius: 12px; font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word; }
.aa-tutor-msg.user .aa-tutor-bubble { background: #6366f1; color: #fff; border-bottom-right-radius: 4px; }
.aa-tutor-msg.bot .aa-tutor-bubble { background: #fff; color: #111827; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
.aa-tutor-msg.sys .aa-tutor-bubble { background: #fef3c7; color: #92400e; font-size: 12px; text-align: center; width: 100%; max-width: 100%; }
.aa-tutor-foot { padding: 10px; border-top: 1px solid #e5e7eb; background: #fff; display: flex; gap: 8px; }
.aa-tutor-foot textarea { flex: 1; border: 1px solid #d1d5db; border-radius: 10px; padding: 9px 11px; font-size: 13px; resize: none; font-family: inherit; outline: none; min-height: 40px; max-height: 120px; }
.aa-tutor-foot textarea:focus { border-color: #6366f1; }
.aa-tutor-foot button { background: #6366f1; color: #fff; border: none; border-radius: 10px; padding: 0 14px; cursor: pointer; font-weight: 600; font-size: 13px; }
.aa-tutor-foot button:disabled { opacity: .5; cursor: not-allowed; }
.aa-tutor-typing { display: inline-flex; gap: 4px; }
.aa-tutor-typing span { width: 6px; height: 6px; border-radius: 50%; background: #9ca3af; animation: aatype 1.2s infinite; }
.aa-tutor-typing span:nth-child(2) { animation-delay: .15s; }
.aa-tutor-typing span:nth-child(3) { animation-delay: .3s; }
@keyframes aatype { 0%,60%,100% { opacity: .3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
`;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildUI(auth) {
    const btn = document.createElement("button");
    btn.id = "aa-tutor-btn";
    btn.innerHTML = "💬";
    btn.title = "Poser une question au tuteur IA";
    btn.onclick = () => panel.classList.toggle("open");

    const panel = document.createElement("div");
    panel.id = "aa-tutor-panel";
    panel.innerHTML = `
      <div class="aa-tutor-head">
        <div>
          <h3>Tuteur IA</h3>
          <small>Tier: ${auth.tier} · ${auth.user}</small>
        </div>
        <button class="aa-tutor-close" aria-label="Fermer">×</button>
      </div>
      <div class="aa-tutor-msgs" id="aa-tutor-msgs">
        <div class="aa-tutor-msg bot"><div class="aa-tutor-bubble">Bonjour ${auth.user} 👋 Pose-moi n'importe quelle question sur le cours ICT/Kronos. Limite: 100 questions/jour.</div></div>
      </div>
      <div class="aa-tutor-foot">
        <textarea id="aa-tutor-input" placeholder="Ta question..." rows="1"></textarea>
        <button id="aa-tutor-send">Envoyer</button>
      </div>
    `;

    panel.querySelector(".aa-tutor-close").onclick = () => panel.classList.remove("open");

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const msgs = panel.querySelector("#aa-tutor-msgs");
    const input = panel.querySelector("#aa-tutor-input");
    const sendBtn = panel.querySelector("#aa-tutor-send");

    function addMsg(role, text) {
      const wrap = document.createElement("div");
      wrap.className = "aa-tutor-msg " + role;
      const b = document.createElement("div");
      b.className = "aa-tutor-bubble";
      b.textContent = text;
      wrap.appendChild(b);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
      return b;
    }

    async function send() {
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      input.style.height = "auto";
      addMsg("user", q);
      sendBtn.disabled = true;
      const typing = addMsg("bot", "");
      typing.innerHTML = '<span class="aa-tutor-typing"><span></span><span></span><span></span></span>';
      try {
        const r = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, token: auth.token }),
        });
        const data = await r.json();
        if (r.ok && data.answer) {
          typing.textContent = data.answer;
          if (data.limit && data.used) {
            const info = document.createElement("div");
            info.style.cssText = "font-size:11px; color:#6b7280; margin-top:6px;";
            info.textContent = `${data.used}/${data.limit} questions utilisees aujourd'hui`;
            typing.parentElement.appendChild(info);
          }
        } else {
          typing.textContent = data.error || "Erreur inconnue.";
          typing.parentElement.classList.remove("bot");
          typing.parentElement.classList.add("sys");
        }
      } catch (e) {
        typing.textContent = "Erreur reseau: " + e.message;
        typing.parentElement.classList.remove("bot");
        typing.parentElement.classList.add("sys");
      }
      sendBtn.disabled = false;
      input.focus();
    }

    sendBtn.onclick = send;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    });
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 120) + "px";
    });
  }

  function init() {
    const auth = getAuth();
    if (!auth) return; // non connecte - pas de widget
    if (!auth.token) {
      console.warn("AA Tutor: aa_token manquant dans sessionStorage. Le widget ne sera pas actif.");
      return;
    }
    injectCSS();
    buildUI(auth);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
