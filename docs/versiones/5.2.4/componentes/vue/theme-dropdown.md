[← Volver](../README.md)

# `ThemeDropdown`

Selector de tema del sitio: un botón con el tema activo que abre un panel con buscador y la lista
de temas disponibles. No recibe props ni emite eventos: lee y escribe el tema en el store global.

## Uso en Vue

```vue
<script setup lang="ts">
import ThemeDropdown from "@/components/theme/ThemeDropdown.vue";
</script>

<template>
  <ThemeDropdown />
</template>
```

## Comportamiento

- El botón muestra el nombre del tema activo (capitalizado) y una flecha que gira al abrir.
- El buscador filtra la lista de temas cargados de forma case-insensitive.
- Cada item lleva un punto con el color del tema y un check en el activo; al elegir uno llama a
  `store.setTheme(name)` y cierra el panel.

## Props

<!--@include: ../../partials/theme-dropdown/props.md-->

## Emits

<!--@include: ../../partials/theme-dropdown/eventos.md-->

## Slots

<!--@include: ../../partials/theme-dropdown/slots.md-->

## Expose

<!--@include: ../../partials/theme-dropdown/metodos.md-->
