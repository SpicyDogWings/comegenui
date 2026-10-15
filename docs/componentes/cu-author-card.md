[← Volver](../README.md)

# `<cu-author-card>`

Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre y rol. Componente de presentación: no emite eventos ni expone métodos.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuAuthorCard.umd.js"></script>

<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary"></cu-author-card>
```

En Vue, importá `AuthorCard` de `@/components/information/AuthorCard.vue` (ver [ficha Vue](/componentes/vue/author-card)).

## Colores

`color` pinta el avatar que genera `name`; es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que se resuelve con los tokens del tema activo.

```html
<cu-author-card name="Ana Pérez" role="Rol del autor" color="primary"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Rol del autor" color="secondary"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Rol del autor" color="neutral"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Rol del autor" color="success"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Rol del autor" color="warning"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Rol del autor" color="danger"></cu-author-card>
```

<!-- demo:author-card-colores -->

## Tamaños

`size` se propaga al avatar interno: `sm`, `md` (**default**) y `lg`. No cambia el nombre ni el rol.

```html
<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary" size="sm"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary" size="md"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary" size="lg"></cu-author-card>
```

<!-- demo:author-card-tamanos -->

## Nombre y rol

`name` es obligatorio y genera las iniciales del avatar (primera letra del primer y último nombre). `role` es opcional: si está vacío, no se renderiza.

```html
<cu-author-card name="Ana Pérez"></cu-author-card>
<cu-author-card name="Ana Pérez" role="Desarrolladora"></cu-author-card>
<cu-author-card name="Ana"></cu-author-card>
```

<!-- demo:author-card-nombre-rol -->

## Con imagen

`src` reemplaza las iniciales generadas de `name` por una imagen.

```html
<cu-author-card
  name="Laura Gómez"
  role="Diseñadora"
  src="https://example.com/avatar.jpg"
></cu-author-card>
```

<!-- demo:author-card-con-imagen -->

## Atributos

<!--@include: ../partials/author-card/props-vanilla.md-->

## Eventos

<!--@include: ../partials/author-card/eventos.md-->

## Slots

<!--@include: ../partials/author-card/slots.md-->

## Métodos expuestos

<!--@include: ../partials/author-card/metodos.md-->
