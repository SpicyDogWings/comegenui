[← Volver](../README.md)

# `Badge`

Etiqueta pequeña para estados, categorías o metadata. `color` define el color semántico,
`variant` el aspecto y el slot `default` el contenido (texto, un ícono o los dos).

Es de presentación pura: no emite eventos ni expone métodos.

## Uso en Vue

```vue
<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Badge color="primary" variant="soft">Nuevo</Badge>
</template>
```

En HTML plano, cargá el bundle `CuBadge` (ver [ficha vanilla](/componentes/cu-badge)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```vue
<Badge color="primary" variant="soft">primary</Badge>
<Badge color="secondary" variant="soft">secondary</Badge>
<Badge color="neutral" variant="soft">neutral</Badge>
<Badge color="success" variant="soft">success</Badge>
<Badge color="warning" variant="soft">warning</Badge>
<Badge color="danger" variant="soft">danger</Badge>
```

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue y el
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<Badge color="primary" variant="solid">solid</Badge>
<Badge color="primary" variant="outlined">outlined</Badge>
<Badge color="primary" variant="soft">soft</Badge>
<Badge color="primary" variant="ghost">ghost</Badge>
<Badge color="primary" variant="subtle">subtle</Badge>
```

## Contenido

El contenido va por el slot `default`: texto, un `<svg>` inline, o los dos. No hay prop ni
slot `icon` — el ícono es el mismo marcado del slot, así que hereda el color del badge con
`stroke="currentColor"`.

```vue
<Badge color="neutral" variant="outlined">Sólo texto</Badge>

<Badge color="success" variant="soft">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Verificado
</Badge>

<Badge color="primary" variant="solid" aria-label="Nuevo">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
</Badge>
```

> Un badge sin texto necesita `aria-label` para no quedar sin nombre accesible.

## Props

<!--@include: ../../partials/badge/props.md-->

## Emits

<!--@include: ../../partials/badge/eventos.md-->

## Slots

<!--@include: ../../partials/badge/slots.md-->

## Expose

<!--@include: ../../partials/badge/metodos.md-->
