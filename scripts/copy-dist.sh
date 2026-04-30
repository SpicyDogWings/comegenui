#!/bin/bash

# Script para copiar el directorio dist/ a la ruta configurada
# Usa BTK para logging y colores

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Cargar BTK
source "$SCRIPT_DIR/btk.sh"

# Cargar configuración
CONFIG_FILE="$SCRIPT_DIR/config"

if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Archivo de configuración no encontrado: %s" "$CONFIG_FILE"
    log_info "Crea el archivo con: DESTINATION_PATH=\"/ruta/de/destino\""
    exit 1
fi

# Leer DESTINATION_PATH
DESTINATION=$(grep -oP 'DESTINATION_PATH="\K[^"]+' "$CONFIG_FILE" 2>/dev/null)

if [ -z "$DESTINATION" ]; then
    log_error "DESTINATION_PATH no definido en %s" "$CONFIG_FILE"
    exit 1
fi

# Verificar que dist existe
DIST_DIR="$PROJECT_ROOT/dist"
if [ ! -d "$DIST_DIR" ]; then
    log_error "Directorio dist no encontrado: %s" "$DIST_DIR"
    exit 1
fi

# Crear ruta de destino si no existe
log_info "Creando ruta de destino: %s" "$DESTINATION"
mkdir -p "$DESTINATION"

# Copiar archivos
log_info "Copiando dist/ a: %s" "$DESTINATION"
cp -r "$DIST_DIR"/* "$DESTINATION/"

if [ $? -eq 0 ]; then
    log_success "✅ Copia completada: dist/ -> %s" "$DESTINATION"
else
    log_error "❌ Error al copiar los archivos"
    exit 1
fi
