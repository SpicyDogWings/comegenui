# `Input`

Input de texto con color, variante, tipos de input HTML5 y métodos `get`/`set`/`reset`.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const email = ref("usuario@dominio.com");
</script>

<template>
  <Input v-model="email" placeholder="Nombre" color="primary" variant="outlined" />
  <Input v-model="email" type="email" placeholder="correo@ejemplo.com" variant="soft" />
  <Input type="number" disabled :model-value="42" />
</template>
```

## Escuchar cambios

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const nombre = ref("");

function onInput(valor: string) {
  console.log("Valor actual:", valor);
}
</script>

<template>
  <Input v-model="nombre" placeholder="Tu nombre" @update:model-value="onInput" />
</template>
```

## Reset

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref, useTemplateRef } from "vue";

const valor = ref("Texto inicial");
const campo = useTemplateRef("campo");
</script>

<template>
  <Input ref="campo" v-model="valor" />
  <button @click="campo?.reset()">Resetear</button>
</template>
```

## Tipos soportados

```vue
<template>
  <Input type="text" placeholder="Texto" />
  <Input type="password" placeholder="Contraseña" />
  <Input type="email" placeholder="correo@ejemplo.com" />
  <Input type="number" placeholder="0" />
  <Input type="tel" placeholder="+54 11 1234-5678" />
  <Input type="url" placeholder="https://..." />
  <Input type="search" placeholder="Buscar..." />
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder del input |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor (mientras el usuario escribe) |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value: string \| number)` | Asigna un valor |
| `.reset()` | Vuelve al `startValue` (o `""` si no se definió) |
| `.focus()` | Enfoca el input |
