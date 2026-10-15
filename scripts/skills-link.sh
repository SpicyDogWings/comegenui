#!/usr/bin/env bash
# skills-link.sh — Linkea las skills del repo a `.opencode/skills/`, que es donde el agente las ve.
#
# Las skills versionadas viven en:
#   docs/skills/<nombre>/SKILL.md   recetas de desarrollo (preflight, docs, release, marked, …)
#   skills/<nombre>/SKILL.md        la skill de uso que viaja con la lib (use-comegen)
#
# El agente las descubre por los symlinks de `.opencode/skills/`: están versionados, pero el
# `.gitignore` los tapa (para versionar uno nuevo hace falta `git add -f`). Olvidarse de linkear una
# skill nueva es fácil: ya pasó con `documenter`, que existía en `docs/skills/` pero no estaba
# linkeada (y por eso el agente no la veía).
#
# Uso:
#   ./scripts/skills-link.sh           # crea/actualiza los links que falten o apunten mal
#   ./scripts/skills-link.sh --check   # sólo verifica; exit 1 si falta algo (lo usa el guard)
#   ./scripts/skills-link.sh --prune   # además borra los links obsoletos
#   ./scripts/skills-link.sh --help
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly LINK_DIR="${REPO_ROOT}/.opencode/skills"
readonly SOURCE_DIRS=("${REPO_ROOT}/docs/skills" "${REPO_ROOT}/skills")

# stk (0.2.0-alpha) no emite el salto de línea final en `log`: lo agrego acá.
stk() {
  command stk "$@"
  local rc=$?
  [[ "${1:-}" == "log" ]] && printf '\n'
  return "$rc"
}

usage() {
  cat <<'EOF'
Linkea las skills del repo en .opencode/skills/ (donde el agente las descubre).

  --check   sólo verifica: no escribe nada y sale 1 si falta un link, apunta mal
            o hay links obsoletos. Es el modo que usa `guard.sh --skills`.
  --prune   además borra los symlinks obsoletos (sólo los que apuntan a
            docs/skills o skills; nunca toca links de otros orígenes).
  -h, --help

Sin flags: crea los links que falten y corrige los que apunten mal.
EOF
}

CHECK=""
PRUNE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check) CHECK=1 ;;
    --prune) PRUNE=1 ;;
    -h|--help) usage; exit 0 ;;
    *)
      printf 'Opción desconocida: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if ! type -P stk >/dev/null 2>&1; then
  printf 'skills-link: hace falta `stk` en el PATH '
  printf '(https://github.com/SpicyDogWings/stk/releases)\n' >&2
  exit 1
fi

# ── qué debería estar linkeado ────────────────────────────────────────────────
# Cada entrada: "<nombre>|<ruta relativa al repo>".
declare -a DESIRED=()

collect_skills() {
  local dir skill name rel
  for dir in "${SOURCE_DIRS[@]}"; do
    [[ -d "$dir" ]] || continue
    while IFS= read -r -d '' skill; do
      [[ -f "${skill}/SKILL.md" ]] || continue
      name="$(basename "$skill")"
      rel="${skill#"${REPO_ROOT}/"}"
      DESIRED+=("${name}|${rel}")
    done < <(find "$dir" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)
  done
}

is_desired() {
  local name="$1" entry
  for entry in "${DESIRED[@]}"; do
    [[ "${entry%%|*}" == "$name" ]] && return 0
  done
  return 1
}

collect_skills

if [[ "${#DESIRED[@]}" -eq 0 ]]; then
  stk log "No encontré skills en ${SOURCE_DIRS[*]}" -v error
  exit 1
fi

[[ -z "$CHECK" ]] && mkdir -p "$LINK_DIR"

# ── alta / verificación ──────────────────────────────────────────────────────
created=0
fixed=0
linked=0
missing=0
wrong=0
stale=0
declare -a PROBLEMS=()

for entry in "${DESIRED[@]}"; do
  name="${entry%%|*}"
  rel="${entry#*|}"
  target="../../${rel}"
  dst="${LINK_DIR}/${name}"

  if [[ -L "$dst" ]]; then
    current="$(readlink "$dst")"
    if [[ "$current" == "$target" ]]; then
      linked=$((linked + 1))
    else
      wrong=$((wrong + 1))
      PROBLEMS+=("✗ ${name}: apunta a '${current}' (debería ser '${target}')")
      if [[ -z "$CHECK" ]]; then
        ln -sfn "$target" "$dst"
        fixed=$((fixed + 1))
      fi
    fi
  elif [[ -e "$dst" ]]; then
    wrong=$((wrong + 1))
    PROBLEMS+=("✗ ${name}: existe '${dst}' y no es un symlink (no lo toco)")
  else
    missing=$((missing + 1))
    PROBLEMS+=("✗ ${name}: falta '${dst}' → '${target}'")
    if [[ -z "$CHECK" ]]; then
      ln -s "$target" "$dst"
      created=$((created + 1))
    fi
  fi
done

# ── obsoletos: symlinks que ya no corresponden a ninguna skill ───────────────
if [[ -d "$LINK_DIR" ]]; then
  while IFS= read -r -d '' link; do
    name="$(basename "$link")"
    target="$(readlink "$link")"
    is_desired "$name" && continue
    case "$target" in
      ../../docs/skills/*|../../skills/*|*/docs/skills/*|*/skills/*) ;;
      *)
        PROBLEMS+=("• ${name}: symlink a otro origen ('${target}'), no lo toco")
        continue
        ;;
    esac
    stale=$((stale + 1))
    PROBLEMS+=("⚠ ${name}: obsoleto ('${target}')")
    if [[ -n "$PRUNE" ]]; then
      rm -- "$link"
    fi
  done < <(find "$LINK_DIR" -mindepth 1 -maxdepth 1 -type l -print0)
fi

# ── salida ───────────────────────────────────────────────────────────────────
for problem in "${PROBLEMS[@]}"; do
  stk log "${problem}" -v warning
done

total="${#DESIRED[@]}"

if [[ -n "$CHECK" ]]; then
  if [[ "$missing" -gt 0 || "$wrong" -gt 0 || "$stale" -gt 0 ]]; then
    stk log "skills: ${missing} sin linkear, ${wrong} mal linkeadas, ${stale} obsoletas" -v error
    printf '   Arreglalo con: ./scripts/skills-link.sh%s\n' "$([[ $stale -gt 0 ]] && printf ' --prune')"
    exit 1
  fi
  stk log "${total} skills linkeadas en .opencode/skills" -v success
  exit 0
fi

[[ "$created" -gt 0 ]] && stk log "${created} link(s) creado(s)" -v success
[[ "$fixed" -gt 0 ]] && stk log "${fixed} link(s) corregido(s)" -v success
[[ -n "$PRUNE" && "$stale" -gt 0 ]] && stk log "${stale} link(s) obsoleto(s) borrado(s)" -v success
[[ "$stale" -gt 0 && -z "$PRUNE" ]] && stk log "Hay ${stale} link(s) obsoleto(s): corré --prune" -v warning

if [[ "$created" -eq 0 && "$fixed" -eq 0 && "$stale" -eq 0 ]]; then
  stk log "${total} skills ya estaban linkeadas" -v success
fi

# Un destino que existe y no es symlink no se puede arreglar solo.
[[ "$wrong" -gt 0 ]] && exit 1
exit 0
