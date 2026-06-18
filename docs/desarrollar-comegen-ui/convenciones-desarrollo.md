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
- `src/components/labs/`: experimentales. **Compilan**, no es sandbox.
- `src/components/archived/`: retirados. **Compilan**, ver [`docs/notes/01-build-glob.md`](../../notes/01-build-glob.md).

## Composición

- **No** anides muchos niveles. Si un `.ce.vue` envuelve a un `.vue` que envuelve a otro `.vue`, considerar refactor.
- Para casos como `DropdownMenu` (que envuelve a `Dropdown.vue`), está OK porque `Dropdown` es un motor genérico y `DropdownMenu` agrega API específica.

## Comentarios

- En `.vue` y `.ts`, los comentarios deben ser en **español** (consistente con la doc).
- **No** comentar lo obvio. Comentá el "por qué", no el "qué".
- Para headers de archivo: usar comentario al inicio del `<script>` o del archivo, no dentro del template.
