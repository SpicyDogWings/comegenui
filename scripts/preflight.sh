#!/bin/bash
# preflight.sh — ALIAS de `scripts/guard.sh` (el gate nuevo, con veredicto por
# componente). Se mantiene sólo por compatibilidad: usá `./scripts/guard.sh`.
#
# La versión vieja contaba errores de tipo contra un número mágico y nunca
# compilaba la lib; eso se reemplazó por `guard.sh` (impacto + contrato + build
# real + tipos por identidad). Este archivo se borra en la próxima release.
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/guard.sh" "$@"
