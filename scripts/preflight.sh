#!/bin/bash
# preflight.sh — Chequeos locales previos al merge request de ComegenUI.
#
# Corre en orden y corta al primer fallo:
#   1. type-check (vue-tsc)
#   2. tests L1 (.vue) — vitest project "l1"
#   3. build de la lib  (fases 2/3: tests L2 .ce y L3 .umd)
#
# Uso: ./scripts/preflight.sh   (o `pnpm run preflight`)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

step() {
  echo ""
  echo "▶ $1"
  shift
  "$@"
}

echo "🛫 Preflight ComegenUI ($(git branch --show-current 2>/dev/null || echo 'sin rama'))"

step "type-check (vue-tsc)" pnpm run --silent type-check
step "tests L1 (.vue)" pnpm run --silent test:l1

echo ""
echo "✅ Preflight OK"
