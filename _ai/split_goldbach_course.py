"""Split goldbach_course.html into 6 modules de l'Architecture Institutionnelle."""
import re
from pathlib import Path
from bs4 import BeautifulSoup

SRC = Path(r"C:\Users\BENDJ\Desktop\goldbach_course.html")
DEST_DIR = Path(r"C:\Users\BENDJ\Desktop\TRADING_ACADEMY\modules")

# Tous Premium (contenu avance)
MAPPING = {
    1: ("arch-po3", "premium", "⚡", "#9b7fe8"),
    2: ("arch-goldbach-levels", "premium", "🔢", "#6366f1"),
    3: ("arch-goldbach-fib", "premium", "📐", "#14b8a6"),
    4: ("arch-fix-price", "premium", "🎯", "#f97316"),
    5: ("arch-dealing-ranges", "premium", "📏", "#a855f7"),
    6: ("arch-trade-plan", "premium", "🗺️", "#0ea5e9"),
}


def hex_to_rgb(h):
    h = h.lstrip("#")
    return f"{int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)}"


def build_page(slug, tier, icon, accent, full_title, inner_html, orig_style):
    subtitle_match = re.search(r"<p[^>]*>(.*?)</p>", inner_html, re.DOTALL)
    subtitle = (subtitle_match.group(1) if subtitle_match else "").strip()[:220]
    subtitle = re.sub(r"<[^>]+>", "", subtitle).strip() or full_title

    tier_badge = "Premium"

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
{orig_style}
body {{ background:#f5f7fa !important; color:#1a1a2e !important; font-family:'Inter',sans-serif !important; }}
.course-hero {{ background:linear-gradient(135deg,{accent} 0%,{accent}dd 100%); color:#fff; padding:60px 40px 40px; position:relative; overflow:hidden; }}
.course-hero::before {{ content:''; position:absolute; inset:0; background:radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events:none; }}
.course-hero-inner {{ max-width:1100px; margin:0 auto; position:relative; z-index:1; }}
.course-hero .back-link {{ display:inline-flex; align-items:center; gap:8px; color:rgba(255,255,255,0.88); text-decoration:none; font-size:13px; margin-bottom:24px; }}
.course-hero h1 {{ font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,40px); font-weight:800; letter-spacing:-0.01em; margin-bottom:10px; }}
.course-hero p {{ font-size:16px; max-width:720px; opacity:0.95; }}
.tier-badge {{ display:inline-block; background:rgba(0,0,0,0.2); color:#fff; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }}
.course-body-wrap {{ max-width:1100px; margin:0 auto; padding:32px 24px; }}
.course-body-wrap > * {{ background:#fff; border-radius:12px; padding:22px 28px; margin-bottom:18px; box-shadow:0 1px 6px rgba(0,0,0,0.04); border:1px solid #e2e5ea; }}
.course-body-wrap h3, .course-body-wrap .section-title {{ font-family:'Syne',sans-serif; color:#1a1a2e; font-weight:700; margin-bottom:12px; }}
.course-body-wrap .section-title {{ font-size:19px; display:flex; align-items:center; gap:10px; }}
.course-body-wrap .section-title::before {{ content:''; width:6px; height:24px; background:{accent}; border-radius:3px; }}
.course-body-wrap h3 {{ font-size:14px; color:{accent}; margin:16px 0 8px; }}
.course-body-wrap p {{ margin-bottom:10px; color:#334155; line-height:1.65; }}
.course-body-wrap ul, .course-body-wrap ol {{ margin-left:22px; margin-bottom:10px; }}
.course-body-wrap li {{ margin-bottom:6px; color:#334155; line-height:1.6; }}
.info-box, .warn-box {{ padding:14px 18px; border-radius:10px; margin:12px 0; font-size:14px; }}
.info-box {{ background:linear-gradient(90deg,rgba({hex_to_rgb(accent)},0.08),rgba({hex_to_rgb(accent)},0.02)); border-left:4px solid {accent}; color:#334155; }}
.warn-box {{ background:#fef3c7; border-left:4px solid #f59e0b; color:#78350f; }}
.rule-card, .card {{ padding:14px 16px; background:#f8fafc; border:1px solid #e2e5ea; border-radius:10px; margin-bottom:10px; }}
.card-title {{ font-weight:700; color:{accent}; font-size:14px; margin-bottom:6px; }}
.badge {{ display:inline-block; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700; margin:0 4px 4px 0; }}
.badge.bull, .badge.b-bull {{ background:#ecfdf5; color:#047857; }}
.badge.bear, .badge.b-bear {{ background:#fef2f2; color:#b91c1c; }}
.badge.neutral {{ background:#f1f5f9; color:#475569; }}
.rule-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; }}
.step-row {{ display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f1f5f9; }}
.step-row:last-child {{ border-bottom:none; }}
.step-num {{ width:30px; height:30px; background:{accent}; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; }}
.modules-nav, .progress-bar, .progress-fill, .mod-btn, .nav-btn, .nav-row {{ display:none !important; }}
</style>
</head>
<body>
<script src="../nav.js"></script>

<div class="course-hero">
  <div class="course-hero-inner">
    <a href="hub-cours.html" class="back-link">← Retour au hub</a>
    <div class="tier-badge">{tier_badge}</div>
    <div style="font-size:44px;margin-bottom:14px;">{icon}</div>
    <h1>{full_title}</h1>
    <p>{subtitle}</p>
  </div>
</div>

<div class="course-body-wrap">
{inner_html}
</div>

<!-- AA_TUTOR_WIDGET -->
<script src="../chat.js?v=v20260416"></script>
</body>
</html>
"""


def main():
    src_html = SRC.read_text(encoding="utf-8")
    soup = BeautifulSoup(src_html, "lxml")
    orig_style = soup.find("style").string if soup.find("style") else ""

    for i, mod_body in enumerate(soup.select(".module-body"), 1):
        if i not in MAPPING:
            continue
        slug, tier, icon, accent = MAPPING[i]
        title_el = mod_body.find(["h2", "h3"])
        full_title = title_el.get_text(" ", strip=True) if title_el else f"Module {i}"
        full_title = full_title.replace("�", "—")
        if title_el:
            title_el.extract()
        inner = mod_body.decode_contents()
        inner = inner.replace("�", "—")
        page = build_page(slug, tier, icon, accent, full_title, inner, orig_style)
        out_path = DEST_DIR / f"{slug}.html"
        out_path.write_text(page, encoding="utf-8")
        print(f"[OK] {out_path.name} (tier={tier})")


if __name__ == "__main__":
    main()
