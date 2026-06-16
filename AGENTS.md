# AGENTS.md — Arquitectura de Componentes ComegenUI

## Patrón de archivos

Cada componente público sigue esta estructura de 3 archivos:

```
src/components/
├── MiComponente.ce.vue   # Thin wrapper para Custom Element (UMD)
├── MiComponente.vue      # Lógica real del componente
└── MiComponente.ts       # defineCustomElement + registro
```

### Responsabilidades

**`MiComponente.vue`** — El componente real
- Define la interfaz del componente (props, emits, exposes)
- Importa y usa sub-componentes `.vue` directamente (`import Button from "./Button.vue"`)
- Contiene toda la lógica de negocio, template, y estilos
- No sabe nada de Custom Elements ni temas
- Espera `color` como hex string (`#1774A4`)

**`MiComponente.ce.vue`** — Wrapper para Custom Element
- Importa `MiComponente.vue`
- Define props con nombres semánticos (`"primary"`, `"neutral"`)
- Resuelve el tema activo via `getHostTheme()` y convierte colores a hex con `getColorMap()`
- Pasa props explícitamente al `.vue` (NO usar `v-bind="{...props}"`)
- Forwardea slots y eventos nativos de Custom Elements
- Expone métodos via `defineExpose` delegando al ref interno

**`MiComponente.ts`** — Punto de entrada para el build
- `defineCustomElement(MiComponente.ce.vue)`
- `customElements.define("cu-mi-componente", ...)`

### Ejemplo: Dropdown

```
Dropdown.ts          → defineCustomElement, register "cu-dropdown"
Dropdown.ce.vue      → import Dropdown from "./Dropdown.vue"
                        props: theme, color (semántico), variant, label, items
                        computed: hexColor (getColorMap + getHostTheme)
                        template: <Dropdown :color="hexColor" :items="items" ...>
Dropdown.vue          → import Button from "./Button.vue"
                        props: color (hex), variant, items: DropdownItem[]
                        toda la lógica: open/close/toggle, onClickOutside, items rendering
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
