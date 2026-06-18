#!/bin/bash
# scripts/move_unzip.sh — Mover ZIP y descomprimir en destino con Pandora
# Reemplaza a .hefesto/modes/scripts/move_unzip.sh (versión raw)

ROOT="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
source "$ROOT/scripts/env.sh"

if [ ! -f "$SOURCE_ZIP" ]; then
  pan log error "El archivo ZIP '$SOURCE_ZIP' no existe. Compilá la librería primero."
  exit 1
fi

pan confirm -t "Move and Unzip" \
  -m "Se eliminará $DESTINATION_PATH y se descomprimirá $(basename "$SOURCE_ZIP")" \
  -v danger -y "Ejecutar" || {
  pan log info "Operación cancelada"
  exit 0
}

pan log info "Preparando directorio destino..."
pan spin -l -t "Limpiando $DESTINATION_PATH..." -- rm -rf "$DESTINATION_PATH"
pan spin -l -t "Creando $DESTINATION_PATH..." -- mkdir -p "$DESTINATION_PATH"

pan log info "Moviendo archivo..."
pan spin -l -t "Moviendo $(basename "$SOURCE_ZIP")..." -- mv "$SOURCE_ZIP" "$DESTINATION_PATH"

pan log info "Descomprimiendo..."
pan spin -l -t "Descomprimiendo..." -- unzip "$DESTINATION_PATH/$(basename "$SOURCE_ZIP")" -d "$DESTINATION_PATH"

pan spin -l -t "Eliminando $(basename "$SOURCE_ZIP")..." -- rm "$DESTINATION_PATH/$(basename "$SOURCE_ZIP")"

pan log info "Operación completada: $(basename "$SOURCE_ZIP") → $DESTINATION_PATH (zip eliminado)"
