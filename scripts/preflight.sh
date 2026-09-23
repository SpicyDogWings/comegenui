#!/bin/bash
# preflight.sh — Chequeos locales previos al merge request de ComegenUI.
#
# Uso:
#   ./scripts/preflight.sh                 # type-check + tests + drift de docs
#   ./scripts/preflight.sh --no-typecheck
#   ./scripts/preflight.sh --no-tests
#
# type-check: no bloquea por deuda vieja, pero falla si hay errores NUEVOS
# respecto de scripts/typecheck-baseline.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SKIP_TYPECHECK=""
SKIP_TESTS=""
for arg in "$@"; do
  case "$arg" in
    --no-typecheck) SKIP_TYPECHECK=1 ;;
    --no-tests) SKIP_TESTS=1 ;;
    -*) echo "⚠️  Opción desconocida: $arg" >&2 ;;
  esac
done

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
if [ -n "$SKIP_TYPECHECK" ]; then
  echo ""
  echo "⏭  type-check omitido (--no-typecheck)"
else
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
fi

# ── 2. tests unitarios ───────────────────────────────────────────────────────
if [ -n "$SKIP_TESTS" ]; then
  echo ""
  echo "⏭  tests omitidos (--no-tests)"
else
  step "tests unitarios" pnpm run --silent test
fi

# ── 3. drift de las fichas de API de la skill ────────────────────────────────
step "docs de la skill" node src/plugins/khadgar-docs/cli.mjs --check

echo ""
echo "✅ Preflight OK"
