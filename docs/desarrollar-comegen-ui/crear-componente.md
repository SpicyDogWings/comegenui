# Crear un componente nuevo

Guía paso a paso para crear un Custom Element nuevo desde cero, siguiendo las convenciones del proyecto.

## 0. Decisiones previas

Antes de tocar código, responder:

- **¿Nombre del tag?** Convención `cu-<nombre-kebab>`. Singular. Sin prefijos redundantes.
- **¿Dónde va?** Ver [arquitectura.md](arquitectura.md#ubicaciones):
  - Form/input → `src/components/form/`
  - Tabla/lista → `src/components/data/`
  - Overlay/display/botón → `src/components/`
  - Experimental → `src/components/labs/`
  - Reemplazo de uno viejo → `src/components/archived/`
- **¿Qué props públicas necesita?** Pensar desde la perspectiva del consumidor (HTML plano + UMD).
- **¿Qué eventos custom emite?** Solo si la lógica de negocio lo requiere.
- **¿Tiene slots?** Slots HTML nativos (no Vue), con `slot="nombre"`.
- **¿Rama de trabajo?** Creá una rama propia **solo si la rama base es `main`** (`feat/<tag>`, `docs/<tag>`, etc.): `git checkout main && git pull --ff-only && git checkout -b feat/cu-<nombre>`. **Si ya estás en una rama (base ≠ `main`), NO crees otra** salvo que te lo pidan explícitamente. Ver [convenciones-desarrollo.md](convenciones-desarrollo.md#workflow-de-ramas-git).

## 1. Crear el `.vue` interno (implementación real)

Path: `src/components/<carpeta>/<Nombre>.vue`

```vue
<script setup lang="ts">
import { computed } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
});

// Lógica
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

**Reglas del `.vue` interno:**

- `color` es **hex string** (no nombre semántico).
- `variant` y `hightContrast` (typo intencional, ver [`docs/notes/02-hightcontrast.md`](../../notes/02-hightcontrast.md)) son strings/boolean.
- Usá `getBgClasses` y `getFgClasses` de `palette.ts` para los colores.
- Slots con sintaxis Vue: `<slot>`, `<slot name="toggle">`, `<template #header>`.
- Al final del `<style>` agregá `@unocss-placeholder;` (directiva de UnoCSS para activar las utilities).
- **Especificidad (regla activa):** toda regla de variante con `color`/`background-color` va con **doble clase** (`.cu-x.cu-x--variant`), y el texto sobre `solid` va con `var(--cu-color-surface)` (nunca `--cu-color-{name}-text`, que es el color oscurecido). Ver [convenciones-desarrollo.md](convenciones-desarrollo.md#especificidad-en-variantes-con-color-propio).

## 2. Crear el `.ce.vue` (Custom Element wrapper)

Path: `src/components/<carpeta>/<Nombre>.ce.vue`

```vue
<script setup lang="ts">
import { computed, ref, getCurrentInstance } from "vue";
import MiComponente from "./MiComponente.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  // ── Tema y color semántico ──
  theme: { type: String, required: false, default: "", validator: isValidTheme },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
  hightContrast: { type: Boolean, required: false, default: false },

  // ── Props específicas ──
  // (acá van las props de tu componente)
});

const emit = defineEmits(["evento1", "evento2"]);

// ── Resolución de tema → hex ──
const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const innerRef = ref<InstanceType<typeof MiComponente> | null>(null);

// ── Helper para re-emitir eventos (si hace falta) ──
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

defineExpose({
  // métodos que el usuario puede llamar
});
</script>

<template>
  <MiComponente
    :color="hexColor"
    :variant="props.variant"
    :hight-contrast="props.hightContrast"
    @evento-interno="ceEmit('evento1', $event)"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </MiComponente>
</template>

<style>
@unocss-placeholder;
</style>
```

**Reglas del `.ce.vue`:**

- Importá `getColorMap`, `getHostTheme`, `isValidTheme`.
- **Pasá cada prop explícitamente**. Nunca uses `v-bind="{...props}"`.
- Slots: `<slot name="...">` o `<slot></slot>` (default). Si necesitás slots dinámicos, usá `slot="nombre"` (HTML nativo).
- Para re-emitir eventos custom del `.vue` interno, usá `ceEmit` o `defineEmits`.
- Si el componente tiene overlay o estado controlable, expón métodos en `defineExpose`.

## 3. Crear el `.ts` (registro)

Path: `src/components/<carpeta>/<Nombre>.ts`

```ts
import { defineCustomElement } from "vue";
import MiComponente from "./MiComponente.ce.vue";

const comegenMiComponente = defineCustomElement(MiComponente);

customElements.define("cu-mi-componente", comegenMiComponente);

export default comegenMiComponente;
```

**Reglas:**

- El tag debe empezar con `cu-` (ComegenUI).
- El nombre de la variable es `comegen<NombrePascalCase>`.
- Una sola línea `customElements.define(...)`.

## 4. Agregar ejemplo en el playground

Path: `src/pages/playground/components/<Nombre>.vue`

El playground Vue es la herramienta principal para demostrar componentes (reemplazó a Storybook). Ver [playground.md](playground.md) para la estructura y convenciones.

```vue
<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import MiComponente from "@/components/<carpeta>/MiComponente.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Otros', id: 'otros' },
];

const selected = ref("");
</script>

<template>
  <PlaygroundLayout title="MiComponente" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <MiComponente variant="soft" placeholder="soft" />
          <MiComponente variant="outlined" placeholder="outlined" />
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
```

## 5. (Opcional) Agregar un preset en el playground HTML estático

Path: `playground/examples/<nombre>.js`

```js
// playground/examples/mi-componente.js
// ✅ EDITABLE, borrá y poné tu ejemplo

const c = document.getElementById('miComponente');
c.addEventListener('evento1', (e) => {
  logEvent(`Evento: ${JSON.stringify(e.detail)}`);
});
```

Y agregar el `<script>` en `playground/index.html`:

```html
<script src="playground.js"></script>
<script src="examples/mi-componente.js"></script>
```

## 6. Build y prueba

```bash
pnpm build:lib
# → genera dist/CuMiComponente.umd.js
```

Después, abrir el playground en el navegador y verificar que el nuevo tag funcione.

## 7. Documentar

Usá la skill [`documentar-comegen-ui`](../documentar-comegen-ui/SKILL.md) para crear el archivo `cu-<nombre>.md` en `docs/comegen-ui/componentes/`.

## 8. Actualizar SKILL.md e índices

Un componente nuevo **no está completo con solo su `.md`**. Hay que actualizar **todos** los índices que listan componentes (verificar con `grep` por el tag `<cu-xxx>`):

1. **`docs/comegen-ui/SKILL.md`** (usuario final) — 3 lugares:
   - Tabla "Archivos disponibles" (agregar `Cu<Nombre>.umd.js` / `<cu-xxx>` / descripción).
   - Tabla "Default de `variant` por componente" (si tiene variant).
   - Índice "Componentes" (link a `componentes/cu-xxx.md`).
   - Si corresponde, la tabla de "Variantes disponibles" y la de "Tamaño de los bundles" (los tamaños salen del `pnpm run build:lib`).
2. **`docs/DOCS.md`** — tabla "Componentes disponibles".
3. **`COMPONENTS-GUIDE.md`** (raíz del repo) — índice, listado de `<script>` de instalación, tabla "Archivos disponibles", y una sección `### <cu-xxx>` completa.
4. **Skill local `~/.agents/skills/use-comegen/`** — instalada por `update.sh`/`update.ps1` desde el zip (`use-comegen/`). Es una copia del canonical `docs/skills/use-comegen/`.

> Regla de oro: **el tag `<cu-xxx>` debe aparecer en todos los índices o en ninguno.** Si solo está en el `.md` y en `SKILL.md`, el componente queda "documentado pero invisible" en `DOCS.md` y `COMPONENTS-GUIDE.md`.

## Checklist final

- [ ] `.vue` interno existe y recibe `color` como hex.
- [ ] `.ce.vue` existe y expone la API con colores semánticos.
- [ ] `.ts` registra el Custom Element.
- [ ] Playground Vue existe y muestra al menos una variante.
- [ ] **Especificidad:** reglas de variante con doble clase (`.cu-x.cu-x--variant`) y texto sobre `solid` con `var(--cu-color-surface)`. Probar `solid` en el playground (reglas globales de color) antes de cerrar.
- [ ] (Opcional) Preset en `playground/examples/`.
- [ ] Build UMD funciona: `pnpm build:lib`.
- [ ] Documentación `cu-<nombre>.md` existe.
- [ ] `docs/comegen-ui/SKILL.md` actualizado (tabla UMD, default variant, índice).
- [ ] `docs/DOCS.md` actualizado (tabla "Componentes disponibles").
- [ ] `COMPONENTS-GUIDE.md` actualizado (índice + sección `<cu-xxx>`).
- [ ] Skill local `~/.agents/skills/use-comegen/` (instalada por update.sh/ps1, copia de `docs/skills/use-comegen/`).
