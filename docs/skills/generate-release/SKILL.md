---
name: generate-release
description: 'Receta para preparar la próxima release de ComegenUI (este repo): doc al día, tests y gate verdes, zips versionados, corte de versión (tag + manifiesto + doc congelada), PR y publicación. Usar cuando el usuario pida "preparar la release", "generar release", "dejar todo listo para la release", "correr todos los tests antes de releasear", "cortar la versión", "buildear la lib para publicar", "armar el PR de la release" o "el mensaje de la release". Solo para este proyecto (no es la skill de uso `use-comegen` ni la de documentar `documenter`).'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/generate-release
  version: 5.2.1
---

# `generate-release` — preparar la próxima release

Deja el repo listo para publicar: doc al día, gate verde, zips versionados, versión cortada
(tag + manifiesto + doc congelada) y los mensajes de PR y de release.

> **Regla:** no declares "listo" sin el [checklist final](#checklist-final) completo y
> `./scripts/guard.sh --full` en verde.

## Cuándo NO

- Consumir la lib en otro proyecto → `use-comegen`.
- Modificar un componente → `AGENTS.md` (patrón de 3 archivos).
- Documentar un componente → `documenter` (o el agente `.opencode/agent/comegen-docs.md`).

## Precondiciones

- Trabajar en una **rama de release** (`main` sólo recibe merges).
- `pnpm install` al día.
- La doc es la **fuente versionada** `docs/versiones/<id>/`; `docs/{componentes,partials,site/componentes,site/examples}`
  son **compuestos** (gitignored) por `pnpm docs:compose` (corre en `dev` y `build`). No los edites.

> `<id>` = versión `latest` del manifiesto (`docs/versions.json`). `<version>` = `version` de
> `package.json`. Hoy: `5.1.1`.

## Flujo

Seguí los pasos en orden; cortá al primer fallo.

### 1. Versión y metadata

Ya no hay «cinco»: son **ocho** `SKILL.md` con `metadata.version` atada a `package.json`
(`skills/use-comegen/` + `docs/skills/{comegen-preflight,crear-pr,deploy-docs,documenter,generate-release,marked,release-changelog}/`).

### 2. Doc al día

Las fichas (`docs/versiones/<id>/componentes/…`), las recetas (`skills/use-comegen/references/…`) y
las páginas (`docs/versiones/<id>/paginas/componentes/…`) se escriben a mano: mirá qué cambió y
verificá que lo reflejen (el gate sólo ve que existan).

```bash
git log --oneline --name-only <ultima-release>..HEAD -- src/components src/lib
```

### 3. Changelog y breaking changes

- `docs/changelog/v<version>.md` (skill `release-changelog`).
- `docs/site/breaking/<version>.md` + su fila en `docs/site/breaking/index.md`: una página **por
  salto**, con lo que rompe y qué hacer. Si el salto no rompe, no se agrega.

### 4. Gate completo

```bash
pnpm test
./scripts/guard.sh --full
```

Verde = sin tipos nuevos (por identidad vs `scripts/typecheck-baseline.txt`), sin contratos rotos,
tests y docs OK. Un cambio de API intencional se regenera con `./scripts/guard.sh --update`, en el
mismo PR.

### 5. Build del sitio y de la lib

```bash
pnpm build        # sitio (compone la doc y la renderiza)
pnpm build:lib    # dist-libs/<config>/ + los 4 zips sueltos
```

Verificá los zips: `unzip -l dist-libs/comegenui-umd-core-v<version>.zip` → un zip por config
(`umd-core`, `umd-shared`, `esm-core`, `esm-shared`) con los bundles de su formato (+ el runtime del
`shared`). Sólo la lib: sin CSS, sin doc, sin skill.

### 6. Commit y PR

Commiteá sólo lo que corresponde (doc versionada, changelog, breaking, versión): revisá el diff
antes, y **nunca** `git add -A` a ciegas (los compuestos están gitignored).

Abrí el **PR de la rama de release**. Título y descripción como en cualquier MR (skill
`comegen-preflight`, plantilla en `CONTRIBUTING.md`), más lo propio de una release:

- qué trae: el resumen del changelog y el puntero a la guía de breaking;
- el resultado del gate (`pnpm test` y `guard --full` verdes);
- que incluye los zips versionados.

### 7. Tag y manifiesto (después del merge)

```bash
git tag -a v<version> -m "ComegenUI v<version>"   # el tag apunta al commit ya mergeado
git push origin v<version>
```

En `docs/versions.json`: la versión nueva queda `latest: true` con `ref: "HEAD"`; la anterior pierde
`latest` y pasa a `ref: "v<anterior>"`. Sólo puede haber **una** `latest` (el script falla con 0 o 2).
No existe un tag `latest` de git: `latest` es el flag del manifiesto.

### 8. Congelar la doc

```bash
pnpm docs:freeze <id>     # materializa las tablas de API (saca los marcadores @api)
```

Una versión congelada no se regenera y no necesita el SFC de su tag. Los cambios siguientes van en
una **versión nueva** (carpeta overlay `docs/versiones/<nueva>/` con sólo lo que cambia).

### 9. Publicar

```bash
pnpm docs:versions              # compone y buildea el sitio con las versiones del manifiesto
pnpm deploy:docs:versions       # publica (raíz = latest, /<id>/ por versión)
```

**Mensajes de publicación** (van en `.release/`, carpeta **ignorada** por git):

- `.release/v<version>.md` — el texto de la **release** de GitHub: el puntero a la guía de breaking
  **completa** (`/breaking/<version>` + el path del repo) y un **resumen breve** con la misma forma
  que la release anterior: primero lo que rompe (con el “qué hacer”), después componentes, docs y
  los zips adjuntos.
- El **PR** de la release usa el mismo resumen (ver paso 6).

```bash
gh release create v<version> dist-libs/*.zip --notes-file .release/v<version>.md
```

## Checklist final

- [ ] Fichas, recetas y páginas de lo que cambió, al día.
- [ ] Changelog + breaking changes del salto (si rompe algo).
- [ ] `metadata.version` de las ocho `SKILL.md` = `package.json`.
- [ ] `pnpm test` y `./scripts/guard.sh --full` verdes.
- [ ] `pnpm build` y `pnpm build:lib` OK.
- [ ] Los 4 `dist-libs/comegenui-<config>-v<version>.zip` con sus bundles (+ runtime del `shared`).
- [ ] PR de la release con su resumen (changelog + breaking + gate + zips).
- [ ] Mergeado en `main`; tag `v<version>` pusheado apuntando a ese commit.
- [ ] `docs/versions.json` con una sola `latest` y las anteriores con su `ref` de tag.
- [ ] Doc de la versión congelada (`pnpm docs:freeze <id>`).
- [ ] Sitio de versiones publicado + mensaje de la release generado.

Si algo falta, decilo en el reporte; no lo tapes con "quedó funcionando".

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `check-docs` falla | Un tag de `src/lib` sin ficha/página, o una página sin `title`/`group`. |
| Tipos "nuevos" | Compará por identidad con `scripts/typecheck-baseline.txt`; arreglá los nuevos, no bajes el baseline. |
| `<tag> ROTO` en contrato | Cambió un prop/método/estructura del CE. Si fue a propósito: `./scripts/guard.sh --update`. |
| `ficha-api`: "hay fichas para verificar" (0) | La doc está congelada y `scripts/ficha-api.mjs` no está leyendo las tablas materializadas. |
| Tests rojos que no tocaste | El repo arrastra fallos viejos: compará con el estado previo (`git stash` + `pnpm test`). |
| No encuentro los `.md` de la doc | Es la fuente versionada (`docs/versiones/<id>/`); los compuestos no se editan. |
| La versión del zip no es la esperada | Sale de `version` en `package.json`. |

## Archivos que toca

| Artefacto | Ruta |
|---|---|
| Fichas · recetas · páginas | `docs/versiones/<id>/componentes/…` · `skills/use-comegen/references/…` · `docs/versiones/<id>/paginas/componentes/…` |
| Guías del sitio (site-level) | `docs/site/{instalacion,personalizacion,configuracion,versionado}.md` + `docs/site/breaking/` |
| Manifiesto · changelog | `docs/versions.json` · `docs/changelog/v<version>.md` |
| Mensajes (ignorados) | `.release/v<version>.md` |
| Build de la lib | `dist-libs/<config>/` (gitignored) + 4 zips sueltos |
