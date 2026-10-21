[← Volver](../README.md)

# `ColorPicker`

Selector de color con swatch y campo de texto hex. Al hacer click en el swatch se abre el color picker nativo del navegador; el campo de texto permite escribir un `#RRGGBB` manualmente.

## Uso en Vue

```vue
<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";
import { ref } from "vue";

const color = ref("#ff5733");

function onChange(valor: string) {
  console.log("Color elegido:", valor);
}
</script>

<template>
  <ColorPicker v-model="color" color="primary" @change="onChange" />
</template>
```

En HTML plano, cargá el bundle `CuColorPicker` (ver [ficha vanilla](/componentes/cu-color-picker)).

## Colores

`color` es un nombre semántico que define el acento del borde/foco. Los 6 valores son
`primary`, `secondary`, `neutral` (**default**), `success`, `warning` y `danger`.

```vue
<template>
  <ColorPicker color="primary" model-value="#3b82f6" />
  <ColorPicker color="secondary" model-value="#3b82f6" />
  <ColorPicker color="neutral" model-value="#3b82f6" />
  <ColorPicker color="success" model-value="#3b82f6" />
  <ColorPicker color="warning" model-value="#3b82f6" />
  <ColorPicker color="danger" model-value="#3b82f6" />
</template>
```

## Valor controlado

```vue
<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";
import { ref } from "vue";

const color = ref("#1774A4");

function onUpdate(valor: string) {
  document.body.style.borderColor = valor;
}
</script>

<template>
  <ColorPicker v-model="color" @update:model-value="onUpdate" />
</template>
```

## Deshabilitado

```vue
<template>
  <ColorPicker disabled model-value="#dc3545" />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";
import { useTemplateRef } from "vue";

const cp = useTemplateRef("cp");

function demo() {
  cp.value?.get(); // "#3b82f6"
  cp.value?.set("#ff8800"); // asigna un color
  cp.value?.reset(); // vuelve al default "#000000"
  cp.value?.focus(); // enfoca el campo de texto
}
</script>

<template>
  <ColorPicker ref="cp" color="primary" model-value="#3b82f6" />
</template>
```

## Notas

- El campo de texto solo confirma el valor cuando es un hex válido (`#RRGGBB`). Si el valor no es válido al perder el foco, se restaura el último color válido.
- El swatch muestra el color actual de `modelValue`.

## Props

<!--@include: ../../partials/color-picker/props-vue.md-->

## Emits

<!--@include: ../../partials/color-picker/eventos.md-->

## Slots

<!--@include: ../../partials/color-picker/slots.md-->

## Expose

<!--@include: ../../partials/color-picker/metodos-vue.md-->
