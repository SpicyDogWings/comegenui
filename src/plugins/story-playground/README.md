# `story-playground` — devkit de stories

Plugin de desarrollo de ComegenUI: **runtime** (playground genérico) + **CLI** (generación/migración) + **reporter de vitest**. Todo vive junto para poder llevarlo a otro proyecto, igual que `cu-tokens` (runtime + build-time en la misma carpeta).

## Entry points

| Archivo | Tipo | Qué hace |
|---|---|---|
| `index.ts` | Vue plugin | `app.use(StoryPlayground, { router, stories })`: registra la ruta `components/:name` y provee el registry (`getStory`). **Instalar antes de `app.use(router)`** (el router navega al instalarse). |
| `keys.ts` | Tipos + `InjectionKey` | `storyRegistryKey`, `StoryEntry`, `GetStory`. Lo consume `StoryPage.vue`. |
| `cli/generate.mjs` | Node CLI | Genera la story **desde las props** del `.vue` (`pnpm run stories:generate X`). Con `--meta-only` actualiza solo `tokens`/`api` sin tocar secciones. Lee `X.stories.config.json`. |
| `cli/migrate.mjs` | Node CLI | Genera story + test desde la **página** del playground (secciones, snippets, variants, checks genéricos). |
| `cli/status.mjs` | Node CLI | Inventario: público/página/story/test viejo/badges. |
| `cli/scaffold.mjs` | Node CLI | Scaffold de componente nuevo: `.vue` + `.ce.vue` + `lib/` + story + test (`pnpm run new:component X <category>`). |
| `vitest/reporter.ts` | Reporter | Escribe `public/test-results.json` (badges ✅/❌ del playground). Configurado en `vitest.config.ts`. |

## Convenciones

- **Config por componente**: `src/stories/{cat}/X.stories.config.json` (order/include/exclude, `sections.<id>.extraProps`, `custom[]`, `preview` interactivo).
- **Extras por componente**: `src/stories/{cat}/X.stories.extras.ts` exporta `extras: StoryExtra[]`:
  - **Programmatic** → patio de los **exposes** (`open()`, `close()`…) o v-model.
  - **Events** → patio de **eventos** (nativos + `ceEmit` con `detail`).
- El generador **no pisa** la story si ya existe (salvo `--force`) ni el archivo de extras.

## Llevarlo a otro proyecto

1. Copiá `src/plugins/story-playground/` al `src/plugins/` del destino.
2. Agregá los scripts de `package.json` (`stories:generate`, `stories:migrate`, `stories:status`, `new:component`).
3. En `main.ts`: `app.use(StoryPlayground, { router, stories: import.meta.glob("./stories/**/*.stories.ts", { eager: true }) })` **antes** de `app.use(router)`.
4. En `vitest.config.ts`: `reporters: ["default", "./src/plugins/story-playground/vitest/reporter.ts"]`.

> Dependencias del runtime: `StoryPage`/`StoryRenderer`/`SectionDemo` y los componentes de ComegenUI (PlaygroundLayout, Table, CodeBlock, Badge). Al llevarlo, copiá también esos archivos o parametrizalos.
