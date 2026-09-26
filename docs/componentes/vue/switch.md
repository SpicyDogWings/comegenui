# `Switch`

Toggle switch con color semántico y dos tamaños. Controlable via `modelValue` o métodos `get`/`set`.

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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | Estado del toggle (controlado) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | — | Estado deshabilitado |
| `label` | `string` | `""` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `boolean` | Se emite cuando cambia el estado |
| `change` | `boolean` | Se emite en cada cambio (payload directo = boolean) |

## Slots

| Slot | Descripción |
|------|------|
| `default` |  |

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el estado actual (`boolean`) |
| `.set(val: boolean)` | Asigna el estado |
| `.reset()` | Pone el estado en `false` |
| `.focus()` | Enfoca el switch |
