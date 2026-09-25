# `<cu-textarea>`

Área de texto multilínea con color, variante, control de filas y opción de deshabilitar el redimensionado.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuTextarea.umd.js"></script>

<cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
<cu-textarea no-resize variant="soft" id="comentarios"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');
  ta.set('Texto predefinido');
  console.log(ta.get());
</script>
```

---

## Escuchar cambios

```html
<cu-textarea id="bio" placeholder="Biografía"></cu-textarea>

<script>
  document.getElementById('bio').addEventListener('update:modelValue', (e) => {
    console.log('Bio:', e.detail);
  });
</script>
```

---

## Reset

```html
<cu-textarea id="notas" start-value="Plantilla inicial">Plantilla inicial</cu-textarea>

<button onclick="document.getElementById('notas').reset()">Restaurar plantilla</button>
```

---

## Deshabilitar redimensionado

```html
<cu-textarea no-resize placeholder="Tamaño fijo" rows="4"></cu-textarea>
```

Útil cuando querés controlar el alto de forma externa (con CSS o de manera responsiva).

---

## Vista Vue

### Uso en Vue

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

### Escuchar cambios

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

### Reset

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

### Deshabilitar redimensionado

```vue
<template>
  <Textarea no-resize placeholder="Tamaño fijo" rows="4" />
</template>
```

Útil cuando querés controlar el alto de forma externa (con CSS o de manera responsiva).

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | — | Placeholder del textarea |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `noResize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

> **Atributos en HTML:** `readOnly` → `readonly`, `noResize` → `no-resize`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom.

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value: string \| number)` | Asigna un valor |
| `.reset()` | Vuelve al `startValue` (o `""` si no se definió) |
| `.focus()` | Enfoca el textarea |
