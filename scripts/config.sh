#!/bin/bash
# scripts/config.sh — Editar variables del entorno con pan

ROOT="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
ENV_FILE="$ROOT/scripts/env.sh"

ENTRY_FILE=$(mktemp /tmp/pan_menu.XXXXXX)
trap 'rm -f "$ENTRY_FILE"' EXIT

while true; do
  source "$ENV_FILE"

  pan menu -t "Configuración" "$ROOT/scripts/config.txt" > "$ENTRY_FILE" < /dev/tty
  EC=$?
  sed -i $'s/\x1b\\[[0-9;]*[a-zA-Z]//g' "$ENTRY_FILE" 2>/dev/null || true
  [ $EC -ne 0 ] && break
  read -r SELECTED < "$ENTRY_FILE"
  SELECTED="${SELECTED//$'\r'}"
  VAR_NAME="${SELECTED##*/}"

  case "$VAR_NAME" in
    SOURCE_ZIP)
      NEW_VALUE=$(pan file "$(dirname "${!VAR_NAME:-.}")") || continue
      ;;
    DESTINATION_PATH)
      NEW_VALUE=$(pan file -d "${!VAR_NAME:-.}") || continue
      ;;
    *)
      NEW_VALUE=$(pan input -p "$VAR_NAME" -v "${!VAR_NAME}") || continue
      ;;
  esac

  if [ -z "$NEW_VALUE" ]; then
    continue
  fi

  ESCAPED=${NEW_VALUE//\\/\\\\}
  ESCAPED=${ESCAPED//&/\\&}
  sed -i "s|^$VAR_NAME=.*|$VAR_NAME=\"$ESCAPED\"|" "$ENV_FILE"
done
