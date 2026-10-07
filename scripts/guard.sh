#!/bin/bash
# guard.sh — ¿dañé o no dañé un componente? Un solo comando con veredicto claro.
#
# Pasos (cada uno tiene su flag para correrlo solo):
#   --impacto   qué componentes tocan los archivos que cambiaste
#   --tipos     errores de TypeScript NUEVOS (por identidad, no por conteo)
#   --build     build real de los UMD (lo que ningún gate miraba)
#   --contrato  props/métodos/shadow DOM de cada custom element vs baseline
#   --mutacion  aplica bugs conocidos y verifica que los tests los detecten
#   --tests     tests unitarios
#   --docs      fichas/páginas y tablas de API
#
# Uso:
#   ./scripts/guard.sh                  # loop rápido: impacto + tipos + build + contrato
#   ./scripts/guard.sh --fast           # lo del hook pre-commit (sin tests/docs/mutación)
#   ./scripts/guard.sh --full           # agrega tests + docs + mutación
#   ./scripts/guard.sh --mutacion       # SOLO la prueba de falsos verdes
#   ./scripts/guard.sh --contrato --tipos   # combinar pasos puntuales
#   ./scripts/guard.sh --solo cu-input  # limita contrato/tests a un componente
#   ./scripts/guard.sh --explicar       # agrega el "qué hace y por qué" de cada paso
#   ./scripts/guard.sh --update         # regenera el baseline de contratos
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EXPLAIN=""
FULL=""
FAST=""
UPDATE=""
SOLO=()

# Pasos: por defecto el loop rápido. Cualquier --<paso> activa modo "solo esos".
DEFAULT_STEPS="impacto tipos build contrato"
declare -a STEPS=()
declare -a EXPLICIT=()
add_step() {
  for s in "${EXPLICIT[@]}"; do [ "$s" = "$1" ] && return; done
  EXPLICIT+=("$1")
}

while [ $# -gt 0 ]; do
  case "$1" in
    --explicar) EXPLAIN=1 ;;
    --full) FULL=1 ;;
    --fast) FAST=1 ;;
    --update) UPDATE=1 ;;
    --solo) shift; while [ $# -gt 0 ] && [[ "$1" != -* ]]; do SOLO+=("$1"); shift; done; continue ;;
    --impacto) add_step impacto ;;
    --tipos) add_step tipos ;;
    --build) add_step build ;;
    --contrato|--contratos) add_step contrato ;;
    --mutacion|--mutación|--mutation) add_step mutacion ;;
    --tests) add_step tests ;;
    --docs) add_step docs ;;
    --no-typecheck|--no-build|--no-tests) ;; # compat: se ignoran en modo explícito
    -h|--help) sed -n '2,23p' "$0"; exit 0 ;;
    *) echo "⚠️  Opción desconocida: $1" >&2 ;;
  esac
  shift
done

# Resolución de pasos.
if [ "${#EXPLICIT[@]}" -gt 0 ]; then
  STEPS=("${EXPLICIT[@]}")          # modo explícito: solo lo pedido
elif [ -n "$FULL" ]; then
  STEPS=(impacto tipos build contrato tests docs mutacion)
elif [ -n "$FAST" ]; then
  STEPS=(impacto tipos build contrato)
else
  STEPS=($DEFAULT_STEPS)
fi

has() { for s in "${STEPS[@]}"; do [ "$s" = "$1" ] && return 0; done; return 1; }

# ── salida ───────────────────────────────────────────────────────────────────
C_DIM=$'\033[2m'; C_B=$'\033[1m'; C_R=$'\033[31m'; C_G=$'\033[32m'
C_Y=$'\033[33m'; C_C=$'\033[36m'; C_0=$'\033[0m'

FAILED=0
declare -a RESUMEN=()
N_STEPS=${#STEPS[@]}
IDX=0

paso() {
  IDX=$((IDX + 1))
  printf "\n%s%s/%s  %s%s\n" "$C_B" "$IDX" "$N_STEPS" "$1" "$C_0"
}
detalle() { printf "   %s\n" "$1"; }
why() { [ -n "$EXPLAIN" ] && printf "   %s↳ %s%s\n" "$C_DIM" "$1" "$C_0"; return 0; }
ok() { printf "   %s✅ %s%s\n" "$C_G" "$1" "$C_0"; }
bad() { printf "   %s❌ %s%s\n" "$C_R" "$1" "$C_0"; }
warn() { printf "   %s⚠️  %s%s\n" "$C_Y" "$1" "$C_0"; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

BRANCH="$(git branch --show-current 2>/dev/null || echo 'sin rama')"
printf "%s🛫 Guard ComegenUI%s — rama %s%s%s · pasos: %s\n" "$C_B" "$C_0" "$C_C" "$BRANCH" "$C_0" "${STEPS[*]}"

# ── impacto (primero: define AFFECTED para el resto) ─────────────────────────
CHANGED="$(cd "$ROOT" && git status --porcelain | node -e '
let data=""; process.stdin.on("data",(c)=>data+=c).on("end",()=>{
  const out=data.split("\n").map((l)=>l.trim()).filter(Boolean).map((l)=>{
    const m=/^(?:\?\?|\S+)\s+(.+)$/.exec(l); return m?m[1]:l;
  });
  console.log(out.join("\n"));
});')"
AFFECTED="$(cd "$ROOT" && node scripts/impact.mjs --files $CHANGED 2>/dev/null | grep '^- ' | sed 's/^- //')"

if has impacto; then
  paso "Impacto"
  why "miro qué archivos tocaste y qué componentes dependen de ellos"
  if [ -n "$CHANGED" ]; then
    N=$(printf "%s\n" "$CHANGED" | grep -c . || true)
    detalle "Tocaste $N archivo(s) sin commitear."
  else
    detalle "Sin cambios sin commitear: verifico todos los componentes."
  fi
  if [ -n "${SOLO[*]-}" ]; then
    AFFECTED="$(printf "%s\n" "${SOLO[@]}")"
    detalle "Modo --solo: ${SOLO[*]}"
  elif [ -n "$AFFECTED" ]; then
    detalle "Componentes afectados:"
    while IFS= read -r t; do [ -n "$t" ] && detalle "  • $t"; done <<<"$AFFECTED"
  else
    [ -n "$CHANGED" ] && detalle "Ningún componente de la lib depende de esos archivos."
  fi
fi

# ── tipos ────────────────────────────────────────────────────────────────────
if has tipos; then
  paso "Tipos"
  why "busco errores de TypeScript NUEVOS que hayas introducido (no cuento los viejos)"
  set +e
  pnpm run --silent type-check >"$TMP/tc.log" 2>&1
  node "$ROOT/scripts/typecheck-diff.mjs" "$TMP/tc.log" "$ROOT/scripts/typecheck-baseline.txt" >"$TMP/tc-diff.txt" 2>&1
  TC_EXIT=$?
  NEW_COUNT="$(head -1 "$TMP/tc-diff.txt")"
  if [ "$TC_EXIT" -ne 0 ]; then
    bad "$NEW_COUNT error(es) de tipo NUEVOS:"
    tail -n +2 "$TMP/tc-diff.txt" | sed 's/^/      /'
    RESUMEN+=("❌ tipos: $NEW_COUNT nuevos"); FAILED=1
  else
    ok "0 errores nuevos (los preexistentes quedan fuera de alcance)"
    RESUMEN+=("✅ tipos")
  fi
fi

# ── build lib ────────────────────────────────────────────────────────────────
if has build; then
  paso "Build de la librería"
  why "compilo los UMD reales que publicás (esto es lo que ningún gate miraba)"
  set +e
  COMEGEN_NO_ZIP=1 pnpm run --silent build:lib >"$TMP/build.log" 2>&1
  BL_EXIT=$?
  set -e
  if [ "$BL_EXIT" -ne 0 ]; then
    bad "el build de la lib falló:"
    tail -20 "$TMP/build.log" | sed 's/^/      /'
    RESUMEN+=("❌ build lib"); FAILED=1
  else
    UMD=$(ls "$ROOT"/dist-lib/Cu*.umd.js 2>/dev/null | wc -l)
    CORE=$(ls "$ROOT"/dist-lib/Cu*.core.umd.js 2>/dev/null | wc -l)
    SHARED=$(ls "$ROOT"/dist-lib/Cu*.shared.umd.js 2>/dev/null | wc -l)
    ok "$UMD UMD generados ($CORE core + $SHARED shared)"
    RESUMEN+=("✅ build lib")
  fi
fi

# ── contrato ─────────────────────────────────────────────────────────────────
if has contrato; then
  paso "Contrato de componentes"
  why "cargo cada UMD ya compilado y comparo props, métodos y shadow DOM contra el baseline"
  TAGS=()
  if [ -n "${SOLO[*]-}" ]; then TAGS=("${SOLO[@]}"); fi
  CONTRACT_ARGS=()
  [ "${#TAGS[@]}" -gt 0 ] && CONTRACT_ARGS=(--solo "${TAGS[@]}")
  [ -n "$UPDATE" ] && CONTRACT_ARGS+=(--update)

  if [ ! -d "$ROOT/dist-lib" ] || ! ls "$ROOT"/dist-lib/Cu*.umd.js >/dev/null 2>&1; then
    bad "no hay UMD en dist-lib: no puedo verificar contratos"
    RESUMEN+=("❌ contrato (sin dist)"); FAILED=1
  else
    set +e
    node scripts/contract.mjs "${CONTRACT_ARGS[@]}" >"$TMP/contract.out" 2>"$TMP/contract.err"
    CT_EXIT=$?
    set -e
    BROKEN=$(grep -c 'ROTO' "$TMP/contract.out" || true)
    if [ "$CT_EXIT" -ne 0 ]; then
      bad "$BROKEN componente(s) dañado(s):"
      grep -A100 'ROTO' "$TMP/contract.out" | sed 's/^/      /'
      RESUMEN+=("❌ contrato: $BROKEN roto(s)"); FAILED=1
    else
      ok "todos los contratos intactos"
      RESUMEN+=("✅ contrato")
    fi
  fi
fi

# ── tests ────────────────────────────────────────────────────────────────────
if has tests; then
  paso "Tests unitarios"
  why "corro las pruebas; solo los componentes afectados salvo --full"
  if [ -n "$FULL" ] || [ -z "$AFFECTED" ]; then
    set +e
    pnpm run --silent test >"$TMP/test.log" 2>&1
    TS_EXIT=$?
    set -e
    if [ "$TS_EXIT" -ne 0 ]; then
      bad "tests en rojo:"
      grep -E '❯|×|FAIL|failed' "$TMP/test.log" | head -20 | sed 's/^/      /'
      RESUMEN+=("❌ tests"); FAILED=1
    else
      ok "$(grep -oE 'Tests +[0-9]+ passed' "$TMP/test.log" | head -1 || echo 'tests OK')"
      RESUMEN+=("✅ tests")
    fi
  else
    detalle "componentes afectados: ${AFFECTED//$'\n'/ }"
    set +e
    pnpm run --silent test >"$TMP/test.log" 2>&1
    TS_EXIT=$?
    set -e
    if [ "$TS_EXIT" -ne 0 ]; then
      bad "tests en rojo:"; grep -E '×|FAIL' "$TMP/test.log" | head -20 | sed 's/^/      /'
      RESUMEN+=("❌ tests"); FAILED=1
    else
      ok "$(grep -oE 'Tests +[0-9]+ passed' "$TMP/test.log" | head -1 || echo 'tests OK')"
      RESUMEN+=("✅ tests")
    fi
  fi
fi

# ── mutación (falsos verdes) ─────────────────────────────────────────────────
if has mutacion; then
  paso "Mutación (¿los tests detectan bugs reales?)"
  why "aplico bugs conocidos uno por uno y verifico que algún test se ponga en rojo"
  MUT_ARGS=()
  [ -n "${SOLO[*]-}" ] && [ "${#SOLO[@]}" -eq 1 ] && MUT_ARGS=(--solo "${SOLO[0]}")
  set +e
  node scripts/mutation-check.mjs "${MUT_ARGS[@]}" >"$TMP/mut.log" 2>&1
  MUT_EXIT=$?
  set -e
  if [ "$MUT_EXIT" -ne 0 ]; then
    bad "hay mutaciones que los tests NO detectan (falsos verdes):"
    grep -E '❌|⚠️' "$TMP/mut.log" | sed 's/^/      /'
    RESUMEN+=("❌ mutación: falso(s) verde(s)"); FAILED=1
  else
    ok "$(grep -oE '[0-9]+/[0-9]+ mutaciones detectadas' "$TMP/mut.log" | head -1 || echo 'todas detectadas')"
    RESUMEN+=("✅ mutación")
  fi
fi

# ── docs ─────────────────────────────────────────────────────────────────────
if has docs; then
  paso "Docs"
  why "verifico fichas/páginas y que las tablas de API estén al día"
  set +e
  node scripts/check-docs.mjs >"$TMP/docs.log" 2>&1; D1=$?
  node scripts/gen-api.mjs --check >>"$TMP/docs.log" 2>&1; D2=$?
  set -e
  if [ "$D1" -ne 0 ] || [ "$D2" -ne 0 ]; then
    bad "$(grep -c '✗' "$TMP/docs.log" || true) problema(s) de docs:"
    tail -20 "$TMP/docs.log" | sed 's/^/      /'
    RESUMEN+=("❌ docs"); FAILED=1
  else
    ok "fichas y API al día"
    RESUMEN+=("✅ docs")
  fi
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
