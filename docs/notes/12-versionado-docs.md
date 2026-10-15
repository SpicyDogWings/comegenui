# 12 — Versionado de la documentación

El sitio (`docs/site`, VitePress) puede servir **varias versiones** de la doc a la vez, con
un select en el topbar. Cada versión es un **build estático congelado** servido bajo su
propia base `/<id>/`; `latest` se construye desde el árbol de trabajo y además deja una
copia en `/`.

## Por qué no hay "swap" en runtime

Un select que cambie el contenido sin recargar **no aplica** acá:

- VitePress es SSG: el markdown se compila a HTML en build.
- Los demos de las fichas cargan la lib real (`esm-shared` de `@comegen-shared`) compilada
  *en ese mismo build*: la doc de la 5.1.0 embebe el bundle de la 5.1.0.
- El search index también es por build.

Por eso el select **navega** a otra URL (navegación dura, `location.assign`), igual que el
select de modo Vue/Vanilla. Cada build es una app distinta con su propia base.

## Estructura

```
docs/versions.json                      ← manifiesto (fuente de verdad, a mano)
scripts/docs-versions.mjs               ← build + agregado + catálogo
docs/site/.vitepress/dist-versions/     ← salida agregada (gitignored)

<out>/                 latest en `/` (alias de back-compat)
<out>/5.1.1/           latest canónico (`/5.1.1/`)
<out>/5.0.0/           versión congelada (`/5.0.0/`)
<out>/versions.json    catálogo que lee el select
```

`latest` es la única entrada con `"latest": true` y sale de `HEAD`. El resto sale de un
`ref` de git (idealmente un tag) y se construye en un **worktree descartable** con
`pnpm install` + `build:docs:lib` + `site:sync` + `vitepress build`.

## Piezas

- **`config.ts`**: `base` sale de `DOCS_BASE`; `DOCS_VERSION_ID`/`_LABEL` alimentan
  `themeConfig.docsVersion` y el título. `transformHead` prefija con `BASE` la contraparte
  del redirect de modo.
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
pnpm docs:versions                 # construye y agrega todas las versiones del manifiesto
pnpm docs:versions -- --list       # ver el manifiesto
pnpm docs:versions -- --only 5.1.1 # sólo latest (útil para desarrollar el agregado)
pnpm deploy:docs:versions          # deploya dist-versions a Vercel
```

## Cortar una versión

1. Taggeá la release (`git tag v5.2.0`).
2. En `docs/versions.json`: pasá `latest` a la nueva (`id`/`label`/`ref: "HEAD"`) y dejá la
   anterior como entrada congelada (`ref: "v5.2.0"`, sin `latest`).
3. `pnpm docs:versions` y deployá.

## Límites conocidos

- **Los tags anteriores a este cambio no son retro-compatibles del todo**: su topbar/paleta
  no son base-aware, así que sus links apuntan a latest. Por eso el manifiesto arranca con
  las versiones nuevas (no se cargaron tags viejos).
- **No hay redirect pre-paint de versión** (a diferencia del modo): la preferencia guardada
  no navega sola, para no mandar a un 404.
- El build de VitePress **vacía su `outDir`**: por eso el alias raíz se construye *antes*
  que las subcarpetas de versión (si no, las borra).
- **La home no muestra el select**: `docs/site/index.md` es `standalone` (sin topbar), igual
  que el select de modo. Para cambiar de versión hay que estar en una página cualquiera.
