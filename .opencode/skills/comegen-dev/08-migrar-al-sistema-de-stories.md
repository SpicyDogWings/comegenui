# 08 — Migrar un componente al sistema de stories (1f)

> **Histórico.** Con el plugin `cu-playground` la creación de stories es
> automática: `pnpm cu-playground:generate X` (o `--all`) lee el contrato del
> `.vue`. Este documento queda como referencia del flujo viejo (páginas legacy
> en `src/pages/playground/components/`, hoy movidas a `backups/`).

Receta para pasar un componente existente (test viejo + playground a mano) al sistema de **story + `X.l1.test.ts` + `StoryRenderer` + badges**, sin perder cobertura.

> Es el trabajo de **1f** del plan (`.opencode/plans/plan-test-stories.md`). Un commit atómico por componente.

## 0. Inventario

```bash
pnpm run stories:status                             # estado de todos los componentes
ls src/lib/**/x.ts                                  # ¿es público? (define tab Vanilla + doc)
ls src/components/**/X.test.ts                      # test viejo (a migrar)
ls src/pages/playground/components/X.vue            # página actual (a refactorizar)
ls docs/skills/use-comegen/componentes/cu-x.md      # doc existente
```

> **Flujo actual (preferido):** `pnpm run stories:generate X` arma la story **desde las props** (secciones enum/boolean/texto, snippets y checks derivados del source). Refiná con `src/stories/{category}/X.stories.config.json` (`order`, `include`/`exclude`, `sections.<id>.extraProps|preview`, secciones `custom[]`). Después:
> - `pnpm run stories:generate X --meta-only` → agrega `tokens`/`api` (la story pasa a la **StoryPage genérica**).
> - `src/stories/{category}/X.stories.extras.ts` → **Programmatic** (solo si usa `defineExpose`) y/o **Events** (si emite).
>
> **Alternativa:** `pnpm run stories:migrate X` cuando el demo de la página es más rico que las props (extrae secciones/snippets/variants/checks de la página y deja TODO lo específico).

## 1. Extraer las secciones del playground

Abrí la página y anotá por sección: `id`, `title`, badge/default, `layout` (row/col), las demos y los snippets (`vue`/`vanilla`). Las secciones del nav deben ser **las mismas ids** en la story.

Para **Badge**: `variants`, `colors`, `combinations`, `programmatic` (esta última queda en la página, no en la story) y luego `style`/`api`.

## 2. Escribir la story `X.stories.ts`

Si usaste `pnpm run stories:migrate X`, ya trae secciones, snippets, variants y checks genéricos: corré `pnpm exec vitest run --project l1 src/stories/{category}/X.l1.test.ts` y revisá el reporte de TODOs (eventos, exposes, `v-for`, slots nombrados). Agregá solo los checks específicos que falten.

- `variants`: una fila por demo (los mismos valores que muestra el playground).
- Snippets: moverlos tal cual; una misma sección no comparte snippet con otra salvo que el demo sea idéntico.
- **Secciones con grilla/tabla** (ej: Badge `combinations`, 5 variantes × 6 colores): usar `preview` (un `defineComponent` con `setup()` que renderiza la tabla) y dejar `variants` solo para los checks.
- **Secciones interactivas** (v-model, toggles, loading): `preview` + variantes para checks.
- **Programmatic**: **solo si el componente usa `defineExpose`**; va como **extra** en `X.stories.extras.ts` (`StoryExtra`), no en la página (ver [`05-playground.md`](05-playground.md)).
- **Events**: patio de eventos como extra (nativos + `ceEmit` con `e.detail`).

## 3. Migrar los checks del test viejo

Cada `it` viejo se convierte en un `check` dentro de la sección que le corresponde, adaptado al `variant`. Mapeo de Badge:

| Test viejo (`Badge.test.ts`) | Check en la story | Sección |
|---|---|---|
| renderiza el slot dentro de `span.cu-badge` | `el span.cu-badge contiene el slot` | `variants` |
| variante por defecto `cu-badge--soft` | variant `default` (`props: {}`) + `default es soft` | `variants` |
| `variant` aplica `cu-badge--{variant}` | `aplica la clase cu-badge--{variant}` | `variants` |
| `color` aplica custom properties | `resuelve --badge-bg al token --cu-color-{color}` | `colors` |

Si un test viejo no mapea a una sección (interacción rara), agregá una sección/variante nueva o un check extra; no lo dejes afuera.

## 4. Test L1 y borrar el viejo

```ts
// src/stories/information/Badge.l1.test.ts
import { cuBadgeStories } from "./Badge.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(cuBadgeStories);
```

```bash
git rm src/components/information/Badge.test.ts
pnpm exec vitest run --project l1 src/stories/information/Badge.l1.test.ts
```

## 5. Refactorizar la página

Reemplazar las secciones a mano por `StoryRenderer`; conservar **Programmatic**, `Style` y `API` (y sus estilos globales, ej: `.playground-badge-table`). El `outlineItems` se deriva de la story:

```ts
const outlineItems = [
  ...cuBadgeStories.sections.map((s) => ({ label: s.title, id: s.id })),
  { label: 'Programmatic', id: 'programmatic' },
  { label: 'Style', id: 'style', children: [{ label: 'CSS Variables', id: 'style-variables' }] },
  { label: 'API', id: 'api', children: [ /* props, slots, events, exposes */ ] },
];
```

Patrón completo en [`05-playground.md`](05-playground.md).

## 6. Validar

```bash
./scripts/preflight.sh X     # scopeado (~8s): type-check + solo el L1 del componente
pnpm dev                     # /playground/components/x → badges ✓ por sección
```

Si el preview cambió respecto del viejo, o el badge no da ✅, no está migrado.

## 7. Commit atómico

```bash
git status --short
git add src/stories/information/Badge.stories.ts \
        src/stories/information/Badge.l1.test.ts \
        src/pages/playground/components/Badge.vue
git commit -m "test(l1/badge): migrar Badge al sistema de stories"
```

## Ejemplo completo (Badge, resumido)

```ts
// src/stories/information/Badge.stories.ts
import { defineComponent, h } from "vue";
import Badge from "./Badge.vue";
import type { ComponentStory } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["solid", "soft", "ghost", "subtle", "outlined"] as const;

const BadgeCombinationsPreview = defineComponent({
  name: "BadgeCombinationsPreview",
  setup() {
    return () =>
      h("table", { class: "playground-badge-table" }, [
        h("thead", [h("tr", [h("th", "variant \\ color"), ...COLORS.map((c) => h("th", { key: c }, c))])]),
        h("tbody", VARIANTS.map((v) =>
          h("tr", { key: v }, [
            h("td", { class: "playground-badge-label" }, v),
            ...COLORS.map((c) => h("td", { key: c }, [h(Badge, { color: c, variant: v }, () => v)])),
          ]),
        )),
      ]);
  },
});

export const cuBadgeStories: ComponentStory = {
  component: "cu-badge",
  vue: Badge,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      layout: "row",
      variants: [
        { id: "default", props: {}, slots: { default: "default" } },
        ...VARIANTS.map((v) => ({ id: v, props: { color: "primary", variant: v }, slots: { default: v } })),
      ],
      vue: "…snippet actual…",
      vanilla: "…snippet actual…",
      checks: {
        l1: [
          {
            name: "aplica la clase cu-badge--{variant}",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "soft";
              expect(wrapper.find("span.cu-badge").classes()).toContain(`cu-badge--${value}`);
            },
          },
          {
            name: "el span.cu-badge contiene el slot",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("span.cu-badge").text()).toContain(String(variant.slots?.default));
            },
          },
        ],
      },
    },
    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Color por defecto",
      variants: COLORS.map((c) => ({ id: c, props: { color: c }, slots: { default: c } })),
      checks: {
        l1: [
          {
            name: "resuelve --badge-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find("span.cu-badge").attributes("style")).toContain(
                `--badge-bg: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },
    {
      id: "combinations",
      title: "All Combinations",
      preview: BadgeCombinationsPreview,
      variants: VARIANTS.flatMap((v) =>
        COLORS.map((c) => ({ id: `${v}-${c}`, props: { variant: v, color: c }, slots: { default: v } })),
      ),
      checks: {
        l1: [
          {
            name: "combina variant + color",
            run({ wrapper, expect }, variant) {
              const classes = wrapper.find("span.cu-badge").classes();
              expect(classes).toContain(`cu-badge--${variant.props?.variant}`);
            },
          },
        ],
      },
    },
  ],
};
```

## Migración en paralelo (lotes)

Cuando hay varios componentes para migrar, **un subagente por componente en paralelo** multiplica la velocidad. Cada uno escribe archivos distintos (story, test y página de su componente), así que no hay conflictos; el orquestador valida y commitea por componente.

**Prompt base para cada subagente** (adaptar nombre y categoría):

> Estás en el repo comegen-ui. Migrá el componente **X** al sistema de stories/tests L1. NO hagas commit ni toques archivos fuera de los indicados.
> 1. Leé `.opencode/skills/comegen-dev/04-stories-y-tests.md` y `08-migrar-al-sistema-de-stories.md`.
> 2. `pnpm run stories:generate X` (prop-driven) y refiná con `X.stories.config.json`; si el demo de la página es más rico que las props, usá `pnpm run stories:migrate X` o escribila a mano.
> 3. `pnpm run stories:generate X --meta-only` para `tokens`/`api`; agregá `X.stories.extras.ts` con Programmatic **solo si usa `defineExpose`** (y Events si emite).
> 4. `X.l1.test.ts` con `runL1Story`; borrá el test viejo (`git rm .../X.test.ts`).
> 5. `pnpm exec vitest run --project l1 src/stories/{cat}/X.l1.test.ts` hasta verde.
> 6. Reportá archivos, cantidad de checks, resultado y bloqueos.

**Orquestador:** al terminar todos, correr `./scripts/preflight.sh <X>` por componente; si da verde, commit atómico `test(l1/x): migrar X al sistema de stories`; al cierre, `./scripts/preflight.sh` completo y ratchet del baseline si bajó.

Reglas del lote:
- Los subagentes **no commitean**; el orquestador revisa y commitea.
- Un componente con interacciones difíciles (v-for, slots nombrados, teleport, Pinia) puede requerir ajustes del orquestador.
- Si un subagente reporta errores de type-check ajenos, correr el preflight completo antes de asumir que son propios.

## Pitfalls

- **Preview distinto**: si la tabla/grilla no se puede expresar con `variants`, usá `preview`; no deformes el demo para que entre en el loop.
- **Estilos globales de la página**: el `preview` se renderiza dentro de la página, así que los `<style>` globales (ej: `.playground-badge-table`) se conservan ahí, no en la story.
- **Defaults**: para testear el default, agregá un variant con `props: {}` (mostrarlo en el preview suele ser deseable) y asertá el default real.
- **Ids del nav**: story y `outlineItems` deben usar las mismas ids; si no, el outline no salta.
- **No dejes los dos tests**: al terminar debe quedar solo `X.l1.test.ts`.
- **Doc desactualizada**: si la migración revela props/eventos que la doc no tenía, actualizala con `comegen-ui-docs`.
