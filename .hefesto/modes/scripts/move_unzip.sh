#!/bin/bash

# Script para mover y descomprimir un archivo ZIP en una carpeta de destino
# Uso: ./move_unzip.sh <source_zip> <destination_path>

set -e  # Salir si hay un error

SOURCE_ZIP="$1"
DESTINATION_PATH="$2"

# Validar que el archivo ZIP exista
if [ ! -f "$SOURCE_ZIP" ]; then
    echo "Error: El archivo ZIP '$SOURCE_ZIP' no existe."
    exit 1
fi

# Validar que la carpeta de destino no sea la raíz o una ruta peligrosa
if [[ "$DESTINATION_PATH" == "/"* && ! "$DESTINATION_PATH" == "/home/unancode/Documentos/releases/sigacadv2/views/comegenuiv2"* ]]; then
    echo "Error: La carpeta de destino '$DESTINATION_PATH' no es válida."
    exit 1
fi

# Verificar si la carpeta de destino existe
if [ -d "$DESTINATION_PATH" ]; then
    echo "La carpeta de destino ya existe: $DESTINATION_PATH"
else
    echo "Creando carpeta de destino: $DESTINATION_PATH"
    mkdir -p "$DESTINATION_PATH"
fi

# Limpiar el contenido de la carpeta de destino (incluyendo archivos ocultos)
echo "Limpando contenido de: $DESTINATION_PATH"
rm -rf "${DESTINATION_PATH:?}"/{*,.*} 2>/dev/null || true

# Mover el archivo ZIP a la carpeta de destino
echo "Moviendo archivo ZIP a: $DESTINATION_PATH"
mv "$SOURCE_ZIP" "$DESTINATION_PATH"

# Descomprimir el archivo ZIP en la carpeta de destino
echo "Descomprimiendo archivo ZIP en: $DESTINATION_PATH"
unzip "$DESTINATION_PATH/$(basename "$SOURCE_ZIP")" -d "$DESTINATION_PATH"

echo "Proceso completado con éxito."