#!/bin/bash
# scripts/build_library.sh — Compilar la librería ComegenUI con Pandora

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/env.sh"

pan confirm -t "Build Library" -m "¿Compilar la librería ComegenUI?" -y "Compilar" || {
  pan log info "Compilación cancelada"
  exit 0
}

pan spin -l -t "Compilando librería..." -a dots -- pnpm build:lib

if [ $? -eq 0 ]; then
  pan log info "Librería compilada correctamente"
else
  pan log error "Error al compilar la librería"
  exit 1
fi
