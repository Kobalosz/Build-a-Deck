#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/synergy-simulator-frontend"

cleanup() {
  if [[ -n "${FRONTEND_PID-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}
trap cleanup INT TERM EXIT

(
  cd "$FRONTEND_DIR"
  npm ci
  npm start
) &
FRONTEND_PID=$!

wait
