# `ThemeManagerModal`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import ThemeManagerModal from "@/components/theme/ThemeManagerModal.vue";
</script>

<template>
  <ThemeManagerModal themeName="…" cssOutput="…">
    ThemeManagerModal
  </ThemeManagerModal>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `themeName` | `string` | `—` | Nombre del tema que se está editando. |
| `cssOutput` | `string` | `—` | CSS generado del tema, para previsualizar y exportar. |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `reset` | `` | — |
| `update:themeName` | `string` | — |
| `import` | `ThemeConfig` | — |
| `export` | `` | — |
| `copy-css` | `` | — |
| `download-css` | `` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
<!-- /@api:expose -->

## Interfaces

### `ThemeConfig`

```ts
interface ThemeConfig {
  themes: Record<string, Record<string, string>>
  typography: Record<string, any>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: { color: string }
  borders: { width: Record<string, string>, color: Record<string, string> }
}
```
