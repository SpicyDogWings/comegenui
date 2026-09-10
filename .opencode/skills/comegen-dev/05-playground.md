# 05 — Playground

Páginas en `src/pages/playground/components/`. Iterar con `pnpm dev` (hot reload).

## Patrón nuevo (story-driven — el obligatorio)

La página **no escribe demos a mano**: renderiza la story con `StoryRenderer` y solo agrega lo que la story no puede expresar (Style, API, y Programmatic si hay métodos/v-model).

```vue
<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import PlaygroundStyle from "@/templates/playground/PlaygroundStyle.vue";
import Table from "@/components/data/Table.vue";
import { cuXStories } from "@/components/{category}/X.stories";

const outlineItems = [
  ...cuXStories.sections.map((s) => ({ label: s.title, id: s.id })),
  { label: 'Style', id: 'style', children: [{ label: 'CSS Variables', id: 'style-variables' }] },
  { label: 'API', id: 'api', children: [
    { label: 'Props', id: 'api-props' },
    { label: 'Slots', id: 'api-slots' },
    { label: 'Events', id: 'api-events' },
    { label: 'Exposes', id: 'api-exposes' },
    // { label: 'Interfaces', id: 'api-interfaces' },  // si hay props complejas
  ]},
];

const componentTokens = [ /* tokens --cu-* del componente */ ];
const apiColumns = [ /* … */ ];
const propsData = [ /* … */ ];
const slotsData = [ /* … */ ];
const eventsData = [ /* … */ ];
</script>

<template>
  <PlaygroundLayout title="X" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuXStories" />

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>
        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />
        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />
        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />
        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
```

Referencia viva: `src/pages/playground/components/Button.vue`.

### Reglas de la story para que el preview quede bien

1. **Badge de default** en la sección: `section.badge` + `section.badgeTitle` (leer el default del source, no de la tabla de API).
2. **`layout`**: `"row"` (default) o `"col"`.
3. **Cada sección** lleva `vue` y `vanilla` (la tab Vanilla **solo si el componente está en `lib/`**). En snippets escapá `</script>` como `<\/script>`.
4. **Interactividad**: si la sección necesita estado (loading, toggles), usá `preview` (un `defineComponent` con `setup()`); el loop de `variants` queda para los checks.
5. **Programmatic** (si expone métodos o se controla por v-model): se escribe a mano en la página, **entre `StoryRenderer` y Style**, con el layout fijo de abajo.

### Programmatic (página, no story)

Referencia: `DatePicker.vue`.

- `<div class="playground-heading"><h2>Programmatic</h2></div>` + `<p class="playground-desc">Seguidilla de botones sobre la instancia de abajo</p>`.
- `SectionDemo` con: fila de `Button color="neutral"` (uniformes, una acción por botón, nunca `<button>` nativo), UNA línea `<p class="playground-state">` con los getters/v-model en vivo, y el componente **al final**.
- Estado en vivo: actualizar en cada acción **y** en los events del componente (`@update:model-value`, `@close`, `@change`…).
- Sin métodos expuestos → manipular los v-models (ej: Pagination `v-model:current-page`).
- Outline `Programmatic` **sin children**.
- En snippets el estado se loguea a `console` (`logState()`); Vanilla usa `cu-button`.

## Patrón viejo (solo páginas sin migrar)

Si una página todavía tiene `<section>` con demos inline, migrala al patrón nuevo (story + `StoryRenderer`) al tocarla. Reglas históricas del `SectionDemo` inline, por si tenés que escribir uno a mano (API, Programmatic):

- Toda sección de demo lleva `SectionDemo`; la **API es la única sin tabs**.
- Tabs en orden **Preview, Vue, Vanilla** (Vanilla solo si está en `lib/`).
- Tab **Vue**: uso como componente Vue (`import X from '@/components/.../X.vue'` + `<X />`). **Nunca** markup de custom element acá.
- Tab **Vanilla**: `<script src="dist/CuX.umd.js">` + `<cu-x>`; arrays/objetos por JS tras `customElements.whenDefined('cu-x')`; eventos con `addEventListener('evento', e => e.detail)`.
- API con `h3` chicos (`api-*`), `Table variant="ghost" compact`, `empty="…"` en vez de filas fake con "—".
- **Interfaces**: si un prop tiene estructura (items/options/columns/events), subsección `Interfaces` con `CodeBlock :code="interfaceCode" language="ts" variant="solid"` con la interfaz **real** del source (no inventar). El demo linkea con `Button variant="link" to="#api-interfaces"`.

## Trampas

| Trampa | Fix |
|---|---|
| El global del layout pisa colores de spans: `.playground[data-v] :is(…,span,…)` = (0,2,1) | Subir especificidad en el componente (clase duplicada → 0,3,0). **NO** tocar el layout. |
| `Button.vue` setea `--btn-*` inline → no sobreescribibles desde afuera | Elegir variante según fondo: `soft` en claros, `solid` sobre `neutral`. |
| Tooltips nativos (`title`) | No cuentan como feedback visible de una prop; si debe "verse", renderizar texto real. |
| Swap animado de textos | Un solo `<Transition mode="out-in">` con `:key`. |
| FABs y `position: fixed` en preview | En la demo: `style="position: static"` por instancia (también en el snippet). |
| Secciones sin `SectionDemo` | Migrar al patrón nuevo al tocar la página; no dejar secciones híbridas. |

## Registrar el playground (router + nav)

La página sola no alcanza: **3 lugares**.

1. **Página** — `src/pages/playground/components/X.vue` (PascalCase igual al componente).
2. **Route** — `src/router/index.ts`:

```ts
{
  path: "x",
  name: "X playground",
  component: () => import("@/pages/playground/components/X.vue")
},
```

3. **Nav** — `PlaygroundLayout.vue`, en el grupo de su categoría (label = nombre exacto del componente):

```ts
{ label: 'X', path: '/playground/components/x' },
```

**Validación:** abrir `/playground/components/x` — aparece en el nav, el outline salta a las secciones, tabs ok, badge de tests visible.

## Nueva sección (grupo del nav)

Un grupo del nav = una **categoría de carpeta**.

1. Carpeta `src/components/{category}/`.
2. `src/lib/{category}/` si son públicos.
3. Grupo en `PlaygroundLayout.vue` (label **Capitalized**):

```ts
{ label: '{Category}', children: [
  { label: 'X', path: '/playground/components/x' },
]},
```

4. Cada componente → [Registrar](#registrar-el-playground-router--nav).
5. Si la categoría es nueva, actualizar el árbol de `AGENTS.md`.

## Sincronizar nav ↔ carpetas

**Regla:** el grupo del nav espeja la carpeta 1:1 (label = archivo sin `.vue`, orden alfabético).

```bash
ls src/components/buttons/ | grep -v test
```

Por cada componente sin entrada: página + route + nav. Validar contando entradas del nav = archivos `.vue` sin test de la carpeta.

## Auditoría de migración

`SectionDemo` envueltos vs secciones demo (todas menos API). Con el patrón nuevo la página **no** tiene `SectionDemo` (los pone `StoryRenderer`), así que este comando aplica solo a páginas sin migrar:

```bash
cd src/pages/playground/components && for f in *.vue; do
  echo "$(grep -c '<SectionDemo' "$f")/$(($(grep -c '<section' "$f") - $(grep -c 'id="api"' "$f"))) $f"
done
```

Interpretación: `0/0` con `StoryRenderer` = migrada; `N/N` inline = completa; `0<N` = legacy.

> Cuando te pregunten si una sección/grupo está "completo", verificá **ambos**: (1) nav ↔ carpeta 1:1 y (2) cada página migrada/terminada. No asumas.

## Tokens ↔ ThemeBuilder

El ThemeBuilder (`src/pages/playground/ThemeBuilder.vue`) consume `colorsBlock()` de `src/plugins/cu-tokens/css.ts` (mismo generador que `build:lib`).

1. Si agregás/modificás un token → tocá SOLO el generador (`css.ts`) y verificá la variable en el CSS exportado del modal (Copy/Download). Test: `src/plugins/cu-tokens/css.test.ts`.
2. El ThemeBuilder previsualiza TODOS los componentes de la lib: al agregar uno a `src/lib/`, agregá su preview.
