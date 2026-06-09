#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "npm wurde nicht gefunden. Bitte zuerst Node.js LTS installieren: https://nodejs.org"
  exit 1
fi

npm install

if [ ! -d .git ]; then
  git init -b main
fi

git add .
git commit -m "Initial Reisefertig2.0 PWA" || true

echo ""
echo "Fertig. Starte lokal mit:"
echo "npm run dev"
echo ""
echo "GitHub remote danach setzen, zum Beispiel:"
echo "git remote add origin https://github.com/DEIN-ACCOUNT/reisefertig2-0.git"
echo "git push -u origin main"
