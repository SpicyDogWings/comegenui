[← Volver](../README.md)

# `Table`

Tabla de datos con columnas y filas por props: color y variante, estado de carga y vacío, filas
deshabilitadas, celdas con HTML, footer programático y slots por celda.

## Uso en Vue

```vue
<script setup lang="ts">
import Table from "@/components/data/Table.vue";

const columns = [
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "precio", label: "Precio", align: "right", width: "120px" },
];

const data = [
  { producto: "Teclado mecánico", stock: 24, precio: 89.9 },
  { producto: 'Monitor 27"', stock: 6, precio: 249.0 },
];
</script>

<template>
  <Table :columns="columns" :data="data" />
</template>
```

Si omitís `columns`, se derivan de las claves del primer objeto de `data`.

## Colores

`color` es un nombre semántico, no un hex: tiñe el header y el hover de las filas con los tokens
del tema activo.

```vue
<Table :columns="columns" :data="data" color="primary" />
<Table :columns="columns" :data="data" color="secondary" />
<Table :columns="columns" :data="data" color="neutral" />
<Table :columns="columns" :data="data" color="success" />
<Table :columns="columns" :data="data" color="warning" />
<Table :columns="columns" :data="data" color="danger" />
```

## Variantes

`variant` decide el aspecto del header: `solid` (color pleno), `outlined` (con borde), `soft`
(fondo tenue y **default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<Table :columns="columns" :data="data" variant="solid" />
<Table :columns="columns" :data="data" variant="outlined" />
<Table :columns="columns" :data="data" variant="soft" />
<Table :columns="columns" :data="data" variant="ghost" />
<Table :columns="columns" :data="data" variant="subtle" />
```

## Carga

Con `loading` en `true` aparece un `Loader` arriba de la tabla y las filas se atenúan sin recibir
clicks mientras dura la carga.

```vue
<Table :columns="columns" :data="data" loading />
```

## Vacío

Si `data` está vacía se muestra el texto de `empty` (por defecto `"No hay datos que mostrar"`), o el
contenido del slot `empty` si lo pasás.

```vue
<Table :columns="columns" :data="[]" empty="No hay registros para esta consulta" />
```

## Compacto y alto máximo

`compact` achica el padding de las celdas; `maxHeight` fija el alto del área de scroll y el header
queda fijo (sticky).

```vue
<Table :columns="columns" :data="data" compact max-height="240px" />
```

## Filas deshabilitadas

`rowDisabled` acepta un booleano (deshabilita todas las filas) o una función que decide por fila.

```vue
<Table :columns="columns" :data="data" :row-disabled="true" />
<Table :columns="columns" :data="data" :row-disabled="(row) => row.stock === 0" />
```

## Celdas con HTML

Con `htmlCells`, el valor de cada celda se renderiza con `v-html` en vez de como texto plano.

```vue
<Table :columns="columns" :data="data" html-cells />
```

> El HTML sale de tus datos: no lo actives con datos que no controlás.

## Footer

La prop `footer` agrega filas de pie (totales, notas) sin usar el slot.

```vue
<Table
  :columns="columns"
  :data="data"
  :footer="[
    { cells: [{ value: 'Total', colspan: 1 }, { value: '$745.50', align: 'right' }] },
    { cells: [{ value: '* Precios sin IVA', colspan: 2 }] },
  ]"
/>
```

## Contenido personalizado

Slots: `header-{key}` y `cell-{key}` para una columna, `template` para la fila completa, y `empty` /
`footer` para reemplazar el vacío y el pie.

```vue
<Table :columns="columns" :data="data">
  <template #header-precio="{ column }">
    <strong>{{ column.label }} ($)</strong>
  </template>
  <template #cell-stock="{ value }">
    <span :style="{ color: value === 0 ? 'var(--cu-color-danger)' : 'inherit' }">{{ value }}</span>
  </template>
  <template #empty>
    <p>No hay productos cargados.</p>
  </template>
</Table>
```

## Props

<!--@include: ../../partials/table/props.md-->

## Emits

<!--@include: ../../partials/table/eventos.md-->

## Slots

<!--@include: ../../partials/table/slots.md-->

## Expose

<!--@include: ../../partials/table/metodos.md-->

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
