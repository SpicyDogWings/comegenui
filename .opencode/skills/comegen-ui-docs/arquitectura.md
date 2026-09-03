# Arquitectura de componentes

ComegenUI sigue un patrón de **3 archivos por componente público**, con separación estricta de responsabilidades.

## Estructura

```
src/components/
├── MiComponente.ce.vue   # Thin wrapper para Custom Element (UMD)
├── MiComponente.vue      # Lógica real del componente
└── MiComponente.ts       # defineCustomElement + registro
```

Un componente puede ser **solo `.vue`** si es interno (no se expone como Custom Element), como `Dropdown.vue` (motor genérico usado por `DropdownMenu.vue`).

## Responsabilidades

### `MiComponente.ce.vue` — **El wrapper para Custom Element (fuente de verdad de la API)**

- Define la interfaz pública del componente (props, emits, exposes).
- **Resuelve el tema activo** con `getHostTheme()` y convierte colores semánticos a hex con `getColorMap()`.
- Pasa props explícitamente al `.vue` interno (NO usar `v-bind="{...props}"`).
- Forwardea slots usando sintaxis HTML nativa `slot="nombre"` (no `#nombre` de Vue).
- Re-emite eventos custom del `.vue` interno con `ceEmit()` o `defineEmits()`.
- Expone métodos via `defineExpose()` delegando al ref interno.

> **Cuando estés documentando, leé siempre este archivo primero.** Es lo que el usuario final consume.

### `MiComponente.vue` — **La implementación real**

- Contiene toda la lógica de negocio, template y estilos.
- Espera `color` como **hex string** (`#1774A4`), no como nombre semántico.
- Usa sintaxis Vue `#nombre` para slots (ej: `<template #toggle>`).
- Importa y usa sub-componentes `.vue` directamente.

> **No documentes desde este archivo.** Lo que hace internamente puede no corresponder con la API pública. Ejemplo: `AdvancedTable.vue` (interno) emite `row-click`, pero el `<cu-table>` (`.ce.vue`) **no** lo re-emite.

### `MiComponente.ts` — **Punto de entrada del build**

Siempre tiene la misma forma:

```ts
import { defineCustomElement } from "vue";
import MiComponente from "./MiComponente.ce.vue";

const ComegenMiComponente = defineCustomElement(MiComponente);

customElements.define("cu-mi-componente", ComegenMiComponente);

export { ComegenMiComponente };
```

> **Para documentación, no necesitás leer este archivo**, solo confirmar el nombre del tag. Es trivial.

## Ubicaciones especiales

No todos los componentes viven en la raíz de `src/components/`:

| Carpeta | Qué contiene | Ejemplos |
|---------|--------------|----------|
| `src/components/` (raíz) | Componentes que no son de formulario ni datos | `Alert`, `Badge`, `Button`, `DropdownMenu`, `Modal`, `Pagination` |
| `src/components/form/` | Componentes de formulario (inputs, controles) | `Autocomplete`, `Checkbox`, `Input`, `Label`, `Switch`, `Textarea` |
| `src/components/data/` | Componentes de datos (tablas, listas) | `Table` |
| `src/components/labs/` | Componentes en experimentación, **sí se distribuyen** | `Select` |
| `src/components/archived/` | Componentes retirados, **se siguen distribuyendo** (ver `doc/notes/01-build-glob.md`) | `SelectNative` |

> **Atención:** `labs/` y `archived/` **sí compilan a UMD** (ver `build-libs.ts`). No asumas que un componente "archivado" no se distribuye.

## Ejemplo: el caso especial de `DropdownMenu`

`DropdownMenu` no es un wrapper sobre un único `.vue`. Tiene una cadena de wrappers:

```
DropdownMenu.ce.vue       (Custom Element; fuente de verdad)
  └─> DropdownMenu.vue   (wrapper con props semánticas para Dropdown.vue)
        └─> Dropdown.vue (motor genérico: toggle + panel + posicionamiento)
```

El `.ce.vue` es lo que documentás. Pero cuando hay un slot como `toggle`, la doc debe mostrar la sintaxis HTML `slot="toggle"`, no la sintaxis Vue `#toggle` (porque el `.ce.vue` reenvía con HTML nativo, no con Vue).

## Patrón de eventos

El `.ce.vue` suele tener un helper para re-emitir eventos custom a través del Shadow DOM:

```ts
const instance = getCurrentInstance();

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}
```

Este helper es clave: los Custom Events creados dentro de Shadow DOM **no** burbujean al host por defecto, hay que hacerlos `composed: true` y `dispatchearlos` sobre el host (`getRootNode().host`).

> Si en el `.ce.vue` ves un `@evento` re-envuelto con `ceEmit`, ese evento **sí** está disponible en el Web Component. Si ves un `@evento` en el `.vue` interno que no se reenvía en el `.ce.vue`, ese evento **no** está disponible para el usuario final.
