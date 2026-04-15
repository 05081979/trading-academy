# Algorithmic Academy — FULL QT

**Indicateur TradingView Pine v6**, toolkit complet Quarterly Theory cdikici71/KA.
Fichier source : [`full-qt.pine`](full-qt.pine)

---

## Ce que fait l'indicateur

Indicateur tout-en-un de **Quarterly Theory** : cycles (yearly / monthly / weekly / daily / intraday), SSMT multi-timeframe, TPD, True Opens, Standard Deviation, HTF Candles, SMT Triad, QCISD, DOG (Daily Opening Gap), PSP & TPD, alertes.

---

## Modules principaux

| Module | Groupe settings | Rôle |
|---|---|---|
| **Cycles** | ⏱ Cycles | Affiche les cycles quarterly sur toutes les timeframes (Y/M/W/D/90m/30m/6h) |
| **True Opens** | True Opens | Plot les vraies ouvertures ICT (midnight, 00:00 GMT, NY Open, NDOG, etc.) |
| **SSMT multi-TF** | SSMTs on chart | Détecte les SMT entre 2 à 4 paires à la fois, sur plusieurs TFs |
| **TPD & PSP** | PSP & TPD | Time Price Divergence + Precision Swing Point |
| **Standard Deviation** | Defining Range | Extensions std dev depuis le defining range |
| **HTF Candles** | HTF Candle Colors | Dessine les bougies HTF (D/W/M) superposées sur ton chart |
| **Triad** | Triad | SMT Triad à 3 pattes entre trois paires |
| **QCISD** | QCISD | Change in State of Delivery (cassure micro structure) |
| **DOG** | Daily Opening Range Gap | Range gap du daily open |
| **Alertes** | Alerts | Alertes personnalisables sur SSMT / TPD / cycles |

---

## Installation

1. Ouvre TradingView → Éditeur Pine
2. Colle le contenu de `full-qt.pine`
3. Save (Ctrl+S) — nomme-le comme tu veux
4. "Ajouter au graphique"

---

## Mode d'emploi rapide

### Visibility settings
Active/désactive chaque module indépendamment :
- Cycles Y, M, W, D, 90m, 30m, 6h, ERL
- SSMTs par paires
- TPD
- True Opens
- HTF Candles
- DOG

### Cycles
- **Active Cycles** : choisis quels niveaux afficher (Y / M / W / D / Intraday)
- **Start to Cycle Candles from ahead** : projette les cycles futurs

### SSMTs
Jusqu'à **4 paires simultanées** (NQ/ES + FX + Crypto + autre). Pour chaque paire :
- **Ticker** : le symbole de corrélation
- **Show SMT 1/2/3/4** : affiche ou cache
- **Type of SSMT** : choix de la méthode de détection
- **Text Color** : couleur du label SSMT

### True Opens
- **NXOG** : New Year / Month / Week Opening Gap
- **TPD** : Time Price Delivery point
- Ajoute ton fuseau dans **Settings** → **Time zone**

### B-ADJ (Futures uniquement)
Pour les symboles futures avec roll (continuous contracts), ajuste le biais de rollover.

### Defining Range & Std Dev
Dessine les extensions std dev (1/2/3 σ) à partir du defining range (high-low sur une période).

---

## Conseils d'usage

- **Scalp 1-5min** : active D + 90m + 30m cycles + SSMT NQ/ES
- **Day trading** : active W + D + 6h + HTF Candles + TPD
- **Swing** : Y + M + W cycles + HTF Candles D/W

---

## Limites

- Max 500 boxes / 500 labels / 500 lines (limite TradingView v6). Si trop de cycles actifs simultanément, désactive les modules inutiles.
- Max bars back = 5000. Sur 1min, couvre ~3 jours.

---

## Crédits

Source originale : **cdikici71** (Quarterly_cycles_SSMT_TPD_Cx).
Adaptation : **Algorithmic Academy**.
