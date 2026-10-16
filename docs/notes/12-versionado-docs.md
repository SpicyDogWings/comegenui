# 12 — Versionado de la documentación

El sitio (`docs/site`, VitePress) puede servir **varias versiones** de la doc a la vez, con
un select en el topbar. Cada versión es un **build estático** servido bajo su propia base
`/<id>/`; `latest` se construye desde el árbol de trabajo y además deja una copia en `/`.

## La doc es la fuente (overlay), el sitio la compone

La doc **no se reconstruye desde el tag**: vive versionada en `docs/versiones/<id>/` con
**overlay** —“gana el último archivo del mismo path”— y el sitio la **compone**. Cada versión
guarda sólo lo que cambió; lo demás se resuelve desde las versiones anteriores. El modelo
completo está en la [nota 13](./13-doc-versionada.md); el resolutor, en `scripts/doc-tree.mjs`.

## Por qué no hay "swap" en runtime

Un select que cambie el contenido sin recargar **no aplica** acá:

- VitePress es SSG: el markdown se compila a HTML en build.
- Los demos de las fichas cargan la lib real (`esm-shared`) que **viaja con la versión** en
  `docs/versiones/<id>/lib/`: la doc de la 5.1.1 embebe el bundle de la 5.1.1.
- El search index también es por build.

Por eso el select **navega** a otra URL (navegación dura, `location.assign`), igual que el
select de modo Vue/Vanilla. Cada build es una app distinta con su propia base.

## Estructura

```
docs/versions.json                       ← manifiesto (fuente de verdad, a mano)
docs/versiones/<id>/                     ← doc versionada (overlay): componentes/, partials/, paginas/
docs/versiones/<id>/lib/                 ← build esm-shared congelado de esa versión (versionado en git)
scripts/doc-tree.mjs                     ← resolutor del overlay
scripts/docs-compose.mjs                 ← materializa el árbol resuelto para el sitio
scripts/docs-freeze.mjs <id>             ← congela tablas de API + copia la lib de la versión
scripts/docs-versions.mjs                ← compone + build + agrega + catálogo
docs/site/.vitepress/dist-versions/      ← salida agregada (gitignored)

<out>/                 latest en `/` (alias de back-compat)
<out>/5.1.1/           latest canónico (`/5.1.1/`)
<out>/5.0.0/           versión congelada (`/5.0.0/`)
<out>/versions.json    catálogo que lee el select
```

`latest` es la única entrada con `"latest": true` y sale del árbol de trabajo. **Todas** se
componen desde la doc versionada (`docs/versiones/`); el `ref` del manifiesto queda como
trazabilidad del tag. **No hay `git worktree` ni `pnpm install` por versión.**

## Piezas

- **`config.ts`**: `base` sale de `DOCS_BASE`; `DOCS_VERSION_ID`/`_LABEL` alimentan
  `themeConfig.docsVersion` y el título; `COMEGEN_SHARED_DIR` apunta el alias
  `@comegen-shared` a la lib de la versión que se está buildeando
  (`docs/versiones/<id>/lib`; si no, al build actual). `transformHead` prefija con `BASE`
  la contraparte del redirect de modo.
- **`doc-tree.mjs`**: resuelve el overlay de una versión (“gana el último archivo del mismo
  path”). Lo usan `docs-compose`, `docs-freeze` y `gen-api`.
- **`useDocsVersions.ts`**: catálogo compartido. Un único `fetch` de `/versions.json` (estado de
  módulo, sobrevive a la navegación SPA); expone `versions`, `current`, `options` (con `link` y
  `active`) y `linkTo`. Lo usan el select y la paleta.
- **`DocsVersionSelect.vue`**: usa `useDocsVersions()`; arma las opciones con `base + path relativo`
  de la página y **valida contra `routes`**; si la página no existe en la versión destino, cae al
  home de esa versión. Se oculta si no hay catálogo (`vitepress dev`) o hay una sola versión.
- **Paleta de comandos (CTRL+K)**: `Layout.vue` convierte las versiones (menos la actual) en comandos
  de categoría `Versión` y los pasa a `AppTopbar` por la prop `extraCommands`; el topbar los inserta
  antes de la lista de componentes. Al elegir, navega duro igual que el select.
- **Base-aware en el topbar/paleta**: `AppTopbar` prefija sus links con `site.base`, acepta
  `extraCommands` y le pasa la base a `navigationCommands`/`componentCommands`. `DocsModeSelect`
  navega con `withBase`. Sin esto, una versión bajo `/5.1.0/` linkearía a la raíz (latest).
  El select de versión ocupa el lugar del viejo badge `v{version}`, al lado del nombre.

## Uso

```bash
pnpm docs:compose                  # materializa la doc de `latest` para el sitio
pnpm docs:freeze 5.2.0 --with-lib  # congela una versión (tablas + lib)
pnpm docs:versions                 # compone, buildea y agrega todas las versiones del manifiesto
pnpm docs:versions -- --list       # ver el manifiesto
pnpm docs:versions -- --only 5.1.1 # sólo latest (útil para desarrollar el agregado)
pnpm deploy:docs:versions          # deploya dist-versions a Vercel
```

## Cortar una versión

1. Actualizá la doc en `docs/versiones/<nueva>/` (overlay: **sólo** lo que cambió).
2. `pnpm build:docs:lib` — build `esm-shared` (el que consumen los demos).
3. `pnpm docs:freeze <nueva> --with-lib` — congela las tablas de API (quita `@api:*`) y copia
   la lib a `docs/versiones/<nueva>/lib/` (versionado en git, ~2-3 MB).
4. Taggeá la release (`git tag v5.2.0`) y anotá la versión en `docs/versions.json`
   (`id`/`label`/`ref` del tag); pasá `latest` a la nueva.
5. `pnpm docs:versions` y deployá.

## Límites conocidos

- **Los tags anteriores a este cambio no son retro-compatibles del todo**: su topbar/paleta
  no son base-aware, así que sus links apuntan a latest. Por eso el manifiesto arranca con
  las versiones nuevas (no se cargaron tags viejos).
- **No hay redirect pre-paint de versión** (a diferencia del modo): la preferencia guardada
  no navega sola, para no mandar a un 404.
- El build de VitePress **vacía su `outDir`**: por eso el alias raíz (`/`) se construye aparte,
  en un temporal, y se copia encima de la salida agregada (no directo en `<out>/`, o se llevaría
  las carpetas `/<id>/`).
- **La home no muestra el select**: `docs/site/index.md` es `standalone` (sin topbar), igual
  que el select de modo. Para cambiar de versión hay que estar en una página cualquiera.
