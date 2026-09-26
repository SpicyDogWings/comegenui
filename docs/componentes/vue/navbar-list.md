# `NavbarList`

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import NavbarList from "@/components/navigation/NavbarList.vue";
// props: items, searchFields
</script>

<template>
  <NavbarList trigger="click">
    NavbarList
  </NavbarList>
</template>
```

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `trigger` | `"click" \| "hover"` | `'click'` | Disparador de los submenús: click o hover. |
| `searchPlaceholder` | `string` | `'Buscar...'` | Placeholder del buscador. |
| `searchFields` | `string[]` | `[]` | Campos sobre los que busca el filtro. |
| `compact` | `boolean` | `false` | Modo compacto: solo iconos o la inicial. |
| `search` | `boolean` | `false` | Habilita el buscador de items. |
| `searchMode` | `string` | `'filter'` | Modo de búsqueda: filter (filtra items) o scroll (resalta y desplaza). |
| `activePath` | `string` | `''` | Path activo para resaltar el item correspondiente. |
| `compactable` | `boolean` | `false` | Muestra el botón para compactar y expandir. |
| `collapsed` | `boolean` | `false` | Inicia los submenús colapsados. |
| `highlightTarget` | `NavItem \| null` | `null` | Item a resaltar por búsqueda en modo scroll. |
| `activeItem` | `NavItem \| null` | `null` | Item activo según la ruta actual. |
| `items` | `NavItem[]` | `—` | Items del menú. |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:query` | `string` | — |
| `toggle-compact` | `` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
