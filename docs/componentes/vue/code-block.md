# `CodeBlock`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";
</script>

<template>
  <CodeBlock code="…">
    CodeBlock
  </CodeBlock>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `variant` | `string` | `'default'` | — |
| `language` | `string` | `''` | — |
| `lineNumbers` | `boolean` | `false` | — |
| `code` | `string` | `—` | — |
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
