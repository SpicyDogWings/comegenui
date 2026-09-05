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
- "Crear playground de un componente" → [Playground](#playground--patrón-de-página) + [Registrar](#registrar-el-playground-router--nav).
- "Crear una sección/grupo nuevo en el menú" → [Nueva sección](#nueva-sección-grupo-del-nav).
- "Ordenar/clasificar/sincronizar el menú con las carpetas" → [Sincronizar nav ↔ carpetas](#sincronizar-nav--carpetas).
- "Buildear la lib" → [Build y validación](#build-y-validación).
- "Testear componente" → [Build y validación](#build-y-validación).
- "Playground / probar componente" → [Playground](#playground--patrón-de-página).
- "Agregar Programmatic/API/Interfaces a una página del playground" → [Playground](#playground--patrón-de-página) (reglas 4-6).
- "Agregar/modificar un token" → [Tokens ↔ ThemeBuilder](#tokens--themebuilder).
- "Agregar componente a la lib" → además, su preview en el ThemeBuilder ([Tokens ↔ ThemeBuilder](#tokens--themebuilder)).

## Cuándo NO se activa

- Usar comegen-ui en **otro** proyecto (esa es la skill de uso que viaja con el zip).
- Modificar el build system (`build-lib.ts`, `vite.config.ts`).
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
git status --short   # revisar: stagear solo los archivos de la tarea, nunca git add -A a ciegas
git add src/components src/lib && git commit -m "feat: agregar componente MiComponente"
```

Reglas transversales: `defineExpose` **siempre arrow functions** (`isOpen: () => ...`); slots con sintaxis Vue `#nombre`.

---

## Modificar un componente existente

1. Identificar: `src/components/{category}/MiComponente.vue`.
2. Si cambia la interfaz (props/emits), actualizar también el `.ce.vue`.
3. Validar: `pnpm run build-only && pnpm exec vitest run` (+ `pnpm run build:lib` si es público).
4. Commit: `git status --short` para stagear solo lo de la tarea (nunca `git add -A` a ciegas) → `git commit -m "fix: descripción del cambio"`.

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
  { label: 'Programmatic', id: 'programmatic' },
  { label: 'API', id: 'api', children: [
    { label: 'Props', id: 'api-props' },
    { label: 'Slots', id: 'api-slots' },
    { label: 'Events', id: 'api-events' },
    { label: 'Exposes', id: 'api-exposes' },
    { label: 'Interfaces', id: 'api-interfaces' },
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
1. **Badge de default** junto a cada `h2` (`.playground-heading`): el valor default de lo que demuestra la sección (leerlo del source del componente, no de la tabla de la API).
2. **`SectionDemo`**: TODA sección de demo lleva su `SectionDemo` — la **API es la única sección sin tabs** (una sección puede llevar más de un `SectionDemo`, ej: Navbar `modes`). Tabs en orden **Preview, Vue, Vanilla** (la tab Vanilla solo si el componente está en lib → 2 tabs si no; ver regla 3). En snippets escapar `</script>` como `<\/script>` (si no, rompe el SFC).
3. **Qué muestra cada tab:**

| Tab | Contenido |
|---|---|
| Preview | Demo en vivo (slot default) |
| Vue | Uso como **componente Vue**: `import Button from '@/components/buttons/Button.vue'` + `<Button ...>` — el mismo import que usa el playground. **NUNCA** markup de custom element acá |
| Vanilla | Uso como **custom element**: `<script src="dist/CuButton.umd.js">` + `<cu-button ...>` — **solo si el componente está en lib** (entry en `src/lib/`); los internos no tienen tab Vanilla. Props array/objeto (items, events, options) por JS tras `customElements.whenDefined('cu-x')`; eventos se escuchan con el nombre del emit tal cual (`addEventListener('update:currentPage', e => e.detail)`) |

4. **API en una sección** con `h3` chicos (Props/Slots/Events/Exposes/Interfaces) y `Table variant="ghost" compact`. Nada de filas fake con "—": usar el `empty` de la Table (`empty="No tiene slots"`). Los `h3` con ids (`api-*`) van como `children` del outline (el `Outline` soporta sub-menús).
5. **Interfaces**: si un prop tiene estructura (items, options, columns, events), la API lleva la subsección `Interfaces` con `CodeBlock :code="interfaceCode" language="ts" variant="solid"` mostrando la interfaz **real** del componente (leerla del source, **no inventar**). El demo que la usa linkea con `Button variant="link" to="#api-interfaces"` ("Ver interfaz X ↓") en vez de enumerar campos en texto. Si los props son primitivos, no hay subsección Interfaces.
6. **Programmatic** (si el componente expone métodos **o se controla por v-model**): **Programmatic y API son las ÚLTIMAS DOS secciones de la página, en ese orden** (ninguna sección entre ellas ni después). Layout fijo (referencia: DatePicker):
   - `<div class="playground-heading"><h2>Programmatic</h2></div>` + `<p class="playground-desc">Seguidilla de botones sobre la instancia de abajo</p>` (los paneles pueden aclarar: "— el panel abre acá al lado").
   - `SectionDemo` con: una fila de `Button color="neutral"` (uniformes, una acción por botón, **nunca `<button>` nativo**), UNA línea `<p class="playground-state">` con los getters/v-model en vivo, y el componente **al final**.
   - Estado en vivo: actualizar en cada acción **y** en los events del componente (`@update:model-value`, `@close`, `@change`…).
   - Sin métodos expuestos → manipular los v-models (ej: Pagination `v-model:current-page` con botones `page 1`/`prev()`/`next()`/`page 5`).
   - Outline `Programmatic` **sin children** (los h3 por-método están proscriptos).
   - En snippets el estado se loguea a `console` (`logState()`); Vanilla usa `cu-button`.

   **Validación:** `pnpm run build-only` — el outline salta a Programmatic (arriba de API) y el estado se actualiza al usar cada botón y al interactuar con el componente.

**Trampas:**

| Trampa | Fix |
|---|---|
| El global del layout pisa colores de spans: `.playground[data-v] :is(...,span,...)` = (0,2,1) | Subir especificidad en el componente (clase duplicada → 0,3,0). **NO** tocar el layout. |
| `Button.vue` setea `--btn-*` inline → no sobreescribibles desde afuera | Elegir la variante según el fondo: `soft` en claros, `solid` sobre fondos `neutral` (texto via `--cu-color-surface`, que es el opuesto de `neutral` en los 3 temas). |
| Tooltips nativos (`title`) | No cuentan como feedback visible de una prop; si debe "verse", renderizar texto real. |
| Swap animado de textos | Un solo `<Transition mode="out-in">` con `:key`; dos Transitions independientes popean al resetear. |
| FABs y componentes `position: fixed` en preview | En la demo: `style="position: static"` por instancia; en el snippet vanilla/vue, incluirlo también. |
| Páginas legacy sin tabs (hoy: AdvancedTable, EditableRow, Table, Tabs; parcial: Loader `colors`) | Sus secciones viejas NO usan `SectionDemo`. Al tocarlas, migrar la sección a `SectionDemo` (con Vanilla solo si el componente está en lib) — no dejar secciones híbridas. La lista se re-deriva con el comando de auditoría de abajo. |
| Verificación superficial de migración | `grep -c SectionDemo` cuenta líneas (import + apertura + cierre), no secciones envueltas: un "3" puede ser un solo uso. Para verificar de verdad usar el comando de auditoría (SectionDemo envueltos vs secciones demo) — NUNCA declarar "migrado" sin que el conteo cumpla. |

**Auditoría rápida del playground** — `SectionDemo` envueltos vs secciones demo (todas menos la API):

```bash
cd src/pages/playground/components && for f in *.vue; do
  echo "$(grep -c '<SectionDemo' "$f")/$(($(grep -c '<section' "$f") - $(grep -c 'id="api"' "$f"))) $f"
done
```

Interpretación: `N/N` o `N>M` = completa (N>M = sección con varios demos, ej: Navbar); `0/N` = legacy; `0<N<M` = parcial.

**¿"Completo" qué significa?** Cuando te pregunten si una sección/grupo está "completa", no asumas: verificá y reportá ambos — (1) nav ↔ carpeta calzan 1:1, y (2) cada página del grupo está migrada (auditoría de arriba). Pueden calzar en nav y faltar migrar páginas (pasó con Controls: nav 5/5, páginas 0-1 secciones envueltas).

### Registrar el playground (router + nav)

La página sola no alcanza: **3 lugares**.

1. **Página** — `src/pages/playground/components/MiComponente.vue` (PascalCase, igual al componente).
2. **Route** — `src/router/index.ts` (path kebab-case):

```ts
{
  path: "mi-componente",
  name: "MiComponente playground",
  component: () => import("@/pages/playground/components/MiComponente.vue")
},
```

3. **Nav** — `PlaygroundLayout.vue`, dentro del grupo de su categoría (label = nombre exacto del componente):

```ts
{ label: 'MiComponente', path: '/playground/components/mi-componente' },
```

**Validación:** abrir `/playground/components/mi-componente` — aparece en el nav, el outline salta a las secciones, tabs ok.

---

## Nueva sección (grupo del nav)

Un grupo del nav = una **categoría de carpeta**. Receta:

1. **Carpeta** — `src/components/{category}/` (convención actual: `buttons`, `form`, `controls`, `information`, `markdown`, `overlay`, `data`).
2. **Lib** (si sus componentes son públicos) — `src/lib/{category}/`.
3. **Nav group** — `PlaygroundLayout.vue` (label **Capitalized**, siempre):

```ts
{
  label: '{Category}',
  children: [
    { label: 'MiComponente', path: '/playground/components/mi-componente' },
  ],
},
```

4. Cada componente del grupo → [Registrar el playground](#registrar-el-playground-router--nav).
5. Si la categoría es nueva, actualizar el árbol de directorios de [`AGENTS.md`](../../AGENTS.md).

**Validación:** el grupo lista EXACTAMENTE lo que hay en la carpeta (ver siguiente sección).

---

## Sincronizar nav ↔ carpetas

**Regla:** el grupo del nav **espeja la carpeta 1:1** — label = nombre del archivo sin `.vue`, orden alfabético.

1. **Auditar** — comparar:

```bash
ls src/components/buttons/ | grep -v test
```

contra el grupo en `PlaygroundLayout.vue`.

2. **Por cada componente sin entrada:** crear página ([patrón de página](#playground--patrón-de-página)) + [route + nav](#registrar-el-playground-router--nav).
3. Validar: contar entradas del nav del grupo = archivos `.vue` sin test de la carpeta.
4. Commit: `git commit -m "feat: sección {Category} completa (N/N componentes)"`.

**Ejemplo real (Buttons):** la carpeta tenía 4 componentes (Button, CopyButton, FloatingButton, ToggleColorSheme) y el nav listaba 3 — faltaba FloatingButton: página completa + route `floating-button` + nav entry → 4/4. Labels de grupo Capitalized (`Buttons`), labels de componente = nombre exacto.

---

## Tokens ↔ ThemeBuilder

El ThemeBuilder (`src/pages/playground/ThemeBuilder.vue`) **no genera tokens propios**: consume `colorsBlock()` desde `src/plugins/cu-tokens/css.ts` (el generador compartido con `build:lib`).

1. **Si modificás o agregás un token** → tocá SOLO el generador (`css.ts`) y verificá que la variable salga en el CSS exportado del ThemeBuilder (modal → Copy/Download CSS). Test de contrato: `src/plugins/cu-tokens/css.test.ts`.
2. **El ThemeBuilder previsualiza TODOS los componentes de la lib** — al agregar un componente a `src/lib/`, agregá su preview al ThemeBuilder. Inventario: `ls src/lib/*/`.

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
