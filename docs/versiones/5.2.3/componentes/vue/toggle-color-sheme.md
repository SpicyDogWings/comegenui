[← Volver](../README.md)

# `ToggleColorSheme`

Botón que alterna el tema claro/oscuro del store global. Muestra un sol cuando el tema activo es
oscuro y una luna cuando es claro; no recibe contenido ni emite eventos propios.

## Uso en Vue

```vue
<script setup lang="ts">
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
</script>

<template>
  <ToggleColorSheme variant="ghost" :size="20" />
</template>
```

## Variantes

`variant` se pasa tal cual al `Button` interno: las 7 variantes del botón.

```vue
<ToggleColorSheme variant="solid" />
<ToggleColorSheme variant="outlined" />
<ToggleColorSheme variant="soft" />
<ToggleColorSheme variant="ghost" />
<ToggleColorSheme variant="subtle" />
<ToggleColorSheme variant="link" />
<ToggleColorSheme variant="none" />
```

## Tamaños

`size` es el tamaño del ícono en px (ancho y alto); por defecto `20`.

```vue
<ToggleColorSheme :size="16" variant="outlined" />
<ToggleColorSheme :size="24" variant="outlined" />
<ToggleColorSheme :size="32" variant="outlined" />
<ToggleColorSheme :size="40" variant="outlined" />
```

## Props

<!--@include: ../../partials/toggle-color-sheme/props.md-->

## Emits

<!--@include: ../../partials/toggle-color-sheme/eventos.md-->

## Slots

<!--@include: ../../partials/toggle-color-sheme/slots.md-->

## Expose

<!--@include: ../../partials/toggle-color-sheme/metodos.md-->
