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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `—` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve si el checkbox está marcado. |
| `set` | Setea el estado marcado y emite change. |
| `reset` | Desmarca el checkbox y emite change. |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
