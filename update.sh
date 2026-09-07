#!/bin/bash
# update.sh — Actualiza ComegenUI en el proyecto huésped desde el artifact del repo.
# Vive junto a la lib (se instala con el zip) y reemplaza esta carpeta de forma
# atómica: si la descarga falla, lo anterior queda intacto.
#
# Uso:
#   ./update.sh          → último build de main
#   ./update.sh v3.0.0   → build de un tag/release
#
# Al actualizar también instala la skill de uso (use-comegen/) en
# .agents/skills/ del proyecto huésped, para que los agentes tengan la doc.
#
# Avanzado: CG_URL para override de la URL (útil para probar con un archivo local)
# y CG_PROJECT_ROOT para indicar la raíz del proyecto (si no, se detecta subiendo
# desde esta carpeta hasta .git / AGENTS.md / package.json).
set -euo pipefail

SELF="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

TAG="${1:-main}"

if [ "${1:-}" = "__swap__" ]; then
  # Segunda pasada: corremos desde una copia en TMP; el destino real llega en $3.
  TAG="${2:-main}"
  SELF="${3:-$(pwd)}"
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
  PROJECT_ROOT="${CG_PROJECT_ROOT:-}"
  if [ -z "$PROJECT_ROOT" ]; then
    D="$SELF"
    while [ "$D" != "/" ] && [ ! -d "$D/.git" ] && [ ! -f "$D/AGENTS.md" ] && [ ! -f "$D/package.json" ]; do
      D="$(dirname "$D")"
    done
    if [ "$D" != "/" ]; then
      PROJECT_ROOT="$D"
    fi
  fi

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
  exit 0
fi

# Primera pasada: capturamos la carpeta real y corremos desde una copia en temp
# para poder reemplazar esta carpeta (incluido este mismo script) sin romper la
# ejecución.
SELF="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$0" "$TMP/self.sh"
exec bash "$TMP/self.sh" __swap__ "$TAG" "$SELF"
