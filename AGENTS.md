# AGENTS.md — Arquitectura de Componentes ComegenUI

> **Para desarrollar componentes**, seguí la estructura de 3 archivos de abajo (componente `.vue` + wrapper `.ce.vue` + entry `lib/`), documentá con la skill `comegen-ui-docs` y validá con el gate local `./scripts/preflight.sh`. Consumir la lib en otro proyecto: skill de uso `comegen-ui`.

## Estructura de directorios

```
src/
├── components/
│   ├── {category}/MiComponente.vue        # Lógica real del componente
│   ├── customElements/{category}/MiComponente.ce.vue  # Wrapper CE (thin)
│   └── ...otrascarpetas (icons, theme, lab, archived, legacy)
├── lib/
│   └── {category}/mi-componente.ts        # Entry point: defineCustomElement + registro
├── plugins/
│   ├── cu-tokens/                         # Sistema de tokens CSS
│   ├── khadgar/                           # Fábrica: `.vue` → contrato JSON (extract/, cli/, config.ts, api.ts)
│   └── khadgar-docs/                      # Consumidor: JSON → fichas `.md` + config/tema de VitePress
├── layouts/                               # AppTopbar + AppLayout (header propio del sitio)
├── pages/                                 # Home.vue + playground/ThemeBuilder.vue (páginas del sitio)
├── composables/                           # Composables reutilizables
└── utils/                                 # Utilidades (getHostTheme, palette, fileIcons)

docs/
├── site/                                  # Sitio VitePress (consume khadgar.gen.json + las fichas)
└── skills/use-comegen/                    # Skill de uso (SKILL.md + fichas `cu-*.md` generadas)
```

Config de la fábrica: `khadgar.config.json` (raíz): `libDir`, `docsDir`, `extract`, `docs` + la lista `components` (cada uno con `name`, `file` —path del `.vue`—, `group` y `vanilla`).

Donde `{category}` es uno de: `form/`, `information/`, `overlay/`, `navigation/`, `data/`, `buttons/`, o raíz.

### Patrón de 3 archivos (componentes públicos)

```
src/components/{category}/MiComponente.vue        → Componente real
src/components/customElements/{category}/MiComponente.ce.vue  → Wrapper CE
src/lib/{category}/mi-componente.ts               → Entry point para build
```

### Componentes sin wrapper CE (internos o directos)

Algunos componentes van directo de `.vue` a `.ts` sin `.ce.vue`:

- `Button.vue` → `lib/buttons/button.ts` (usa CSS tokens directamente)
- `Badge.vue` → `lib/information/badge.ts` (usa CSS tokens directamente)

### Componentes internos (sin CE público)

- `Dropdown.vue` — Motor genérico (toggle + panel + posicionamiento)
- `AdvancedTable.vue`, `EditableTableCell.vue` — Tabla interna
- `FileList.vue` — Lista de archivos
- `icons/*.vue` — Iconos
- `theme/ThemeManagerModal.vue` — Modal de configuración
- `lab/` — Componentes experimentales

### Legacy

`src/components/legacy/` contiene versiones anteriores que usan `getBgClasses`/`getBgClasses` de `palette.ts`. No usar como referencia para componentes nuevos.

### Notas de componentes específicos

#### Table — Footer programático

`<cu-table>` expone una prop `footer` (además del slot) que acepta `FooterRow[]` para definir filas de pie sin HTML:

```ts
interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}

interface FooterRow {
  cells: FooterCell[];
}
```

```js
table.footer = [
  { cells: [
    { value: 'Total', colspan: 1 },
    { value: '$745.50', align: 'right' },
  ]},
];
```

- Prioridad: slot `footer` > prop `footer`
- El `<tfoot>` solo se renderiza si hay contenido (slot o prop)

#### DatePicker — Calendar condicional

El `<cu-date-picker>` renderiza el calendario interno solo cuando el panel está abierto (`Dropdown.vue` usa `v-if="isOpen"`). Esto significa:

- Asignar `picker.events = [...]` con el panel cerrado: los puntos aparecen la próxima vez que se abre (mount fresco)
- Cambiar `events` con el panel abierto: el Calendar recibe el prop actualizado y re-renderiza
- Para forzar re-render con el panel abierto: `picker.close(); picker.open()`

El picker está **unificado**: `mode="single"` (fecha, `modelValue`) o `mode="range"` (`startDate`/`endDate`). El rango lo administra `Calendar` con `mode="single" | "range"` y la FSM compartida `src/composables/useDateRange.ts` (en rango el valor son `rangeStart`/`rangeEnd`; **en `single` se ignoran**, la única selección es el click simple); `DualCalendar.vue` **solo range**: compone 2 `Calendar` en modo range con navegación independiente y comparte el mismo rango entre ambos (no tiene FSM propia). `DatePicker` elige el **tipo de calendario** (`dual=false` → `Calendar` single/range; `dual=true` → `DualCalendar`, forzando range aunque `mode` sea single), administra los valores (espeja y re-emite) y comparte el trigger en `DatePickerShell.vue`; en `single` ignora `startDate`/`endDate` (`setRange` no-op). `DualCalendar` es interno (sin CE, sin entry en `lib/`, sin ficha de skill) pero **sí aparece en el playground** vía una entrada en `khadgar.config.json` sin `customElement` ni `skill`. `<cu-date-picker-range>` (`DatePickerRange.ce.vue` + `lib/form/date-picker-range.ts`) queda como **shim deprecado** de `mode="range"`.

---

## Responsabilidades

### `MiComponente.vue` — El componente real

- Define la interfaz (props, emits, exposes)
- Importa y usa sub-componentes `.vue` directamente
- Contiene lógica de negocio, template, y estilos
- **Acepta `color` como nombre semántico** (`'primary' | 'neutral' | 'success' | ...`)
- Usa **CSS custom properties** para resolver colores: `var(--cu-color-{name}-*)`
- **Usa sintaxis Vue `#nombre` para slots** (ej: `<template #toggle>`)
- `defineExpose` siempre con **arrow functions** (`isOpen: () => ...`), nunca getters

```ts
// Ejemplo de resolución de color en .vue
const colorStyles = computed(() => ({
  '--alert-bg': `var(--cu-color-${props.color})`,
  '--alert-text': `var(--cu-color-${props.color}-text)`,
  '--alert-soft': `var(--cu-color-${props.color}-soft)`,
  // ... más variantes
}))
```

### `MiComponente.ce.vue` — Wrapper para Custom Element

- Importa `MiComponente.vue`
- Define props con nombres semánticos (`"primary"`, `"neutral"`)
- **Pasa props explícitamente** al `.vue` (NO usar `v-bind="{...props}"`)
- Puede importar `initTokens()` si el `.ts` no lo hace
- Forwardea slots y eventos
- **Slots:** usa sintaxis Vue `<template #nombre>` o HTML `slot="nombre"` (ver nota abajo)
- Expone métodos via `defineExpose` delegando al ref interno
-桥接 eventos Vue a CustomEvents via `ceEmit()`

**Nota sobre slots en `.ce.vue`:**
La mayoría usa `<template #nombre>` (sintaxis Vue). `DropdownMenu.ce.vue` usa `slot="nombre"` (HTML nativo) en un `<div>` wrapper. Ambos patrones funcionan; preferir `<template #nombre>` para consistencia.

```ts
// ceEmit:桥接 eventos Vue → CustomEvents nativos
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

### `mi-componente.ts` — Entry point para el build

- Importa `defineCustomElement` de Vue
- Importa el `.ce.vue` (o `.vue` si no hay wrapper CE)
- Llama `initTokens()` si el `.ce.vue` no lo hace
- Registra el Custom Element
- Exporta el componente

```ts
import { defineCustomElement } from 'vue'
import Component from '@/components/customElements/{category}/Component.ce.vue'
import { initTokens } from '@/plugins/cu-tokens/css'

initTokens()

const CuComponent = defineCustomElement(Component)
customElements.define('cu-component', CuComponent)

export default CuComponent
```

> **`initTokens()`** inyecta un `<style>` con los CSS custom properties del tema activo. Debe llamarse una vez por componente UMD, ya sea en el `.ce.vue` o en el `.ts`.

---

## Sistema de Color y Temas

### Flujo de color

```
Usuario pasa color="primary" (string semántico)
        ↓
.ce.vue recibe y pasa al .vue
        ↓
.vue resuelve via CSS: var(--cu-color-primary)
        ↓
CSS tokens (inyectados por initTokens o themes.css) resuelven el hex según el tema activo
```

**Ya NO se usa `getHostTheme()` + `getColorMap()` para convertir a hex** (excepto en `Label.ce.vue` que es transicional). El patrón moderno usa CSS custom properties directamente.

### Sistema de temas

Tres temas: `light` (default), `dark`, `sigacadv2`.

```html
<html data-theme="dark">              <!-- Global -->
<cu-button theme="sigacadv2">         <!-- Por componente -->
```

Prioridad: `theme` prop → `data-theme` en `<html>` → `prefers-color-scheme` (OS).

### Tokens CSS

El sistema de tokens (`cu-tokens`) genera para cada color:
- `--cu-color-{name}` (base)
- `--cu-color-{name}-text` (texto sobre el color)
- `--cu-color-{name}-hover`, `-active` (estados)
- `--cu-color-{name}-soft`, `-soft-hover`, `-soft-active` (variante soft)
- `--cu-color-{name}-subtle`, `-subtle-hover`, `-subtle-active`, `-subtle-border` (variante subtle)
- `--cu-color-{name}-ghost-hover`, `-ghost-active` (variante ghost)
- `--cu-color-{name}-code` (acento para superficies de código: mezcla del color hacia surface — legible sobre `--cu-code-bg` en todos los temas)

Tokens del esquema de código (invierten con el tema, pensados para el contexto "inverso" de los code blocks):
- `--cu-code-bg` (fondo de código, = neutral)
- `--cu-code-text` (texto sobre código, = surface)
- `--cu-code-faded` (atenuados: comentarios, meta, gutter = surface al 55%)

Tokens compartidos: tipografía, spacing, border-radius, shadows, borders.

---

## Build

`build-lib.ts` busca `src/lib/**/*.ts` (excluyendo `index.ts` y `tokens.ts`) y construye cada uno como UMD:

- `vue({ features: { customElement: true } })`
- `UnoCSS({ mode: "shadow-dom" })`
- Genera `dist/css/themes.css` + `dist/css/{theme}.css`
- Crea zip versionado: `comegenui-v{version}.zip`
- **El zip SIEMPRE incluye la skill de uso** `use-comegen/` (`SKILL.md` + `componentes/`) al lado de los archivos de la lib — viaja con la lib para que los agentes del proyecto consumidor tengan la doc. Solo la de uso; no la de desarrollo ni la de documentar. Incluye también `update.sh` (Linux/macOS: `./update.sh`), `update.bat` (Windows: `update.bat` — doble clic o desde cmd, evade ExecutionPolicy) y `update.ps1` (alternativa PowerShell: `.\update.ps1`) — actualizadores del proyecto huésped que además instalan la skill de uso en `.agents/skills/` del proyecto. Los tres aceptan `--only`/`-Only CuX[,CuY]` (alias `-o`) para actualizar solo algunos componentes: sin esa opción reemplazan toda la carpeta de forma atómica; con ella copian únicamente los UMD elegidos + su doc (`use-comegen/componentes/cu-*.md`), sin tocar `css/themes.css` ni el resto

### Tests y preflight

- Tests unitarios con Vitest (`pnpm test`), junto al componente (`X.test.ts`).
- Gate local antes de un MR: `./scripts/preflight.sh` (type-check contra baseline + tests + drift de las fichas).

---

## Reglas

1. Los `.ce.vue` **NO importan sub-componentes `.vue`** — esa responsabilidad es del `.vue`
2. Los `.ce.vue` pasan props **explícitamente** (nunca `v-bind="{...props}"`)
3. Los `.vue` resuelven colores via **CSS custom properties** (`var(--cu-color-{name}-*)`)
4. `initTokens()` debe llamarse en el `.ce.vue` o en el `.ts` (al menos una vez por componente UMD)
5. **Slots:** los `.vue` usan `#nombre` (sintaxis Vue); los `.ce.vue` usan `<template #nombre>` (consistente)
6. **`defineExpose` en `.ce.vue`:** siempre **arrow functions** (`isOpen: () => ...`), **nunca** getters
7. Los `.ce.vue`桥edan eventos Vue a CustomEvents via **`ceEmit()`**
8. Los componentes nuevos van en `src/components/{category}/` y `src/components/customElements/{category}/`
9. Los entry points van en `src/lib/{category}/mi-componente.ts`
10. `hightContrast` es el nombre correcto del prop (typo persistente en todo el codebase)
11. **Creá ramas solo cuando corresponde, no a cada rato.** Creá una rama nueva **solo cuando la rama base es `main`** y la tarea es una feature, fix, docs o tests con entidad propia (ej: `feat/x`, `fix/x`, `docs/x`, `test/x`). **Si ya estás trabajando en una rama (base ≠ `main`), NO crees otra rama** salvo que el usuario lo pida explícitamente — trabajá sobre la rama actual. `main` solo recibe merges.
12. **Validadores de props:** usá los compartidos de `src/utils/validators.ts` (`validator: isColor`, `isSize`, …) en vez de repetir el array inline. Mantené igual la **unión inline en `PropType<...>`** (khadgar la extrae para la doc y el playground; un alias con nombre la rompe). Los formatos de mes/año viven en `src/utils/date.ts` (`isMonthFormat`/`isYearFormat`).

---

## Ejemplo completo: Alert

### `src/components/information/Alert.vue`

```vue
<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: "neutral" },
  variant: { type: String, default: "soft" },
  // ...
})

const colorStyles = computed(() => ({
  '--alert-bg': `var(--cu-color-${props.color})`,
  '--alert-text': `var(--cu-color-${props.color}-text)`,
  // ...
}))
</script>

<template>
  <div :class="['cu-alert', `cu-alert--${props.variant}`]" :style="colorStyles">
    <slot name="icon" />
    <slot />
  </div>
</template>
```

### `src/components/customElements/information/Alert.ce.vue`

```vue
<script setup lang="ts">
import Alert from "../../information/Alert.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String, default: "neutral" },
  variant: { type: String, default: "soft" },
  // ...
});

const alertRef = ref(null);
// ceEmit para桥edar eventos...
</script>

<template>
  <Alert ref="alertRef" :color="props.color" :variant="props.variant" ...>
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </Alert>
</template>
```

### `src/lib/information/alert.ts`

```ts
import { defineCustomElement } from 'vue'
import Alert from '@/components/customElements/information/Alert.ce.vue'

const CuAlert = defineCustomElement(Alert)
customElements.define('cu-alert', CuAlert)

export default CuAlert
```
