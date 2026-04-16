"""Scan modules/*.html -> extract text by tier -> produce corpus-starter.json + corpus-premium.json.

Each corpus is a list of {slug, title, tier, text}.
Starter corpus: starter modules only.
Premium corpus: ALL modules (starter + premium).
Custom tier is handled at query-time: client sends allow-list, worker filters dynamically.
"""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent.parent
MODULES = ROOT / "modules"
OUT = Path(__file__).parent
OUT.mkdir(exist_ok=True)

SKIP = {"hub-cours.html", "index-cours.html", "indicateurs.html", "fiches-visuelles.html"}


def clean_text(html_text: str) -> str:
    soup = BeautifulSoup(html_text, "lxml")
    # remove scripts, styles, nav bar
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    # extract main content areas (prefer article/main/.container/.section)
    main = soup.select_one("main, article, .container, .page-main")
    root = main if main else soup.body
    if root is None:
        return ""
    text = root.get_text(separator="\n")
    # collapse whitespace
    lines = [ln.strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if ln]
    return "\n".join(lines)


def main():
    all_mods = []
    for path in sorted(MODULES.glob("*.html")):
        if path.name in SKIP:
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(html, "lxml")
        root = soup.find("html")
        tier = (root.get("data-tier") or "starter").strip().lower() if root else "starter"
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else path.stem
        title = re.sub(r"\s*[-—|]\s*Algorithmic Academy.*$", "", title, flags=re.I).strip()
        text = clean_text(html)
        if not text or len(text) < 50:
            continue
        all_mods.append({
            "slug": path.stem,
            "title": title,
            "tier": tier,
            "text": text,
        })

    # Starter corpus = only starter-tagged
    starter = [m for m in all_mods if m["tier"] == "starter"]
    # Premium corpus = everything (starter + premium). Custom filtered at query-time.
    premium = all_mods

    (OUT / "corpus-starter.json").write_text(
        json.dumps(starter, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT / "corpus-premium.json").write_text(
        json.dumps(premium, ensure_ascii=False, indent=1), encoding="utf-8")

    # Also dump a slug->tier map for quick reference
    (OUT / "tier-map.json").write_text(
        json.dumps({m["slug"]: m["tier"] for m in all_mods}, indent=1), encoding="utf-8")

    # Stats
    total_chars_starter = sum(len(m["text"]) for m in starter)
    total_chars_premium = sum(len(m["text"]) for m in premium)
    print(f"Starter modules: {len(starter)} ({total_chars_starter:,} chars, ~{total_chars_starter//4:,} tokens)")
    print(f"Premium modules: {len(premium)} ({total_chars_premium:,} chars, ~{total_chars_premium//4:,} tokens)")
    print(f"Fichiers ecrits: {OUT}")


if __name__ == "__main__":
    main()
