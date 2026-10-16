---
name: generate-release
description: 'Receta para preparar la próxima release de ComegenUI (este repo): verificar que las fichas de la skill y las páginas del sitio estén al día, correr TODOS los tests, validar con preflight, buildear la lib + zip versionado, cortar la versión (tag + manifiesto + congelado de la doc) y publicar. Usá esta skill cuando el usuario pida "preparar la release", "generar release", "dejar todo listo para la release", "revisar la doc antes de releasear", "correr todos los tests antes de releasear", "cortar la versión", "buildear la lib para publicar". Es solo para este proyecto (no es la skill de uso `use-comegen` que viaja en el zip, ni la de documentar `documenter`).'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/generate-release
  version: 5.1.1
---

# `generate-release` — preparar la próxima release

Deja el repo listo para publicar: doc al día, tests verdes, el zip de la lib generado, la versión
cortada (tag + manifiesto + doc congelada) y el sitio de versiones publicado.

> **Regla:** la release está lista solo si el [checklist final](#checklist-final) está completo y
> `./scripts/guard.sh --full` da verde. No declares "listo" sin eso.

## Cuándo se activa

- "Preparar / generar la release", "dejar todo listo para la próxima release".
- "Revisar la doc" / "las fichas de los componentes".
- "Correr todos los tests antes de releasear".
- "Buildear la lib / el zip para publicar".
- "Cortar la versión" (tag + manifiesto + congelar la doc).

## Cuándo NO

- Consumir la lib en otro proyecto → skill de uso `use-comegen`.
- Desarrollar/modificar un componente puntual → `AGENTS.md` (patrón de 3 archivos).
- Documentar un componente → `documenter` (o el agente `.opencode/agent/comegen-docs.md`).

## Precondiciones

- Estar en la **rama de release** (no commitear directo a `main`; `main` solo recibe merges).
- `pnpm install` al día.
- **La doc ya no vive en `docs/componentes/`**: es la fuente versionada `docs/versiones/<id>/`, y
  `docs/{componentes,partials,site/componentes,site/examples}` son **compuestos** (gitignored) por
  `pnpm docs:compose` (corre dentro de `dev` y `build`). No edites ni commitees los compuestos.
- La doc se escribe a mano: si vas a tocarla, commiteá o stasheá lo pendiente antes.

> En todos los comandos de abajo, `<id>` es la versión **`latest`** del manifiesto
> (`docs/versions.json`), y `<version>` es `version` de `package.json`. Hoy: `5.1.1`.

## Flujo

Seguí los pasos **en orden**; cortá al primer fallo.

### 0. Estado y versión

```bash
git status --short
node -e "console.log(require('./package.json').version)"
```

Anotá la versión: los zips se llaman `comegenui-<config>-v<version>.zip`. Si hay que bumpear, editá
`version` en `package.json` **antes** del paso 5 y actualizá `metadata.version` en las **seis**
`SKILL.md` (`skills/use-comegen/` + `docs/skills/{comegen-preflight,documenter,generate-release,marked,release-changelog}/`)
para que declaren de qué release salió cada receta.

### 1. Revisar que la doc esté al día

No hay generación: las fichas (`docs/versiones/<id>/componentes/<tag>.md` y
`docs/versiones/<id>/componentes/vue/<kebab>.md`) y las páginas
(`docs/versiones/<id>/paginas/componentes/<slug>.md`) se mantienen a mano. Mirá qué componentes
cambiaron desde la última release y verificá que su ficha, su receta y su página lo reflejen:

```bash
git log --oneline --name-only <ultima-release>..HEAD -- src/components src/lib
```

Si un componente cambió y su doc no, actualizala (skill `documenter`). El gate sólo valida que
existan la ficha y la página: el contenido lo revisás vos.

### 2. Changelog y breaking changes

- **Changelog** (`docs/changelog/v<version>.md`): generá o revisá con la skill `release-changelog`
  (delta entre la última release y HEAD).
- **Breaking changes** (`docs/site/breaking/<version>.md` + su fila en `docs/site/breaking/index.md`):
  una página **por salto**, con lo que rompe y qué hacer. Si el salto no rompe nada, no se agrega.

### 3. Tests

```bash
pnpm test          # unitarios (Vitest)
```

### 4. Gate (type-check + tests + consistencia de docs)

```bash
./scripts/guard.sh --full
```

Falla si hay **errores de type-check nuevos por identidad** (respecto de
`scripts/typecheck-baseline.txt`), algún **contrato de custom element roto**
(props/métodos/shadow DOM vs `scripts/contract-baseline/`), tests rojos, o tags/componentes sin
ficha o sin página. No bajes ningún baseline sin arreglar la causa; si un cambio de API fue
intencional, regenerá el contrato con `./scripts/guard.sh --update`.

### 5. Build del sitio (que la doc no rompa)

```bash
pnpm build
```

### 6. Build de la lib + zips versionados

```bash
pnpm build:lib
```

Genera `dist-libs/<config>/` (una carpeta por config) y deja los 4 zips **sueltos** en
`dist-libs/comegenui-<config>-v<version>.zip`. Cada zip incluye **sólo la lib**: los bundles de su
config + el runtime del `shared` si aplica (sin CSS, sin doc, sin skill).

### 7. Verificar los zips

```bash
unzip -l dist-libs/comegenui-umd-core-v<version>.zip
```

Deben existir los 4 zips (`umd-core`, `umd-shared`, `esm-core`, `esm-shared`) con los bundles de su
formato (`Cu*.umd.js` o `Cu*.js`). Los `shared` agregan su runtime (`comegen-vue.global.js` o
`comegen-vue.js`). Nada más.

### 8. Cortar la versión (tag + manifiesto + congelado)

Después de que la release esté mergeada y pusheada en `main`:

```bash
git tag -a v<version> -m "ComegenUI v<version>"   # el tag apunta al commit YA mergeado
git push origin v<version>
```

- **Manifiesto** `docs/versions.json`: mové el flag. La versión nueva queda `latest: true` con
  `ref: "HEAD"`; la anterior pierde `latest` y pasa a `ref: "v<anterior>"`. Sólo puede haber **una**
  con `latest: true` (el script falla si hay 0 o 2). No hay tag `latest` de git: `latest` es el flag.
- **Congelá la doc** de la versión que sale:

```bash
pnpm docs:freeze <id>     # materializa las tablas de API: saca los marcadores @api
```

Una versión congelada no necesita el SFC ni el toolchain de su tag. **Ojo**: después de congelar, la
versión no se regenera; los cambios siguientes van en una versión nueva (una carpeta overlay en
`docs/versiones/<nueva>/` con sólo lo que cambia).

### 9. Publicar

```bash
pnpm docs:versions              # compone y buildea el sitio con las versiones del manifiesto
pnpm deploy:docs:versions       # publica esa salida (raíz = latest, /<id>/ por versión)
```

Si querés la release de GitHub con los zips adjuntos: `gh release create v<version> dist-libs/*.zip`.

### 10. Commit de lo que haya cambiado

```bash
git status --short
```

Staggeá sólo lo que corresponde (doc versionada, changelog, breaking, versión) y commiteá, p. ej.:

```bash
git commit -m "chore(release): preparar v<version>"
```

Revisá el diff antes. **Nunca** `git add -A` a ciegas (y nunca los compuestos: están gitignoreados).

## Checklist final

- [ ] Fichas, recetas y páginas de los componentes que cambiaron, al día.
- [ ] Changelog `docs/changelog/v<version>.md` + breaking changes si el salto rompe algo.
- [ ] `metadata.version` de las **seis** `SKILL.md` (`use-comegen` + las cinco de `docs/skills/`) coincide con `package.json`.
- [ ] `pnpm test` verde.
- [ ] `./scripts/guard.sh --full` verde (sin tipos nuevos, sin contratos rotos, docs al día).
- [ ] `pnpm build` OK.
- [ ] `pnpm build:lib` OK.
- [ ] Los 4 `dist-libs/comegenui-<config>-v<version>.zip` (sueltos) con sus bundles (+ el runtime del `shared`).
- [ ] Tag `v<version>` creado y pusheado, apuntando al commit mergeado en `main`.
- [ ] `docs/versions.json`: una sola `latest` (la nueva) y la anterior con su `ref` de tag.
- [ ] Doc de la versión congelada (`pnpm docs:freeze <id>`).
- [ ] Sitio de versiones publicado (`pnpm deploy:docs:versions`).
- [ ] Cambios commiteados, mergeados a `main` y pusheados.

Si algo falta, decilo explícitamente en el reporte; no lo tapes con "quedó funcionando".

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `check-docs` falla en el guard | Un tag de `src/lib` no tiene ficha o página, o a una página le falta `title`/`group`. |
| Errores de type-check "nuevos" | Compará con `scripts/typecheck-baseline.txt` (por identidad); arreglá los nuevos, no bajes el baseline. |
| `❌ <tag> ROTO` en el paso de contrato | Un prop/método/estructura del custom element cambió. Si fue a propósito: `./scripts/guard.sh --update`. |
| `ficha-api`: “hay fichas para verificar” (0) | La doc está **congelada** (sin marcadores `@api`) y `scripts/ficha-api.mjs` no está leyendo las tablas materializadas. |
| Tests rojos que no tocaste | El repo arrastra fallos viejos: compará con el estado previo (`git stash` + `pnpm test`). |
| La doc de un componente quedó vieja | Actualizá su ficha vanilla (`docs/versiones/<id>/componentes/<tag>.md`), su ficha Vue (`…/componentes/vue/<kebab>.md`), su receta (`skills/use-comegen/references/<kebab>.md`) y su página (`…/paginas/componentes/`). |
| El zip no incluye un componente | Debe existir su entry en `src/lib/**/*.ts` (los internos no van a la lib ni a la skill). |
| La versión del zip no es la esperada | Sale de `version` en `package.json`; bumpéala y re-corré `pnpm build:lib`. |
| Hay que editar la doc y no encuentro los archivos | Es la fuente versionada: `docs/versiones/<id>/` (los `docs/componentes|partials|site/componentes` son compuestos). |

## Archivos que toca

| Artefacto | Ruta |
|---|---|
| Fichas | `docs/versiones/<id>/componentes/<tag>.md` y `…/componentes/vue/<kebab>.md` |
| Recetas de la skill de uso | `skills/use-comegen/references/<kebab>.md` |
| Páginas del sitio | `docs/versiones/<id>/paginas/componentes/<slug>.md` (versionadas) |
| Guías del sitio (site-level) | `docs/site/{instalacion,personalizacion,configuracion,versionado}.md` y `docs/site/breaking/` |
| Manifiesto de versiones | `docs/versions.json` (`latest` + `ref` de cada versión) |
| Changelog | `docs/changelog/v<version>.md` |
| Tema del sitio | `docs/site/.vitepress/theme/*.gen.*` (generados, gitignored) |
| Build de la lib | `dist-libs/<config>/` (gitignored) + 4 zips sueltos en `dist-libs/` |
