# AI Tutor — Infrastructure

Tuteur IA (Gemini 2.5 Flash via Cloudflare Worker) qui répond aux questions des élèves sur les modules du site, avec tier-gating Starter/Premium/Custom.

## Architecture

```
[Élève] → chat.js (widget) → Cloudflare Worker (aa-tutor) → Gemini 2.5 Flash
                                    ↓
                              corpus-{starter,premium}.json (embarqué)
                              RATE_KV (100 questions/jour/élève)
```

## Ajouter un nouveau module de cours

1. Crée ton HTML dans `modules/` avec `<html data-tier="starter">` ou `premium`
2. Ajoute un lien dans `hub-cours.html` (bloc existant ou nouveau)
3. Lance la sync :
   ```bash
   bash _ai/sync_ai.sh
   ```
4. Commit + push :
   ```bash
   git add . && git commit -m "Ajout module X" && git push
   ```

Le script `sync_ai.sh` :
- Re-scanne tous les modules et reconstruit `corpus-starter.json` + `corpus-premium.json`
- Injecte le widget chat sur les nouvelles pages
- Redéploie le Worker Cloudflare

## Fichiers

- `build_corpus.py` — Scanne `modules/*.html`, extrait texte par tier
- `split_ict_course.py` — Utilitaire (one-shot) pour éclater un cours multi-modules
- `inject_widget.py` — Ajoute `<script src="chat.js">` avant `</body>` sur les pages protégées
- `sync_ai.sh` — One-command sync (corpus + deploy)
- `worker/` — Cloudflare Worker (déployable via `wrangler deploy`)
- `corpus-*.json` — Données passées au LLM (régénérées à chaque sync)

## Paramètres à modifier

- **Limite quotidienne par élève** : `_ai/worker/src/worker.js` → `DAILY_LIMIT`
- **Modèle Gemini** : `_ai/worker/src/worker.js` → `MODEL` (ex: `gemini-2.5-pro` payant, `gemini-2.5-flash` gratuit)
- **Clé Gemini** : `wrangler secret put GEMINI_KEY` (depuis `_ai/worker/`)
- **Tokens révoqués** : `_ai/worker/src/worker.js` → `REVOKED` Set (à synchroniser avec `auth.js`)
