---
name: comegen-ui-dev
description: 'Skill de desarrollo de componentes para comegen-ui (Vue 3 + Custom Elements + UnoCSS). Usar cuando el usuario pida crear, modificar, eliminar o buildear un componente de comegen-ui. Frases: "crear componente", "nuevo componente", "agregar componente", "modificar componente", "buildear comegen", "build lib", "agregar al storybook", "testear componente". NO la uses para usar componentes en otro proyecto (esa es la skill de uso que viaja con el zip).'
---

# `comegen-ui-dev`

Desarrollo de componentes **comegen-ui**: Vue 3 + Custom Elements + UnoCSS, buildeados como UMD via `build-lib.ts`.

> **Regla de oro:** todo componente público sigue el **patrón de 3 archivos** (`.vue` → `.ce.vue` → `.ts`). No lo rompas.

## Cuándo se activa

- "Crear/agregar/eliminar un componente".
- "Modificar/cambiar un componente existente".
- "Buildear la lib" (`pnpm build:lib`).
- "Testear un componente" (vitest).
- "Storybook" (`pnpm storybook`).

## Cuándo NO se activa

- Usar componentes comegen-ui en otro proyecto (esa es la skill de uso).
- Modificar el build system (`build-lib.ts`, `vite.config.ts`).
- Modificar el sistema de tokens (`cu-tokens/`).
- Storybook: **obsoleto**. No se usa más. Usar playground para probar componentes.

---

## Crear un componente nuevo

**Antes de crear**, verificar que no existe:

```bash
ls src/components/*/MiComponente.vue 2>/dev/null && echo "YA EXISTE" || echo "NO EXISTE"
ls src/components/customElements/*/MiComponente.ce.vue 2>/dev/null && echo "YA EXISTE" || echo "NO EXISTE"
```

Si ya existe, **no crear** — modificar el existente.

**Patrón de 3 archivos** (componente público con Custom Element):

### 1. Componente real — `src/components/{category}/MiComponente.vue`

```vue
<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: "neutral" },
  // ... más props
})

const colorStyles = computed(() => ({
  '--mi-bg': `var(--cu-color-${props.color})`,
  '--mi-text': `var(--cu-color-${props.color}-text)`,
}))
</script>

<template>
  <div :class="['cu-mi-componente']" :style="colorStyles">
    <slot />
  </div>
</template>
```

**Reglas:**
- `defineExpose` siempre con **arrow functions** (`isOpen: () => ...`), nunca getters.
- Colores via **CSS custom properties** (`var(--cu-color-{name}-*)`), NO `getHostTheme()`.
- Slots con sintaxis Vue `#nombre`.

### 2. Wrapper CE — `src/components/customElements/{category}/MiComponente.ce.vue`

```vue
<script setup lang="ts">
import MiComponente from "../../{category}/MiComponente.vue"
import { initTokens } from "@/plugins/cu-tokens/css"

initTokens()

const props = defineProps({
  color: { type: String, default: "neutral" },
  // ... mismos props que el .vue
})

const ref = ref(null)

// ceEmit para eventos
function ceEmit(event: string, payload: unknown) {
  const el = ref.value?.$el
  const host = el?.getRootNode()?.host || el
  if (host) {
    host.dispatchEvent(new CustomEvent(event, { detail: payload, bubbles: true, composed: true }))
  }
}
</script>

<template>
  <MiComponente ref="ref" :color="props.color">
    <slot></slot>
  </MiComponente>
</template>
```

**Reglas:**
- **NO** importar sub-componentes `.vue` (eso hace el `.vue`).
- Pasar props **explícitamente** (nunca `v-bind="{...props}"`).
- `initTokens()` va aquí o en el `.ts`, una vez por componente.

### 3. Entry point — `src/lib/{category}/mi-componente.ts`

```ts
import { defineCustomElement } from 'vue'
import MiComponente from '@/components/customElements/{category}/MiComponente.ce.vue'

const CuMiComponente = defineCustomElement(MiComponente)
customElements.define('cu-mi-componente', CuMiComponente)

export default CuMiComponente
```

### 4. Validar

```bash
pnpm build:lib   # debe buildear sin errores
pnpm type-check  # vue-tsc debe pasar
```

### 5. Commit

```bash
git add -A
git commit -m "feat: agregar componente MiComponente"
```

---

## Modificar un componente existente

1. Identificar el componente: `src/components/{category}/MiComponente.vue`.
2. Si el cambio afecta la interfaz (props/emits), actualizar también el `.ce.vue`.
3. Validar: `pnpm type-check && pnpm build:lib`.
4. Commit: `git add -A && git commit -m "fix: descripción del cambio"`.

---

## Build

```bash
pnpm build:lib    # buildea UMD + genera zip en dist/
pnpm type-check   # verificación de tipos
```

Salida: `dist/comegenui-v{version}.zip` con los CSS, JS y la skill de uso.

---

## Tests

```bash
pnpm test                  # todos los tests
pnpm test ComponentName    # un componente
```

Los tests van junto al componente: `src/components/{category}/MiComponente.test.ts`.

---

## Probar componente

Siempre probar en **2 contextos**: Vue (desarrollo) y CE buildeado (uso real fuera de Vue).

### 1. Vue playground (desarrollo rápido)

```bash
pnpm dev   # vite dev server
```

Crear ejemplo en `src/pages/playground/components/MiComponente.vue` para iterar con hot reload.

### 2. CE buildeado (uso real fuera de Vue)

Después de `pnpm build:lib`:

```html
<!DOCTYPE html>
<html data-theme="dark">
<head>
  <link rel="stylesheet" href="dist/css/themes.css">
</head>
<body>
  <cu-button color="primary" variant="soft">Click me</button>

  <script src="dist/CuButton.umd.js"></script>
  <script>
    const btn = document.querySelector('cu-button')
    btn.addEventListener('click', () => console.log('clicked'))
  </script>
</body>
</html>
```

**Reglas:**
- El `<script>` del componente **siempre** va en `<body>` o con `defer` (nunca en `<head>` sin defer).
- `themes.css` incluye todos los temas; `data-theme` en `<html>` controla cuál se aplica.
- Los Custom Elements se usan como tags nativos: `<cu-button>`, `<cu-alert>`, etc.
- Props se setean como atributos: `color="primary"`, `variant="soft"`.
- Eventos: `addEventListener('cu-event', ...)` o el nombre que defina el componente.

**Para servir localmente:**

```bash
cd dist && python3 -m http.server 3000
```

---

## Referencia de arquitectura

Para detalles del sistema de color, tokens, temas y reglas completas → [`AGENTS.md`](../../AGENTS.md).
