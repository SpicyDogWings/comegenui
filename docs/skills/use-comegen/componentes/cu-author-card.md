# `<cu-author-card>`

Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre y rol. Componente de presentación: no emite eventos ni expone métodos.

[← Volver](../SKILL.md)

---

## Uso en HTML plano

```html
<script src="dist/CuAuthorCard.umd.js"></script>

<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary"></cu-author-card>
<cu-author-card name="Marcos Ruiz" color="success" size="lg"></cu-author-card>
```

---

## Con imagen

```html
<cu-author-card
  name="Laura Gómez"
  role="Diseñadora"
  src="https://example.com/avatar.jpg"
></cu-author-card>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";
</script>

<template>
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" />
  <AuthorCard name="Marcos Ruiz" color="success" size="lg" />
</template>
```

### Con imagen

```vue
<template>
  <AuthorCard
    name="Laura Gómez"
    role="Diseñadora"
    src="https://example.com/avatar.jpg"
  />
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `name` | `string` | — | Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) |
| `role` | `string` | `""` | Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) |
| `color` | `string` | `""` | Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `string` | `"md"` | Tamaño del avatar: `sm`, `md`, `lg` |
| `src` | `string` | `""` | URL de la imagen del avatar (reemplaza las iniciales) |

## Eventos

Ninguno.

## Slots

Ninguno.

## Métodos expuestos

Ninguno.
