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

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `items` | `NavItem[]` | — | Items del menú. |
| `search` | `boolean` | `false` | Habilita el buscador de items. |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder del buscador. |
| `searchMode` | `string` | `"filter"` | Modo de búsqueda: filter (filtra items) o scroll (resalta y desplaza). |
| `searchFields` | `string[]` | `[]` | Campos sobre los que busca el filtro. |
| `compact` | `boolean` | `false` | Modo compacto: solo iconos o la inicial. |
| `compactable` | `boolean` | `false` | Muestra el botón para compactar y expandir. |
| `collapsed` | `boolean` | `false` | Inicia los submenús colapsados. |
| `trigger` | `"click" \| "hover"` | `"click"` | Disparador de los submenús: click o hover. |
| `activePath` | `string` | `""` | Path activo para resaltar el item correspondiente. |
| `highlightTarget` | `NavItem \| null` | `null` | Item a resaltar por búsqueda en modo scroll. |
| `activeItem` | `NavItem \| null` | `null` | Item activo según la ruta actual. |
| `query` | `string` | `""` | Texto de búsqueda (v-model:query). |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:query` | `value: string` |  |
| `toggle-compact` | — |  |

## Slots

Ninguno.

## Expose

Ninguno.
