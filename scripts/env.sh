#!/bin/bash
# scripts/env.sh — Configuración compartida para acciones de ComegenUI
# Sourced por los demás scripts. No ejecutar directamente.

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE_ZIP="/home/unancode/Documentos/canary/comegenUI/dist/comegenui.zip"
DESTINATION_PATH="/home/unancode/Documentos/releases/sigacadv2/views/comegenuiv2"
