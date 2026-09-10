#!/bin/bash
# update.sh — Actualiza ComegenUI en el proyecto huésped desde el artifact del repo.
# Vive junto a la lib (se instala con el zip) y, sin --only, reemplaza esta
# carpeta de forma atómica: si la descarga falla, lo anterior queda intacto.
#
# Uso:
#   ./update.sh                          → actualiza TODA la lib (main)
#   ./update.sh v3.0.0                   → actualiza TODA la lib (tag/release)
#   ./update.sh --only CuButton          → actualiza SOLO CuButton (main)
#   ./update.sh --only CuButton,CuAlert  → actualiza solo esos componentes
#   ./update.sh --only CuButton v3.0.0   → idem, pero desde un tag
#
#   -o es alias de --only. Acepta `CuButton`, `button`, `cu-button` o
#   `CuButton.umd.js`, sin distinguir mayúsculas ni guiones.
#
# Modo --only: NO reemplaza toda la carpeta. Descarga el build y copia solo los
# UMD elegidos + su doc (use-comegen/componentes/cu-*.md), dejando el resto de
# los componentes intactos (y sin tocar css/themes.css).
#
# Al actualizar (completo o selectivo) también actualiza la skill de uso
# (use-comegen/) en .agents/skills/ del proyecto huésped.
#
# Avanzado: CG_URL para override de la URL (útil para probar con un archivo local)
# y CG_PROJECT_ROOT para indicar la raíz del proyecto (si no, se detecta subiendo
# desde esta carpeta hasta .git / AGENTS.md / package.json).
set -euo pipefail

SELF="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# --- Parseo de argumentos -----------------------------------------------------
if [ "${1:-}" = "__swap__" ]; then
  # Segunda pasada: corremos desde una copia en TMP; el destino real llega en $3.
  TAG="${2:-main}"
  SELF="${3:-$(pwd)}"
  ONLY="${4:-}"
else
  TAG="main"
  ONLY=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --only|-o)
        shift
        [ $# -gt 0 ] || { echo "⚠️  --only requiere un componente" >&2; exit 2; }
        ONLY="${ONLY:+$ONLY,}$1"
        shift
        ;;
      --only=*)
        ONLY="${ONLY:+$ONLY,}${1#--only=}"
        shift
        ;;
      -*)
        echo "⚠️  Opción desconocida: $1 (se ignora)" >&2
        shift
        ;;
      *)
        TAG="$1"
        shift
        ;;
    esac
  done

  # Primera pasada: capturamos la carpeta real y corremos desde una copia en temp
  # para poder reemplazar esta carpeta (incluido este mismo script) sin romper la
  # ejecución.
  cp "$0" "$TMP/self.sh"
  exec bash "$TMP/self.sh" __swap__ "$TAG" "$SELF" "$ONLY"
fi

# --- Helpers ------------------------------------------------------------------
# CuDatePicker / cu-date-picker / date-picker / CuDatePicker.umd.js → datepicker
normalize() {
  printf '%s' "$1" \
    | sed -E 's/\.umd\.js$//' \
    | sed -E 's/^[Cc]u//' \
    | tr -cd '[:alnum:]' \
    | tr '[:upper:]' '[:lower:]'
}

# CuDatePicker.umd.js → cu-date-picker.md
doc_name() {
  local base="${1%.umd.js}"
  base="${base#Cu}"
  printf 'cu-%s.md' "$(printf '%s' "$base" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')"
}

# Sube desde la lib hasta .git / AGENTS.md / package.json.
detect_root() {
  local d="$1"
  while [ "$d" != "/" ] && [ ! -d "$d/.git" ] && [ ! -f "$d/AGENTS.md" ] && [ ! -f "$d/package.json" ]; do
    d="$(dirname "$d")"
  done
  [ "$d" != "/" ] && printf '%s' "$d"
  return 0
}

# --- Descarga -----------------------------------------------------------------
URL="${CG_URL:-https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/${TAG}/download?job=build}"
echo "⬇️  Descargando build '${TAG}'..."
curl -fsSL -o "$TMP/comegenui.zip" "$URL"
unzip -q "$TMP/comegenui.zip" -d "$TMP/x"

# Normalizar: si el artifact trae wrapper (dist/ o carpeta única), usar su contenido.
CONTENT="$TMP/x"
if [ -d "$TMP/x/dist" ]; then
  CONTENT="$TMP/x/dist"
elif [ -d "$TMP/x/comegenui" ]; then
  CONTENT="$TMP/x/comegenui"
fi

PROJECT_ROOT="${CG_PROJECT_ROOT:-$(detect_root "$SELF")}"

if [ -n "$ONLY" ]; then
  # --- Modo selectivo: copiar solo los UMD + doc elegidos ---------------------
  shopt -s nullglob
  selected_docs=()
  updated=0
  for want in $(printf '%s' "$ONLY" | tr ',' ' '); do
    [ -z "$want" ] && continue
    wnorm="$(normalize "$want")"
    match=""
    for f in "$CONTENT"/Cu*.umd.js; do
      if [ "$(normalize "$(basename "$f")")" = "$wnorm" ]; then
        match="$f"
        break
      fi
    done
    if [ -z "$match" ]; then
      echo "⚠️  No se encontró '$want' en el build '${TAG}' (se omite)" >&2
      continue
    fi
    fbase="$(basename "$match")"
    cp -f "$match" "$SELF/$fbase"
    echo "📦 ${fbase} actualizado"
    doc="$(doc_name "$fbase")"
    if [ -f "$CONTENT/use-comegen/componentes/$doc" ]; then
      mkdir -p "$SELF/use-comegen/componentes"
      cp -f "$CONTENT/use-comegen/componentes/$doc" "$SELF/use-comegen/componentes/$doc"
      selected_docs+=("$doc")
    fi
    updated=$((updated + 1))
  done

  if [ "$updated" -eq 0 ]; then
    echo "❌ Ningún componente coincidió con --only (${ONLY}). Nada se actualizó." >&2
    exit 1
  fi

  # Actualizar la skill de uso del proyecto huésped: solo los docs elegidos.
  if [ -n "$PROJECT_ROOT" ] && [ "${#selected_docs[@]}" -gt 0 ]; then
    SKILL_DIR="$PROJECT_ROOT/.agents/skills/use-comegen"
    mkdir -p "$SKILL_DIR/componentes"
    for doc in "${selected_docs[@]}"; do
      cp -f "$SELF/use-comegen/componentes/$doc" "$SKILL_DIR/componentes/$doc"
    done
    echo "📚 Docs actualizadas en $SKILL_DIR/componentes"
  elif [ -z "$PROJECT_ROOT" ]; then
    echo "⚠️  No se detectó la raíz del proyecto (sin .git/AGENTS.md/package.json). Seteá CG_PROJECT_ROOT para instalar la skill en .agents/skills."
  fi

  echo "✅ ComegenUI '${TAG}' actualizado (solo: ${ONLY}) en $SELF"
  exit 0
fi

# --- Modo completo: reemplazo atómico de toda la carpeta ----------------------
echo "🔁 Reemplazando $SELF ..."
rm -rf "$SELF.old"
mv "$SELF" "$SELF.old"
mv "$CONTENT" "$SELF"
# Si el build nuevo no trae update.sh, restaurarlo (para seguir actualizando).
if [ ! -f "$SELF/update.sh" ]; then
  cp "$SELF.old/update.sh" "$SELF/update.sh" 2>/dev/null || true
fi
rm -rf "$SELF.old"

# Instalar la skill de uso en .agents/skills/ del proyecto huésped.
# La raíz del proyecto se detecta subiendo desde la lib hasta .git / AGENTS.md /
# package.json; CG_PROJECT_ROOT la fuerza (útil si no hay ninguno de esos).
if [ -n "$PROJECT_ROOT" ] && [ -d "$SELF/use-comegen" ]; then
  mkdir -p "$PROJECT_ROOT/.agents/skills"
  rm -rf "$PROJECT_ROOT/.agents/skills/use-comegen"
  cp -r "$SELF/use-comegen" "$PROJECT_ROOT/.agents/skills/use-comegen"
  echo "📚 Skill de uso instalada en $PROJECT_ROOT/.agents/skills/use-comegen"
elif [ -z "$PROJECT_ROOT" ]; then
  echo "⚠️  No se detectó la raíz del proyecto (sin .git/AGENTS.md/package.json). Seteá CG_PROJECT_ROOT para instalar la skill en .agents/skills."
else
  echo "⚠️  El build no incluye la skill use-comegen/, se omite la instalación en .agents/skills."
fi

echo "✅ ComegenUI '${TAG}' actualizado en $SELF"
