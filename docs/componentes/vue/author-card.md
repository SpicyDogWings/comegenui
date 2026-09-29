# `AuthorCard`

Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre y rol. Componente de presentación: no emite eventos ni expone métodos.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";
</script>

<template>
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" />
  <AuthorCard name="Marcos Ruiz" color="success" size="lg" />
</template>
```

## Con imagen

```vue
<template>
  <AuthorCard
    name="Laura Gómez"
    role="Diseñadora"
    src="https://example.com/avatar.jpg"
  />
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `role` | `string` | `""` | — |
| `src` | `string` | `""` | — |
| `name` | `string` | `—` | — |
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
