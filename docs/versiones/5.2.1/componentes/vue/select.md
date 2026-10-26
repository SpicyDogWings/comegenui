[← Volver](../README.md)

# `Select`

Selector de opciones con color, variante, búsqueda por teclado, barra de cooldown,
posicionamiento configurable y estado de carga. Mantiene su estado y también se controla vía
`modelValue` o los métodos `get`/`set`.

## Uso en Vue

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("pdf");
const opciones = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    placeholder="Seleccione una opción"
    color="primary"
    variant="outlined"
  />
</template>
```

En HTML plano, cargá el bundle `CuSelect` (ver [ficha vanilla](/componentes/cu-select)).

La opción cuyo `value` coincide con el seleccionado (por click, `set()` o `modelValue`) se muestra
resaltada y con un check al final de la fila. Elegir una opción sigue cerrando el panel.

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo, así que
el mismo nombre se ve distinto en cada tema.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "ok", label: "Aprobado" },
  { value: "pend", label: "Pendiente" },
];
</script>

<template>
  <Select :options="opciones" color="primary" placeholder="primary" />
  <Select :options="opciones" color="secondary" placeholder="secondary" />
  <Select :options="opciones" color="neutral" placeholder="neutral" />
  <Select :options="opciones" color="success" placeholder="success" />
  <Select :options="opciones" color="warning" placeholder="warning" />
  <Select :options="opciones" color="danger" placeholder="danger" />
</template>
```

## Variantes

`variant` acepta `outlined` (borde), `soft` (fondo tenue, el **default**), `ghost`
(transparente) y `subtle` (fondo tenue con borde).

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="opciones" variant="outlined" placeholder="outlined" />
  <Select :options="opciones" variant="soft" placeholder="soft (default)" />
  <Select :options="opciones" variant="ghost" placeholder="ghost" />
  <Select :options="opciones" variant="subtle" placeholder="subtle" />
</template>
```

## Opciones deshabilitadas

Una opción con `disabled: true` se ve atenuada y no responde al click.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Documento", disabled: true },
  { value: "csv", label: "CSV", disabled: true },
  { value: "xlsx", label: "Excel" },
];
</script>

<template>
  <Select v-model="value" :options="opciones" placeholder="Elige un formato" />
</template>
```

## Opciones con color

Una opción puede fijar su propio `color` (y `variant`); si no lo hace, hereda los valores del
`<Select>`.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "ok", label: "Aprobado", color: "success" },
  { value: "warn", label: "Pendiente", color: "warning" },
  { value: "err", label: "Rechazado", color: "danger" },
];
</script>

<template>
  <Select v-model="value" :options="opciones" />
</template>
```

## Texto y alineación

`textAlign` (`left` **default**, `center`, `right`) alinea el texto del control, con el mismo
criterio en las dos partes:

- **El label del trigger**: el placeholder cuando no hay selección y el label de la opción elegida.
- **Las opciones del panel**, cada una dentro de su ancho.

`placeholderWrap` elige aparte entre envolver el texto en varias líneas o truncarlo con `...`;
cuando envuelve, la alineación se ve en todas las líneas.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="opciones" text-align="left" placeholder="text-align: left (default)" />
  <Select :options="opciones" text-align="center" placeholder="text-align: center" />
  <Select :options="opciones" text-align="right" placeholder="text-align: right" />
  <Select
    :options="opciones"
    placeholder-wrap
    placeholder="Un placeholder largo que se envuelve en varias líneas en vez de truncarse"
  />
</template>
```

## Búsqueda por teclado

Con `search-enabled` el select acepta entrada por teclado (como un `<select>` nativo): al
escribir, la lista hace scroll a la primera opción que coincide.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const paises = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "mx", label: "México" },
  { value: "pe", label: "Perú" },
];
</script>

<template>
  <Select v-model="value" :options="paises" search-enabled placeholder="Escribí para buscar" />
</template>
```

La coincidencia la define `searchMode`: `startsWith` (**default**, sólo al inicio del label) o
`includes` (en cualquier parte); `searchResetDelay` (1000ms por default) es el tiempo sin
teclear antes de resetear el texto acumulado.

## Barra de cooldown

Mientras se escribe (con `searchEnabled`), aparece una barra que se vacía en
`searchResetDelay` ms. `cooldownVariant` elige su estilo: `ghost` (color suave) o `solid`
(color lleno).

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];
</script>

<template>
  <!-- Cooldown con color suave (ghost, default) -->
  <Select :options="opciones" search-enabled />

  <!-- Cooldown con color lleno (solid) -->
  <Select :options="opciones" search-enabled cooldown-variant="solid" />

  <!-- Cooldown personalizado: 3s -->
  <Select :options="opciones" search-enabled :search-reset-delay="3000" />
</template>
```

> Si `loading` está activo, la barra de cooldown **no se muestra**.

## Carga

Con `loading` se muestra una barra animada arriba del panel y el dropdown se atenúa (sin
interacción).

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];
const loading = ref(false);

async function cargar() {
  loading.value = true;   // mostrar
  // ...carga...
  loading.value = false;  // ocultar
}
</script>

<template>
  <Select v-model="value" :options="opciones" :loading="loading" placeholder="Elegí un formato" />
</template>
```

## Estado deshabilitado

`disabled` bloquea la apertura del dropdown y atenúa el control.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="opciones" disabled placeholder="disabled" />
</template>
```

## Estado de solo lectura

`readOnly` bloquea la apertura del dropdown y el cambio de selección, pero el control sigue
enfocable y no se atenúa. `set()` y `reset()` programáticos siguen funcionando; para bloquear
también el foco usá `disabled`.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="opciones" read-only model-value="a" placeholder="read-only" />
</template>
```

## Posicionamiento

`position` acepta `bottom` (**default**) y `top`; `align` acepta `start` (**default**),
`center` y `end`. Con `fixed`, el panel se posiciona respecto del viewport.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const opciones = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="opciones" position="bottom" align="end" placeholder="bottom / end" />
  <Select :options="opciones" position="top" align="center" placeholder="top / center" />
  <Select :options="opciones" position="bottom" align="end" placeholder="bottom / end" />
  <Select :options="opciones" position="top" align="start" placeholder="top / start" />
</template>
```

## Escuchar cambios

`select` trae la opción elegida (`{ value, label }`), `update:modelValue` el valor nuevo y
`change` el valor nuevo cuando el cambio es por click (igual que un `<select>` nativo).

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "op1", label: "Opción 1" },
  { value: "op2", label: "Opción 2" },
];

function onSelect(option: { value: string; label: string }) {
  console.log("Seleccionado:", option); // { value, label }
}
function onUpdate(valor: string) {
  console.log("Valor:", valor);
}
function onChange(valor: string) {
  console.log("Cambió a:", valor);
}
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    @select="onSelect"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref, useTemplateRef } from "vue";

const value = ref("");
const sel = useTemplateRef("sel");
const opciones = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

function demo() {
  sel.value?.set("a");         // seleccionar 'a'
  sel.value?.get();            // 'a'
  sel.value?.selectedItem();   // { value: 'a', label: 'A' }
  sel.value?.reset();          // limpiar
  sel.value?.isOpen();         // false
  sel.value?.focus();          // foco
}
</script>

<template>
  <Select ref="sel" v-model="value" :options="opciones" placeholder="Elegí una letra" />
</template>
```

## Props

<!--@include: ../../partials/select/props-vue.md-->

### Opciones (`options`)

Cada opción del array `options` puede tener:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | — | Valor de la opción (lo que se asigna al `modelValue`) |
| `label` | `string` | — | Texto visible |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |
| `color` | `string` | hereda del padre | Color semántico individual |
| `variant` | `string` | hereda del padre | Variante individual |

> La opción seleccionada se distingue con el resaltado y un check al final de la fila; no hace
> falta marcar nada en `options`.

## Emits

<!--@include: ../../partials/select/eventos-vue.md-->

## Slots

<!--@include: ../../partials/select/slots.md-->

## Expose

<!--@include: ../../partials/select/metodos-vue.md-->

## Interfaces

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}
```
