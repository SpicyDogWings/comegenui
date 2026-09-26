---
title: Table
group: Datos
---

# `Table`

## Uso en Vue

```vue
<script setup lang="ts">
import Table from "@/components/data/Table.vue";
// props: columns, data, rowDisabled, footer
</script>

<template>
  <Table color="neutral" variant="soft">
    Table
  </Table>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `columns` | `Column[]` | `[]` |  |
| `data` | `Record<string, any>[]` | `[]` |  |
| `empty` | `string` | `"No hay datos que mostrar"` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` |  |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` |  |
| `loading` | `boolean` | `false` |  |
| `maxHeight` | `string` | `""` |  |
| `rowDisabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` |  |
| `htmlCells` | `boolean` | `false` |  |
| `footer` | `FooterRow[]` | `[]` |  |
| `compact` | `boolean` | `false` |  |

## Eventos

Ninguno.

## Slots

| Slot | Descripción |
|------|------|
| `template` | Fila completa custom; scoped: { row, rowIndex, columns, getCellValue }. |
| `empty` |  |
| `footer` |  |

## Métodos expuestos

Ninguno.

## Interfaces

### `Column`

```ts
interface Column {
  key: string;
  label?: string;
  width?: string;
  align?: "left" | "center" | "right";
}
```

### `FooterCell`

```ts
interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}
```

### `FooterRow`

```ts
interface FooterRow {
  cells: FooterCell[];
}
```
