# `story-playground` — plugin de stories

Plugin de desarrollo de ComegenUI con lo **genérico/reutilizable**: runtime del playground, generador prop-driven y reporter de vitest. Lo específico del repo (migración de páginas, inventario, scaffold del patrón de 3 archivos) vive en `tools/`.

## Entry points (plugin)

| Archivo | Tipo | Qué hace |
|---|---|---|
| `index.ts` | Vue plugin | `app.use(StoryPlayground, { router, stories })`: registra la ruta `components/:name` y provee el registry (`getStory`). **Instalar antes de `app.use(router)`**. |
| `keys.ts` | Tipos + `InjectionKey` | `storyRegistryKey`, `StoryEntry`, `GetStory`. Lo consume `StoryPage.vue`. |
| `cli/generate.mjs` | Node CLI | Genera la story **desde las props** del `.vue` (`pnpm run stories:generate X`). Con `--meta-only` actualiza solo `tokens`/`api`. Lee `X.stories.config.json`. |
| `vitest/reporter.ts` | Reporter | Escribe `public/test-results.json` (badges ✅/❌ del playground). Configurado en `vitest.config.ts`. |

## Herramientas del proyecto (no viajan)

Específicas de la estructura de este repo; viven en `tools/` y `scripts/`:

| Comando | Archivo | Por qué es del proyecto |
|---|---|---|
| `pnpm run stories:migrate X` | `tools/migrate.mjs` | Parsea las páginas del playground y los tests viejos de este repo. |
| `pnpm run stories:status` | `tools/status.mjs` | Inventario de `src/components` vs `src/stories` vs `src/lib` y playground. |
| `pnpm run new:component X <cat>` | `tools/scaffold-component.mjs` | Crea el patrón de 3 archivos de ComegenUI (`.vue` + `.ce.vue` + `lib/` + story + test). |
| `./scripts/preflight.sh` | `scripts/preflight.sh` | Gate local con baseline de type-check y scripts de este repo. |

## Convenciones (aplican al generar)

- **Config por componente**: `src/stories/{cat}/X.stories.config.json`.
- **Extras por componente**: `src/stories/{cat}/X.stories.extras.ts` → `StoryExtra[]`:
  - **Programmatic** = patio de los **exposes**; solo si el componente usa `defineExpose`.
  - **Events** = patio de **eventos** (nativos + `ceEmit` con `detail`).
- El generador **no pisa** la story existente (salvo `--force`) ni el archivo de extras.

## Runtime

Los CLI (`.mjs`) y los tests corren tanto con **Node** (canónico; lo que usa CI/pnpm) como con **Bun**:

```bash
bun tools/status.mjs
bun src/plugins/story-playground/cli/generate.mjs X
bun x vitest run --project l1        # suite completa verde con Bun
```

## Llevarlo a otro proyecto

1. Copiá `src/plugins/story-playground/` al `src/plugins/` del destino.
2. Agregá `stories:generate` en `package.json`.
3. En `main.ts`: `app.use(StoryPlayground, { router, stories: import.meta.glob("./stories/**/*.stories.ts", { eager: true }) })` **antes** de `app.use(router)`.
4. En `vitest.config.ts`: `reporters: ["default", "./src/plugins/story-playground/vitest/reporter.ts"]`.

> Dependencias del runtime: `StoryPage`/`StoryRenderer`/`SectionDemo` y los componentes de ComegenUI (PlaygroundLayout, Table, CodeBlock, Badge). Al llevarlo, copiá también esos archivos o parametrizalos.
