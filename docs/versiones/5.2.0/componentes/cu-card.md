[← Volver](../README.md)

# `<cu-card>`

Tarjeta para mostrar información agrupada con jerarquía visual: media, header (título + subtítulo), contenido y footer. Componente de presentación: no emite eventos ni expone métodos.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuCard.umd.js"></script>

<cu-card title="Resumen" subtitle="Último corte" color="primary">
  Contenido principal de la tarjeta.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Ver más</cu-button>
  </div>
</cu-card>
```

En Vue, importá `Card` de `@/components/information/Card.vue` (ver [ficha Vue](/componentes/vue/card)).

## Variantes visuales

`variant` decide el aspecto: `ghost` (**default**; superficie + sombra), `outlined` (solo borde), `soft` (fondo tenue), `subtle` (tenue con borde) y `solid` (relleno con el color).

```html
<cu-card title="Ghost">ghost (default)</cu-card>
<cu-card title="Outlined" variant="outlined" color="primary">outlined</cu-card>
<cu-card title="Soft" variant="soft" color="primary">soft</cu-card>
<cu-card title="Subtle" variant="subtle" color="primary">subtle</cu-card>
<cu-card title="Solid" variant="solid" color="primary">solid</cu-card>
```

<!-- demo:card-variantes -->

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`). Se ve en las variantes que usan el color de fondo (`soft`, `subtle`, `solid`) y en el borde de `outlined`; `ghost` no lo usa.

```html
<cu-card title="primary" color="primary" variant="solid">Contenido de la tarjeta.</cu-card>
<cu-card title="secondary" color="secondary" variant="solid">Contenido de la tarjeta.</cu-card>
<cu-card title="neutral" color="neutral" variant="solid">Contenido de la tarjeta.</cu-card>
<cu-card title="success" color="success" variant="solid">Contenido de la tarjeta.</cu-card>
<cu-card title="warning" color="warning" variant="solid">Contenido de la tarjeta.</cu-card>
<cu-card title="danger" color="danger" variant="solid">Contenido de la tarjeta.</cu-card>
```

<!-- demo:card-colores -->

## Con imagen

`image` agrega la media arriba del cuerpo (o al costado con `layout="horizontal"`). El slot `media` tiene prioridad sobre `image`.

```html
<cu-card
  title="Proyecto"
  subtitle="Equipo de desarrollo"
  image="https://example.com/cover.jpg"
  color="success"
>
  Descripción del proyecto.
</cu-card>
```

<!-- demo:card-con-imagen -->

## Layout horizontal

`layout` acepta `vertical` (**default**; media arriba) u `horizontal` (media al costado, contenido a la derecha). Si no hay media (ni `image` ni slot `media`), la tarjeta ocupa todo el ancho y no queda la columna vacía del 40 %.

```html
<cu-card layout="horizontal" title="Perfil" subtitle="Información del usuario" image="https://example.com/avatar.jpg">
  Datos del perfil.
</cu-card>
```

<!-- demo:card-layout-horizontal -->

El slot `media` también funciona en horizontal, y pisa a `image`:

```html
<cu-card layout="horizontal" color="primary" variant="outlined">
  <div slot="media">
    <img src="https://example.com/avatar.jpg" alt="Perfil" />
  </div>
  <h3>Título custom</h3>
  <p>El slot media reemplaza a image.</p>
  <div slot="footer">
    <cu-badge color="success" variant="solid">Activo</cu-badge>
  </div>
</cu-card>
```

<!-- demo:card-slots-media-horizontal -->

## Slots custom

El contenido va por el slot `default`; los slots `media`, `header` y `footer` reemplazan la media, el header (título/subtítulo) y el pie. Si hay slot `header`, tiene prioridad sobre `title`/`subtitle`. Los bloques sin contenido no ocupan lugar, también en el custom element (donde el contenido de los slots vive en el light DOM).

```html
<cu-card color="neutral">
  <div slot="media">
    <img src="https://example.com/banner.jpg" alt="Banner" style="width:100%;display:block" />
  </div>
  <h3 style="margin:0">Título custom</h3>
  <p style="margin:0">Contenido.</p>
  <div slot="footer">
    <cu-badge color="success" variant="solid">Activo</cu-badge>
  </div>
</cu-card>
```

<!-- demo:card-slots-custom -->

## Atributos

<!--@include: ../partials/card/props-vanilla.md-->

## Eventos

<!--@include: ../partials/card/eventos-vanilla.md-->

## Slots

<!--@include: ../partials/card/slots-vanilla.md-->

## Métodos expuestos

<!--@include: ../partials/card/metodos.md-->
