# Convenciones de desarrollo

Reglas que se aplican a todo el código de `src/`. Mantener consistencia con el resto de la librería.

## Nombres de archivos y carpetas

- **Componentes:** PascalCase. `<Nombre>.vue`, `<Nombre>.ce.vue`, `<Nombre>.ts`.
- **Composables:** camelCase con prefijo `use`. `usePagination.ts`, `useSearch.ts`, `useTableData.ts`.
- **Utils:** camelCase. `palette.ts`, `getHostTheme.ts`.
- **Stories:** `<Nombre>.stories.ts`, en `src/stories/` o subcarpeta según el tipo.
- **Tests:** `<archivo>.test.ts` al lado del archivo que testean.

## Nombres de tags (Custom Elements)

- Siempre con prefijo `cu-` (ComegenUI). El prefijo es obligatorio para Custom Elements.
- kebab-case: `cu-button`, `cu-dropdown-menu`, `cu-alert`.
- Evitar abreviaciones crípticas. Mejor `cu-modal` que `cu-md`.
- No usar `cu-` para componentes internos (los que no son Custom Element público, como `Dropdown.vue`).

## Nombres de variables

- En `.ce.vue`, la variable de `defineCustomElement` es `comegen<NombrePascalCase>`:

  ```ts
  // Button.ts
  const comegenButton = defineCustomElement(Button);
  ```

- En composables, funciones puras en camelCase: `getColorMap`, `getHostTheme`, `usePagination`.

## Props

### Naming

- camelCase en JS: `modelValue`, `itemsPerPage`, `hightContrast`.
- kebab-case en HTML: `model-value`, `items-per-page`, `hight-contrast`.
- **Excepción:** `hightContrast` está mal escrito pero se mantiene por compatibilidad (ver [`docs/notes/02-hightcontrast.md`](../../notes/02-hightcontrast.md)).

### Tipos

- Usar tipos de Vue cuando se pueda: `String`, `Boolean`, `Number`, `Array`, `Object`.
- Para `Object`, definir la interface en TypeScript y castear con `as PropType<MyInterface>`.
- Para arrays tipados: `type: Array as () => MyType[]`.

### Defaults

- **Siempre** definir un `default`, salvo que la prop sea requerida (`required: true`).
- Para arrays/objetos: `default: () => []` o `default: () => ({})` (función, no valor literal).

### Validadores

- Usar `validator` para `variant`, `color`, `size`, etc. Lista blanca con `.includes()`:

  ```ts
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
  ```

- Para `color`, validar el set semántico: `["primary", "neutral", "success", "warning", "danger"]`.

## Eventos

- Convención Vue: `update:<propName>` para v-model (`update:modelValue`).
- Eventos de negocio: kebab-case descriptivo (`edit-save`, `select`, `open`).
- Siempre `composed: true` en `CustomEvent` para cruzar Shadow DOM:

  ```ts
  host.dispatchEvent(new CustomEvent("evento", {
    detail: payload,
    bubbles: true,
    composed: true,
  }));
  ```

## Métodos (defineExpose)

- Para overlays: `open()`, `close()`, `toggle()`, getter `isOpen`.
- Para forms: `get()`, `set(value)`, `reset()`, `focus()`.
- Getters con sintaxis `get propName() { return ... }`.

## Slots

- **En `.vue` (interno):** sintaxis Vue: `<slot>`, `<slot name="x">`, `<template #y>`.
- **En `.ce.vue` (público):** sintaxis HTML nativa: `<slot name="x">`. El `.ce.vue` reenvía slots a través de `<slot name="x">` adentro de su template.

  ```html
  <!-- .ce.vue -->
  <template>
    <MiComponente>
      <template #icon>
        <slot name="icon"></slot>  <!-- slot HTML nativo -->
      </template>
      <slot></slot>
    </MiComponente>
  </template>
  ```

### Slots opcionales con contenido default (patrón `slotHasContent`)

**Problema:** el `.ce.vue` reenvía los slots de forma **incondicional** (`<template #header><slot name="header"></slot></template>`). En Vue, un slot provisto pero **vacío** descarta el contenido fallback del `.vue` interno — el host no lo llenó, pero el fallback (ej. el `title` como `<h3>`) tampoco se renderiza.

**Solución:** en el `.vue` interno, no depender del fallback de `<slot name="x">`. Detectar si el slot tiene contenido real con un helper y renderizar el slot o el fallback explícitamente:

```ts
// Card.vue
import { computed, useSlots, type VNode } from "vue";

const slots = useSlots();

function slotHasContent(name: string): boolean {
  const fn = slots[name];
  if (!fn) return false;
  return fn().some((vnode: VNode) => {
    if (typeof vnode.type === 'symbol') return false;
    if (vnode.type === 'comment') return false;
    if (vnode.type === 'text' && typeof vnode.children === 'string' && !vnode.children.trim()) return false;
    return true;
  });
}

const hasHeader = computed(() => slotHasContent('header'));
const hasFooter = computed(() => slotHasContent('footer'));
const hasMedia = computed(() => slotHasContent('media'));
```

```html
<!-- .vue -->
<header v-if="props.title || props.subtitle || hasHeader" class="cu-card-header">
  <template v-if="hasHeader">
    <slot name="header" />
  </template>
  <template v-else>
    <h3 v-if="props.title" class="cu-card-title">{{ props.title }}</h3>
    <p v-if="props.subtitle" class="cu-card-subtitle">{{ props.subtitle }}</p>
  </template>
</header>

<footer v-if="hasFooter" class="cu-card-footer">
  <slot name="footer" />
</footer>
```

**Reglas del patrón:**

- Usar `useSlots()` + helper `slotHasContent` cuando un slot tenga **contenido default** (fallback) y el `.ce.vue` lo reenvíe.
- El fallback se renderiza con `v-else`, no como contenido del `<slot>`.
- Slots sin fallback (ej. `footer`, `media`) solo necesitan el `v-if="slotHasContent('x')"`.
- Slots siempre presentes y con contenido obligatorio (ej. `default`) no necesitan nada de esto.

## CSS / UnoCSS

- Usar **utility-first** de UnoCSS: `bg-red-500`, `text-sm`, `p-4`, etc.
- Al final del `<style>` de cada `.vue` y `.ce.vue`, agregar:

  ```css
  <style>
  @unocss-placeholder;
  </style>
  ```

- **No** escribir CSS custom salvo que sea estrictamente necesario. Si necesitás algo custom, poné una clase con prefijo único para no chocar con utilities.
- **No** uses `@apply` salvo en casos muy justificados.

### Estilos `scoped`

- **Todos los componentes `.vue` deben usar `<style scoped>`.** Nunca `<style>` global, para no filtrar reglas hacia afuera ni pisar estilos del consumidor.
- Los `.ce.vue` son la excepción: usan `<style>` no-scoped, pero solo para `@unocss-placeholder` y reglas de `:host` (ver [`arquitectura.md`](arquitectura.md)).

### Especificidad en variantes con color propio

Todas las reglas de variante que definen `color`/`background-color` propios **deben usar doble clase** (`.cu-alert.cu-alert--solid`, `.cu-button.cu-button--ghost`, ...) para ganarle en cascada a reglas globales del consumidor (reset CSS, `button { color }`, `.card span { color }`, etc.). Una clase scoped simple (`(0,1,0)`) pierde contra reglas globales de tipo `.container span { color }` (`(0,1,1)`).

**Patrón:** doble clase en la base + doble clase + clase interna en el título:

```css
/* Alert.vue */
.cu-alert.cu-alert--solid {
  background-color: var(--alert-bg);
  color: var(--cu-color-surface);
}
.cu-alert.cu-alert--solid .cu-alert-title-text {
  color: var(--cu-color-surface);
}
```

```css
/* Card.vue */
.cu-card.cu-card--solid {
  background-color: var(--card-bg);
  color: var(--cu-color-surface);
}
.cu-card.cu-card--solid .cu-card-title {
  color: var(--cu-color-surface);
}
```

La clase duplicada sube la especificidad a `(0,2,0)` (y `(0,3,0)` con el título), suficiente para ganarle a reglas globales de elementos.

Aplica a **todo componente** con variantes de color (`solid`, `ghost`, `soft`, `subtle`, `outlined`, ...): las reglas de variante van con doble clase, y en `solid` el texto debe quedar `var(--cu-color-surface)`, nunca heredar un color global del consumidor.

> ⚠️ **`--cu-color-{name}-text` NO es para texto sobre `solid`.** Ese token es el color **oscurecido** (`darken(color, 0.25)` — en `sigacadv2`, `--cu-color-neutral-text: #000000`), pensado como tinte/énfasis sobre variantes suaves, no como contraste sobre el color base. Texto sobre fondo `solid` va **siempre** con `var(--cu-color-surface)` (blanco), como hacen `Button`, `Alert`, `Card` y `MonthSliderLabel`.

**Regla activa (aplicar en cada componente que se desarrolle/modifique):**
1. Toda regla de variante que defina `color`/`background-color` → **doble clase** (`.cu-x.cu-x--variant`, y para estados: `.cu-x.cu-x:hover:not(:disabled)`, `.cu-x.cu-x--today`, ...).
2. Texto sobre `solid` → `var(--cu-color-surface)`.
3. Probar la variante `solid` en el playground (donde hay reglas globales de color) antes de dar por cerrado el componente.

## Imports

- Imports relativos dentro de `src/`:

  ```ts
  import Button from "./Button.vue";
  import { getColorMap } from "../utils/palette";
  ```

- Sin alias `@/`. Los paths son siempre relativos.
- Para Vue: `import { ref, computed, watch, getCurrentInstance } from "vue"`.
- Para utils propios: `from "../utils/palette"`, `from "../config/theme"`, `from "../utils/getHostTheme"`.

## TypeScript

- `"strict": true` (asumido por el template de Vite).
- **No** usar `any` salvo necesidad. Si tenés que usarlo, justificá con un comentario (no, en serio: no uses `any`).
- Para props de Custom Element que son arrays/objetos complejos, castear: `as () => MyType[]`.
- Para eventos custom: `CustomEvent<MyType>` cuando sea posible.

## Testing (Vitest)

- Tests de composables van al lado del composable: `usePagination.test.ts`.
- Usar `@vue/test-utils` para tests de componentes (si se agregan en el futuro).
- Cobertura: ver [testing.md](testing.md).

## Estructura de carpetas (resumen)

Ver [arquitectura.md](arquitectura.md#ubicaciones). Reglas rápidas:

- `src/components/` (raíz): botones, alerts, modals, badges, dropdowns, pagination.
- `src/components/form/`: inputs, checkboxes, switches, textareas, selects, labels, autocomplete.
- `src/components/data/`: tablas.
- `src/components/labs/`: experimentales. **Compilan**, no es sandbox. La carpeta **puede estar vacía** (o no existir) si no hay componentes en experimentación.
- `src/components/archived/`: retirados. **Compilan**, ver [`docs/notes/01-build-glob.md`](../../notes/01-build-glob.md).

## Composición

- **No** anides muchos niveles. Si un `.ce.vue` envuelve a un `.vue` que envuelve a otro `.vue`, considerar refactor.
- Para casos como `DropdownMenu` (que envuelve a `Dropdown.vue`), está OK porque `Dropdown` es un motor genérico y `DropdownMenu` agrega API específica.

## Comentarios

- En `.vue` y `.ts`, los comentarios deben ser en **español** (consistente con la doc).
- **No** comentar lo obvio. Comentá el "por qué", no el "qué".
- Para headers de archivo: usar comentario al inicio del `<script>` o del archivo, no dentro del template.

## Workflow de ramas (git)

Toda tarea de desarrollo (feature, fix, docs, tests) se trabaja en una **rama propia creada desde `main`** — nunca se commitea directo en `main`; `main` solo recibe merges (idealmente con MR/review). Ver la [Regla de oro #3](SKILL.md#regla-de-oro).

- **Naming:** `feat/<nombre>`, `fix/<nombre>`, `docs/<nombre>`, `test/<nombre>`, `chore/<nombre>`.
- **Antes de empezar:** `git checkout main && git pull --ff-only && git checkout -b <tipo>/<nombre>`.
- **Al terminar:** commit + push, mergear a `main` (o abrir MR) y borrar la rama local (`git branch -d <tipo>/<nombre>`).
- Si la tarea solo toca documentación, igual va en rama: `docs/<tema>`.
