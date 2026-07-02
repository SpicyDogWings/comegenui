#!/bin/bash
# menu.sh — Menú principal ComegenUI con Pandora
# Dependencia: pan >= 0.4.5

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Iconos (Nerd Font) ──
I_LIBRARY="󱉟"
I_BUILD="󰣪"
I_MOVE="󰆾"
I_CONFIG="󰒓"
I_ADMIN="󰞷"
I_FILE="󱁉"
I_FOLDER="󰉋"
I_EXIT=""

# ── Helpers ──
ENV_FILE="$SCRIPT_DIR/scripts/env.sh"

env_set() {
  local var="$1" val="$2"
  val="${val//\\/\\\\}"
  val="${val//&/\\&}"
  if grep -q "^${var}=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^${var}=.*|${var}=\"${val}\"|" "$ENV_FILE"
  else
    echo "${var}=\"${val}\"" >> "$ENV_FILE"
  fi
  source "$ENV_FILE"
}

expand_path() {
  local path="$1"
  case "$path" in
    \~/*) echo "$HOME/${path#\~/}" ;;
    \~)   echo "$HOME" ;;
    *)    echo "$path" ;;
  esac
}

log_box() {
  local title="$*"
  local line
  line=$(printf '%*s' "${#title}" | sed 's/ /═/g')
  pan log info "╔═$line═╗"
  pan log info "║ $title ║"
  pan log info "╚═$line═╝"
}

init_env() {
  local example_file="$SCRIPT_DIR/scripts/env.sh.example"
  if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
    return 0
  fi
  pan log warn "No se encuentra env.sh"
  if [ ! -f "$example_file" ]; then
    pan log error "Tampoco existe env.sh.example. No se puede inicializar."
    exit 1
  fi
  if pan confirm -t "Inicializar" \
    -m "¿Crear env.sh desde env.sh.example?" \
    -v warning -y "Crear"; then
    cp "$example_file" "$ENV_FILE"
    source "$ENV_FILE"
    pan log info "✓ env.sh creado desde env.sh.example"
  else
    pan log error "No se puede continuar sin env.sh"
    exit 1
  fi
}

populate_menu() {
  local file="$1"
  cat > "$file" <<EOF
${I_LIBRARY} Library/${I_BUILD} Build
${I_LIBRARY} Library/${I_MOVE} Move and Unzip

${I_CONFIG} Configuración/${I_ADMIN} Administrador de paquetes
${I_CONFIG} Configuración/${I_FILE} Source Zip Path
${I_CONFIG} Configuración/${I_FOLDER} Destination Path

${I_EXIT} Salir
EOF
}

select_pm() {
  local pm
  pm=$(pan choose -t "Package Manager" npm pnpm bun deno) || return 1
  env_set "PM" "$pm"
  pan log info "✓ Package Manager: $pm"
}

# ── Main ──
init_env
log_box "ComegenUI"

MENU_FILE=$(mktemp /tmp/menu.XXXXXX)
ENTRY_FILE=$(mktemp /tmp/entry.XXXXXX)
trap 'rm -f "$MENU_FILE" "$ENTRY_FILE"' EXIT

while true; do
  populate_menu "$MENU_FILE"
  pan menu -t " ComegenUI " "$MENU_FILE" > "$ENTRY_FILE" 2>/dev/null
  EC=$?
  [ $EC -ne 0 ] && break
  read -r ENTRY < "$ENTRY_FILE"
  ENTRY="${ENTRY//$'\r'}"

  case "$ENTRY" in
    "${I_LIBRARY} Library/${I_BUILD} Build")
      bash "$SCRIPT_DIR/scripts/build_library.sh"
      ;;
    "${I_LIBRARY} Library/${I_MOVE} Move and Unzip")
      bash "$SCRIPT_DIR/scripts/move_unzip.sh"
      ;;
    "${I_CONFIG} Configuración/${I_ADMIN} Administrador de paquetes")
      select_pm
      ;;
    "${I_CONFIG} Configuración/${I_FILE} Source Zip Path")
      local src_dir
      src_dir=$(expand_path "$(dirname "${SOURCE_ZIP:-.}")")
      [ -d "$src_dir" ] || src_dir="."
      NEW_VAL=$(pan file "$src_dir") || continue
      env_set "SOURCE_ZIP" "$NEW_VAL"
      pan log info "✓ SOURCE_ZIP: $NEW_VAL"
      ;;
    "${I_CONFIG} Configuración/${I_FOLDER} Destination Path")
      local dest_dir
      dest_dir=$(expand_path "${DESTINATION_PATH:-.}")
      [ -d "$dest_dir" ] || dest_dir="."
      NEW_VAL=$(pan file -d "$dest_dir") || continue
      env_set "DESTINATION_PATH" "$NEW_VAL"
      pan log info "✓ DESTINATION_PATH: $NEW_VAL"
      ;;
    "${I_EXIT} Salir")
      break
      ;;
  esac
  echo
done
