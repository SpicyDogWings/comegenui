# `cu-playground` — plugin de playground

Plugin de desarrollo de ComegenUI. Toma un `.vue`, le lee el **contrato**
(props, emits, exposes, slots, tokens, clases CSS e interfaces) con
`vue/compiler-sfc`, genera/actualiza su story y sirve la página del playground
en runtime (con nav automático y posibilidad de páginas físicas de override).

## Entry points

| Archivo | Tipo | Qué hace |
|---|---|---|
| `index.ts` | Vue plugin | `app.use(CuPlayground, { router, stories, pages, config })`: registra la ruta `components/:name`, provee el registry (stories + nav + páginas) y arma el nav desde las stories. **Instalar antes de `app.use(router)`**. |
| `keys.ts` | Tipos + `InjectionKey` | `playgroundKey`, `PlaygroundRegistry`, `StoryEntry`, `NavGroup`. Lo consume el runtime. |
| `config.ts` | Tipos | `PlaygroundConfig` + `resolvePlaygroundConfig` (defaults). |
| `runtime/` | Vue SFCs | `StoryPage`, `StoryBody`, `StoryRenderer`, `PlaygroundLayout`, `PlaygroundStyle`, `PlaygroundApiComponents`, `SectionDemo`, `TestResultBadge`, `outline.ts`. |
| `cli/generate.mjs` | Node CLI | Genera/actualiza la story desde el contrato del `.vue`. |
| `cli/parse-sfc.mjs` | Node CLI | Parser del `.vue` (props/emits/exposes/slots + JSDoc, interfaces, tokens, clases CSS, sub-componentes). |
| `vitest/reporter.ts` | Reporter | Escribe `public/test-results.json` (badges ✅/❌). |

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
| `X.stories.extras.ts` | No | extras (Programmatic/Events/render custom) |
| `X.stories.runtime.ts` | No | setup/global de la story |

### Overrides por sección (`sections`)

En `X.stories.config.json`, `sections.<id>` ajusta una sección generada:

| Opción | Efecto |
|---|---|
| `title`, `badge`, `layout` | Pisan título, badge y layout (`row`/`col`). |
| `extraProps` | Agrega props a **todas** las variantes (ej. `{ "label": "Copiar" }`). |
| `extraAttrs` | Agrega atributos HTML a todas las variantes. |
| `slot` | Pisa el contenido del slot `default` de todas las variantes (ej. `"+"`). Útil en componentes icon-only donde el label derivado (nombre del color) no entra. |

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

> El runtime usa componentes de ComegenUI (`Navbar`, `Outline`, `Badge`, `Table`,
> `CodeBlock`, `Tabs`). Al llevarlo, copiá esos archivos o parametrizalos.
