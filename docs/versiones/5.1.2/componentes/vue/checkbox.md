[← Volver](../README.md)

# `Checkbox`

Checkbox con label, controlable via `modelValue` o métodos `get`/`set`.

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

En HTML plano, cargá el bundle `CuCheckbox` (ver [ficha vanilla](/componentes/cu-checkbox)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`). Los 6 valores son `primary`, `secondary`, `neutral` (**default**),
`success`, `warning` y `danger`.

```vue
<template>
  <Checkbox label="primary" color="primary" :model-value="true" />
  <Checkbox label="secondary" color="secondary" :model-value="true" />
  <Checkbox label="neutral" color="neutral" :model-value="true" />
  <Checkbox label="success" color="success" :model-value="true" />
  <Checkbox label="warning" color="warning" :model-value="true" />
  <Checkbox label="danger" color="danger" :model-value="true" />
</template>
```

## Tamaños

`size` acepta `sm` y `md` (**default**), y cambia el tamaño de la caja y de la etiqueta.

```vue
<template>
  <Checkbox label="sm" size="sm" :model-value="true" />
  <Checkbox label="md (default)" size="md" :model-value="true" />
</template>
```

## Estado deshabilitado

`disabled` atenúa el checkbox, bloquea el click y muestra cursor `not-allowed`, marcado o
no. `label` es el texto de al lado y es opcional: sin él, el checkbox queda solo.

```vue
<template>
  <Checkbox label="Deshabilitado (marcado)" :model-value="true" disabled />
  <Checkbox label="Deshabilitado (sin marcar)" disabled />
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

## Props

<!--@include: ../../partials/checkbox/props-vue.md-->

## Emits

<!--@include: ../../partials/checkbox/eventos.md-->

## Slots

<!--@include: ../../partials/checkbox/slots.md-->

## Expose

<!--@include: ../../partials/checkbox/metodos-vue.md-->
