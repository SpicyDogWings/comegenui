---
name: generate-release
description: 'Receta para preparar la próxima release de ComegenUI (este repo): verificar que las fichas de la skill y las páginas del sitio estén al día, correr TODOS los tests, validar con preflight y buildear la lib + zip versionado. Usá esta skill cuando el usuario pida "preparar la release", "generar release", "dejar todo listo para la release", "revisar la doc antes de releasear", "correr todos los tests antes de releasear" o "buildear la lib para publicar". Es solo para este proyecto (no es la skill de uso `use-comegen` que viaja en el zip, ni la de documentar `comegen-ui-docs`).'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/generate-release
  version: 5.0.2-alpha
---

# `generate-release` — preparar la próxima release

Deja el repo listo para publicar: doc al día, tests verdes, y el zip de la lib generado.

> **Regla:** la release está lista solo si el [checklist final](#checklist-final) está completo y `./scripts/guard.sh --full` da verde. No declares "listo" sin eso.

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

Anotá la versión: los zips se llaman `comegenui-<config>-v<version>.zip`. Si hay que bumpear, editá `version` en `package.json` **antes** del paso 5.

Si bumpeás la versión, actualizá también `metadata.version` en las cinco `SKILL.md`
(`skills/use-comegen/` y `docs/skills/{comegen-preflight,comegen-ui-docs,generate-release,marked}/`)
para que declaren de qué release salió cada receta.

### 1. Revisar que la doc esté al día

No hay generación: las fichas (`docs/componentes/<tag>.md` y `docs/componentes/vue/<kebab>.md`) y las páginas
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
./scripts/guard.sh --full
```

Falla si hay **errores de type-check nuevos por identidad** (respecto de `scripts/typecheck-baseline.txt`),
algún **contrato de custom element roto** (props/métodos/shadow DOM vs `scripts/contract-baseline/`),
tests rojos, o tags/componentes sin ficha o sin página. No bajes ningún baseline sin arreglar la causa;
si un cambio de API fue intencional, regenerá el contrato con `./scripts/guard.sh --update`.

### 4. Build del sitio (que la doc no rompa)

```bash
pnpm build
```

### 5. Build de la lib + zips versionados

```bash
pnpm build:lib
```

Genera `dist-libs/<config>/` (una carpeta por config) y un zip por config:
`dist-libs/<config>/comegenui-<config>-v<version>.zip`. Cada zip incluye **sólo la lib**: los
bundles de su config + el runtime del `shared` si aplica (sin CSS).

### 6. Verificar los zips

```bash
unzip -l dist-libs/umd-core/comegenui-umd-core-v<version>.zip
```

Deben existir los 4 zips (`umd-core`, `umd-shared`, `esm-core`, `esm-shared`) con los bundles
de su formato (`Cu*.umd.js` o `Cu*.js`). Los `shared` agregan su runtime
(`comegen-vue.global.js` o `comegen-vue.js`). Nada más.

### 7. Commit de lo que haya cambiado

```bash
git status --short
```

Staggeá solo lo que corresponde (doc, versión) y commiteá, p. ej.:

```bash
git add docs/componentes docs/site/componentes
git commit -m "chore(release): preparar v<version>"
```

Revisá el diff antes. **Nunca** `git add -A` a ciegas.

## Checklist final

- [ ] Fichas y páginas de los componentes que cambiaron, al día.
- [ ] `metadata.version` de las cinco `SKILL.md` coincide con `package.json`.
- [ ] `pnpm test` verde.
- [ ] `./scripts/guard.sh --full` verde (sin tipos nuevos, sin contratos rotos, docs al día).
- [ ] `pnpm build` OK.
- [ ] `pnpm build:lib` OK.
- [ ] Los 4 `dist-libs/<config>/comegenui-<config>-v<version>.zip` con sus bundles (+ el runtime del `shared`).
- [ ] Cambios commiteados.

Si algo falta, decilo explícitamente en el reporte; no lo tapes con "quedó funcionando".

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `check-docs` falla en el guard | Un tag de `src/lib` no tiene ficha o página, o a una página le falta `title`/`group`. |
| Errores de type-check "nuevos" | Compará con `scripts/typecheck-baseline.txt` (por identidad); arreglá los nuevos, no bajes el baseline. |
| `❌ <tag> ROTO` en el paso de contrato | Un prop/método/estructura del custom element cambió. Si fue a propósito: `./scripts/guard.sh --update`. |
| Tests rojos que no tocaste | El repo arrastra fallos viejos: compará con el estado previo (`git stash` + `pnpm test`). |
| La doc de un componente quedó vieja | Actualizá su ficha vanilla (`docs/componentes/<tag>.md`), su ficha Vue (`docs/componentes/vue/<kebab>.md`), su receta (`skills/use-comegen/references/<kebab>.md`) y su página (`docs/site/componentes/`). |
| El zip no incluye un componente | Debe existir su entry en `src/lib/**/*.ts` (los internos no van a la lib ni a la skill). |
| La versión del zip no es la esperada | Sale de `version` en `package.json`; bumpéala y re-corré `pnpm build:lib`. |

## Archivos que toca

| Artefacto | Ruta |
|---|---|
| Fichas | `docs/componentes/<tag>.md` y `docs/componentes/vue/<kebab>.md` |
| Recetas de la skill de uso | `skills/use-comegen/references/<kebab>.md` |
| Páginas del sitio | `docs/site/componentes/<slug>.md` (versionadas) |
| Tema del sitio | `docs/site/.vitepress/theme/*.gen.*` (generados, gitignored) |
| Build de la lib | `dist-libs/<config>/` (gitignored) + un zip por config |
