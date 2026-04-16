"""Injecte <script src="../chat.js"> dans toutes les pages protegees du site (avant </body>)."""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\BENDJ\Desktop\TRADING_ACADEMY")

# Pages qui doivent recevoir le widget (elles ont toutes auth.js)
TARGETS = list((ROOT / "modules").glob("*.html")) + [ROOT / "index.html"]

MARKER = "<!-- AA_TUTOR_WIDGET -->"
SNIPPET = f'{MARKER}\n<script src="../chat.js?v=v20260416"></script>\n'
SNIPPET_ROOT = f'{MARKER}\n<script src="chat.js?v=v20260416"></script>\n'

patched = 0
skipped = 0
for p in TARGETS:
    try:
        t = p.read_text(encoding="utf-8")
    except Exception:
        continue
    if MARKER in t:
        skipped += 1
        continue
    snippet = SNIPPET_ROOT if p.parent == ROOT else SNIPPET
    # Insere juste avant </body> (case-insensitive)
    new_t, n = re.subn(r"(</body\s*>)", snippet + r"\1", t, count=1, flags=re.IGNORECASE)
    if n == 0:
        print(f"[skip] pas de </body> dans {p.name}")
        continue
    p.write_text(new_t, encoding="utf-8")
    patched += 1

print(f"Patched: {patched} | Skipped (deja inject): {skipped}")
