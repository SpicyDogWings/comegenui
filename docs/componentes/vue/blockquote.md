[← Volver](../README.md)

# `Blockquote`

Cita en bloque con un borde izquierdo del color semántico elegido. Se usa como el `<blockquote>` de HTML: el contenido va por el slot `default` o, si preferís pasar HTML crudo, por la prop `html`.

## Uso en Vue

```vue
<script setup lang="ts">
import Blockquote from "@/components/markdown/Blockquote.vue";
</script>

<template>
  <Blockquote>
    Blockquote
  </Blockquote>
</template>
```

Es un componente sólo Vue: no tiene custom element ni ficha vanilla.

## Colores

`color` pinta el borde izquierdo; es un nombre semántico (`primary` —default—, `secondary`, `neutral`, `success`, `warning`, `danger`).

```vue
<template>
  <Blockquote color="primary">Cita con color <code>primary</code>; el borde izquierdo toma el color semántico.</Blockquote>
  <Blockquote color="secondary">Cita con color <code>secondary</code>; el borde izquierdo toma el color semántico.</Blockquote>
  <Blockquote color="neutral">Cita con color <code>neutral</code>; el borde izquierdo toma el color semántico.</Blockquote>
  <Blockquote color="success">Cita con color <code>success</code>; el borde izquierdo toma el color semántico.</Blockquote>
  <Blockquote color="warning">Cita con color <code>warning</code>; el borde izquierdo toma el color semántico.</Blockquote>
  <Blockquote color="danger">Cita con color <code>danger</code>; el borde izquierdo toma el color semántico.</Blockquote>
</template>
```

## Contenido: slot o `html`

Por defecto el contenido es el slot `default`. Con la prop `html` se renderiza HTML crudo (`v-html`), que **tiene prioridad sobre el slot**.

```vue
<script setup lang="ts">
import Blockquote from "@/components/markdown/Blockquote.vue";

const html = "<p>Versión con <strong>html</strong> y <em>etiquetas</em>.</p>";
</script>

<template>
  <!-- Slot default: el contenido se escribe como hijos. -->
  <Blockquote color="primary">Versión con slot (texto plano).</Blockquote>

  <!-- Prop `html`: tiene prioridad sobre el slot. -->
  <Blockquote color="secondary" :html="html" />
</template>
```

## Props

<!--@include: ../../partials/blockquote/props.md-->

## Emits

<!--@include: ../../partials/blockquote/eventos.md-->

## Slots

<!--@include: ../../partials/blockquote/slots.md-->

## Expose

<!--@include: ../../partials/blockquote/metodos.md-->
