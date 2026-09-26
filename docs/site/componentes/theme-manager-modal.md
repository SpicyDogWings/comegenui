---
title: ThemeManagerModal
group: Theme
---

# `ThemeManagerModal`

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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `themeName` | `string` | — | Nombre del tema que se está editando. |
| `cssOutput` | `string` | — | CSS generado del tema, para previsualizar y exportar. |

## Eventos

| Evento | Payload | Descripción |
|------|------|------|
| `reset` | — |  |
| `update:themeName` | `value: string` |  |
| `import` | `config: ThemeConfig` |  |
| `export` | — |  |
| `copy-css` | — |  |
| `download-css` | — |  |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el modal. |
| `.close()` | Cierra el modal. |

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
