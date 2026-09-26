---
title: CopyButton
group: Buttons
---

# `CopyButton`

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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `text` | `string` | — | Texto que se copia al portapapeles. |
| `label` | `string` | `""` | Etiqueta visible junto al ícono de copiar. |
| `copiedLabel` | `string` | `"Copiado"` | Etiqueta que reemplaza a `label` durante la confirmación de copia. |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del botón. |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"soft"` | Variante visual del botón. |

## Eventos

Ninguno.

## Slots

Ninguno.

## Métodos expuestos

Ninguno.
