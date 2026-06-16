#!/bin/bash
# scripts/storybook_dev.sh — Iniciar Storybook en modo desarrollo con Pandora

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/env.sh"

pan log info "Iniciando Storybook en http://localhost:6006"
pan spin -t "Storybook Dev" -- pnpm run storybook
