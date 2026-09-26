# `FileList`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import FileList from "@/components/FileList.vue/FileList.vue";
</script>

<template>
  <FileList color="neutral">
    FileList
  </FileList>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `files` | `any` | `null` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` |  |
| `disabled` | `boolean` | `false` |  |
| `maxHeight` | `string` | `""` |  |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `select` | `index: number` |  |
| `remove` | `index: number` |  |

## Slots

Ninguno.

## Expose

Ninguno.
