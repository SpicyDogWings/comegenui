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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `name` | `string` | — | Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) |
| `role` | `string` | `""` | Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del avatar: `sm`, `md`, `lg` |
| `src` | `string` | `""` | URL de la imagen del avatar (reemplaza las iniciales) |

## Emits

Ninguno.

## Slots

Ninguno.

## Expose

Ninguno.
