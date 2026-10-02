#!/bin/bash
# guard.sh — ¿dañé o no dañé un componente? Un solo comando con veredicto claro.
#
# Corre, en orden, y por cada paso explica en criollo qué hace:
#   1. impact  — qué componentes tocan los archivos que cambiaste
#   2. tipos   — errores de TypeScript NUEVOS (por identidad, no por conteo)
#   3. contrato— props/métodos/shadow DOM de cada custom element compilado
#   4. lib     — build real de los UMD + carga en jsdom
#   5. tests   — tests unitarios (los afectados, o todos con --full)
#   6. docs    — fichas/páginas y tablas de API (solo con --full)
#
# Uso:
#   ./scripts/guard.sh                  # loop rápido: impacto + tipos + contrato + lib
#   ./scripts/guard.sh --fast           # lo del hook pre-commit (sin tests ni docs)
#   ./scripts/guard.sh --full           # agrega tests completos + docs + build del sitio
#   ./scripts/guard.sh --solo cu-input  # un componente puntual
#   ./scripts/guard.sh --explicar       # agrega el "qué hace y por qué" de cada paso
#   ./scripts/guard.sh --update         # regenera el baseline de contratos
#   ./scripts/guard.sh --no-typecheck --no-build
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EXPLAIN=""
FULL=""
FAST=""
UPDATE=""
NO_TYPECHECK=""
NO_BUILD=""
NO_TESTS=""
SOLO=()

while [ $# -gt 0 ]; do
  case "$1" in
    --explicar) EXPLAIN=1 ;;
    --full) FULL=1 ;;
    --fast) FAST=1 ;;
    --update) UPDATE=1 ;;
    --no-typecheck) NO_TYPECHECK=1 ;;
    --no-build) NO_BUILD=1 ;;
    --no-tests) NO_TESTS=1 ;;
    --solo) shift; while [ $# -gt 0 ] && [[ "$1" != -* ]]; do SOLO+=("$1"); shift; done; continue ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "⚠️  Opción desconocida: $1" >&2 ;;
  esac
  shift
done

# --fast: lo que corre el hook pre-commit. Salta tests y docs.
[ -n "$FAST" ] && NO_TESTS=1

# ── salida ───────────────────────────────────────────────────────────────────
C_DIM=$'\033[2m'; C_B=$'\033[1m'; C_R=$'\033[31m'; C_G=$'\033[32m'
C_Y=$'\033[33m'; C_C=$'\033[36m'; C_0=$'\033[0m'

FAILED=0
declare -a RESUMEN=()

paso() { printf "\n%s%s%s\n" "$C_B" "$1" "$C_0"; }
detalle() { printf "   %s\n" "$1"; }
why() { [ -n "$EXPLAIN" ] && printf "   %s↳ %s%s\n" "$C_DIM" "$1" "$C_0"; return 0; }
ok() { printf "   %s✅ %s%s\n" "$C_G" "$1" "$C_0"; }
bad() { printf "   %s❌ %s%s\n" "$C_R" "$1" "$C_0"; }
warn() { printf "   %s⚠️  %s%s\n" "$C_Y" "$1" "$C_0"; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

BRANCH="$(git branch --show-current 2>/dev/null || echo 'sin rama')"
printf "%s🛫 Guard ComegenUI%s — rama %s%s%s\n" "$C_B" "$C_0" "$C_C" "$BRANCH" "$C_0"

# ── archivos cambiados ───────────────────────────────────────────────────────
CHANGED="$(cd "$ROOT" && git status --porcelain | node -e '
let data=""; process.stdin.on("data",(c)=>data+=c).on("end",()=>{
  const out=data.split("\n").map((l)=>l.trim()).filter(Boolean).map((l)=>{
    const m=/^(?:\?\?|\S+)\s+(.+)$/.exec(l); return m?m[1]:l;
  });
  console.log(out.join("\n"));
});')"

# ── 1. impacto ───────────────────────────────────────────────────────────────
paso "1/6  Impacto"
why "miro qué archivos tocaste y qué componentes dependen de ellos"
if [ -n "$CHANGED" ]; then
  N=$(printf "%s\n" "$CHANGED" | grep -c . || true)
  detalle "Tocaste $N archivo(s) sin commitear."
else
  detalle "Sin cambios sin commitear: verifico los 32 componentes."
fi

AFFECTED="$(cd "$ROOT" && node scripts/impact.mjs --files $CHANGED 2>/dev/null | grep '^- ' | sed 's/^- //')"
if [ -n "${SOLO[*]-}" ]; then
  AFFECTED="$(printf "%s\n" "${SOLO[@]}")"
  detalle "Modo --solo: ${SOLO[*]}"
elif [ -n "$AFFECTED" ]; then
  detalle "Componentes afectados:"
  while IFS= read -r t; do [ -n "$t" ] && detalle "  • $t"; done <<<"$AFFECTED"
else
  [ -n "$CHANGED" ] && detalle "Ningún componente de la lib depende de esos archivos."
fi

# ── 2. tipos ─────────────────────────────────────────────────────────────────
paso "2/6  Tipos"
why "busco errores de TypeScript NUEVOS que hayas introducido (no cuento los viejos)"
if [ -n "$NO_TYPECHECK" ]; then
  warn "omitido (--no-typecheck)"
else
  set +e
  pnpm run --silent type-check >"$TMP/tc.log" 2>&1
  set -e
  node "$ROOT/scripts/typecheck-diff.mjs" "$TMP/tc.log" "$ROOT/scripts/typecheck-baseline.txt" >"$TMP/tc-diff.txt" 2>&1
  TC_EXIT=$?
  NEW_COUNT="$(head -1 "$TMP/tc-diff.txt")"
  if [ "$TC_EXIT" -ne 0 ]; then
    bad "$NEW_COUNT error(es) de tipo NUEVOS:"
    tail -n +2 "$TMP/tc-diff.txt" | sed 's/^/      /'
    RESUMEN+=("❌ tipos: $NEW_COUNT nuevos")
    FAILED=1
  else
    ok "0 errores nuevos (los preexistentes quedan fuera de alcance)"
    RESUMEN+=("✅ tipos")
  fi
fi

# ── 3. build lib ─────────────────────────────────────────────────────────────
paso "3/6  Build de la librería"
why "compilo los UMD reales que publicás (esto es lo que ningún gate miraba)"
if [ -n "$NO_BUILD" ] && [ -d "$ROOT/dist-lib" ]; then
  warn "omitido (--no-build); uso el dist-lib existente"
else
  set +e
  COMEGEN_NO_ZIP=1 pnpm run --silent build:lib >"$TMP/build.log" 2>&1
  BL_EXIT=$?
  set -e
  if [ "$BL_EXIT" -ne 0 ]; then
    bad "el build de la lib falló:"
    tail -20 "$TMP/build.log" | sed 's/^/      /'
    RESUMEN+=("❌ build lib")
    FAILED=1
  else
    UMD=$(ls "$ROOT"/dist-lib/Cu*.umd.js 2>/dev/null | wc -l)
    ok "$UMD UMD generados"
    RESUMEN+=("✅ build lib")
  fi
fi

# ── 4. contrato ──────────────────────────────────────────────────────────────
paso "4/6  Contrato de componentes"
why "cargo cada UMD ya compilado y comparo props, métodos y shadow DOM contra el baseline"
TAGS=()
if [ -n "${SOLO[*]-}" ]; then TAGS=("${SOLO[@]}"); fi
if [ "${#TAGS[@]}" -gt 0 ]; then
  CONTRACT_ARGS=(--solo "${TAGS[@]}")
else
  CONTRACT_ARGS=()
fi
if [ -n "$UPDATE" ]; then CONTRACT_ARGS+=(--update); fi

if [ ! -d "$ROOT/dist-lib" ] || ! ls "$ROOT"/dist-lib/Cu*.umd.js >/dev/null 2>&1; then
  bad "no hay UMD en dist-lib: no puedo verificar contratos"
  RESUMEN+=("❌ contrato (sin dist)")
  FAILED=1
else
  set +e
  node scripts/contract.mjs "${CONTRACT_ARGS[@]}" >"$TMP/contract.out" 2>"$TMP/contract.err"
  CT_EXIT=$?
  set -e
  BROKEN=$(grep -c 'ROTO' "$TMP/contract.out" || true)
  if [ "$CT_EXIT" -ne 0 ]; then
    bad "$BROKEN componente(s) dañado(s):"
    grep -A100 'ROTO' "$TMP/contract.out" | sed 's/^/      /'
    RESUMEN+=("❌ contrato: $BROKEN roto(s)")
    FAILED=1
  else
    ok "todos los contratos intactos"
    RESUMEN+=("✅ contrato")
  fi
fi

# ── 5. tests ─────────────────────────────────────────────────────────────────
paso "5/6  Tests unitarios"
why "corro las pruebas; en el loop rápido solo las de los componentes afectados"
if [ -n "$NO_TESTS" ]; then
  warn "omitido (--no-tests)"
  RESUMEN+=("⏭  tests")
elif [ -n "$FULL" ] || [ -z "$AFFECTED" ]; then
  set +e
  pnpm run --silent test >"$TMP/test.log" 2>&1
  TS_EXIT=$?
  set -e
  if [ "$TS_EXIT" -ne 0 ]; then
    bad "tests en rojo:"
    grep -E '❯|×|FAIL|failed' "$TMP/test.log" | head -20 | sed 's/^/      /'
    RESUMEN+=("❌ tests")
    FAILED=1
  else
    ok "$(grep -oE 'Tests +[0-9]+ passed' "$TMP/test.log" | head -1 || echo 'tests OK')"
    RESUMEN+=("✅ tests")
  fi
else
  warn "loop rápido: tests completos solo con --full o sin impacto detectado"
  RESUMEN+=("⏭  tests (--full para correrlos)")
fi

# ── 6. docs ──────────────────────────────────────────────────────────────────
paso "6/6  Docs"
why "verifico fichas/páginas y que las tablas de API estén al día"
if [ -n "$FULL" ]; then
  set +e
  node scripts/check-docs.mjs >"$TMP/docs.log" 2>&1; D1=$?
  node scripts/gen-api.mjs --check >>"$TMP/docs.log" 2>&1; D2=$?
  set -e
  if [ "$D1" -ne 0 ] || [ "$D2" -ne 0 ]; then
    bad "$(grep -c '✗' "$TMP/docs.log" || true) problema(s) de docs:"
    tail -20 "$TMP/docs.log" | sed 's/^/      /'
    RESUMEN+=("❌ docs")
    FAILED=1
  else
    ok "fichas y API al día"
    RESUMEN+=("✅ docs")
  fi
else
  warn "omitido (usá --full para docs y build del sitio)"
  RESUMEN+=("⏭  docs (--full)")
fi

# ── veredicto ────────────────────────────────────────────────────────────────
printf "\n%s─────────────────────────────────────────────%s\n" "$C_DIM" "$C_0"
for line in "${RESUMEN[@]}"; do printf "   %s\n" "$line"; done
printf "%s─────────────────────────────────────────────%s\n" "$C_DIM" "$C_0"
if [ "$FAILED" -eq 0 ]; then
  printf "%s✅ RESULTADO: nada roto. Adelante.%s\n" "$C_G$C_B" "$C_0"
else
  printf "%s❌ RESULTADO: hay componentes rotos o fallos. NO mergear.%s\n" "$C_R$C_B" "$C_0"
fi
exit "$FAILED"
