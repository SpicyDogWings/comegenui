[← Volver](../README.md)

# `<cu-loader>`

Barra de progreso indeterminada: un barrido infinito (`loading`) o un enfriamiento que se
consume una vez (`cooldown`). La barra mide 3 px de alto. Es un elemento **decorativo**: no emite
eventos, no expone métodos y no tiene slots. El host es `position: relative`, así que la barra se ancla a él y
se superpone al contenido que sigue.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuLoader.umd.js"></script>

<cu-loader></cu-loader>
```

<!-- demo:loader-uso -->

El host mide 0 de alto: la barra se dibuja sobre el borde superior del contenido siguiente. Si
necesitás reservar espacio (por ejemplo, dentro de una tarjeta), dale alto al host o envolvelo en
un contenedor con `position: relative` y alto propio.

En Vue, importá `Loader` de `@/components/information/Loader.vue` (ver
[ficha Vue](/componentes/vue/loader)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}`).

```html
<cu-loader color="primary"></cu-loader>
<cu-loader color="secondary"></cu-loader>
<cu-loader color="neutral"></cu-loader>
<cu-loader color="success"></cu-loader>
<cu-loader color="warning"></cu-loader>
<cu-loader color="danger"></cu-loader>
```

<!-- demo:loader-colores -->

## Animaciones

`animation` acepta `loading` (barrido infinito, **default**) y `cooldown` (barra que se agota una
vez). `delay` sólo afecta a `cooldown`: son los milisegundos que tarda en vaciarse.

```html
<cu-loader animation="loading" color="primary"></cu-loader>
<cu-loader animation="cooldown" delay="3000" color="success"></cu-loader>
```

<!-- demo:loader-animaciones -->

> `cooldown` se agota una sola vez: para repetirlo hay que remontar el elemento (quitarlo y
> volver a insertarlo).

## Accesibilidad

- Es un indicador visual: no anuncia el estado de carga por sí solo. Si hace falta, agregá el
  texto o el `role="status"` en el contenedor que envuelve al loader.
- No emite eventos, no expone métodos y no tiene slots.

## Atributos

<!--@include: ../partials/loader/props-vanilla.md-->

## Eventos

<!--@include: ../partials/loader/eventos.md-->

## Slots

<!--@include: ../partials/loader/slots.md-->

## Métodos expuestos

<!--@include: ../partials/loader/metodos.md-->
