#!/bin/bash
# preflight.sh — Chequeos locales previos al merge request de ComegenUI.
#
# Corre en orden y corta al primer fallo:
#   1. type-check (vue-tsc) — NO bloquea por deuda vieja, pero falla si hay
#      errores NUEVOS respecto de scripts/typecheck-baseline
#   2. tests L1 (.vue) — vitest project "l1"
#   3. (fases 2/3) tests L2 .ce y L3 .umd
#
# Uso: ./scripts/preflight.sh   (o `pnpm run preflight`)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

step() {
  echo ""
  echo "▶ $1"
  shift
  "$@"
}

echo "🛫 Preflight ComegenUI ($(git branch --show-current 2>/dev/null || echo 'sin rama'))"

# ── 1. type-check contra baseline ────────────────────────────────────────────
set +e
pnpm run --silent type-check >"$TMP/typecheck.log" 2>&1
set -e
TC_COUNT="$(grep -cE 'error TS[0-9]+' "$TMP/typecheck.log" || true)"
TC_BASELINE="$(tr -dc '0-9' <"$ROOT/scripts/typecheck-baseline" 2>/dev/null || true)"
TC_BASELINE="${TC_BASELINE:-0}"

if [ "$TC_COUNT" -gt "$TC_BASELINE" ]; then
  echo ""
  echo "❌ type-check: $TC_COUNT errores (baseline $TC_BASELINE) — hay errores NUEVOS:" >&2
  grep -E 'error TS[0-9]+' "$TMP/typecheck.log" | head -30 >&2
  exit 1
fi
echo ""
echo "✔ type-check: $TC_COUNT errores preexistentes (baseline $TC_BASELINE) — sin regresión"

step "tests L1 (.vue)" pnpm run --silent test:l1

echo ""
echo "✅ Preflight OK"
