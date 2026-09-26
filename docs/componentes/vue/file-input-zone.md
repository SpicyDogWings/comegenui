# `FileInputZone`

Selector de archivos con zona de drag & drop amplia, soporte para carpetas (recursivo con control de profundidad), múltiples archivos y preview de lista.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import FileInputZone from "@/components/form/FileInputZone.vue";
import { ref } from "vue";

const archivos = ref<File | File[] | null>(null);

function onUpdate(files: File | File[] | null) {
  if (Array.isArray(files)) {
    console.log(`${files.length} archivos seleccionados`);
  }
}
</script>

<template>
  <!-- Básico -->
  <FileInputZone v-model="archivos" placeholder="Arrastra un archivo" />

  <!-- Múltiple + imágenes -->
  <FileInputZone
    v-model="archivos"
    color="primary"
    multiple
    accept="image/*"
    placeholder="Subí tus imágenes"
  />

  <!-- Carpeta con scroll -->
  <FileInputZone
    v-model="archivos"
    directory
    max-height="200px"
    placeholder="Carpeta de documentos"
    @update:model-value="onUpdate"
  />
</template>
```

## Directorio recursivo

Con `directory` activo, se puede controlar la profundidad con `directory-deep`:

| `directory-deep` | Archivos que entran |
|-----------------|-------------------|
| `0` (default) | Solo archivos directos de la carpeta raíz |
| `1` | Raíz + 1 subnivel |
| `5` | Hasta 5 subniveles |
| `-1` | Sin límite (recursión completa) |

El listado de archivos se renderiza con `<cu-file-list>` (componente interno) que muestra icono por extensión, nombre, tamaño y botón X para quitar archivos individuales. Al hacer click en un archivo se abre en una nueva pestaña.

## Notas

- `directory` activa automáticamente `multiple` internamente.
- Los directorios (archivos con `size === 0 && !type`) se filtran automáticamente.
- Con `max-height` activo, el listado tiene scroll vertical cuando excede esa altura.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `disabled` | `boolean` | `false` | — |
| `maxHeight` | `string` | `""` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `"Selecciona un archivo o arrastra aquí"` | — |
| `multiple` | `boolean` | `false` | — |
| `directory` | `boolean` | `false` | — |
| `directoryDeep` | `number` | `0` | — |
| `maxSize` | `number` | `—` | — |
| `accept` | `string` | `—` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \\| File[] \\| null` | — |
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
| `trigger` | — |
<!-- /@api:expose -->
