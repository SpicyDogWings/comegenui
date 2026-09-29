# `InlineRenderer`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import InlineRenderer from "@/components/markdown/InlineRenderer.vue";
// props: tokens
</script>

<template>
  <InlineRenderer>
    InlineRenderer
  </InlineRenderer>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `tokens` | `any[]` | `—` | Tokens inline de marked a renderizar. |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
