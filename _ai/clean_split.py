"""Generateur propre de modules : extrait le contenu d'un module, nettoie, applique le style du site."""
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(r"C:\Users\BENDJ\Desktop")
DEST_DIR = ROOT / "TRADING_ACADEMY" / "modules"

# Fichiers sources + mapping
SOURCES = [
    {
        "src": ROOT / "ict_course.html",
        "mapping": {
            1: ("cours-ohlc-olhc", "starter", "📊", "#3b82f6"),
            2: ("cours-daily-bias", "starter", "🎯", "#10b981"),
            3: ("cours-killzones", "starter", "⏰", "#f59e0b"),
            4: ("cours-ict-ranges", "premium", "📏", "#8b5cf6"),
            5: ("cours-cisd", "premium", "🔄", "#ef4444"),
            6: ("cours-mmxm-org", "premium", "🏦", "#ec4899"),
            7: ("cours-quarterly-theory", "premium", "📅", "#06b6d4"),
        },
    },
    {
        "src": ROOT / "goldbach_course.html",
        "mapping": {
            1: ("arch-po3", "premium", "⚡", "#9b7fe8"),
            2: ("arch-goldbach-levels", "premium", "🔢", "#6366f1"),
            3: ("arch-goldbach-fib", "premium", "📐", "#14b8a6"),
            4: ("arch-fix-price", "premium", "🎯", "#f97316"),
            5: ("arch-dealing-ranges", "premium", "📏", "#a855f7"),
            6: ("arch-trade-plan", "premium", "🗺️", "#0ea5e9"),
        },
    },
]

# Classes source a retirer (navigation + header du fichier original)
STRIP_CLASSES = {"modules-nav", "progress-bar", "progress-fill", "mod-btn", "nav-btn", "nav-row", "mod-count", "course-header", "candle-wrap", "candle-group"}


def clean_inner(mod_body, remove_title=True):
    """Retire elements de nav + titre, retourne HTML interne propre."""
    # Supprime le h2/h3 titre principal (on le met dans le hero)
    if remove_title:
        t = mod_body.find(["h2", "h3"])
        if t:
            t.extract()
    # Supprime elements de navigation
    for cls in STRIP_CLASSES:
        for el in mod_body.select(f".{cls}"):
            el.decompose()
    # Retire tout attribut style inline (pour eviter conflits)
    for el in mod_body.find_all(True):
        if el.has_attr("style"):
            del el["style"]
    # Retire les scripts imbriques
    for s in mod_body.find_all("script"):
        s.decompose()
    return mod_body.decode_contents().replace("�", "—")


def hex_to_rgb(h):
    h = h.lstrip("#")
    return f"{int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)}"


def build_page(slug, tier, icon, accent, full_title, inner_html):
    # sous-titre = premier paragraphe
    m = re.search(r"<p[^>]*>(.*?)</p>", inner_html, re.DOTALL)
    subtitle = (m.group(1) if m else "").strip()[:240]
    subtitle = re.sub(r"<[^>]+>", "", subtitle).strip() or full_title

    tier_badge = "Starter" if tier == "starter" else "Premium"
    accent_rgb = hex_to_rgb(accent)

    return f"""<!DOCTYPE html>
<html data-tier="{tier}" lang="fr">
<head>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<script>
(function(){{
  try {{
    fetch('../version.txt?_='+Date.now(), {{cache:'no-store'}})
      .then(function(r){{return r.text();}})
      .then(function(v){{
        v=(v||'').trim(); if(!v) return;
        var k='aa-v', prev=localStorage.getItem(k);
        if(prev && prev!==v){{ localStorage.setItem(k,v); location.replace(location.pathname+'?_cb='+v+location.hash); }}
        else localStorage.setItem(k,v);
      }}).catch(function(){{}});
  }} catch(e){{}}
}})();
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="../auth.js?v=v20260413-revoke2"></script>
<title>{full_title} — Algorithmic Academy</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../bootcamp-theme.css?v=v20260413a">
<style>
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
html {{ scroll-behavior: smooth; }}
body {{ background:#f5f7fa !important; color:#1a1a2e !important; font-family:'Inter',sans-serif; line-height:1.65; min-height:100vh; }}
.hero {{ background:linear-gradient(135deg,{accent} 0%,{accent}dd 100%); color:#fff; padding:60px 40px 40px; position:relative; overflow:hidden; }}
.hero::before {{ content:''; position:absolute; inset:0; background:radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events:none; }}
.hero-inner {{ max-width:1100px; margin:0 auto; position:relative; z-index:1; }}
.back-link {{ display:inline-flex; align-items:center; gap:8px; color:rgba(255,255,255,0.88); text-decoration:none; font-size:13px; margin-bottom:24px; }}
.back-link:hover {{ color:#fff; }}
.tier-badge {{ display:inline-block; background:rgba(0,0,0,0.2); color:#fff; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }}
.hero h1 {{ font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,40px); font-weight:800; letter-spacing:-0.01em; margin-bottom:10px; color:#fff; }}
.hero p {{ font-size:16px; max-width:720px; opacity:0.95; color:#fff; }}
.container {{ max-width:1100px; margin:0 auto; padding:40px 24px; }}
.container > * {{ background:#fff; border-radius:14px; padding:24px 28px; margin-bottom:18px; box-shadow:0 2px 12px rgba(0,0,0,0.04); border:1px solid #e2e5ea; }}
.container > *:last-child {{ margin-bottom:0; }}
h2, h3, h4 {{ font-family:'Syne',sans-serif; color:#1a1a2e; font-weight:700; }}
h2 {{ font-size:20px; margin-bottom:14px; display:flex; align-items:center; gap:10px; padding-bottom:8px; border-bottom:2px solid {accent}33; }}
h3 {{ font-size:15px; color:{accent}; margin:18px 0 8px; }}
h4 {{ font-size:14px; color:#1a1a2e; margin:14px 0 6px; }}
p {{ margin-bottom:12px; color:#334155; line-height:1.7; }}
strong, b {{ color:#111827; font-weight:700; }}
em, i {{ color:#334155; }}
ul, ol {{ margin-left:22px; margin-bottom:12px; }}
li {{ margin-bottom:6px; color:#334155; line-height:1.65; }}
code {{ font-family:'JetBrains Mono',monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.9em; color:#0f172a; }}
.section-title {{ font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:12px; display:flex; align-items:center; gap:10px; padding-bottom:8px; border-bottom:2px solid {accent}33; }}
.section-sub {{ color:#64748b; font-size:14px; margin-bottom:14px; font-style:italic; }}
.info-box {{ padding:14px 18px; background:rgba({accent_rgb},0.06); border-left:4px solid {accent}; border-radius:10px; margin:14px 0; color:#334155; font-size:14px; }}
.warn-box, .b-warn {{ padding:14px 18px; background:#fef3c7; border-left:4px solid #f59e0b; border-radius:10px; margin:14px 0; color:#78350f; font-size:14px; }}
.rule-card, .card {{ padding:14px 18px; background:#f8fafc; border:1px solid #e2e5ea; border-radius:10px; margin-bottom:12px; }}
.card-title {{ font-weight:700; color:{accent}; font-size:14px; margin-bottom:6px; font-family:'Syne',sans-serif; }}
.rule-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; margin-top:10px; }}
.badge {{ display:inline-block; padding:3px 9px; border-radius:6px; font-size:11px; font-weight:700; margin:0 4px 4px 0; font-family:'Inter',sans-serif; }}
.badge.bull, .b-bull {{ background:#ecfdf5; color:#047857; padding:3px 9px; border-radius:6px; font-size:11px; font-weight:700; display:inline-block; }}
.badge.bear, .b-bear {{ background:#fef2f2; color:#b91c1c; padding:3px 9px; border-radius:6px; font-size:11px; font-weight:700; display:inline-block; }}
.badge.neutral {{ background:#f1f5f9; color:#475569; }}
.step-row {{ display:flex; gap:14px; padding:12px 0; border-bottom:1px solid #f1f5f9; }}
.step-row:last-child {{ border-bottom:none; }}
.step-num {{ width:30px; height:30px; background:{accent}; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0; font-family:'Syne',sans-serif; font-size:14px; }}
.step-text {{ flex:1; color:#334155; line-height:1.6; }}
.flow-step, .flow-arrow {{ padding:8px 0; }}
.flow-arrow {{ color:{accent}; font-weight:700; }}
.time-line {{ display:flex; gap:14px; padding:8px 0; border-bottom:1px solid #f1f5f9; align-items:center; }}
.time-line:last-child {{ border-bottom:none; }}
.time-key {{ font-family:'JetBrains Mono',monospace; color:{accent}; font-weight:600; font-size:13px; min-width:120px; }}
.time-val {{ color:#334155; font-size:14px; }}
.kz-row, .amd-row {{ display:grid; grid-template-columns:140px 1fr; gap:14px; padding:8px 0; border-bottom:1px solid #f1f5f9; font-size:14px; }}
.kz-row:last-child, .amd-row:last-child {{ border-bottom:none; }}
.kz-time, .amd-cell:first-child {{ font-family:'JetBrains Mono',monospace; color:{accent}; font-weight:600; }}
.divider {{ height:1px; background:#e2e5ea; margin:16px 0; border:none; }}
.primary {{ color:{accent}; font-weight:600; }}
</style>
</head>
<body>
<script src="../nav.js"></script>

<div class="hero">
  <div class="hero-inner">
    <a href="hub-cours.html" class="back-link">← Retour au hub</a>
    <div class="tier-badge">{tier_badge}</div>
    <div style="font-size:44px;margin-bottom:14px;">{icon}</div>
    <h1>{full_title}</h1>
    <p>{subtitle}</p>
  </div>
</div>

<div class="container">
{inner_html}
</div>

<!-- AA_TUTOR_WIDGET -->
<script src="../chat.js?v=v20260416"></script>
</body>
</html>
"""


def main():
    for src_cfg in SOURCES:
        src = src_cfg["src"]
        if not src.exists():
            print(f"[SKIP] {src.name} introuvable")
            continue
        html = src.read_text(encoding="utf-8")
        soup = BeautifulSoup(html, "lxml")
        for i, mod_body in enumerate(soup.select(".module-body"), 1):
            if i not in src_cfg["mapping"]:
                continue
            slug, tier, icon, accent = src_cfg["mapping"][i]
            # Extract title
            title_el = mod_body.find(["h2", "h3"])
            full_title = title_el.get_text(" ", strip=True).replace("�", "—") if title_el else f"Module {i}"
            # Clean copy
            mod_clone = BeautifulSoup(str(mod_body), "lxml")
            inner_body = mod_clone.find(class_="module-body") or mod_clone
            inner_html = clean_inner(inner_body, remove_title=True)
            page = build_page(slug, tier, icon, accent, full_title, inner_html)
            (DEST_DIR / f"{slug}.html").write_text(page, encoding="utf-8")
            print(f"[OK] {slug}.html (tier={tier})")


if __name__ == "__main__":
    main()
