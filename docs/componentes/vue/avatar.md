# `Avatar`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";
</script>

<template>
  <Avatar initials="JP" color="primary" />
  <Avatar initials="MR" color="success" size="lg" />
  <Avatar initials="CD" size="sm" />
</template>
```

## Tamaños

```vue
<template>
  <Avatar initials="A" size="sm" />
  <Avatar initials="A" size="md" />
  <Avatar initials="A" size="lg" />
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `src` | `string` | `""` | — |
| `initials` | `string` | `""` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
