# 04 — Stories y tests por capas

La **story** es la fuente única de un componente: alimenta el preview del playground, los snippets de código y los tests de las 3 capas. Si el preview y el test salen de la misma definición, un test rojo apunta al mismo escenario que ves en el playground.

```
Story (src/components/{cat}/X.stories.ts)
  ├── sections[] / variants[]  ──► StoryRenderer (preview)
  ├── checks.l1[]              ──► runner.l1  (.vue, jsdom)        ✅
  ├── checks.ce[]              ──► runner.ce  (.ce, browser)       ⏳ Fase 2
  ├── checks.umd[]             ──► runner.umd (UMD, browser)       ⏳ Fase 3
  └── vue / vanilla (snippets) ──► tabs de código
```

## Contrato (`src/stories/types.ts`)

```ts
export type SlotContent = string | number | (() => VNodeChild);

export interface Variant {
  id: string;                            // 'primary', 'sm', 'external'
  props?: Record<string, unknown>;       // L1 y preview (Vue)
  attrs?: Record<string, string>;        // ce/umd (atributos kebab)
  slots?: Record<string, SlotContent>;   // default + nombrados
}

export interface SectionCheck<Ctx> {
  name: string;                          // 'aplica token --btn-bg'
  run: (ctx: Ctx, variant: Variant) => void | Promise<void>;
}

export interface Section {
  id: string;                            // = id del nav ('colors')
  title: string;                         // 'Colors'
  badge?: string; badgeTitle?: string;   // badge de default en el heading
  layout?: "row" | "col";
  variants: Variant[];
  preview?: Component;                   // demo interactiva (reemplaza el loop)
  vue?: string; vanilla?: string;        // snippets
  checks: { l1?: SectionCheck<L1Context>[]; ce?: …; umd?: … };
}

export interface ComponentStory {
  component: string;                     // 'cu-button' (tag CE)
  vue: Component;                        // .vue real
  ce?: Component;                        // *.ce.vue (Fase 2)
  sections: Section[];
}
```

Los contextos (`L1Context`, `CeContext`, `UmdContext`) traen `expect` inyectado: **las stories no importan `vitest`** (así el archivo se puede importar desde el playground sin arrastrar vitest).

## Escribir una story

```ts
// src/components/buttons/Button.stories.ts
import Button from "./Button.vue";
import type { ComponentStory } from "@/stories/types";

export const cuButtonStories: ComponentStory = {
  component: "cu-button",
  vue: Button,
  sections: [
    {
      id: "colors",
      title: "Colors",
      layout: "row",
      variants: [
        { id: "primary", props: { color: "primary" }, slots: { default: "Primary" } },
        // un variant por fila del demo
      ],
      vue: `<Button color="primary">Primary</Button>`,
      vanilla: `<cu-button color="primary">Primary</cu-button>`,
      checks: {
        l1: [
          {
            name: "resuelve --btn-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              const style = wrapper.find("button.cu-button").attributes("style") ?? "";
              expect(style).toContain(`--btn-bg: var(--cu-color-${color})`);
            },
          },
        ],
      },
    },
  ],
};
```

Buenas prácticas:

- **Un variant por caso real** del demo (no inventes estados que el componente no tiene).
- Checks **adaptados al variant** (usá `variant.props`), no copiados/pegados.
- Evitá aserciones frágiles de CSS (anchos/colores computados); asertá clases, atributos, tokens en `style`, texto y eventos.
- La story **no importa vitest**; usá el `expect` del contexto.
- Si la sección necesita interacción (loading, toggles), usá `preview: MiPreviewComponent` (un `defineComponent` con `setup()`) y dejá `variants` solo para los checks.

## Runner L1

```ts
// src/components/buttons/Button.l1.test.ts
import { cuButtonStories } from "./Button.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(cuButtonStories);
```

`runner.l1.ts` monta el `.vue` con `@vue/test-utils` por cada `variant × check`, corre el check y desmonta. El nombre del test es:

```
[cu-button] Colors › primary › resuelve --btn-bg al token --cu-color-{color}
```

y emite `meta = { component, section, variant, layer }` para el reporter.

Comandos:

```bash
pnpm run test:l1                 # capa L1 completa (project "l1")
pnpm run test:watch              # modo watch
pnpm exec vitest run --project l1 src/components/buttons/Button.l1.test.ts
```

## Reporter y playground

`tools/reporters/playground-reporter.ts` (configurado en `vitest.config.ts`) escribe `public/test-results.json`:

```jsonc
{
  "totals": { "pass": 65, "fail": 0 },
  "components": {
    "cu-button": {
      "sections": {
        "colors": { "status": "passed", "variants": { "primary": { "status": "passed", "checks": [ … ] } } }
      }
    }
  }
}
```

El playground lo lee con `useTestResults()` y pinta el badge ✅/❌ por sección (`TestResultBadge.vue`, usado por `StoryRenderer.vue`). Si el archivo no existe: "sin correr". El `title` del badge lista los checks fallidos con su error.

> El reporter **solo** cuenta tests con `meta`; los tests viejos (sin story) no aparecen en los badges.

## Capas L2 / L3 (pendientes)

El plan y el estado están en `.opencode/plans/plan-test-stories.md`. Resumen:

- **L2 (`ce`)**: project `ce` con `environment: 'browser'` (`@vitest/browser` + `@vitest/browser-playwright`); `defineCustomElement(*.ce.vue)`; checks reutilizables: tag registrado, `attribute→prop`, `property→prop`, eventos `ceEmit`, `defineExpose`, slots.
- **L3 (`umd`)**: carga `dist-lib/CuX.umd.js` en browser; mismos checks sobre el artefacto real + test de coexistencia (2 UMD sin doble Vue).

Hasta que existan, **la story ya debe declarar** los checks que apliquen en `checks.ce` / `checks.umd` (se pueden dejar para la fase), y el contrato de la story no cambia.

## Preflight

```bash
./scripts/preflight.sh
```

Corre type-check contra `scripts/typecheck-baseline` (falla solo si hay errores **nuevos**) + tests L1. En Fase 3 se suman build y L2/L3.

## Tests viejos

Los `X.test.ts` sin `runL1Story` son de la etapa anterior: siguen corriendo pero no dan badges ni salen de las secciones del playground. Al tocar un componente, **migralo**: receta paso a paso (con Badge como ejemplo) en [`08-migrar-al-sistema-de-stories.md`](08-migrar-al-sistema-de-stories.md).
