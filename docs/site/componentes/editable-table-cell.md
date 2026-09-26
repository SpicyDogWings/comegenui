---
title: EditableTableCell
group: Datos
---

# `EditableTableCell`

## Uso en Vue

```vue
<script setup lang="ts">
import EditableTableCell from "@/components/data/EditableTableCell.vue";
// props: row
</script>

<template>
  <EditableTableCell value="…" column="…" index="0" validation="{ success: false, error: null }">
    EditableTableCell
  </EditableTableCell>
</template>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `value` | `string \| number \| boolean` | — | Valor actual de la celda. |
| `row` | `Record<string, any>` | — | Fila completa a la que pertenece la celda. |
| `column` | `Column` | — | Configuración de la columna: editor, validación y alineación. |
| `index` | `number` | — | Índice de la fila en los datos. |
| `color` | `string` | `"neutral"` | Color semántico del editor. |
| `variant` | `string` | `"ghost"` | Variante visual del editor. |
| `validation` | `{ success: boolean; error: string \| null; }` | `{ success: false, error: null }` | Estado de validación: success y mensaje de error. |
| `inlineEdit` | `boolean` | `false` | Muestra el editor directo en toda la tabla, sin lápiz. |
| `disabled` | `boolean` | `false` | Deshabilita la edición de la celda. |

## Eventos

| Evento | Payload | Descripción |
|------|------|------|
| `edit-start` | — |  |
| `edit-save` | — |  |
| `edit-cancel` | — |  |
| `edit-error` | — |  |

## Slots

Ninguno.

## Métodos expuestos

Ninguno.

## Interfaces

### `AutocompleteItem`

```ts
interface AutocompleteItem {
  label: string;
  value?: string;
  icon?: string;
}
```

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}
```

### `Column`

```ts
interface Column {
  key: string;
  label?: string;
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";
  singleClick?: boolean;
  inlineEdit?: boolean; // Estado por columna: renderiza el editor directo
  width?: string;
  align?: "left" | "center" | "right";
  editorAlign?: "start" | "center" | "end"; // Alineación del editor en la celda (para celdas que no ocupan todo el ancho, ej. switch)

  color?: string;
  variant?: string;

  date?: {
    format?: string;
    min?: string | number | Date;
    max?: string | number | Date;
    yearNavigation?: boolean;
    disabledWeekdays?: number[] | string;
    disabledDates?: (string | Date)[] | string;
    color?: string;
    variant?: string;
    position?: string;
    align?: string;
    fixed?: boolean;
  };

  select?: {
    options: SelectOption[];
    color?: string;
    variant?: string;
    position?: string;
    align?: string;
    placeholderWrap?: boolean;
  };
  autocomplete?: {
    items: AutocompleteItem[];
    minChars?: number;
    color?: string;
    variant?: string;
  };
  textarea?: {
    rows?: number;
    noResize?: boolean;
    color?: string;
    variant?: string;
  };
  input?: {
    type?: string;
    startValue?: string;
    color?: string;
    variant?: string;
  };
  switch?: {
    size?: "sm" | "md";
    color?: string;
  };

  selectOptions?: SelectOption[] | ((row: Record<string, any>) => SelectOption[]);
  autocompleteItems?: AutocompleteItem[] | ((row: Record<string, any>) => AutocompleteItem[]);
}
```
