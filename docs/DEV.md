# Guía de desarrollo de ComegenUI

Esta guía es para **contribuidores** al proyecto ComegenUI 2.x. Si solo querés **usar** los componentes, mirá la [guía de uso](skills/use-comegen/SKILL.md) en su lugar.

> Para una referencia más detallada, consultá la skill [`desarrollar-comegen-ui`](desarrollar-comegen-ui/SKILL.md) que está pensada para agentes.

---

## Tabla de contenidos

- [Setup inicial](#setup-inicial)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Comandos esenciales](#comandos-esenciales)
- [Crear un componente nuevo](#crear-un-componente-nuevo)
- [Usar el playground](#usar-el-playground)
- [Storybook](#storybook)
- [Sistema de temas](#sistema-de-temas)
- [Build y deploy](#build-y-deploy)
- [Recursos para contribuidores](#recursos-para-contribuidores)

---

## Setup inicial

```bash
pnpm install            # instalar dependencias
```

Requisitos: **Node.js ^20.19.0 || >=22.12.0** y **pnpm 11+**.

---

## Estructura del proyecto

```
comegenui/
├── src/
│   ├── components/              ← componentes (3 archivos cada uno)
│   ├── composables/             ← usePagination, useSearch, useTableData
│   ├── config/                  ← theme.ts (light, dark, sigacadv2)
│   ├── utils/                   ← palette.ts, getHostTheme.ts
│   ├── stories/                 ← Storybook stories
│   ├── App.vue
│   └── main.ts
├── playground/                  ← HTML estático para experimentar
├── scripts/                     ← bash scripts (build, deploy, config)
├── docs/                        ← esta documentación
├── build-libs.ts                ← pipeline de build UMD
├── package.json
└── index.html
```

### El patrón de 3 archivos

Cada componente público tiene:

- **`<Nombre>.vue`** — implementación real (recibe color en hex).
- **`<Nombre>.ce.vue`** — wrapper para Custom Element (recibe color semántico, lo resuelve).
- **`<Nombre>.ts`** — registro del Custom Element con `customElements.define()`.

> **Regla de oro:** el `.ce.vue` es la **fuente de verdad de la API pública**. Lo que documentás al usuario es lo que está expuesto en ese archivo.

---

## Comandos esenciales

```bash
pnpm dev                # Vite dev server con HMR
pnpm storybook          # Storybook en http://localhost:6006
pnpm build:lib          # Compila los UMD (lo que se distribuye)
pnpm build              # Compila la app Vite (no la lib)
pnpm type-check         # vue-tsc
pnpm vitest             # corre tests
./menu.sh               # menú interactivo (build, deploy, storybook, config)
```

Más detalles en la [skill de desarrollo](desarrollar-comegen-ui/comandos.md).

---

## Crear un componente nuevo

### 1. Decisiones previas

- **Nombre del tag:** `cu-<nombre-kebab>` (ej: `cu-tooltip`).
- **Ubicación:**
  - Form/input → `src/components/form/`
  - Tabla/lista → `src/components/data/`
  - General → `src/components/`
  - Experimental → `src/components/labs/`
  - Reemplazo de viejo → `src/components/archived/`

### 2. Crear los 3 archivos

**`<Nombre>.vue`** (interno, recibe color en hex):

```vue
<script setup lang="ts">
import { computed } from "vue";
import { getBgClasses, getFgClasses } from "../utils/palette";

const props = defineProps({
  color: { type: String, default: "#2c2c2c" },
  variant: { type: String, default: "ghost" },
  hightContrast: { type: Boolean, default: false },
});

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
</script>

<template>
  <button :class="bgClass.main">
    <slot></slot>
  </button>
</template>

<style>
@unocss-placeholder;
</style>
```

**`<Nombre>.ce.vue`** (Custom Element, recibe color semántico):

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import MiComponente from "./MiComponente.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  theme: { type: String, default: "", validator: isValidTheme },
  color: {
    type: String,
    default: "neutral",
    validator: (v) => ["primary", "neutral", "success", "warning", "danger"].includes(v),
  },
  variant: {
    type: String,
    default: "ghost",
    validator: (v) => ["solid", "outlined", "soft", "ghost", "subtle"].includes(v),
  },
  hightContrast: { type: Boolean, default: false },
});

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const innerRef = ref<InstanceType<typeof MiComponente> | null>(null);
defineExpose({ /* métodos públicos */ });
</script>

<template>
  <MiComponente
    :color="hexColor"
    :variant="props.variant"
    :hight-contrast="props.hightContrast"
  >
    <slot></slot>
  </MiComponente>
</template>

<style>
@unocss-placeholder;
</style>
```

**`<Nombre>.ts`** (registro):

```ts
import { defineCustomElement } from "vue";
import MiComponente from "./MiComponente.ce.vue";

const comegenMiComponente = defineCustomElement(MiComponente);

customElements.define("cu-mi-componente", comegenMiComponente);

export default comegenMiComponente;
```

### 3. Crear la storybook

```ts
// src/stories/MiComponente.stories.ts
import MiComponente from "../components/MiComponente.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MiComponente> = {
  title: "Components/MiComponente",
  component: MiComponente,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    variant: { control: "select", options: ["solid", "outlined", "soft", "ghost", "subtle"] },
    hightContrast: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof MiComponente>;

export const Solid: Story = {
  args: { color: "#1774A4", variant: "solid" },
  render: (args) => ({
    components: { MiComponente },
    setup: () => ({ args }),
    template: `<MiComponente v-bind="args">Click me</MiComponente>`,
  }),
};
```

### 4. Build y prueba

```bash
pnpm build:lib
```

Después abrí el playground (ver siguiente sección) y verificá que el nuevo tag funcione.

### 5. Documentar

Usá la skill [`documentar-comegen-ui`](documentar-comegen-ui/SKILL.md) para crear el archivo `cu-<nombre>.md` en `docs/skills/use-comegen/componentes/`.

---

## Usar el playground

El playground es un HTML estático en `playground/` que carga los UMD ya construidos.

**Archivos:**

- `playground/index.html` — base, carga UMD y la zona editable. **NO modificar la estructura.**
- `playground/playground.js` — base: theme toggle, `logEvent()`. **NO modificar.**
- `playground/style.css` — estilos. **NO modificar.**
- `playground/example.js` — **editable**, acá va la lógica del experimento.
- `playground/examples/*.js` — presets editables (ej: `table.js`).

**Cómo se usa:**

1. Asegurate de tener un servidor estático sirviendo la raíz del proyecto.
2. Navegá a `playground/index.html`.
3. Modificá `example.js` o los presets para experimentar.
4. Refrescá (F5) para ver cambios (no hay hot-reload).

**Función `logEvent(msg)`** (global, definida en `playground.js`):

```js
const tabla = document.getElementById('tabla');
tabla.addEventListener('edit-save', (e) => {
  logEvent(`Editado: ${e.detail.column.key} = "${e.detail.value}"`);
});
```

Más detalles en [desarrollar-comegen-ui/playground.md](desarrollar-comegen-ui/playground.md).

---

## Storybook

```bash
pnpm storybook
```

Abrí `http://localhost:6006`. Las stories están en `src/stories/`. Para agregar una nueva, seguí el template de la sección "Crear un componente nuevo".

**Convenciones de título:**

- `Components/<Nombre>` para componentes en `src/components/` raíz.
- `Form/<Nombre>` para `src/components/form/`.
- `Data/<Nombre>` para `src/components/data/`.

Más detalles en [desarrollar-comegen-ui/storybook.md](desarrollar-comegen-ui/storybook.md).

---

## Sistema de temas

ComegenUI tiene 3 temas integrados: `light`, `dark`, `sigacadv2`. Todos los componentes con color lo respetan automáticamente.

**Prioridad de resolución:**

1. `theme` prop en el componente.
2. `data-theme` en `<html>` o cualquier ancestro.
3. `prefers-color-scheme` del sistema.
4. Default: `light`.

**Cambiar el tema globalmente:**

```html
<html data-theme="dark">
  <cu-button color="primary">Click</cu-button>
</html>
```

**Cambiar el tema en un componente puntual:**

```html
<cu-button theme="sigacadv2" color="primary">Click</cu-button>
```

**Agregar un tema nuevo:**

1. Editar `src/config/theme.ts` y agregar la entrada en `themes`:

   ```ts
   export const themes = {
     light: { /* ... */ },
     dark: { /* ... */ },
     miTema: {
       primary: '#ff6600',
       neutral: '#333333',
       success: '#00cc66',
       warning: '#ffcc00',
       danger:  '#ff3333',
       surface: '#fafafa',
     },
   };
   ```

2. Rebuild: `pnpm build:lib`.

3. Usar: `<html data-theme="miTema">` o `<cu-button theme="miTema">`.

**Color hex literal:** si necesitás un color ad-hoc, podés pasar un hex en `color` y se respeta tal cual:

```html
<cu-button color="#ff0000">Rojo literal</cu-button>
```

Más detalles en [desarrollar-comegen-ui/temas.md](desarrollar-comegen-ui/temas.md).

---

## Build y deploy

### Compilar los UMD (lo que se distribuye)

```bash
pnpm build:lib
```

Salida en `dist/`:

```
dist/
├── CuAlert.umd.js
├── CuButton.umd.js
├── ...
├── README-BUILD.md
└── comegenui.zip
```

### Deploy a un destino

```bash
./menu.sh
# → Library/Build
# → Library/Move and Unzip
```

O directo:

```bash
pnpm build:lib
bash scripts/move_unzip.sh
```

> **Importante:** los scripts usan rutas absolutas hardcoded en `scripts/env.sh`. Si moviste el proyecto, editá las variables con `bash scripts/config.sh` antes de deployar.

### Cambiar el destino del deploy

```bash
bash scripts/config.sh
# → Configuración
# → Archivos/DESTINATION_PATH
```

Más detalles en [desarrollar-comegen-ui/build.md](desarrollar-comegen-ui/build.md) y [scripts.md](desarrollar-comegen-ui/scripts.md).

---

## Recursos para contribuidores

### Documentación interna

- [Skill `desarrollar-comegen-ui`](desarrollar-comegen-ui/SKILL.md) — guía detallada para agentes y contribuidores.
- [Skill `documentar-comegen-ui`](documentar-comegen-ui/SKILL.md) — cómo documentar un componente.
- [Notas de auditoría](notes/) — problemas pendientes y decisiones técnicas.

### Documentación de uso

- [Guía de uso](skills/use-comegen/SKILL.md) — para usuarios finales de los componentes.
- [Documentación por componente](skills/use-comegen/componentes/) — referencia de la API.

### Skills del sistema

- `comegen-ui` — uso de los componentes.
- `desarrollar-comegen-ui` — esta guía (para agentes).
- `documentar-comegen-ui` — cómo escribir/actualizar docs.
- `customize-opencode` — para editar opencode (no relacionado).

---

## Convenciones rápidas

| Concepto | Convención |
|----------|------------|
| Tag de Custom Element | `cu-<nombre-kebab>` |
| Archivo `.vue` | `PascalCase.vue` |
| Archivo `.ts` | `PascalCase.ts` |
| Composables | `use<Nombre>.ts` (camelCase) |
| Stories | `PascalCase.stories.ts` |
| Tests | `PascalCase.test.ts` |
| Prop en HTML | `kebab-case` (ej: `items-per-page`) |
| Prop en JS | `camelCase` (ej: `itemsPerPage`) |
| CSS | UnoCSS utilities + `@unocss-placeholder;` |
| Comentarios | Español, sobre el "por qué" |

Más detalles en [desarrollar-comegen-ui/convenciones-desarrollo.md](desarrollar-comegen-ui/convenciones-desarrollo.md).
