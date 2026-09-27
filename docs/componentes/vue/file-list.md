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
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `maxHeight` | `string` | `""` | — |
| `disabled` | `boolean` | `false` | — |
| `files` | `any` | `null` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | `number` | — |
| `remove` | `number` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
