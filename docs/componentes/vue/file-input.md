# `FileInput`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin directorio, con validación de tipo y tamaño.

[← Volver](../README.md)

---

## Uso en Vue

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

## Drag & drop

Soporta arrastrar un solo archivo sobre el componente. Durante el drag se ilumina el borde y fondo. Los directorios se descartan automáticamente (`size === 0 && !type`).

## Notas

- No soporta `multiple`, `directory` ni `directory-deep` — usá `<cu-file-input-zone>` para esos casos.
- Al hacer click en el nombre del archivo seleccionado se abre en una nueva pestaña.
- La validación por `accept` y `maxSize` se aplica tanto en el diálogo nativo como al soltar archivos por drag.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `"Seleccionar archivo"` | — |
| `maxSize` | `number` | `—` | — |
| `accept` | `string` | `—` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \| null` | — |
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
| `trigger` | Abre el selector de archivos. |
<!-- /@api:expose -->
