# 05 — Playground

Iterar con `pnpm dev` (hot reload).

## Playground genérico (actual)

El plugin `src/plugins/khadgar/` registra la ruta dinámica `/playground/components/:name` y `StoryPage.vue` pinta la story completa: **secciones + extras (Programmatic/Events) + Style + API**. No se escribe una página por componente.

- **Nav automático**: `PlaygroundLayout.vue` ya no hardcodea entradas; lo deriva del registry (categoría = subcarpeta de `src/stories`). Para ocultar/ordenar/renombrar: `khadgar.config.json` → `nav`.
- **Registry lazy**: las stories se cargan al navegar (code-splitting). Para que exista la página, la story necesita `tokens`/`api`: `pnpm khadgar:generate X --meta-only` (o `--all`).
- **Páginas físicas (opcional)**: `pnpm khadgar:generate X --pages` crea `src/playground/X.vue` editable; si existe (la haya generado el plugin o no), **override** de la página genérica.
- Config por componente: `X.stories.config.json` (order/include/exclude, `sections`, `custom[]`, `attrs`, `api`, `tokens`, `subComponents`, `components`, `interfaceCode`). Extras: `X.stories.extras.ts` (Programmatic = exposes/v-model; Events = eventos).

### Extras (patio de juegos)

- **Programmatic**: **solo si el componente usa `defineExpose`**. Botones `Button color="neutral"` sobre una instancia (`ref`), una acción por botón, línea `playground-state` con los getters en vivo, y el componente al final. Si no expone métodos, no se crea. Ej: `src/stories/overlay/Collapse.stories.extras.ts`, `src/stories/information/Alert.stories.extras.ts`.
- **Events**: una instancia y un log en vivo de los eventos (nativos + `ceEmit` con `e.detail`). Ej: `src/stories/buttons/Button.stories.extras.ts`.

**Pitfall (v-model controlado):** si el componente usa `defineModel` y le pasás `v-model` desde el extra, `set()`/`reset()` **no** cambian el valor local en el mismo tick: solo emiten `update:modelValue`. El estado del patio debe actualizarse desde `onUpdate:modelValue`/eventos; `get()` se usa solo en el botón `get()`. Leer `get()` justo después de `set()` revierte el estado (bug real corregido en Switch/Checkbox/Textarea/Input/ColorPicker).
- Se pintan como sección propia después de las secciones de la story.

## Página física (opcional)

La página genérica alcanza para el 99%. Si necesitás una sección custom que la
story no puede expresar, generá una página física con
`pnpm khadgar:generate X --pages`. El plugin la detecta (por nombre) y la
usa en lugar de la genérica.

El scaffold **reusa el runtime del plugin**: `StoryBody` pinta todo lo genérico y
`buildOutline` arma el outline. Solo agregás lo tuyo.

```vue
<script setup lang="ts">
import PlaygroundLayout from "@/plugins/khadgar/runtime/PlaygroundLayout.vue";
import StoryBody from "@/plugins/khadgar/runtime/StoryBody.vue";
import { buildOutline } from "@/plugins/khadgar/runtime/outline";
import { cuXStories } from "@/stories/{category}/X.stories";

const outlineItems = buildOutline(cuXStories);
// Si agregás una sección custom, sumá su item al outline:
outlineItems.splice(-2, 0, { label: "Custom", id: "custom" });
</script>

<template>
  <PlaygroundLayout title="X" :outlineItems="outlineItems">
    <StoryBody :story="cuXStories" />
    <!-- Agregá acá secciones custom (con id propio para el outline). -->
  </PlaygroundLayout>
</template>
```

> Las páginas legacy del repo quedaron en `backups/legacy-playground-pages/`
> (ya no se compilan).

### Reglas de la story para que el preview quede bien

1. **Badge de default** en la sección: `section.badge` + `section.badgeTitle` (leer el default del source, no de la tabla de API).
2. **`layout`**: `"row"` (default) o `"col"`.
3. **Cada sección** lleva `vue` y `vanilla` (la tab Vanilla **solo si el componente está en `lib/`**). En snippets escapá `</script>` como `<\/script>`.
4. **Interactividad**: si la sección necesita estado (loading, toggles), usá `preview` (un `defineComponent` con `setup()`); el loop de `variants` queda para los checks.
5. **Programmatic**: **no** va en la página; va como **extra** de la story (`X.stories.extras.ts`) y **solo si el componente usa `defineExpose`**. Página legacy: mismo layout en su `<section id="programmatic">`, pero es transitorio.

### Programmatic (layout — aplica a extras)

El layout del patio es el mismo en extras y en páginas legacy:

- `<h2>Programmatic</h2>` + `<p class="playground-desc">Seguidilla de botones sobre la instancia de abajo</p>`.
- Fila de `Button color="neutral"` (uniformes, una acción por botón, nunca `<button>` nativo), UNA línea `<p class="playground-state">` con los getters en vivo, y el componente **al final**.
- Actualizar el estado desde los eventos del componente (`@update:model-value`, `@change`, `@toggle`…) y en `get()` cuando se lo invoca; **no** leer `get()` justo después de `set()` en v-model controlado (ver pitfall arriba).
- Outline del extra: `id: "programmatic"`, sin children.
- En snippets el estado se loguea a `console`; Vanilla usa `cu-button`.

## Secciones a mano (extras)

Las demos que la story no puede expresar van como **extras** (`X.stories.extras.ts`, `StoryExtra[]`), no en una página. Reglas del `SectionDemo` para un extra:

- Toda sección de demo lleva `SectionDemo`; la **API es la única sin tabs**.
- Tabs en orden **Preview, Vue, Vanilla** (Vanilla solo si está en `lib/`).
- Tab **Vue**: uso como componente Vue (`import X from '@/components/.../X.vue'` + `<X />`). **Nunca** markup de custom element acá.
- Tab **Vanilla**: `<script src="dist/CuX.umd.js">` + `<cu-x>`; arrays/objetos por JS tras `customElements.whenDefined('cu-x')`; eventos con `addEventListener('evento', e => e.detail)`.
- API con `h3` chicos (`api-*`), `Table variant="ghost" compact`, `empty="…"` en vez de filas fake con "—".
- **Interfaces**: si un prop tiene estructura (items/options/columns/events), subsección `Interfaces` con `CodeBlock :code="interfaceCode" language="ts" variant="solid"` con la interfaz **real** del source (no inventar).

## Trampas

| Trampa | Fix |
|---|---|
| El global del layout pisa colores de spans: `.playground[data-v] :is(…,span,…)` = (0,2,1) | Subir especificidad en el componente (clase duplicada → 0,3,0). **NO** tocar el layout. |
| `Button.vue` setea `--btn-*` inline → no sobreescribibles desde afuera | Elegir variante según fondo: `soft` en claros, `solid` sobre `neutral`. |
| Tooltips nativos (`title`) | No cuentan como feedback visible de una prop; si debe "verse", renderizar texto real. |
| Swap animado de textos | Un solo `<Transition mode="out-in">` con `:key`. |
| FABs y `position: fixed` en preview | En la demo: `style="position: static"` por instancia (también en el snippet). |
| Secciones sin `SectionDemo` | Migrar al patrón nuevo al tocar la página; no dejar secciones híbridas. |

## Registrar el playground (automático)

Ya **no** hay que registrar nada a mano: el plugin deriva la ruta y el nav del
glob de stories.

1. **Story** — `src/stories/{category}/X.stories.ts` (la crea
   `pnpm khadgar:generate X`, o `--all`).
2. **Ruta** — la agrega el plugin (`/playground/components/:name`).
3. **Nav** — lo deriva el plugin de la subcarpeta de la story (categoría). Para
   ordenar/renombrar/ocultar: `khadgar.config.json` → `nav`.

**Validación:** abrir `/playground/components/x` — aparece en el nav solo, el
outline salta a las secciones, tabs ok, badge de tests visible.

## Nueva categoría (grupo del nav)

Un grupo del nav = una **subcarpeta de `src/stories/`** (y de
`src/components/`). Al crear `src/stories/{category}/X.stories.ts`, el grupo
aparece solo. Para ubicarlo en un orden puntual, agregalo a
`nav.order` en `khadgar.config.json`. Si la categoría es nueva, actualizá
el árbol de `AGENTS.md`.

## Sincronizar

El nav espeja `src/stories/` 1:1 (label = archivo sin `.stories.ts`, orden
alfabético). Para ver qué falta:

```bash
pnpm khadgar:generate --all   # crea/actualiza stories y metadata
```

> Ya no existe el concepto de "página legacy". Las viejas quedaron en
> `backups/legacy-playground-pages/`.

## Tokens ↔ ThemeBuilder

El ThemeBuilder (`src/pages/playground/ThemeBuilder.vue`) consume `colorsBlock()` de `src/plugins/cu-tokens/css.ts` (mismo generador que `build:lib`).

1. Si agregás/modificás un token → tocá SOLO el generador (`css.ts`) y verificá la variable en el CSS exportado del modal (Copy/Download). Test: `src/plugins/cu-tokens/css.test.ts`.
2. El ThemeBuilder previsualiza TODOS los componentes de la lib: al agregar uno a `src/lib/`, agregá su preview.
