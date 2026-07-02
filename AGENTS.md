# AGENTS.md — Arquitectura de Componentes ComegenUI

## Patrón de archivos

Cada componente público sigue esta estructura de 3 archivos:

```
src/components/
├── MiComponente.ce.vue   # Thin wrapper para Custom Element (UMD)
├── MiComponente.vue      # Lógica real del componente
└── MiComponente.ts       # defineCustomElement + registro
```

Un componente puede ser solo `.vue` si es interno (sin CE público), como `Dropdown.vue` (motor genérico).

### Responsabilidades

**`MiComponente.vue`** — El componente real
- Define la interfaz del componente (props, emits, exposes)
- Importa y usa sub-componentes `.vue` directamente (`import Button from "./Button.vue"`)
- Contiene toda la lógica de negocio, template, y estilos
- No sabe nada de Custom Elements ni temas
- Espera `color` como hex string (`#1774A4`)
- **Usa sintaxis Vue `#nombre` para slots** (ej: `<template #toggle>`)

**`MiComponente.ce.vue`** — Wrapper para Custom Element
- Importa `MiComponente.vue`
- Define props con nombres semánticos (`"primary"`, `"neutral"`)
- Resuelve el tema activo via `getHostTheme()` y convierte colores a hex con `getColorMap()`
- Pasa props explícitamente al `.vue` (NO usar `v-bind="{...props}"`)
- Forwardea slots y eventos nativos de Custom Elements
- **Usa `slot="nombre"` (HTML nativo) en vez de `#nombre` (Vue)**, porque los CE wrappers se renderizan en shadow DOM y deben usar la sintaxis de Custom Elements para proyectar slots
- Expone métodos via `defineExpose` delegando al ref interno

**`MiComponente.ts`** — Punto de entrada para el build
- `defineCustomElement(MiComponente.ce.vue)`
- `customElements.define("cu-mi-componente", ...)`

### Ejemplo: DropdownMenu

```
Dropdown.vue           → Motor genérico (toggle + panel + posicionamiento + click-outside)
                          Props: color (hex), variant, label, placement, offset, menuBg
                          Slots: #toggle (con slot props: toggle, isOpen), #default (panel)
                          Sin items, sin iconos, sin divisores.
                          NO tiene .ts ni .ce — es Vue interno.

DropdownMenu.vue       → Menú con items (usa Dropdown.vue)
                          Props: mismos que Dropdown + items (DropdownItem[])
                          Slots: forwardea #toggle (con slot props), #default (fallback)
                          NO tiene .ts ni .ce.

DropdownMenu.ce.vue    → Wrapper CE del menú
                          Importa DropdownMenu.vue
                          Props: theme, color (semántico), variant, label, items, etc.
                          Template: <DropdownMenu :color="hexColor" :items="resolvedItems" ...>
                          Slot forwarding con slot="nombre" (HTML), no #nombre (Vue)

DropdownMenu.ts        → defineCustomElement("cu-dropdown-menu", DropdownMenu.ce.vue)
```

### Build

`build-libs.ts` busca `src/components/**/*.ts` y construye cada uno como UMD con Vite:
- `vue({ features: { customElement: true } })`
- `UnoCSS({ mode: "shadow-dom" })`

### Reglas

1. Los `.ce.vue` NO importan sub-componentes `.vue` — esa responsabilidad es del `.vue`
2. Los `.ce.vue` solo resuelven tema/color y delegan
3. Los `.vue` aceptan colores en hex, los `.ce.vue` convierten de nombre semántico a hex
4. Los `.ts` son siempre 3 líneas: import, define, export
5. No usar `v-bind="{...props}"` en `.ce.vue` — pasar props explícitamente (como hace Table.ce.vue)
6. **Slots:** los `.vue` usan `#nombre` (sintaxis Vue), los `.ce.vue` usan `slot="nombre"` (HTML nativo)
7. **`defineExpose` en `.ce.vue`:** siempre usar arrow functions (`isOpen: () => ...`), **nunca** getters (`get isOpen() { ... }`). Los getters no se serializan correctamente al exponer el CE. Ver commit `a4e5d70` en Autocomplete.ce.vue como referencia.
