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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `code` | `string` | — |  |
| `language` | `string` | `""` |  |
| `variant` | `string` | `"default"` |  |
| `lineNumbers` | `boolean` | `false` |  |

## Emits

Ninguno.

## Slots

Ninguno.

## Expose

Ninguno.
