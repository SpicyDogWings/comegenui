[← Volver](../README.md)

# `CopyButton`

Botón que copia `text` al portapapeles y confirma con un tilde + etiqueta temporal (`copiedLabel`) durante ~2 segundos. Es un componente **sólo Vue**: no tiene custom element.

## Uso en Vue

```vue
<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
</script>

<template>
  <CopyButton text="Contenido copiado al portapapeles" label="Copiar" />
  <CopyButton text="https://ejemplo.com" label="Copiar URL" color="primary" variant="solid" />
</template>
```

## Colores

`color` es un nombre semántico, no un hex. Los 6 valores son `primary`, `secondary`,
`neutral` (**default**), `success`, `warning` y `danger`.

```vue
<template>
  <CopyButton text="primary" label="primary" color="primary" variant="solid" />
  <CopyButton text="secondary" label="secondary" color="secondary" variant="solid" />
  <CopyButton text="neutral" label="neutral" color="neutral" variant="solid" />
  <CopyButton text="success" label="success" color="success" variant="solid" />
  <CopyButton text="warning" label="warning" color="warning" variant="solid" />
  <CopyButton text="danger" label="danger" color="danger" variant="solid" />
</template>
```

## Variantes

`variant` acepta las 7 variantes del botón: `solid`, `outlined`, `soft` (**default**),
`ghost`, `subtle`, `link` y `none`.

```vue
<template>
  <CopyButton text="solid" label="solid" color="primary" variant="solid" />
  <CopyButton text="outlined" label="outlined" color="primary" variant="outlined" />
  <CopyButton text="soft" label="soft" color="primary" variant="soft" />
  <CopyButton text="ghost" label="ghost" color="primary" variant="ghost" />
  <CopyButton text="subtle" label="subtle" color="primary" variant="subtle" />
  <CopyButton text="link" label="link" color="primary" variant="link" />
  <CopyButton text="none" label="none" color="primary" variant="none" />
</template>
```

## Etiquetas

`label` es el texto visible junto al ícono (opcional: sin él queda solo el ícono).
`copiedLabel` reemplaza a `label` durante la confirmación de copia (default `"Copiado"`).

```vue
<template>
  <CopyButton text="Solo ícono" />
  <CopyButton text="Con label" label="Copiar código" />
  <CopyButton text="Personalizado" label="Copiar" copied-label="¡Listo!" color="success" variant="solid" />
</template>
```

## Props

<!--@include: ../../partials/copy-button/props.md-->

## Emits

<!--@include: ../../partials/copy-button/eventos.md-->

## Slots

<!--@include: ../../partials/copy-button/slots.md-->

## Expose

<!--@include: ../../partials/copy-button/metodos.md-->
