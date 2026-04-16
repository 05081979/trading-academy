#!/bin/bash
# Deploy complet: a lancer apres `wrangler login`
set -e
cd "$(dirname "$0")"

echo "=== 1. Whoami check ==="
npx wrangler whoami || { echo "Pas logge. Lance: npx wrangler login"; exit 1; }

echo ""
echo "=== 2. Creation KV namespace RATE_KV ==="
KV_OUT=$(npx wrangler kv namespace create RATE_KV 2>&1 || true)
echo "$KV_OUT"
KV_ID=$(echo "$KV_OUT" | grep -oE 'id = "[a-f0-9]+"' | head -1 | sed -E 's/id = "([a-f0-9]+)"/\1/')
if [ -z "$KV_ID" ]; then
  # Try to get existing namespace
  KV_ID=$(npx wrangler kv namespace list 2>&1 | grep -A1 RATE_KV | grep -oE '"id": "[a-f0-9]+"' | head -1 | sed -E 's/"id": "([a-f0-9]+)"/\1/')
fi
if [ -z "$KV_ID" ]; then
  echo "ERREUR: impossible de determiner KV_ID"
  exit 1
fi
echo "KV_ID=$KV_ID"

echo ""
echo "=== 3. Patch wrangler.toml avec KV_ID ==="
# Enable the KV binding block and set id
python <<EOF
import re
from pathlib import Path
p = Path("wrangler.toml")
t = p.read_text(encoding="utf-8")
# Remove any existing [[kv_namespaces]] block
t = re.sub(r'\n\[\[kv_namespaces\]\][^\[]*', '\n', t, flags=re.MULTILINE)
# Append fresh binding
t = t.rstrip() + '\n\n[[kv_namespaces]]\nbinding = "RATE_KV"\nid = "$KV_ID"\n'
p.write_text(t, encoding="utf-8")
print("wrangler.toml OK")
EOF

echo ""
echo "=== 4. Secret GEMINI_KEY ==="
echo -n "$GEMINI_KEY" | npx wrangler secret put GEMINI_KEY

echo ""
echo "=== 5. Deploy ==="
npx wrangler deploy 2>&1 | tee /tmp/deploy_out.txt

WORKER_URL=$(grep -oE 'https://[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev' /tmp/deploy_out.txt | head -1)
echo ""
echo "=== 6. URL Worker deployee: $WORKER_URL ==="
echo "$WORKER_URL" > WORKER_URL.txt
