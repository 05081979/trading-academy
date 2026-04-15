# Algorithmic Academy — Smart Money Toolkit

**Indicateur TradingView Pine v6**, overlay intraday tout-en-un pour le trader ICT/Smart Money.
Fichier source : [`algorithmic-academy.pine`](algorithmic-academy.pine)

---

## Ce que fait l'indicateur

| Module | Rôle |
|---|---|
| **MSB + Order Blocks (Z-score)** | Détecte les cassures de structure avec scoring probabiliste, dessine les OB validés avec HPZ (High Probability Zones) |
| **HIPPO MTF** | Patterns HIPPO sur 15m / 30m / 1H / 4H / Daily, boxes simultanées sur le chart courant |
| **BPR / iFVG (single-TF)** | Détection classique Balanced Price Range + inverse FVG sur le TF sélectionné |
| **Multi-HTF FVG/BPR** ⭐ | **Nouveau** — FVG et BPR détectés sur **7 timeframes en parallèle** (15m / 30m / 1H / 4H / 8H / 12H / Daily) et affichés sur le chart courant. Idéal pour scalp 1min avec vision HTF. |

---

## Installation

1. Ouvre TradingView → Éditeur Pine
2. Colle le contenu de `algorithmic-academy.pine`
3. Save (Ctrl+S) → Donne-lui un nom
4. "Ajouter au graphique"

---

## Mode d'emploi — Multi-HTF FVG/BPR

### Activation rapide
Settings → groupe **Multi-HTF FVG/BPR** :

1. **Coche les TFs** que tu veux voir (par défaut : 15m + 1H + 4H)
2. **Ajuste les couleurs Bull/Bear** pour chaque TF
3. Par défaut le filtre **"Garder seulement BPR/FVG proches du prix actuel"** est actif → évite le clutter historique

### Voir BPR uniquement (sans FVG)
- Décoche **"Afficher FVG"**
- Laisse coché **"Afficher BPR"**

### Voir FVG uniquement (sans BPR)
- Laisse coché **"Afficher FVG"**
- Décoche **"Afficher BPR"**

### Distinguer visuellement FVG et BPR
- **Style FVG** / **Style BPR** : change le trait (solid / dotted / dashed)
- **Transparence FVG** / **Transparence BPR** : fond plus ou moins opaque (0 = opaque, 100 = invisible)

### Paramètres de détection
| Réglage | Effet |
|---|---|
| Nb FVG max / TF | Combien de FVG affichés par timeframe (défaut 20) |
| Nb BPR max / TF | Combien de BPR affichés par timeframe (défaut 100) |
| Min gap % | Taille minimum du gap pour compter comme FVG (défaut 0.009%) |
| Mitigation % | À quel % de pénétration une zone est considérée mitigée (défaut 50%) |
| Mitigation Type | Wick (mèche) ou Close (clôture) pour juger la mitigation |
| Mitiger FVG / BPR | Décoche pour garder toutes les zones jusqu'à atteindre la limite max |
| Real-time (lookahead) | Actif par défaut → détecte en temps réel sur la barre HTF en cours (peut repaint) |

### Filtre de proximité
- **Distance max du prix (%)** (défaut 3%) : supprime automatiquement les zones trop éloignées du prix actuel
- Utile sur 1min pour ne voir que ce qui compte vraiment
- Augmente à 10%+ pour voir un range plus large

### Tableau debug
Active **"Afficher tableau debug FVG/BPR"** → tableau en haut à droite montrant le nombre de FVG actifs et BPR détectés par TF. Sert à diagnostiquer si la détection fonctionne.

---

## Conseils d'usage

- **Scalp 1 min** : active 15m + 1H + 4H + 12H, distance 3-5%
- **Day trading** : 1H + 4H + Daily, distance 5-10%
- **Swing** : 4H + Daily + Weekly (ajoute `W` si besoin)
- Si tu **ne vois pas un BPR récent**, augmente `max_bars_back` via le code (déjà à 5000 par défaut, suffisant pour 3+ jours en 1min) et/ou désactive le filtre de proximité

---

## Limites TradingView

- Max 500 boxes affichées simultanément (limite stricte TV). Si tu actives tous les TFs avec limite haute, TV supprimera automatiquement les plus anciennes boxes.
- Le mode lookahead peut causer un léger repaint (une zone détectée en temps réel peut disparaître si la barre HTF évolue différemment à sa clôture).

---

## Changelog

- **v2.0** : ajout du **Multi-HTF FVG/BPR** (7 timeframes), filtre proximité prix, tableau debug
