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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `files` | `any` | `null` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` |  |
| `disabled` | `boolean` | `false` |  |
| `maxHeight` | `string` | `""` |  |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
|------|------|------|
| `select` | `index: number` |  |
| `remove` | `index: number` |  |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
Ninguno.
<!-- /@api:expose -->
