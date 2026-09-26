# `Badge`

Etiqueta o badge pequeño para estados, categorías o metadata. Componente de presentación pura: no emite eventos ni expone métodos.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Badge color="primary" variant="solid">Nuevo</Badge>
  <Badge color="success" variant="soft">Activo</Badge>
  <Badge color="warning" variant="outlined">Pendiente</Badge>
  <Badge color="danger" variant="subtle">Error</Badge>
</template>
```

## Variantes visuales

```vue
<template>
  <Badge color="primary" variant="solid">solid</Badge>
  <Badge color="primary" variant="outlined">outlined</Badge>
  <Badge color="primary" variant="soft">soft</Badge>
  <Badge color="primary" variant="ghost">ghost</Badge>
  <Badge color="primary" variant="subtle">subtle</Badge>
</template>
```

## Con ícono

```vue
<template>
  <Badge color="success" variant="soft">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    Verificado
  </Badge>
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |

## Emits

Ninguno.

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido textual o ícono del badge |

## Expose

Ninguno.
