#!/bin/bash
# preflight.sh — Chequeos locales previos al merge request de ComegenUI.
#
# Uso:
#   ./scripts/preflight.sh                 # type-check + todos los tests L1
#   ./scripts/preflight.sh Alert           # type-check + solo el test L1 de Alert
#   ./scripts/preflight.sh Alert --no-typecheck
#
# type-check: no bloquea por deuda vieja, pero falla si hay errores NUEVOS
# respecto de scripts/typecheck-baseline.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SKIP_TYPECHECK=""
COMPONENT=""
for arg in "$@"; do
  case "$arg" in
    --no-typecheck) SKIP_TYPECHECK=1 ;;
    -*) echo "⚠️  Opción desconocida: $arg" >&2 ;;
    *) COMPONENT="$arg" ;;
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

TITLE="${COMPONENT:+$COMPONENT }"
echo "🛫 Preflight ComegenUI (${TITLE}$(git branch --show-current 2>/dev/null || echo 'sin rama'))"

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

# ── 2. tests L1 (todos o solo el componente) ─────────────────────────────────
if [ -n "$COMPONENT" ]; then
  TEST_FILE="$(find src/stories -name "${COMPONENT}.l1.test.ts" 2>/dev/null | head -1)"
  if [ -z "$TEST_FILE" ]; then
    echo ""
    echo "❌ No existe test L1 para '${COMPONENT}' (src/stories/**/${COMPONENT}.l1.test.ts)" >&2
    exit 1
  fi
  step "tests L1 (${COMPONENT})" pnpm exec vitest run --project l1 "$TEST_FILE"
else
  step "tests L1 (.vue)" pnpm run --silent test:l1
fi

echo ""
echo "✅ Preflight OK"
