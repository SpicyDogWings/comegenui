#!/bin/bash
# menu.sh — Menú principal para ComegenUI con Pandora
# Dependencia: pan >= 0.4.5 (https://github.com/anomalyco/hefesto)

ROOT="$(cd "$(dirname "$0")" && pwd)"
source "$ROOT/scripts/env.sh"

ENTRY_FILE="/tmp/pan_entry_$$"
trap 'rm -f "$ENTRY_FILE"' EXIT

while true; do
  pan menu -t "ComegenUI" "$ROOT/scripts/menu.txt" > "$ENTRY_FILE" 2>/dev/null
  EC=$?
  sed -i $'s/\x1b\\[[0-9;]*[a-zA-Z]//g' "$ENTRY_FILE" 2>/dev/null || true
  [ $EC -ne 0 ] && break

  read -r ENTRY < "$ENTRY_FILE"
  ENTRY="${ENTRY//$'\r'}"

  case "$ENTRY" in
    "Library/Build")
      pan log info "Compilando librería ComegenUI..."
      bash "$ROOT/scripts/build_library.sh"
      ;;
    "Library/Move and Unzip")
      pan log info "Moviendo y descomprimiendo..."
      bash "$ROOT/scripts/move_unzip.sh"
      ;;
    "Storybook Dev")
      pan log info "Iniciando Storybook..."
      bash "$ROOT/scripts/storybook_dev.sh"
      ;;
    "Configuración")
      bash "$ROOT/scripts/config.sh"
      ;;
    "Salir")
      pan log info "Saliendo del menú"
      break
      ;;
  esac

  echo
done
