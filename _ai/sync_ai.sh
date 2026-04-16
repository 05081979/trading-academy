#!/bin/bash
# sync_ai.sh — Met a jour l'IA apres ajout/modif de modules
# Usage: bash _ai/sync_ai.sh
set -e
cd "$(dirname "$0")"
echo "=== 1. Rebuild corpus (scan modules/*.html par tier) ==="
python build_corpus.py

echo ""
echo "=== 2. Copie corpus vers le dossier worker ==="
cp corpus-starter.json worker/corpus/corpus-starter.json
cp corpus-premium.json worker/corpus/corpus-premium.json

echo ""
echo "=== 3. Inject widget chat sur toute nouvelle page ==="
python inject_widget.py

echo ""
echo "=== 4. Redeploy Cloudflare Worker ==="
cd worker
npx wrangler deploy
cd ..

echo ""
echo "=== DONE ==="
echo "L'IA connait maintenant le nouveau contenu. Fais git add + commit + push pour publier le site."
