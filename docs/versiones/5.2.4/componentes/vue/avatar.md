[← Volver](../README.md)

# `Avatar`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

## Uso en Vue

```vue
<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";
</script>

<template>
  <Avatar initials="JP" color="primary" />
</template>
```

En HTML plano, cargá el bundle `CuAvatar` (ver [ficha vanilla](/componentes/cu-avatar)).

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`). **Sin `color`**, el avatar elige un color estable a partir de un hash de las iniciales (mismo texto → mismo color).

```vue
<template>
  <Avatar initials="pr" color="primary" size="lg" />
  <Avatar initials="se" color="secondary" size="lg" />
  <Avatar initials="ne" color="neutral" size="lg" />
  <Avatar initials="su" color="success" size="lg" />
  <Avatar initials="wa" color="warning" size="lg" />
  <Avatar initials="da" color="danger" size="lg" />

  <!-- Sin color: elegido por hash de las iniciales -->
  <Avatar initials="AP" size="lg" />
  <Avatar initials="MR" size="lg" />
  <Avatar initials="CD" size="lg" />
</template>
```

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el diámetro y el tamaño de las iniciales.

```vue
<template>
  <Avatar initials="A" size="sm" />
  <Avatar initials="A" size="md" />
  <Avatar initials="A" size="lg" />
</template>
```

## Contenido

Con `initials` el avatar muestra ese texto. Sin `initials` ni `src`, el contenido es el slot `default`: cualquier marcado (un `<svg>`, por ejemplo) hereda el color de texto del avatar con `stroke="currentColor"`. Se ve **una sola cosa** a la vez: si hay `src` o `initials`, el slot no se renderiza.

```vue
<template>
  <Avatar color="success" size="lg">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </Avatar>
  <Avatar color="primary" size="lg">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a6 6 0 0 1 16 0v2" />
    </svg>
  </Avatar>
</template>
```

## Con imagen

`src` reemplaza a las iniciales por una imagen recortada en círculo. Si la imagen **no carga**
(404, host caído, URL vencida), el avatar vuelve a las iniciales —o al slot— en vez de quedar como
un círculo vacío; cambiar `src` vuelve a intentar la carga.

```vue
<template>
  <Avatar src="https://example.com/foto.jpg" size="sm" />
  <Avatar src="https://example.com/foto.jpg" size="md" />
  <Avatar src="https://example.com/foto.jpg" size="lg" />
</template>
```

## Accesibilidad

- El fondo sale de `--cu-color-{color}-solid` y el texto de `--cu-color-{color}-solid-text` (el polo
  negro/blanco de máximo contraste): el generador garantiza **≥ 4.5:1** en los 15 temas. Un color
  fuera del set cae al que elige el hash de las iniciales.
- Las iniciales largas se recortan dentro del círculo (`overflow: hidden`): no se derraman sobre
  el contenido de al lado.
- La imagen usa `alt=""` (es decorativa). Si el avatar identifica a una persona y no hay un nombre
  en texto al lado, agregá `aria-label` al elemento que envuelve al avatar.

## Props

<!--@include: ../../partials/avatar/props-vue.md-->

## Emits

<!--@include: ../../partials/avatar/eventos.md-->

## Slots

<!--@include: ../../partials/avatar/slots.md-->

## Expose

<!--@include: ../../partials/avatar/metodos.md-->
