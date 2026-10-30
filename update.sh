#!/usr/bin/env bash
set -euo pipefail

UPDATEDBRANCH="$(printenv UPDATEDBRANCH)"
BRANCH="origin/$UPDATEDBRANCH"

git fetch --all
git reset --hard "$BRANCH"
NODE_ENV=skipForInstall yarn --production=false

echo "Using build script yarn build-$UPDATEDBRANCH"
yarn "build-$UPDATEDBRANCH"
yarn build-ssr
chmod -R 0777 ./dist

# Restart SSR if managed by pm2 (name from previous standalone smartbox-ssr deploy)
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart smartbox-ssr || pm2 start yarn --name smartbox-ssr -- start:ssr
fi

echo "done"
