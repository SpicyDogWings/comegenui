[← Volver](../README.md)

# `Card`

Tarjeta para mostrar información agrupada con jerarquía visual: media, header (título + subtítulo), contenido y footer. Componente de presentación: no emite eventos ni expone métodos.

## Uso en Vue

```vue
<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Card title="Resumen" subtitle="Último corte" color="primary">
    Contenido principal de la tarjeta.
    <template #footer>
      <Button color="primary" variant="soft">Ver más</Button>
    </template>
  </Card>
</template>
```

En HTML plano, cargá el bundle `CuCard` (ver [ficha vanilla](/componentes/cu-card)).

## Variantes visuales

`variant` decide el aspecto: `ghost` (**default**; superficie + sombra), `outlined` (solo borde), `soft` (fondo tenue), `subtle` (tenue con borde) y `solid` (relleno con el color).

```vue
<template>
  <Card title="Ghost">ghost (default)</Card>
  <Card title="Outlined" variant="outlined" color="primary">outlined</Card>
  <Card title="Soft" variant="soft" color="primary">soft</Card>
  <Card title="Subtle" variant="subtle" color="primary">subtle</Card>
  <Card title="Solid" variant="solid" color="primary">solid</Card>
</template>
```

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`). Se ve en las variantes que usan el color de fondo (`soft`, `subtle`, `solid`) y en el borde de `outlined`; `ghost` no lo usa.

```vue
<template>
  <Card title="primary" color="primary" variant="solid">Contenido de la tarjeta.</Card>
  <Card title="secondary" color="secondary" variant="solid">Contenido de la tarjeta.</Card>
  <Card title="neutral" color="neutral" variant="solid">Contenido de la tarjeta.</Card>
  <Card title="success" color="success" variant="solid">Contenido de la tarjeta.</Card>
  <Card title="warning" color="warning" variant="solid">Contenido de la tarjeta.</Card>
  <Card title="danger" color="danger" variant="solid">Contenido de la tarjeta.</Card>
</template>
```

## Con imagen

`image` agrega la media arriba del cuerpo (o al costado con `layout="horizontal"`). El slot `media` tiene prioridad sobre `image`.

```vue
<template>
  <Card
    title="Proyecto"
    subtitle="Equipo de desarrollo"
    image="https://example.com/cover.jpg"
    color="success"
  >
    Descripción del proyecto.
  </Card>
</template>
```

## Layout horizontal

`layout` acepta `vertical` (**default**; media arriba) u `horizontal` (media al costado, contenido a la derecha).

```vue
<template>
  <Card layout="horizontal" title="Perfil" subtitle="Información del usuario" image="https://example.com/avatar.jpg">
    Datos del perfil.
  </Card>
</template>
```

## Slots custom

El contenido va por el slot `default`; los slots `media`, `header` y `footer` reemplazan la media, el header (título/subtítulo) y el pie. Si hay slot `header`, tiene prioridad sobre `title`/`subtitle`.

```vue
<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Card color="neutral">
    <template #media>
      <img src="https://example.com/banner.jpg" alt="Banner" style="width:100%;display:block" />
    </template>
    <h3 style="margin:0">Título custom</h3>
    <p style="margin:0">Contenido.</p>
    <template #footer>
      <Badge color="success" variant="solid">Activo</Badge>
    </template>
  </Card>
</template>
```

## Props

<!--@include: ../../partials/card/props-vue.md-->

## Emits

<!--@include: ../../partials/card/eventos-vue.md-->

## Slots

<!--@include: ../../partials/card/slots-vue.md-->

## Expose

<!--@include: ../../partials/card/metodos.md-->
