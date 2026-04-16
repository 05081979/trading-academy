"""Disperse les 14 modules dans les blocs existants du hub par thematique.

- Retire les 3 blocs que j'avais ajoutes (BLOC 5ter Goldbach, BLOC 6 Cours ICT, BLOC 6bis Entry Model)
- Ajoute des liens aux blocs existants par theme
"""
import re
from pathlib import Path

HUB = Path(r"C:\Users\BENDJ\Desktop\TRADING_ACADEMY\modules\hub-cours.html")


def link_html(href, num, color, label, tier_note=""):
    """Genere un lien <a> compatible avec la grille existante."""
    bg = "#faf5ff" if tier_note == "PREMIUM" else "#f8f9fb"
    border = "#e9d5ff" if tier_note == "PREMIUM" else "#e2e5ea"
    hover_bg = "#f3e8ff" if tier_note == "PREMIUM" else "#eef2ff"
    tier_badge = f' <span style="font-size:9px;opacity:0.6;">PREMIUM</span>' if tier_note == "PREMIUM" else ""
    return (
        f'        <a href="{href}" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:{bg};border:1px solid {border};border-radius:8px;text-decoration:none;color:#000;transition:all 0.2s;" onmouseover="this.style.borderColor=\'{color}\';this.style.background=\'{hover_bg}\'" onmouseout="this.style.borderColor=\'{border}\';this.style.background=\'{bg}\'">\n'
        f'          <span style="font-size:11px;font-weight:700;color:{color};min-width:24px;">{num}</span>\n'
        f'          <span style="font-size:13px;font-weight:600;">{label}{tier_badge}</span>\n'
        f'        </a>\n'
    )


def main():
    html = HUB.read_text(encoding="utf-8")

    # ── 1. Retire les 3 blocs que j'ai ajoutes ──
    # Pattern: de "<!-- ═══ BLOC 5ter" jusqu'au debut de "<!-- ═══ BLOC 7:"
    pat = r"[ \t]*<!-- ═══ BLOC 5ter:.*?(?=    <!-- ═══ BLOC 7:)"
    n_before = len(html)
    html = re.sub(pat, "", html, count=1, flags=re.DOTALL)
    if len(html) == n_before:
        print("WARN: pattern des 3 blocs non trouve — deja retire ?")

    # ── 2. Injecter des liens dans les blocs existants ──
    # Helper: insere des lignes juste avant le </div> de fermeture d'une grille.
    # On cible la fermeture de chaque bloc via son ancre unique.

    def inject_after(anchor_comment, end_of_grid_marker, new_links_html):
        """Localise le bloc via son commentaire ancre, puis insere les liens avant la fermeture de la grille."""
        nonlocal html
        # La grille se termine par "      </div>\n    </div>\n\n" juste avant le bloc suivant.
        # On cherche l'ancre, puis la premiere occurrence de "      </div>\n    </div>" apres.
        idx = html.find(anchor_comment)
        if idx == -1:
            print(f"[skip] ancre introuvable: {anchor_comment[:40]}")
            return
        # Trouve la fin de grille: "      </div>\n    </div>" (grid + card)
        close_pat = "      </div>\n    </div>"
        close_idx = html.find(close_pat, idx)
        if close_idx == -1:
            print(f"[skip] fermeture grid non trouvee pour {anchor_comment[:40]}")
            return
        html = html[:close_idx] + new_links_html + html[close_idx:]
        print(f"[OK] liens injectes dans: {anchor_comment[:60]}")

    # BLOC 1 — Bases SMC & Structure (starter)
    bloc1_links = (
        link_html("cours-ohlc-olhc.html", "06", "#2563eb", "OHLC / OLHC — Structure des bougies") +
        link_html("cours-daily-bias.html", "07", "#2563eb", "Daily Bias") +
        link_html("cours-ict-ranges.html", "08", "#2563eb", "Ranges & Premium/Discount", "PREMIUM")
    )
    inject_after("<!-- ═══ BLOC 1: BASES SMC & STRUCTURE ═══ -->", None, bloc1_links)

    # BLOC 2 — Liquidité & Inducements (starter)
    bloc2_links = link_html("cours-cisd.html", "03", "#2563eb", "CISD — Change In State of Delivery", "PREMIUM")
    inject_after("<!-- ═══ BLOC 2: LIQUIDITE & INDUCEMENTS ═══ -->", None, bloc2_links)

    # BLOC 3 — Quarterly Theory (starter)
    bloc3_links = link_html("cours-quarterly-theory.html", "02", "#2563eb", "Quarterly Theory — Cours Thematique", "PREMIUM")
    inject_after("<!-- ═══ BLOC 3: QUARTERLY THEORY ═══ -->", None, bloc3_links)

    # BLOC 4 — Time Cycles & Execution (starter, dest de Entry Model)
    bloc4_links = (
        link_html("cours-killzones.html", "07", "#0d9488", "Killzones — Fenetres Algorithmiques") +
        link_html("cours-mmxm-org.html", "08", "#0d9488", "MMXM + ORG Repricing", "PREMIUM") +
        link_html("entry-model-simplified.html", "09", "#0d9488", "Entry Model Simplifie — Checklist 7 criteres", "PREMIUM")
    )
    inject_after("<!-- ═══ BLOC 4: TIME CYCLES & EXECUTION ═══ -->", None, bloc4_links)

    # BLOC 5 — PO3 & Architecture Institutionnelle (premium, dest de Goldbach)
    bloc5_links = (
        link_html("arch-po3.html", "08", "#7c3aed", "Power of Three (PO3)") +
        link_html("arch-goldbach-levels.html", "09", "#7c3aed", "Niveaux Goldbach") +
        link_html("arch-goldbach-fib.html", "10", "#7c3aed", "Fibonacci Goldbach") +
        link_html("arch-fix-price.html", "11", "#7c3aed", "FIX Price & Element Temps") +
        link_html("arch-dealing-ranges.html", "12", "#7c3aed", "Dealing Ranges — Socle") +
        link_html("arch-trade-plan.html", "13", "#7c3aed", "Trade Plan & Top-Down")
    )
    inject_after("<!-- ═══ BLOC 5: PO3 & ARCHITECTURE INSTITUTIONNELLE ═══ -->", None, bloc5_links)

    HUB.write_text(html, encoding="utf-8")
    print("\nHub mis a jour")


if __name__ == "__main__":
    main()
