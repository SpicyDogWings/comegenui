[← Volver](../README.md)

# `Skeleton`

Placeholder de carga: ocupa el lugar del contenido mientras llega, con la forma y el tamaño del
bloque que va a reemplazar. Es **decorativo** (`aria-hidden="true"`): no emite eventos, no expone
métodos y no tiene slots. Se usa dentro de una tarjeta, una lista o una fila para que el layout no
salte cuando aparecen los datos.

## Uso en Vue

```vue
<script setup lang="ts">
import Skeleton from "@/components/information/Skeleton.vue";
</script>

<template>
  <Skeleton width="60%" height="2rem" />
</template>
```

En HTML plano, cargá el bundle `CuSkeleton` (ver [ficha vanilla](/componentes/cu-skeleton)).

## Forma

`shape` decide qué se dibuja:

- `rect` (**default**): un bloque; por defecto ocupa el 100 % del ancho y `1rem` de alto.
- `circle`: un avatar; por defecto `40px` × `40px` con radio `full`.
- `text`: líneas de texto; ver [`lines`](#lineas-de-texto).

```vue
<Skeleton shape="rect" height="2rem" />
<Skeleton shape="circle" />
<Skeleton shape="text" :lines="3" />
```

## Tamaño

`width` y `height` aceptan cualquier medida CSS (`100%`, `48px`, `12rem`, `1.5em`). Si se omiten,
cada `shape` usa su default; pasarlos pisa ese default sin tocar el resto de la forma.

```vue
<Skeleton width="100%" height="1rem" />
<Skeleton shape="circle" width="56px" height="56px" />
```

## Líneas de texto

Con `shape="text"`, `lines` indica cuántas barras se apilan (default `1`). La **última** queda al
60 % del ancho, como el final de un párrafo; con una sola línea no se acorta. En `rect` y `circle`
`lines` se ignora.

```vue
<Skeleton shape="text" :lines="3" />
```

## Card completa

Combinando formas y tamaños se arma el esqueleto de una tarjeta real: media, título, tres líneas y
una fila de acciones. Los bloques no reservan espacio por sí solos: el layout que los contiene
(gaps, padding) es el que define la separación.

## Animación

`animation` controla el movimiento:

- `pulse` (**default**): la opacidad sube y baja.
- `wave`: un brillo (`--cu-color-{color}-subtle`) barre el bloque.
- `none`: estático.

Con `prefers-reduced-motion: reduce` en el sistema operativo, `pulse` y `wave` **no animan**.

```vue
<Skeleton animation="pulse" height="2rem" />
<Skeleton animation="wave" height="2rem" />
<Skeleton animation="none" height="2rem" />
```

## Color y radio

`color` es un nombre semántico, no un hex: el fondo sale de `--cu-color-{color}-soft` y el brillo
de `wave` de `--cu-color-{color}-subtle`, así que se adapta al tema activo. `radius` acepta
`none`, `sm`, `md`, `lg` y `full`; vacío usa el default de la forma (`rect` → `md`,
`circle` → `full`, `text` → `sm`).

```vue
<Skeleton color="primary" width="4rem" />
<Skeleton color="success" radius="lg" width="4rem" />
```

## Accesibilidad

- El root lleva siempre `aria-hidden="true"`: es un placeholder visual, no contenido.
- No anuncia el estado de carga. Si hace falta, agregá el texto o el `role="status"` en el
  contenedor que envuelve al esqueleto.
- Con `prefers-reduced-motion: reduce` no hay animación.

El componente no emite eventos ni expone métodos: el estado es sólo visual.

## Props

<!--@include: ../../partials/skeleton/props.md-->

## Emits

<!--@include: ../../partials/skeleton/eventos.md-->

## Slots

<!--@include: ../../partials/skeleton/slots.md-->

## Expose

<!--@include: ../../partials/skeleton/metodos.md-->
