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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del input (sm \| md \| lg). |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
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
| `focus` | Enfoca el input. |
<!-- /@api:expose -->
