---
name: comegen-ui-dev
description: 'Skill de desarrollo de componentes para comegen-ui (Vue 3 + Custom Elements + UnoCSS). Usar cuando el usuario pida crear, modificar, eliminar o buildear un componente de comegen-ui, o trabajar en el playground. Frases: "crear componente", "nuevo componente", "modificar componente", "buildear comegen", "build lib", "testear componente", "playground". NO la uses para usar componentes en otro proyecto (esa es la skill de uso que viaja con el zip).'
---

# `comegen-ui-dev`

Desarrollo de componentes **comegen-ui** (Vue 3 + Custom Elements + UnoCSS, UMD via `build-lib.ts`) y de su playground.

> **Regla de oro:** todo componente público sigue el **patrón de 3 archivos** (`.vue` → `.ce.vue` → `.ts`) y resuelve colores via **CSS custom properties** (`var(--cu-color-{name}-*)`), nunca `getHostTheme()`.

## Cuándo se activa

- "Crear/agregar componente" → [Crear](#crear-un-componente-nuevo).
- "Modificar componente" → [Modificar](#modificar-un-componente-existente).
- "Buildear la lib" → [Build y validación](#build-y-validación).
- "Testear componente" → [Build y validación](#build-y-validación).
- "Playground / probar componente" → [Playground](#playground--patrón-de-página).

## Cuándo NO se activa

- Usar comegen-ui en **otro** proyecto (esa es la skill de uso que viaja con el zip).
- Modificar el build system (`build-lib.ts`, `vite.config.ts`) o los tokens (`cu-tokens/`).
- Storybook: **obsoleto, eliminado**. Probar en el playground.

---

## Crear un componente nuevo

Verificar que no existe:

```bash
ls src/components/{category}/MiComponente.vue src/components/customElements/{category}/MiComponente.ce.vue 2>/dev/null && echo "YA EXISTE" || echo "NO EXISTE"
```

**1. Componente real** — `src/components/{category}/MiComponente.vue`:

```vue
<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: "neutral" },
})
const colorStyles = computed(() => ({
  '--mi-bg': `var(--cu-color-${props.color})`,
  '--mi-text': `var(--cu-color-${props.color}-text)`,
}))
</script>

<template>
  <div class="cu-mi-componente" :style="colorStyles">
    <slot />
  </div>
</template>
```

**2. Wrapper CE** — `src/components/customElements/{category}/MiComponente.ce.vue`:

```vue
<script setup lang="ts">
import MiComponente from "../../{category}/MiComponente.vue"
import { initTokens } from "@/plugins/cu-tokens/css"

initTokens()

const props = defineProps({ color: { type: String, default: "neutral" } })
const ref = ref(null)

function ceEmit(event: string, payload: unknown) {
  const el = ref.value?.$el
  const host = el?.getRootNode()?.host || el
  if (host) host.dispatchEvent(new CustomEvent(event, { detail: payload, bubbles: true, composed: true }))
}
</script>

<template>
  <MiComponente ref="ref" :color="props.color">
    <slot></slot>
  </MiComponente>
</template>
```

Reglas del `.ce.vue`: **NO** importa sub-componentes `.vue`; pasa props **explícitamente** (nunca `v-bind="{...props}"`); `initTokens()` una vez por componente (acá o en el `.ts`).

**3. Entry point** — `src/lib/{category}/mi-componente.ts`:

```ts
import { defineCustomElement } from 'vue'
import MiComponente from '@/components/customElements/{category}/MiComponente.ce.vue'

const CuMiComponente = defineCustomElement(MiComponente)
customElements.define('cu-mi-componente', CuMiComponente)

export default CuMiComponente
```

**4. Validar y commit:**

```bash
pnpm run build-only && pnpm exec vitest run && pnpm run build:lib
git add -A && git commit -m "feat: agregar componente MiComponente"
```

Reglas transversales: `defineExpose` **siempre arrow functions** (`isOpen: () => ...`); slots con sintaxis Vue `#nombre`.

---

## Modificar un componente existente

1. Identificar: `src/components/{category}/MiComponente.vue`.
2. Si cambia la interfaz (props/emits), actualizar también el `.ce.vue`.
3. Validar: `pnpm run build-only && pnpm exec vitest run` (+ `pnpm run build:lib` si es público).
4. Commit: `git add -A && git commit -m "fix: descripción del cambio"`.

---

## Build y validación

```bash
pnpm run build-only     # compila la app (validación principal)
pnpm exec vitest run    # tests; un solo componente: pnpm exec vitest run src/components/...
pnpm run build:lib      # UMD + zip en dist/comegenui-v{version}.zip (si tocó la lib)
```

> `pnpm type-check` **NO es gate usable**: tiene ~400 errores pre-existentes en `legacy/`. Validar con `build-only` + `vitest`.

Los tests viven junto al componente: `src/components/{category}/MiComponente.test.ts` (patrón: `mount` de `@vue/test-utils`). Con fake timers usar `vi.advanceTimersByTimeAsync(ms)` — `runAllTimersAsync` ejecuta los timeouts internos del componente.

---

## Playground — patrón de página

Páginas en `src/pages/playground/components/`. Patrón **estricto**: solo demos en vivo, sin snippets sueltos ni párrafos explicativos. Iterar con `pnpm dev` (hot reload).

```vue
<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'API', id: 'api', children: [
    { label: 'Props', id: 'api-props' },
    { label: 'Slots', id: 'api-slots' },
    { label: 'Events', id: 'api-events' },
    { label: 'Exposes', id: 'api-exposes' },
  ]},
];
</script>

<template>
  <PlaygroundLayout title="MiComponente" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="vueVariants" :vanilla-code="vanillaVariants">
          <div class="playground-row"><!-- demos en vivo --></div>
        </SectionDemo>
      </section>
      <hr class="playground-separator" />
    </div>
  </PlaygroundLayout>
</template>
```

**Reglas:**
1. **Badge de default** junto a cada `h2` (`.playground-heading`): el valor default de lo que demuestra la sección.
2. **`SectionDemo`**: SIEMPRE las 3 tabs en orden **Preview, Vue, Vanilla**. En snippets escapar `</script>` como `<\/script>` (si no, rompe el SFC).
3. **Qué muestra cada tab:**

| Tab | Contenido |
|---|---|
| Preview | Demo en vivo (slot default) |
| Vue | Uso como **componente Vue**: `import Button from '@/components/buttons/Button.vue'` + `<Button ...>` — el mismo import que usa el playground. **NUNCA** markup de custom element acá |
| Vanilla | Uso como **custom element**: `<script src="dist/CuButton.umd.js">` + `<cu-button ...>` — **solo si el componente está en lib** (entry en `src/lib/`); los internos no tienen tab Vanilla |

4. **API en una sección** con `h3` chicos (Props/Slots/Events/Exposes) y `Table variant="ghost" compact`. Nada de filas fake con "—": usar el `empty` de la Table (`empty="No tiene slots"`). Los `h3` con ids (`api-*`) van como `children` del outline (el `Outline` soporta sub-menús).
5. Registrar la página en `src/router/index.ts` y en el menú del `PlaygroundLayout`.

**Trampas:**

| Trampa | Fix |
|---|---|
| El global del layout pisa colores de spans: `.playground[data-v] :is(...,span,...)` = (0,2,1) | Subir especificidad en el componente (clase duplicada → 0,3,0). **NO** tocar el layout. |
| `Button.vue` setea `--btn-*` inline → no sobreescribibles desde afuera | Elegir la variante según el fondo: `soft` en claros, `solid` sobre fondos `neutral` (texto via `--cu-color-surface`, que es el opuesto de `neutral` en los 3 temas). |
| Tooltips nativos (`title`) | No cuentan como feedback visible de una prop; si debe "verse", renderizar texto real. |
| Swap animado de textos | Un solo `<Transition mode="out-in">` con `:key`; dos Transitions independientes popean al resetear. |

---

## Probar CE buildeado (fuera de Vue)

Después de `pnpm run build:lib`:

```html
<!DOCTYPE html>
<html data-theme="dark">
<head><link rel="stylesheet" href="dist/css/themes.css"></head>
<body>
  <cu-button color="primary" variant="soft">Click me</cu-button>
  <script src="dist/CuButton.umd.js"></script>
  <script>
    document.querySelector('cu-button').addEventListener('click', () => console.log('clicked'))
  </script>
</body>
</html>
```

- `<script>` del componente siempre en `<body>` (o `defer`).
- Props como atributos kebab-case; arrays/objetos por JS (`el.options = [...]` tras `customElements.whenDefined`).
- Servir: `cd dist && python3 -m http.server 3000`.

---

## Referencia de arquitectura

Sistema de color, tokens, temas y reglas completas → [`AGENTS.md`](../../AGENTS.md).
