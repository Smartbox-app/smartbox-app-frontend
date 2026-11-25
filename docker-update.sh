#!/usr/bin/env bash
set -euo pipefail

APP_FILE="docker-compose.app.yml"
APP_CONTAINER="smartbox-frontend"

export $(grep -v '^#' .env | xargs)
PROJECT="${CONTAINER_NAME:?CONTAINER_NAME not set in .env}"
BRANCH="${BRANCH:-${UPDATEDBRANCH:-prod}}"
export BRANCH

echo "Starting deployment for $PROJECT (branch=$BRANCH)"

echo "Building new image (current container still serving)..."
docker compose -p "$PROJECT" -f "$APP_FILE" build \
  --build-arg "BRANCH=$BRANCH" \
  --build-arg "VITE_MAPBOX_ACCESS_TOKEN=${VITE_MAPBOX_ACCESS_TOKEN:-}" \
  --build-arg "CACHE_BUST=$(date +%s)"

echo "Replacing $APP_CONTAINER..."
docker compose -p "$PROJECT" -f "$APP_FILE" down || true
docker rm -f "$APP_CONTAINER" 2>/dev/null || true

echo "Starting replacement container..."
docker compose -p "$PROJECT" -f "$APP_FILE" up -d --force-recreate --no-build

echo "Waiting for container to become healthy..."
HEALTHY=false
for _ in $(seq 1 30); do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$APP_CONTAINER" 2>/dev/null || echo "starting")
  if [ "$STATUS" = "healthy" ]; then
    HEALTHY=true
    break
  fi
  sleep 2
done

if [ "$HEALTHY" != true ]; then
  echo "Deployment failed — container not healthy"
  docker logs "$APP_CONTAINER" --tail 80 || true
  exit 1
fi

echo "Deployment successful"
