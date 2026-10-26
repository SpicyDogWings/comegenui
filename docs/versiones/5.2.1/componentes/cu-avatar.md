[← Volver](../README.md)

# `<cu-avatar>`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuAvatar.umd.js"></script>

<cu-avatar initials="JP" color="primary"></cu-avatar>
```

En Vue, importá `Avatar` de `@/components/information/Avatar.vue` (ver [ficha Vue](/componentes/vue/avatar)).

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`). **Sin `color`**, el avatar elige un color estable a partir de un hash de las iniciales (mismo texto → mismo color).

```html
<cu-avatar initials="pr" color="primary" size="lg"></cu-avatar>
<cu-avatar initials="se" color="secondary" size="lg"></cu-avatar>
<cu-avatar initials="ne" color="neutral" size="lg"></cu-avatar>
<cu-avatar initials="su" color="success" size="lg"></cu-avatar>
<cu-avatar initials="wa" color="warning" size="lg"></cu-avatar>
<cu-avatar initials="da" color="danger" size="lg"></cu-avatar>

<!-- Sin color: elegido por hash de las iniciales -->
<cu-avatar initials="AP" size="lg"></cu-avatar>
<cu-avatar initials="MR" size="lg"></cu-avatar>
<cu-avatar initials="CD" size="lg"></cu-avatar>
```

<!-- demo:avatar-colores -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el diámetro y el tamaño de las iniciales.

```html
<cu-avatar initials="A" size="sm"></cu-avatar>
<cu-avatar initials="A" size="md"></cu-avatar>
<cu-avatar initials="A" size="lg"></cu-avatar>
```

<!-- demo:avatar-tamanos -->

## Contenido

Con `initials` el avatar muestra ese texto. Sin `initials` ni `src`, el contenido es el slot `default`: cualquier marcado (un `<svg>`, por ejemplo) hereda el color de texto del avatar con `stroke="currentColor"`.

```html
<cu-avatar color="success" size="lg">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
</cu-avatar>
<cu-avatar color="primary" size="lg">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-2a6 6 0 0 1 16 0v2" />
  </svg>
</cu-avatar>
```

<!-- demo:avatar-contenido -->

## Con imagen

`src` reemplaza a las iniciales por una imagen recortada en círculo.

```html
<cu-avatar src="https://example.com/foto.jpg" size="sm"></cu-avatar>
<cu-avatar src="https://example.com/foto.jpg" size="md"></cu-avatar>
<cu-avatar src="https://example.com/foto.jpg" size="lg"></cu-avatar>
```

<!-- demo:avatar-con-imagen -->

## Atributos

<!--@include: ../partials/avatar/props-vanilla.md-->

## Eventos

<!--@include: ../partials/avatar/eventos.md-->

## Slots

<!--@include: ../partials/avatar/slots.md-->

## Métodos expuestos

<!--@include: ../partials/avatar/metodos.md-->
