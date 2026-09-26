# `Select`

Selector de opciones con color, variante, ícono chevron, opciones deshabilitadas y posicionamiento configurable. Controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

---

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

## Opciones deshabilitadas

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

Las opciones con `disabled: true` se ven atenuadas y no responden al click.

## Opciones con color y variante individual

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

Si una opción no especifica `color` ni `variant`, hereda los valores del `<cu-select>`.

## Escuchar cambios

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
  console.log("Valor:", valor); // string
}
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    @select="onSelect"
    @update:model-value="onUpdate"
  />
</template>
```

## Búsqueda por teclado (searchEnabled)

Cuando `searchEnabled` es `true`, el select acepta entrada por teclado (como un `<select>` nativo): el usuario escribe y la lista hace scroll a la primera opción que coincide.

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
  <Select v-model="value" :options="paises" search-enabled />
</template>
```

**Comportamiento:**
- Al abrir el dropdown, el input oculto recibe foco
- Al escribir, la lista scrollea a la primera opción que coincide (según `searchMode`: `startsWith` por defecto)
- El texto acumulado se resetea después de 1s sin teclear (configurable con `searchResetDelay`)
- Backspace borra el último carácter
- Escape y Tab no afectan la búsqueda

## Estado de carga (loading)

Cuando `loading` es `true`, se muestra una barra animada en el tope del dropdown y el panel se atenúa (sin interacción):

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
const loading = ref(false);

async function cargar() {
  loading.value = true;   // mostrar
  // ...carga...
  loading.value = false;  // ocultar
}
</script>

<template>
  <Select v-model="value" :options="opciones" :loading="loading" />
</template>
```

**Nota:** Si `loading` está activo, la barra de cooldown (del `searchEnabled`) **no se muestra**.

## Barra de cooldown

Mientras el usuario escribe (con `searchEnabled`), aparece una barra de cooldown que se vacía en `searchResetDelay` ms. Al presionar otra tecla, la barra se reinicia.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
</script>

<template>
  <!-- Cooldown con color suave (ghost, default) -->
  <Select v-model="value" :options="opciones" search-enabled />

  <!-- Cooldown con color lleno (solid) -->
  <Select v-model="value" :options="opciones" search-enabled cooldown-variant="solid" />

  <!-- Cooldown personalizado: 3s -->
  <Select v-model="value" :options="opciones" search-enabled :search-reset-delay="3000" />
</template>
```

| `cooldownVariant` | Apariencia |
|-------------------|------------|
| `ghost` (default) | Color suave (`--cu-color-{color}-ghost-hover`) |
| `solid` | Color lleno (`--cu-color-{color}`) |

## Control programático

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { onMounted, ref, useTemplateRef } from "vue";

const value = ref("");
const auto = useTemplateRef("auto");
const opciones = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

onMounted(() => {
  auto.value?.set("a");             // seleccionar 'a'
  auto.value?.get();                // 'a'
  auto.value?.selectedItem();       // { value: 'a', label: 'A' }
  auto.value?.reset();              // limpiar
  auto.value?.isOpen();             // false
  auto.value?.focus();              // foco
});
</script>

<template>
  <Select ref="auto" v-model="value" :options="opciones" />
</template>
```

## Posicionamiento

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
</script>

<template>
  <!-- Con position + align separados -->
  <Select v-model="value" :options="opciones" position="bottom" align="end" />
  <Select v-model="value" :options="opciones" position="top" align="center" />

  <Select v-model="value" :options="opciones" position="bottom" align="end" />
  <Select v-model="value" :options="opciones" position="top" align="start" />
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `searchEnabled` | `boolean` | `false` | — |
| `loading` | `boolean` | `false` | — |
| `disabled` | `boolean` | `false` | — |
| `placeholder` | `string` | `""` | — |
| `position` | `string` | `"bottom"` | — |
| `align` | `string` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `modelValue` | `string` | `""` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | — |
| `searchMode` | `"includes" \| "startsWith"` | `"startsWith"` | — |
| `options` | `SelectOption[]` | `[]` | — |
| `placeholderWrap` | `boolean` | `false` | — |
| `searchResetDelay` | `number` | `1000` | — |
| `cooldownVariant` | `string` | `"ghost-hover"` | — |
<!-- /@api:props -->

### Opciones (`options`)

Cada opción del array `options` puede tener:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | — | Valor de la opción (lo que se asigna al `modelValue`) |
| `label` | `string` | — | Texto visible |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |
| `color` | `string` | hereda del padre | Color semántico individual |
| `variant` | `string` | hereda del padre | Variante individual |

> **Importante:** `options` se asigna como propiedad JS (`select.options = [...]`), no como atributo HTML.

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `any[` | — |
| `close` | `any[` | — |
| `update:modelValue` | `any[` | — |
| `blur` | `any[` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve la opción seleccionada o null. |
<!-- /@api:expose -->

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
