---
name: crear-pr
description: 'Arma y crea el pull request de la rama actual usando la plantilla del repo: título en Conventional Commits, cuerpo completo (Qué, Issue, Verificación), push y `gh pr create`, con fallback a la URL de comparación si `gh` no está autenticado. Usar cuando el usuario pida "dame la PR", "abrí el PR", "creá el pull request", "armá el PR", "pasá la rama a PR", "completá la plantilla del PR" o "generá el título/descripción del PR".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/crear-pr
  version: 5.2.0
---

# `crear-pr`

Convierte la rama actual en un pull request usando la plantilla del repo, sin inventar secciones ni
dejar placeholders.

## Cuándo se activa

- "Dame la PR", "abrí el PR", "creá el pull request", "armá el PR", "pasá la rama a PR".
- "¿Cómo se escribe la descripción del PR?" / "completá la plantilla".

Para el gate previo (impacto, tipos, contrato, tests, mutación y docs) usá `comegen-preflight`.
Esta skill arranca cuando el gate ya está verde o cuando el usuario pide sólo el texto del PR.

## Antes de crearlo

1. **No estés en `main`.** Si estás en `main`, pedí/permití una rama; `main` sólo recibe merges.
2. **Working tree limpio.** `git status --short` sin cambios sin commitear.
3. **Gate verde.** `./scripts/guard.sh --full` (o al menos `--fast` si el usuario acepta el riesgo).
   Si falla, no abras el PR.
4. **Issue.** El repo exige una issue asociada. Pedí el número si no lo tenés; **no inventes**
   `Closes #N`. Si es un PR de release, usá la issue de release que corresponda.

## Título

Conventional Commits en español y minúsculas, igual que los commits:

```
fix(switch): renderizar label cuando el CE no tiene hijos
feat(select): permitir búsqueda remota
docs(button): aclarar la variante ghost
```

Un PR con varias cosas elige el tipo de **lo principal**; el resto va explicado en el cuerpo.

## Cuerpo

La fuente es [`.github/PULL_REQUEST_TEMPLATE.md`](../../../.github/PULL_REQUEST_TEMPLATE.md).
No la copies a mano si podés leerla: si cambia, la skill no queda vieja.

Completá las secciones:

- **Qué:** contá el **problema y la causa**, no sólo el diff. Después, qué cambió, en bullets.
  Si toca la API, decí qué props/slots/eventos/métodos cambian; si no toca nada, escribí
  «No toca la API».
- **Issue:** `Closes #N` (o `Fixes`/`Resolves`).
- **Verificación:** evidencia, no afirmaciones. Marcá sólo lo que sea cierto.

### Verificación: qué se espera

- El veredicto literal de `./scripts/guard.sh --full` y su resumen
  (tipos · build · contrato · tests · mutación · docs).
- Las páginas o el custom element con el que se probó.
- **Si el cambio es visual** (color, tamaño, layout, overflow): una tabla **antes/después** con
  valores medidos (`getComputedStyle`, `getBoundingClientRect`, `scrollWidth`…) y **capturas**
  (pegalas en el PR; GitHub las sube como `user-attachments`). Sin esto el PR no está evidenciado.
- Si cambió la API: fichas y páginas al día.
- Si el contrato cambió a propósito: baseline actualizado.
- Si agregaste un test de comportamiento: su mutación.
- Si es sólo CSS y no hay test: explicá por qué y dejá la medición/captura como evidencia.

Esqueleto de referencia:

```md
## Qué

El hover del `cu-switch` encendido se veía deslavado: el track es un color sólido, pero el
`:hover` usaba `--cu-color-{color}-ghost-hover` (el color al 10 %), así que pasaba a un rosado
casi blanco.

Ahora usa las variantes sólidas:

- `:hover` → `--cu-color-{color}-hover`.
- `:active` → `--cu-color-{color}-active`.
- El track apagado no cambia.

No toca la API: mismas props, slots, eventos y métodos.

## Issue

Closes #

## Verificación

- [x] `./scripts/guard.sh --full` en verde — `✅ RESULTADO: nada roto`
      (tipos 0 nuevos · 136 bundles · contratos intactos · 1820 tests · 100/100 mutaciones · docs)
- [x] Probado en `/componentes/cu-switch` y `/componentes/vue/switch` (Chromium, tema light)

| estado | antes | después |
|---|---|---|
| normal | `#e73f1e` | `#e73f1e` |
| `:hover` | `rgba(231,63,30,0.1)` | `#bd3014` |

![Antes y después](https://github.com/user-attachments/assets/…)
```

Para un **PR de release**, agregá al final:

- resumen del changelog (`docs/changelog/v<version>.md`),
- guía de breaking changes si existe (`docs/site/breaking/<version>.md`),
- que incluye los zips versionados (`dist-libs/comegenui-*-v<version>.zip`).

## Flujo

```bash
# 1. Contexto para escribir el cuerpo
git log --oneline main..HEAD
git diff --stat main..HEAD

# 2. Guardar el cuerpo (la carpeta .release/ está gitignoreada)
mkdir -p .release
$EDITOR .release/pr-<rama>.md

# 3. Pushear y crear el PR
git push -u origin HEAD
gh pr create --base main --head "$(git branch --show-current)" \
  --title "<título>" --body-file .release/pr-<rama>.md
```

Si `gh` no está autenticado o falla, **no reintentes a ciegas**: entregá el título, el cuerpo y la
URL de comparación para crearlo desde el navegador:

```
https://github.com/SpicyDogWings/comegenui/compare/main...<rama>?expand=1
```

Al terminar, devolvé el link del PR (o el de comparación) y un resumen de una línea.

## Errores comunes

| Síntoma | Qué hacer |
|---|---|
| `gh: not logged in` / token inválido | No insistas: pasá título + cuerpo + URL de comparación. |
| `Closes #N` sin issue | Pedí el número; no lo inventes. |
| La rama no está en el remoto | `git push -u origin HEAD` antes de `gh pr create`. |
| El PR va a una rama que no es `main` | El closing keyword **no autocierra** la issue: avisalo. |
| El cuerpo quedó con `<!-- ... -->` | Completalo o borrá el comentario; no dejes placeholders. |

## Reglas

- Un PR = un cambio con entidad; no mezcles refactors ajenos.
- Nunca `git add -A` a ciegas.
- No abras el PR con el gate en rojo.
- No mergees: el merge lo decide quien revisa.
