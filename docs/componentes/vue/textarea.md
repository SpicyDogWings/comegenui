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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `rows` | `number` | `3` | — |
| `noResize` | `boolean` | `false` | — |
| `placeholder` | `string` | `—` | — |
| `startValue` | `string` | `—` | — |
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
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
<!-- /@api:expose -->
