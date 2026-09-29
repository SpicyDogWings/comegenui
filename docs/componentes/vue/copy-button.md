# `CopyButton`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
</script>

<template>
  <CopyButton text="…" color="neutral" variant="soft">
    CopyButton
  </CopyButton>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del botón. |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"soft"` | Variante visual del botón. |
| `label` | `string` | `""` | Etiqueta visible junto al ícono de copiar. |
| `copiedLabel` | `string` | `"Copiado"` | Etiqueta que reemplaza a `label` durante la confirmación de copia. |
| `text` | `string` | `—` | Texto que se copia al portapapeles. |
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
