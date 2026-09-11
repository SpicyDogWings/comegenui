# `cu-playground` — plugin de playground

Plugin de desarrollo de ComegenUI. Toma un `.vue`, le lee el **contrato**
(props, emits, exposes, slots, tokens, clases CSS e interfaces) con
`vue/compiler-sfc`, genera/actualiza su story y sirve la página del playground
en runtime (con nav automático y posibilidad de páginas físicas de override).

Es **self-contained**: el contrato, el runner de tests y el chrome (UI) viven
dentro del plugin, así que se copia a otro proyecto y anda sin depender de
archivos del host. El host solo inyecta su propia piel vía la opción `chrome`.

## Entry points

| Archivo | Tipo | Qué hace |
|---|---|---|
| `index.ts` | Vue plugin | `app.use(CuPlayground, { router, stories, pages, config, chrome, getTokenDescription, libStatus })`: registra la ruta `components/:name`, provee el registry (stories + nav + páginas) y arma el nav desde las stories. **Instalar antes de `app.use(router)`**. |
| `contract.ts` | Tipos | **Dueño del contrato** de una story (`ComponentStory`, `Section`, `Variant`, `SectionCheck`…). `src/stories/types.ts` lo re-exporta (backwards compat). |
| `chrome.ts` | Tipos + defaults | `PlaygroundChrome`/`ResolvedChrome`, `resolveChrome()` (merge host + fallbacks), `chromeKey` y `defaultTokenDescription()`. |
| `keys.ts` | Tipos + `InjectionKey` | `playgroundKey`, `PlaygroundRegistry`, `StoryEntry`, `NavGroup`, `PlaygroundLibStatus`. Lo consume el runtime. |
| `config.ts` | Tipos | `PlaygroundConfig` + `resolvePlaygroundConfig` (defaults). |
| `runtime/` | Vue SFCs | `StoryPage`, `StoryBody`, `StoryRenderer`, `PlaygroundLayout`, `PlaygroundStyle`, `PlaygroundApiComponents`, `SectionDemo`, `TestResultBadge`, `outline.ts`, `useLibStatus.ts`, `useTestResults.ts`. |
| `runtime/chrome/` | Vue SFCs fallback | Chrome mínimo (solo CSS vars): `AppLayout`, `Navbar`, `Outline`, `Badge`, `Table`, `Button`, `Tabs`, `CodeBlock`. |
| `tests/runner.l1.ts` | Vitest runner | **Dueño del runner L1** (monta el `.vue` con `@vue/test-utils`). `src/stories/runner.l1.ts` lo re-exporta. |
| `cli/generate.mjs` | Node CLI | Genera/actualiza la story desde el contrato del `.vue`. |
| `cli/parse-sfc.mjs` | Node CLI | Parser del `.vue` (props/emits/exposes/slots + JSDoc, interfaces, tokens, clases CSS, sub-componentes). |
| `vitest/reporter.ts` | Reporter | Escribe `public/test-results.json` (badges ✅/❌). |

## Opciones del plugin

Todas opcionales; sin ellas el plugin anda con fallbacks:

| Opción | Tipo | Si no se pasa |
|---|---|---|
| `router` | `Router` | **Requerida** — el plugin agrega la ruta `components/:name`. |
| `stories` | glob de `.stories.ts` | **Requerida** — registry del nav y de páginas. |
| `pages` | glob de `.vue` físicos | Página genérica para todos. |
| `config` | `PlaygroundConfig` | Defaults. |
| `chrome` | `PlaygroundChrome` | Chrome fallback mínimo (`runtime/chrome/`). |
| `getTokenDescription` | `(name) => string` | `defaultTokenDescription()` genérica. |
| `libStatus` | `{ entries, aliases }` | Sin badge "En lib / No en lib". |
| `base` / `routeName` | string | `config.base` / `'Component playground'`. |

## Chrome: la piel del runtime

El runtime no importa componentes del host: los recibe inyectados por el plugin
vía `chromeKey` (`chrome.ts`). El host puede:

- no pasar nada → se usan los fallbacks mínimos de `runtime/chrome/` (estilo
  solo con CSS vars `--cu-*`, así funcionan en cualquier proyecto);
- pasar algunos → se mergean sobre los fallbacks (`resolveChrome`);
- pasar todos → el playground se ve con el sistema de componentes del host.

En `main.ts` de ComegenUI:

```ts
app.use(CuPlayground, {
  router,
  config: playgroundConfig,
  stories: import.meta.glob("./stories/**/*.stories.ts"),
  pages: import.meta.glob("./playground/**/*.vue"),
  chrome: {
    appLayout: AppLayout, navbar: Navbar, outline: Outline,
    badge: Badge, table: Table, button: Button,
    tabs: Tabs, codeBlock: CodeBlock,
  },
  getTokenDescription,
  libStatus: {
    entries: import.meta.glob('@/lib/**/*.ts'),
    aliases: { 'advanced-table': 'table' },
  },
})
```

## Comandos

```bash
pnpm cu-playground:generate Button             # story + test desde el contrato
pnpm cu-playground:generate Button --meta-only # solo metadata (tokens/clases/api), sin tocar secciones
pnpm cu-playground:generate Button --pages     # + página física editable
pnpm cu-playground:generate Button --dry-run   # previsualiza sin escribir
pnpm cu-playground:generate --all              # barre componentsDir
pnpm cu-playground:generate Button --force     # pisa story existente (reconstruye secciones)
```

> Para actualizar metadata de todas las stories sin perder secciones custom:
> `pnpm cu-playground:generate --all --meta-only`. `--force` sí reconstruye las
> secciones y solo es seguro si tus customizaciones viven en config/extras/runtime.

> `stories:generate` sigue como alias del mismo comando.

## Qué infiere del `.vue` (y qué se cura)

| Dato | Se infiere de | Override (config) |
|---|---|---|
| Props (nombre, tipo, default) | `defineProps` | `api.props.<name>` |
| Descripción de props/emits/exposes | JSDoc (`/** … */`) del miembro | `api.<grupo>.<name>.description` |
| Emits / exposes | `defineEmits` / `defineExpose` / `defineModel` | `api.events` / `api.exposes` |
| Slots | `<slot>` y `<template #name>` | `api.slots` |
| Interfaces | `interface`/`type` del script, filtradas a las de la API (exportadas, documentadas o usadas en un macro) + las que referencian | `interfaceCode` |
| Tokens CSS | `var(--x)` / `--x:` de estilos y script | `tokens` |
| Clases CSS | selectores `.cu-*` de los `<style>` | `classes` |
| Sub-componentes | imports `*.vue` | `subComponents` |
| Secciones / checks | una por prop enum/boolean/string-label | `sections` / `custom` |

Precedencia al regenerar: descripciones → **config > JSDoc > story previa**;
`interfaceCode` → **config > curado > inferido**; tokens/clases → **config > `.vue` > story previa**.

## Configuración: `cu-playground.config.json` (raíz)

```json
{
  "componentsDir": "src/components",
  "storiesDir": "src/stories",
  "playgroundDir": "src/playground",
  "libDir": "src/lib",
  "base": "/playground/components",
  "pages": false,
  "exclude": [],
  "nav": {
    "order": ["buttons", "form"],
    "groups": { "form": "Formularios" },
    "exclude": []
  }
}
```

El runtime la recibe desde `main.ts`; el CLI la lee del archivo.

## Runtime

- **Registry lazy**: `import.meta.glob("./stories/**/*.stories.ts")` (sin
  `eager`) → cada story es un chunk y se carga al navegar. El nav se deriva del
  path del glob (categoría = subcarpeta), sin cargar contenido.
- **Página genérica**: `StoryPage` resuelve `:name` → página física si existe,
  si no la story y renderiza `StoryBody` (secciones + extras + Style + API).
- **Página física**: si hay un `.vue` en `playgroundDir` con el nombre del
  componente, el plugin lo usa como override (aunque no lo haya generado el
  plugin).

## Convenciones

- Config por componente: `src/stories/{cat}/X.stories.config.json`
  (`include`/`exclude`/`order`, `sections`, `custom`, `attrs`, `api`, `tokens`,
  `classes`, `subComponents`, `components`, `interfaceCode`).
- Extras por componente: `src/stories/{cat}/X.stories.extras.ts` (`StoryExtra[]`).
- El generador **no pisa** la story (salvo `--force`) ni el archivo de extras.
- `--meta-only` preserva descripciones y deps curadas.

## Regenerar sin perder lo custom

Solo se generan `X.stories.ts` y `X.l1.test.ts`. Todo lo tuyo va en **sidecars
que nunca se pisan**:

| Archivo | ¿`--force` lo pisa? | Para qué |
|---|---|---|
| `X.stories.ts` | **Sí** | generado (secciones + tokens/api) |
| `X.l1.test.ts` | **Sí** | generado (runner) |
| `X.stories.config.json` | No | include/exclude/order, `sections`, `custom[]`, `attrs`, `api`, `tokens`, `classes` |
| `X.stories.extras.ts` | No | extras: demos custom que `--force` no pisa (con `render`, `vue`/`vanilla`, y opcional `variants`/`checks`/`badge`/`layout`) |
| `X.stories.runtime.ts` | No | setup/global de la story |

> **Migrar una sección custom a extra**: si una sección escrita a mano no la
> genera el contrato (ej. un demo con estado), movela a `extras` con su
> `render()`, `variants` y `checks`. Sus tests L1 siguen corriendo (el runner
> recorre secciones **y** extras) y el playground le pinta el badge de tests.

### Overrides por sección (`sections`)

En `X.stories.config.json`, `sections.<id>` ajusta una sección generada:

| Opción | Efecto |
|---|---|
| `title`, `badge`, `layout` | Pisan título, badge y layout (`row`/`col`). |
| `extraProps` | Agrega props a **todas** las variantes (ej. `{ "label": "Copiar" }`). |
| `extraAttrs` | Agrega atributos HTML a todas las variantes. |
| `slot` | Pisa el contenido del slot `default` de todas las variantes (ej. `"+"`). Útil en componentes icon-only donde el label derivado (nombre del color) no entra. |
| `skipChecks` | Saca checks L1 generados que no aplican (ej. `["disabled"]` en una celda que solo renderiza el control al editar). |

Ejemplo (FloatingButton, sección `color` con el `+` del FAB en vez del nombre del color):

```json
{
  "attrs": { "style": "position: static" },
  "sections": { "color": { "slot": "+" } }
}
```

Reglas:

1. **No edites `X.stories.ts` a mano**: lo que agregues ahí se pierde con
   `--force`. Ponelo en config/extras/runtime.
2. Para actualizar solo metadata (tokens/clases/api/interfaceCode) sin tocar
   secciones: `--meta-only` (además preserva descripciones, deps y events curados).
   Es el modo seguro para actualizar en masa con `--all`.
3. Previsualizá antes de pisar: `--dry-run` (no escribe; con un solo componente
   imprime la story resultante).
4. Para que `--all` no toque un componente (o una categoría): `exclude` en
   `cu-playground.config.json`.
5. Página custom de un componente: `--pages` (o escribila a mano en
   `playgroundDir`); el plugin la usa como override.

## Llevarlo a otro proyecto

1. Copiá `src/plugins/cu-playground/` al `src/plugins/` del destino.
2. Copiá `cu-playground.config.json` y ajustá rutas.
3. En `main.ts`:
   ```ts
   app.use(CuPlayground, {
     router,
     config: playgroundConfig,
     stories: import.meta.glob("./stories/**/*.stories.ts"),
     pages: import.meta.glob("./playground/**/*.vue"),
   })
   ```
   **antes** de `app.use(router)`.
4. En `vitest.config.ts`: `reporters: ["default", "./src/plugins/cu-playground/vitest/reporter.ts"]`.

> El plugin es self-contained: contrato, runner y chrome fallback viajan con él.
> Para que se vea como en ComegenUI, inyectá el `chrome` del host (ver arriba);
> sin eso el playground anda con los fallbacks mínimos de `runtime/chrome/`.

## Dependencias

| Dependencia | Para qué |
|---|---|
| `vue` (^3) + `vue-router` | Runtime del plugin (registra rutas; el `Navbar` fallback usa `RouterLink`). |
| `vue/compiler-sfc` | CLI (`parse-sfc.mjs`). |
| `vitest` + `@vue/test-utils` | Runner L1 + reporter (`tests/`, `vitest/`). |
| `fast-glob` | CLI (`generate.mjs`). |
