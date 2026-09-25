# `<cu-checkbox>`

Checkbox con label, controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuCheckbox.umd.js"></script>

<cu-checkbox label="Acepto los términos" color="primary"></cu-checkbox>
<cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>

<script>
  const chk = document.querySelector('cu-checkbox');
  chk.set(true);
  console.log(chk.get()); // true
</script>
```

---

## Escuchar cambios

Hay dos formas equivalentes de escuchar cambios:

```html
<cu-checkbox label="Notificaciones" id="notif"></cu-checkbox>

<script>
  const cb = document.getElementById('notif');

  // Vía update:modelValue (convención Vue)
  cb.addEventListener('update:modelValue', (e) => {
    console.log('Valor:', e.detail);
  });

  // Vía change (payload = boolean)
  cb.addEventListener('change', (e) => {
    console.log('Cambió a:', e.detail);
  });
</script>
```

---

## Control programático

```html
<cu-checkbox id="auto" label="Acepto"></cu-checkbox>

<script>
  const cb = document.getElementById('auto');
  cb.set(true);     // marcar
  cb.set(false);    // desmarcar
  cb.reset();       // equivale a cb.set(false)
  cb.focus();       // foco
  console.log(cb.get()); // estado actual
</script>
```

---

## Vista Vue

### Uso en Vue

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

### Escuchar cambios

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

### Control programático

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

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | Estado del checkbox (controlado) |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `string` | `"md"` | Tamaño del checkbox: `sm`, `md` |
| `disabled` | `boolean` | — | Estado deshabilitado |
| `label` | `string` | — | Texto visible junto al checkbox |

> El Custom Element **no expone** una prop `checked` separada (el control se hace únicamente con `modelValue`), ni una prop `variant` (el estilo se fija con `size` y `color`).

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `boolean` | Se emite cuando cambia el estado |
| `change` | `boolean` | Se emite en cada cambio, útil para listeners simples |

## Slots

Ninguno (el texto se pasa via `label`).

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el estado actual (`boolean`) |
| `.set(val: boolean)` | Asigna el estado (programáticamente) |
| `.reset()` | Pone el estado en `false` |
| `.focus()` | Enfoca el checkbox |
