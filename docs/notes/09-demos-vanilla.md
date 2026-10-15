# Nota 09 — Demos vanilla inline

**Estado:** en curso (patrón validado con `cu-button` y `cu-alert`).

La doc **vanilla** (`docs/versiones/5.1.1/paginas/componentes/cu-<x>.md`) muestra, debajo de cada bloque de
ejemplo de la ficha, el **componente real** (custom element del build `esm-shared`).

## Cómo funciona

1. En la ficha (`docs/versiones/5.1.1/componentes/cu-<x>.md`), debajo del bloque ` ```html `, va un marcador
   `<!-- demo:<id> -->`.
2. El plugin de VitePress (`docs/site/.vitepress/config.ts`) lo convierte en
   `<ComegenDemo id="<id>" />`.
3. `ComegenDemo` (`docs/site/.vitepress/theme/ComegenDemo.vue`) busca el demo en
   `theme/comegen-demos.ts`, que **auto-registra** todo `docs/site/examples/**/<id>.vue`
   (id = **nombre del archivo**, en kebab-case).
4. El demo es un `.vue` que renderiza el CE real dentro de `<VanillaDemo :use="['CuX']">`,
   que carga el bundle desde `dist-libs/esm-shared` (client-only, vía `import.meta.glob`).

## Receta para agregar un demo

1. Elegí un bloque de ejemplo de la ficha y su id: `<comp>-<slug>` (kebab), p. ej.
   `select-opciones-deshabilitadas`.
2. Creá `docs/site/examples/<comp>/<id>.vue`:

   ```vue
   <template>
     <VanillaDemo :use="['CuSelect']">
       <cu-select …>…</cu-select>
     </VanillaDemo>
   </template>
   ```

   - **Reflejá exactamente lo que enseña el bloque** (mismos atributos, slots y contenido).
   - Interactividad (loading, eventos, control programático) → `ref`/handlers en `<script setup>`.
   - Props no-string (arrays/objetos) → binding normal `:prop="…"`. `VanillaDemo` **carga el CE
     antes** de renderizar los hijos, así que Vue resuelve el binding como propiedad (evita el
     `"[object Object]"` de un atributo). `:prop.prop` también sirve.
   - Evitá que un click navegue fuera de la doc (`to` a una ruta válida o `#`).
3. Debajo de ese bloque, en la ficha, agregá `<!-- demo:<id> -->`.
4. **No** edites `comegen-demos.ts` ni otros archivos compartidos (es automático).

## Prerrequisito / build de la doc

`pnpm dev` y `pnpm build` **ya arman** el `esm-shared` antes (script `build:docs:lib`), así que
la doc se sirve/publica con los demos adentro (los bundles quedan en `docs/site/.vitepress/dist`).
Sin `esm-shared`, el demo muestra un aviso; el build del sitio **no** rompe (el glob degrada).
Los zips de release siguen saliendo aparte, con `pnpm build:lib`.

## Referencia

- `docs/site/examples/button/button-*.vue` + `docs/versiones/5.1.1/componentes/cu-button.md`
- `docs/site/examples/alert/alert-*.vue` + `docs/versiones/5.1.1/componentes/cu-alert.md`

## Deploy del sitio (Vercel)

El sitio se publica **estático, sin build en Vercel**: el `dist` ya trae todo (incluidos los JS
del `esm-shared`), así que se sube tal cual.

```bash
pnpm deploy:docs            # sitio sólo latest (un solo build, base `/`)
pnpm deploy:docs:versions   # salida agregada: `/` = alias de latest + `/<id>/` + `versions.json`
```

Para publicar el sitio **con versiones** (el select del topbar), la que va es `deploy:docs:versions`
(ver [nota 12](./12-versionado-docs.md)); `deploy:docs` sigue sirviendo para un deploy de una sola
versión.

- `docs/site/public/vercel.json` viaja al `dist` y activa `cleanUrls` (VitePress usa URLs sin
  `.html`; sin esto, Vercel da 404 en `/componentes/cu-x`).
- **No** conectar el repo por Git integration: Vercel clonaría sin el `dist` (gitignored) y/o
  intentaría buildear. Se sube por **CLI**, con la carpeta `dist` como root.
- Requiere el CLI: `pnpm add -g vercel` (y `vercel login` la primera vez).

