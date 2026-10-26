[← Volver](../README.md)

# `AuthorCard`

Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre y rol. Componente de presentación: no emite eventos ni expone métodos.

## Uso en Vue

```vue
<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";
</script>

<template>
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" />
</template>
```

En HTML plano, cargá el bundle `CuAuthorCard` (ver [ficha vanilla](/componentes/cu-author-card)).

## Colores

`color` pinta el avatar que genera `name`; es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que se resuelve con los tokens del tema activo.

```vue
<template>
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="primary" />
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="secondary" />
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="neutral" />
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="success" />
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="warning" />
  <AuthorCard name="Ana Pérez" role="Rol del autor" color="danger" />
</template>
```

## Tamaños

`size` se propaga al avatar interno: `sm`, `md` (**default**) y `lg`. No cambia el nombre ni el rol.

```vue
<template>
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" size="sm" />
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" size="md" />
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" size="lg" />
</template>
```

## Nombre y rol

`name` es obligatorio y genera las iniciales del avatar (primera letra del primer y último nombre). `role` es opcional: si está vacío, no se renderiza.

```vue
<template>
  <AuthorCard name="Ana Pérez" />
  <AuthorCard name="Ana Pérez" role="Desarrolladora" />
  <AuthorCard name="Ana" />
</template>
```

## Con imagen

`src` reemplaza las iniciales generadas de `name` por una imagen.

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

<!--@include: ../../partials/author-card/props-vue.md-->

## Emits

<!--@include: ../../partials/author-card/eventos.md-->

## Slots

<!--@include: ../../partials/author-card/slots.md-->

## Expose

<!--@include: ../../partials/author-card/metodos.md-->
