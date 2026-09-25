# `<cu-input>`

Input de texto con color, variante, tipos de input HTML5 y métodos `get`/`set`/`reset`.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuInput.umd.js"></script>

<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com" variant="soft" id="email"></cu-input>
<cu-input type="number" disabled value="42"></cu-input>

<script>
  const input = document.getElementById('email');
  input.set('usuario@dominio.com');
  console.log(input.get());
  input.focus();
</script>
```

---

## Escuchar cambios

```html
<cu-input id="nombre" placeholder="Tu nombre"></cu-input>

<script>
  document.getElementById('nombre').addEventListener('update:modelValue', (e) => {
    console.log('Valor actual:', e.detail);
  });
</script>
```

---

## Reset

```html
<cu-input id="campo" start-value="Texto inicial" value="Texto inicial"></cu-input>

<button onclick="document.getElementById('campo').reset()">Resetear</button>
```

---

## Tipos soportados

```html
<cu-input type="text" placeholder="Texto"></cu-input>
<cu-input type="password" placeholder="Contraseña"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
<cu-input type="number" placeholder="0"></cu-input>
<cu-input type="tel" placeholder="+54 11 1234-5678"></cu-input>
<cu-input type="url" placeholder="https://..."></cu-input>
<cu-input type="search" placeholder="Buscar..."></cu-input>
```

---

## Vista Vue

### Uso en Vue

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

### Escuchar cambios

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

### Reset

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

### Tipos soportados

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

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `type` | `"text" \| "password" \| "email" \| "number" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder del input |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del input (sm \| md \| lg). |
| `modelValue` | `string` | `""` | Valor controlado |

> **Atributos en HTML:** `readOnly` se escribe como `readonly` (convención HTML). Ej.: `<cu-input readonly>`

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor (mientras el usuario escribe) |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. Podés escucharlos con `addEventListener`, pero no se re-emiten como eventos custom (no hay `input`/`change` propios en el Custom Element).

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual del input. |
| `.set(newValue: string \| number)` | Setea el valor del input. |
| `.reset()` | Limpia el input. |
| `.focus()` | Enfoca el input. |
