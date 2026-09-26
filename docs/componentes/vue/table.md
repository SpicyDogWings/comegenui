# `Table`

[← Volver](../README.md)

---

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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `columns` | `Column[]` | `[]` | — |
| `data` | `Record<string, any>[]` | `[]` | — |
| `empty` | `string` | `"No hay datos que mostrar"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `loading` | `boolean` | `false` | — |
| `rowDisabled` | `boolean \| ((row: Record<string, any>) => boolean)` | `false` | — |
| `footer` | `FooterRow[]` | `[]` | — |
| `compact` | `boolean` | `false` | — |
| `maxHeight` | `string` | `""` | — |
| `htmlCells` | `boolean` | `false` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `template` | — |
| `empty` | — |
| `footer` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->

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
