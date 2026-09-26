---
name: generate-release
description: 'Receta para preparar la próxima release de ComegenUI (este repo): verificar que las fichas de la skill y las páginas del sitio estén al día, correr TODOS los tests, validar con preflight y buildear la lib + zip versionado. Usá esta skill cuando el usuario pida "preparar la release", "generar release", "dejar todo listo para la release", "revisar la doc antes de releasear", "correr todos los tests antes de releasear" o "buildear la lib para publicar". Es solo para este proyecto (no es la skill de uso `use-comegen` que viaja en el zip, ni la de documentar `comegen-ui-docs`).'
---

# `generate-release` — preparar la próxima release

Deja el repo listo para publicar: doc al día, tests verdes, y el zip de la lib generado.

> **Regla:** la release está lista solo si el [checklist final](#checklist-final) está completo y `./scripts/preflight.sh` da verde. No declares "listo" sin eso.

## Cuándo se activa

- "Preparar / generar la release", "dejar todo listo para la próxima release".
- "Revisar la doc" / "las fichas de los componentes".
- "Correr todos los tests antes de releasear".
- "Buildear la lib / el zip para publicar".

## Cuándo NO

- Consumir la lib en otro proyecto → skill de uso `comegen-ui` (`use-comegen`).
- Desarrollar/modificar un componente puntual → `AGENTS.md` (arquitectura y patrón de 3 archivos).
- Documentar un componente → `comegen-ui-docs` (o el agente `.opencode/agent/comegen-docs.md`).

## Precondiciones

- Estar en la rama de release (no commitear directo a `main`; `main` solo recibe merges).
- `pnpm install` al día.
- La doc se escribe a mano: si vas a tocarla, commiteá o stasheá lo pendiente antes.

## Flujo

Seguí los pasos **en orden**; cortá al primer fallo.

### 0. Estado y versión

```bash
git status --short
node -e "console.log(require('./package.json').version)"
```

Anotá la versión: el zip se llama `comegenui-v<version>.zip`. Si hay que bumpear, editá `version` en `package.json` **antes** del paso 5.

### 1. Revisar que la doc esté al día

No hay generación: las fichas (`docs/skills/use-comegen/componentes/cu-*.md`) y las páginas
(`docs/site/componentes/<slug>.md`) se mantienen a mano. Mirá qué componentes cambiaron desde la
última release y verificá que su ficha y su página lo reflejen:

```bash
git log --oneline --name-only <ultima-release>..HEAD -- src/components src/lib
```

Si un componente cambió y su doc no, actualizala (skill `comegen-ui-docs`). El gate del preflight
sólo valida que existan la ficha y la página: el contenido lo revisás vos.

### 2. Tests

```bash
pnpm test          # unitarios (Vitest)
```

### 3. Gate (type-check + tests + consistencia de docs)

```bash
./scripts/preflight.sh
```

Falla si hay **errores de type-check nuevos** (respecto de `scripts/typecheck-baseline`), tests rojos,
o tags/componentes sin ficha o sin página. No bajes el baseline sin arreglar la causa.

### 4. Build del sitio (que la doc no rompa)

```bash
pnpm build
```

### 5. Build de la lib + zip versionado

```bash
pnpm build:lib
```

Genera `dist-lib/` con los UMD, `css/themes.css` y el zip `dist-lib/comegenui-v<version>.zip`. El zip incluye los UMD, `css/`, `README-BUILD.md`, la skill `use-comegen/` y `update.sh`/`.ps1`/`.bat`.

### 6. Verificar el zip

```bash
unzip -l dist-lib/comegenui-v<version>.zip
```

Debe contener: los `Cu*.umd.js`, `css/themes.css`, `use-comegen/SKILL.md` + `use-comegen/componentes/cu-*.md`, y `update.sh`/`update.ps1`/`update.bat`.

### 7. Commit de lo que haya cambiado

```bash
git status --short
```

Staggeá solo lo que corresponde (doc, versión) y commiteá, p. ej.:

```bash
git add docs/skills/use-comegen/componentes docs/site/componentes
git commit -m "chore(release): preparar v<version>"
```

Revisá el diff antes. **Nunca** `git add -A` a ciegas.

## Checklist final

- [ ] Fichas y páginas de los componentes que cambiaron, al día.
- [ ] `pnpm test` verde.
- [ ] `./scripts/preflight.sh` verde (sin errores nuevos de type-check).
- [ ] `pnpm build` OK.
- [ ] `pnpm build:lib` OK.
- [ ] `dist-lib/comegenui-v<version>.zip` con UMDs, css, skill y update scripts.
- [ ] Cambios commiteados.

Si algo falta, decilo explícitamente en el reporte; no lo tapes con "quedó funcionando".

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `check-docs` falla en preflight | Un tag de `src/lib` no tiene ficha o página, o a una página le falta `title`/`group`. |
| Errores de type-check "nuevos" | Compará con `scripts/typecheck-baseline`; arreglá los nuevos, no bajes el baseline. |
| Tests rojos que no tocaste | El repo arrastra fallos viejos: compará con el estado previo (`git stash` + `pnpm test`). |
| La doc de un componente quedó vieja | Actualizá su ficha (`docs/skills/use-comegen/componentes/`) y su página (`docs/site/componentes/`). |
| El zip no incluye un componente | Debe existir su entry en `src/lib/**/*.ts` (los internos no van a la lib ni a la skill). |
| La versión del zip no es la esperada | Sale de `version` en `package.json`; bumpéala y re-corré `pnpm build:lib`. |

## Archivos que toca

| Artefacto | Ruta |
|---|---|
| Fichas de la skill | `docs/skills/use-comegen/componentes/cu-*.md` |
| Páginas del sitio | `docs/site/componentes/<slug>.md` (versionadas) |
| Tema del sitio | `docs/site/.vitepress/theme/*.gen.*` (generados, gitignored) |
| Build de la lib | `dist-lib/` (gitignored) + `dist-lib/comegenui-v<version>.zip` |
