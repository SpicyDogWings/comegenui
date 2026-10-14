[← Volver](../README.md)

# `ThemeManagerModal`

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
| `reset` | — | Restablece el tema a sus valores por defecto. |
| `update:themeName` | `string` | Actualiza el nombre del tema. |
| `import` | `ThemeConfig` | Importa una configuración de tema desde JSON. |
| `export` | — | Exporta la configuración actual del tema. |
| `copy-css` | — | Copia el CSS generado al portapapeles. |
| `download-css` | — | Descarga el CSS generado como archivo. |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el modal. |
| `close` | Cierra el modal. |
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
