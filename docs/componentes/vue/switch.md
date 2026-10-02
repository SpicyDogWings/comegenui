# `Switch`

Toggle switch con color semántico y dos tamaños. Mantiene su estado y también se controla via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(true);
</script>

<template>
  <Switch v-model="activo" color="primary" size="md" />
</template>
```

## Tamaños

```vue
<template>
  <Switch size="sm" color="primary" />
  <Switch size="md" color="primary" />
</template>
```

- `sm`: 32×20px
- `md`: 48×32px

## Escuchar cambios

Hay dos formas equivalentes:

```vue
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(false);

// update:modelValue (convención Vue)
function onUpdate(estado: boolean) {
  console.log("Estado:", estado);
}

// change (payload = boolean)
function onChange(estado: boolean) {
  console.log("Toggle a:", estado);
}
</script>

<template>
  <Switch v-model="activo" @update:model-value="onUpdate" @change="onChange" />
</template>
```

## Uso con label

El switch no incluye label propio. Combinalo con `<Label>` para tener un área clickeable extendida:

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(false);
</script>

<template>
  <Label label="Notificaciones activas">
    <Switch v-model="activo" color="primary" />
  </Label>
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `""` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

Ninguno.

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
