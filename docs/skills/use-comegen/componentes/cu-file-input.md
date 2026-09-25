# `<cu-file-input>`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin directorio, con validación de tipo y tamaño.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuFileInput.umd.js"></script>

<cu-file-input placeholder="Elige un archivo..." color="primary"></cu-file-input>
<cu-file-input accept="image/*" variant="outlined" id="miInput"></cu-file-input>
<cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>

<script>
  const input = document.getElementById('miInput');
  input.addEventListener('update:modelValue', (e) => {
    console.log('Archivo:', e.detail?.name);
  });
  input.set(new File(['contenido'], 'ejemplo.txt'));
  console.log(input.get()?.name);
</script>
```

---

## Drag & drop

Soporta arrastrar un solo archivo sobre el componente. Durante el drag se ilumina el borde y fondo. Los directorios se descartan automáticamente (`size === 0 && !type`).

---

## Notas

- No soporta `multiple`, `directory` ni `directory-deep` — usá `<cu-file-input-zone>` para esos casos.
- Al hacer click en el nombre del archivo seleccionado se abre en una nueva pestaña.
- La validación por `accept` y `maxSize` se aplica tanto en el diálogo nativo como al soltar archivos por drag.

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import FileInput from "@/components/form/FileInput.vue";
import { ref } from "vue";

const archivo = ref<File | null>(null);

function onUpdate(file: File | null) {
  console.log("Archivo:", file?.name);
}
</script>

<template>
  <FileInput v-model="archivo" placeholder="Elige un archivo..." color="primary" />
  <FileInput
    v-model="archivo"
    accept="image/*"
    variant="outlined"
    @update:model-value="onUpdate"
  />
  <FileInput disabled placeholder="Deshabilitado" />
</template>
```

### Drag & drop

Soporta arrastrar un solo archivo sobre el componente. Durante el drag se ilumina el borde y fondo. Los directorios se descartan automáticamente (`size === 0 && !type`).

### Notas

- No soporta `multiple`, `directory` ni `directory-deep` — usá `<cu-file-input-zone>` para esos casos.
- Al hacer click en el nombre del archivo seleccionado se abre en una nueva pestaña.
- La validación por `accept` y `maxSize` se aplica tanto en el diálogo nativo como al soltar archivos por drag.

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `File \| null` | `null` | Archivo seleccionado (vía JS, no HTML) |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"outlined"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `disabled` | `boolean` | — | Deshabilita click, drag y drop |
| `readOnly` | `boolean` | — | Modo solo lectura |
| `accept` | `string` | — | Tipos aceptados (ej: `"image/*"`, `".pdf,.doc"`) |
| `maxSize` | `number` | — | Tamaño máximo en bytes |

> **Atributos en HTML:** `readOnly` se escribe como `readonly`, `maxSize` como `max-size`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `null` | Se emite al seleccionar, soltar o limpiar un archivo |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el `File` actual o `null` |
| `.set(val: File \| null)` | Asigna un archivo programáticamente |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el input |
| `.trigger()` | Abre el diálogo nativo de selección de archivos |
