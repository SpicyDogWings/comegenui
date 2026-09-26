# `Textarea`

Área de texto multilínea con color, variante, control de filas y opción de deshabilitar el redimensionado.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref } from "vue";

const comentarios = ref("Texto predefinido");
</script>

<template>
  <Textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined" />
  <Textarea v-model="comentarios" no-resize variant="soft" />
</template>
```

## Escuchar cambios

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref } from "vue";

const bio = ref("");

function onUpdate(valor: string) {
  console.log("Bio:", valor);
}
</script>

<template>
  <Textarea v-model="bio" placeholder="Biografía" @update:model-value="onUpdate" />
</template>
```

## Reset

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref, useTemplateRef } from "vue";

const notas = ref("Plantilla inicial");
const campo = useTemplateRef("campo");
</script>

<template>
  <Textarea ref="campo" v-model="notas" start-value="Plantilla inicial" />
  <button @click="campo?.reset()">Restaurar plantilla</button>
</template>
```

## Deshabilitar redimensionado

```vue
<template>
  <Textarea no-resize placeholder="Tamaño fijo" rows="4" />
</template>
```

Útil cuando querés controlar el alto de forma externa (con CSS o de manera responsiva).

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | — | Placeholder del textarea |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `noResize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value: string \| number)` | Asigna un valor |
| `.reset()` | Vuelve al `startValue` (o `""` si no se definió) |
| `.focus()` | Enfoca el textarea |
