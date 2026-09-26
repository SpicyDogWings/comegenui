# `Checkbox`

Checkbox con label, controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
import { ref } from "vue";

const acepto = ref(true);
</script>

<template>
  <Checkbox v-model="acepto" label="Acepto los términos" color="primary" />
  <Checkbox label="Opción deshabilitada" disabled />
</template>
```

## Escuchar cambios

Hay dos formas equivalentes de escuchar cambios:

```vue
<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
import { ref } from "vue";

const notif = ref(false);

// Vía update:modelValue (convención Vue)
function onUpdate(valor: boolean) {
  console.log("Valor:", valor);
}

// Vía change (payload = boolean)
function onChange(valor: boolean) {
  console.log("Cambió a:", valor);
}
</script>

<template>
  <Checkbox
    v-model="notif"
    label="Notificaciones"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
import { ref, useTemplateRef } from "vue";

const auto = ref(false);
const cb = useTemplateRef("cb");

function demo() {
  cb.value?.set(true); // marcar
  cb.value?.set(false); // desmarcar
  cb.value?.reset(); // equivale a cb.set(false)
  cb.value?.focus(); // foco
  console.log(cb.value?.get()); // estado actual
}
</script>

<template>
  <Checkbox ref="cb" v-model="auto" label="Acepto" />
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | Estado del checkbox (controlado) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del checkbox: `sm`, `md` |
| `disabled` | `boolean` | — | Estado deshabilitado |
| `label` | `string` | — | Texto visible junto al checkbox |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `boolean` | Se emite cuando cambia el estado |
| `change` | `boolean` | Se emite en cada cambio, útil para listeners simples |

## Slots

Ninguno (el texto se pasa via `label`).

## Expose

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el estado actual (`boolean`) |
| `.set(val: boolean)` | Asigna el estado (programáticamente) |
| `.reset()` | Pone el estado en `false` |
| `.focus()` | Enfoca el checkbox |
