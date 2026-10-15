[← Volver](../README.md)

# `EditableTableCell`

Celda editable para tablas: muestra el valor con un lápiz y, al hacer click, renderiza el editor de la columna. El editor sale de `column.inputType` y puede ir desde un `input` hasta un `select`, un `date` o un `switch`. Es interna: la usan `<Table>` y `<AdvancedTable>`.

## Uso en Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ nombre: "Juan Pérez" });
const column = {
  key: "nombre",
  label: "Nombre",
  editable: true,
  inputType: "input",
  singleClick: true,
};
const validation = ref<{ success: boolean; error: string | null }>({ success: false, error: null });

function onSave(e: any) {
  row.value.nombre = e.value;
  validation.value = { success: true, error: null };
}
</script>

<template>
  <EditableTableCell
    :value="row.nombre"
    :row="row"
    :column="column"
    :index="0"
    :validation="validation"
    @edit-save="onSave"
  />
</template>
```

> `value`, `row`, `column`, `index` y `validation` son obligatorias: la celda no adivina la fila ni el valor, los recibe del `<Table>`.

## Editores

`column.inputType` elige el editor: `input`, `textarea`, `select`, `autocomplete`, `date` o `switch`. Cada uno acepta su propio sub-objeto de configuración (`input`, `textarea`, `select`, `autocomplete`, `date`, `switch`) y, si no hay `inputType`, cae a `input`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({
  nombre: "Ana Torres",
  descripcion: "Cliente mayorista con envío mensual.",
  rol: "admin",
  ciudad: "Buenos Aires",
  fecha: "2026-03-15",
  activo: true,
});

// Un editor por inputType soportado.
const fields = [
  { key: "nombre", label: "input", column: { key: "nombre", editable: true, inputType: "input", singleClick: true } },
  {
    key: "descripcion",
    label: "textarea",
    column: { key: "descripcion", editable: true, inputType: "textarea", singleClick: true, textarea: { rows: 2 } },
  },
  {
    key: "rol",
    label: "select",
    column: {
      key: "rol",
      editable: true,
      inputType: "select",
      singleClick: true,
      selectOptions: [
        { value: "admin", label: "Administrador" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Visor" },
      ],
    },
  },
  {
    key: "ciudad",
    label: "autocomplete",
    column: {
      key: "ciudad",
      editable: true,
      inputType: "autocomplete",
      singleClick: true,
      autocompleteItems: [
        { label: "Buenos Aires", value: "Buenos Aires" },
        { label: "Córdoba", value: "Córdoba" },
        { label: "Rosario", value: "Rosario" },
      ],
    },
  },
  {
    key: "fecha",
    label: "date",
    column: { key: "fecha", editable: true, inputType: "date", singleClick: true, date: { format: "dd/MM/yyyy" } },
  },
  {
    key: "activo",
    label: "switch",
    column: { key: "activo", editable: true, inputType: "switch", switch: { size: "sm", color: "success" } },
  },
];

function onSave(e: any) {
  row.value[e.column.key] = e.value;
}
</script>

<template>
  <EditableTableCell
    v-for="field in fields"
    :key="field.key"
    :value="(row as any)[field.key]"
    :row="row"
    :column="field.column"
    :index="0"
    :validation="{ success: false, error: null }"
    @edit-save="onSave"
  />
</template>
```

> `switch` es el único editor que se renderiza siempre (no tiene modo lápiz): guarda el booleano directo con `edit-save`. `date` guarda el valor como `"YYYY-MM-DD"` y lo muestra formateado con `column.date.format`.

## Modo lápiz e inline

Por defecto la celda muestra el valor con un lápiz y se edita con un click (`column.singleClick`, con `false` pasa a doble click). Con `column.inlineEdit: true` (por columna, tiene prioridad) o `inlineEdit` en la celda, el editor queda siempre visible, sin lápiz.

```vue
<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ nombre: "Luis Gómez", rol: "editor" });

const nombreColumn = { key: "nombre", editable: true, inputType: "input", inlineEdit: true };
const rolColumn = {
  key: "rol",
  editable: true,
  inputType: "select",
  inlineEdit: true,
  selectOptions: [
    { value: "admin", label: "Administrador" },
    { value: "editor", label: "Editor" },
  ],
};
</script>

<template>
  <EditableTableCell :value="row.nombre" :row="row" :column="nombreColumn" :index="0" :inline-edit="true" :validation="{ success: false, error: null }" />
  <EditableTableCell :value="row.rol" :row="row" :column="rolColumn" :index="0" :inline-edit="true" :validation="{ success: false, error: null }" />

  <!-- Sólo doble click para editar -->
  <EditableTableCell :value="row.nombre" :row="row" :column="{ ...nombreColumn, singleClick: false }" :index="0" :validation="{ success: false, error: null }" />
</template>
```

## Validación

`column.editable` puede ser un `RegExp` (el valor debe matchear) o una función `(row) => boolean`; `column.validator` agrega una validación `(value, row) => boolean`. Si algo falla, la celda emite `edit-error` y no guarda. El prop `validation` (`{ success, error }`) pinta el lápiz de verde o rojo y fuerza el color `danger` del editor cuando hay error.

```vue
<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ precio: "1200.50" });
const column = { key: "precio", editable: /^\d+\.\d{2}$/, inputType: "input", singleClick: true };
const validation = ref<{ success: boolean; error: string | null }>({ success: false, error: null });

function onSave(e: any) {
  row.value.precio = e.value;
  validation.value = { success: true, error: null };
}
function onError() {
  validation.value = { success: false, error: "Formato inválido" };
}
</script>

<template>
  <EditableTableCell
    :value="row.precio"
    :row="row"
    :column="column"
    :index="0"
    :validation="validation"
    @edit-save="onSave"
    @edit-error="onError"
  />
</template>
```

## Alineación

`column.align` alinea el contenido (`left`, `center`, `right`) y `column.editorAlign` el editor dentro de la celda (`start`, `center`, `end`); sin `editorAlign`, el `switch` queda centrado y el resto sigue al `align`. `column.width` fija el ancho de la celda.

```vue
<script setup lang="ts">
const column = {
  key: "activo",
  editable: true,
  inputType: "switch",
  editorAlign: "end",
  align: "right",
  width: "120px",
  switch: { size: "md" },
};
</script>

<template>
  <EditableTableCell :value="true" :row="row" :column="column" :index="0" :validation="{ success: false, error: null }" />
</template>
```

## Color y variante

`color` y `variant` son el default del editor; `column.color` / `column.variant` los pisan, y cada sub-objeto (`input`, `textarea`, `select`, `date`…) puede definir los suyos (y aceptar una función `(row) => valor`).

```vue
<script setup lang="ts">
const column = {
  key: "email",
  editable: true,
  inputType: "input",
  color: "neutral",
  variant: "ghost",
  input: { color: "primary", variant: "soft" },
};
</script>

<template>
  <!-- Con error de validación el editor pasa a color danger -->
  <EditableTableCell color="primary" variant="soft" :value="row.email" :row="row" :column="column" :index="0" :validation="validation" />
</template>
```

## Estados

`disabled` deshabilita la edición de la celda (atenúa el contenido y no muestra editor). A nivel de columna, `editable` como función `(row) => boolean` habilita la edición sólo en las filas que cumplen la condición.

```vue
<script setup lang="ts">
const column = {
  key: "nombre",
  editable: (row: Record<string, any>) => row.rol === "admin",
  inputType: "input",
  singleClick: true,
};
</script>

<template>
  <EditableTableCell disabled :value="row.nombre" :row="row" :column="column" :index="0" :validation="{ success: false, error: null }" />
</template>
```

## Interacción

`edit-start` avisa cuando la celda entra en edición, `edit-save` cuando el valor pasa la validación (o cuando el campo pierde foco, con `{ row, column, value, index }`), `edit-cancel` con Escape y `edit-error` cuando el valor no valida.

```vue
<script setup lang="ts">
function onStart(e: any) { console.log("edit-start", e.column.key, e.index); }
function onSave(e: any) { console.log("edit-save", e.value); }
function onCancel(e: any) { console.log("edit-cancel", e.column.key); }
function onError(e: any) { console.log("edit-error", e.value); }
</script>

<template>
  <EditableTableCell
    :value="row.nombre"
    :row="row"
    :column="column"
    :index="0"
    :validation="validation"
    @edit-start="onStart"
    @edit-save="onSave"
    @edit-cancel="onCancel"
    @edit-error="onError"
  />
</template>
```

## Props

<!--@include: ../../partials/editable-table-cell/props.md-->

## Emits

<!--@include: ../../partials/editable-table-cell/eventos.md-->

## Slots

<!--@include: ../../partials/editable-table-cell/slots.md-->

## Expose

<!--@include: ../../partials/editable-table-cell/metodos.md-->

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
