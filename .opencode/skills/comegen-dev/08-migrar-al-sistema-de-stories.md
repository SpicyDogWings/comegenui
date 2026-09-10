# 08 — Migrar un componente al sistema de stories (1f)

Receta para pasar un componente existente (test viejo + playground a mano) al sistema de **story + `X.l1.test.ts` + `StoryRenderer` + badges**, sin perder cobertura.

> Es el trabajo de **1f** del plan (`.opencode/plans/plan-test-stories.md`). Un commit atómico por componente.

## 0. Inventario

```bash
ls src/lib/**/x.ts                                  # ¿es público? (define tab Vanilla + doc)
ls src/components/**/X.test.ts                      # test viejo (a migrar)
ls src/pages/playground/components/X.vue            # página actual (a refactorizar)
ls docs/skills/use-comegen/componentes/cu-x.md      # doc existente
```

## 1. Extraer las secciones del playground

Abrí la página y anotá por sección: `id`, `title`, badge/default, `layout` (row/col), las demos y los snippets (`vue`/`vanilla`). Las secciones del nav deben ser **las mismas ids** en la story.

Para **Badge**: `variants`, `colors`, `combinations`, `programmatic` (esta última queda en la página, no en la story) y luego `style`/`api`.

## 2. Escribir la story `X.stories.ts`

- `variants`: una fila por demo (los mismos valores que muestra el playground).
- Snippets: moverlos tal cual; una misma sección no comparte snippet con otra salvo que el demo sea idéntico.
- **Secciones con grilla/tabla** (ej: Badge `combinations`, 5 variantes × 6 colores): usar `preview` (un `defineComponent` con `setup()` que renderiza la tabla) y dejar `variants` solo para los checks.
- **Secciones interactivas** (v-model, toggles, loading): `preview` + variantes para checks.
- **Programmatic** (métodos expuestos o v-model): **no va a la story**, se queda en la página (ver [`05-playground.md`](05-playground.md)).

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
./scripts/preflight.sh
pnpm dev      # /playground/components/x → badges ✅ por sección, preview igual al anterior
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

## Pitfalls

- **Preview distinto**: si la tabla/grilla no se puede expresar con `variants`, usá `preview`; no deformes el demo para que entre en el loop.
- **Estilos globales de la página**: el `preview` se renderiza dentro de la página, así que los `<style>` globales (ej: `.playground-badge-table`) se conservan ahí, no en la story.
- **Defaults**: para testear el default, agregá un variant con `props: {}` (mostrarlo en el preview suele ser deseable) y asertá el default real.
- **Ids del nav**: story y `outlineItems` deben usar las mismas ids; si no, el outline no salta.
- **No dejes los dos tests**: al terminar debe quedar solo `X.l1.test.ts`.
- **Doc desactualizada**: si la migración revela props/eventos que la doc no tenía, actualizala con `comegen-ui-docs`.
