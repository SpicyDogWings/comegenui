# `ColorPicker`

Selector de color con swatch y campo de texto hex. Al hacer click en el swatch se abre el color picker nativo del navegador; el campo de texto permite escribir un `#RRGGBB` manualmente.

[← Volver](../README.md)

---

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

## Notas

- El campo de texto solo confirma el valor cuando es un hex válido (`#RRGGBB`). Si el valor no es válido al perder el foco, se restaura el último color válido.
- El swatch muestra el color actual de `modelValue`.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | — |
| `disabled` | `boolean` | `false` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el color actual en formato hex. |
| `set` | Setea el color actual en formato hex. |
| `reset` | Restaura el color al negro (#000000). |
| `focus` | Enfoca el input de texto del color. |
<!-- /@api:expose -->
