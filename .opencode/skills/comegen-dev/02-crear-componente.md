# 02 — Crear un componente nuevo

> Antes de empezar: [`01-mapa-del-repo.md`](01-mapa-del-repo.md) y la DoD del [`SKILL.md`](SKILL.md#definición-de-terminado-dod). No saltees story, tests, playground ni docs.

## 0. Verificar que no existe

```bash
ls src/components/{category}/X.vue src/components/customElements/{category}/X.ce.vue 2>/dev/null && echo "YA EXISTE" || echo "NO EXISTE"
```

## 1. Definir el contrato

Antes de escribir código, fijá la API pública:

- **props**: nombres, tipos, defaults, variantes válidas.
- **emits**: eventos Vue que después se puentean con `ceEmit` a `CustomEvent`.
- **slots**: `default` y nombrados.
- **`defineExpose`**: métodos/getters que el host puede llamar (siempre arrow functions).
- **tokens**: qué `--cu-color-{name}-*` usa (resolver por CSS, nunca a hex).

## 2. Componente real — `src/components/{category}/X.vue`

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

## 3. Wrapper CE — `src/components/customElements/{category}/X.ce.vue`

Solo si el componente es **público**.

```vue
<script setup lang="ts">
import X from "../../{category}/X.vue"
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
  <X ref="ref" :color="props.color">
    <slot></slot>
  </X>
</template>
```

Reglas: **NO** importa sub-componentes `.vue`; props **explícitas** (nunca `v-bind="{...props}"`); `initTokens()` una vez (acá o en el `.ts`); slots con `<template #nombre>`.

## 4. Entry point — `src/lib/{category}/x.ts`

Solo si es público.

```ts
import { defineCustomElement } from 'vue'
import X from '@/components/customElements/{category}/X.ce.vue'

const CuX = defineCustomElement(X)
customElements.define('cu-x', CuX)

export default CuX
```

## 5. Story + tests (obligatorio)

Esto es lo que separa un componente terminado de uno a medias:

1. `src/stories/{category}/X.stories.ts` — secciones = casos de uso reales, cada una con `variants`, `checks.l1`, snippets `vue` y `vanilla`.
2. `src/stories/{category}/X.l1.test.ts` — `runL1Story(XStories)`.

> La story y el test **no** van al lado del componente: viven en `src/stories/{category}/` (espejo de `src/components/{category}/`).

Receta completa y schema en [`04-stories-y-tests.md`](04-stories-y-tests.md).

## 6. Playground

Página + `route` + entrada de nav. El preview se renderiza desde la story con `StoryRenderer` (no se escribe markup a mano).

Receta en [`05-playground.md`](05-playground.md).

## 7. Docs

`docs/skills/use-comegen/componentes/cu-x.md` + índices. Delegá a la skill `comegen-ui-docs`; detalle en [`07-documentacion.md`](07-documentacion.md).

## 8. Validar y commitear

```bash
./scripts/preflight.sh          # type-check (sin errores nuevos) + tests L1
pnpm run build:lib              # si es público: UMD + zip
git status --short              # stagear SOLO los archivos de la tarea
git add <archivos exactos>
git commit -m "feat(cu-x): agregar componente X"
```

Nunca `git add -A` a ciegas. Si el trabajo es en `main`, creá rama primero (regla 11 de `AGENTS.md`).

## Checklist final

Usá la [DoD del SKILL.md](SKILL.md#definición-de-terminado-dod). Si algo no aplica (ej: componente interno no lleva `.ce.vue` ni tab Vanilla), decilo explícitamente.
