// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de EditableTableCell.vue.
// Eventos detectados: edit-start, edit-save, edit-cancel, edit-error

import EditableTableCell from "@/components/data/EditableTableCell.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuEditableTableCellStories: ComponentStory = {
  component: "cu-editable-table-cell",
  vue: EditableTableCell,
  tokens: [
    "--cu-color-danger",
    "--cu-color-success",
    "--cu-space-sm"
  ],
  classes: [
    "cu-editable-cell",
    "cu-editable-cell--disabled",
    "cu-editable-cell--error",
    "cu-editable-cell--success",
    "cu-editable-cell-icon",
    "cu-editable-cell-input",
    "cu-editable-cell-view",
    "cu-editable-cell-view--disabled"
  ],
  api: {
    "components": [
      {
        "label": "Input",
        "path": "/playground/components/input"
      },
      {
        "label": "Textarea",
        "path": "/playground/components/textarea"
      },
      {
        "label": "Select",
        "path": "/playground/components/select"
      },
      {
        "label": "Autocomplete",
        "path": "/playground/components/autocomplete"
      },
      {
        "label": "DatePicker",
        "path": "/playground/components/date-picker"
      },
      {
        "label": "Switch",
        "path": "/playground/components/switch"
      }
    ],
    "props": [
      {
        "name": "value",
        "type": "string | number | boolean",
        "description": "Valor actual de la celda."
      },
      {
        "name": "row",
        "type": "Record<string, any>",
        "description": "Fila completa a la que pertenece la celda."
      },
      {
        "name": "column",
        "type": "Column",
        "description": "Configuración de la columna: editor, validación y alineación."
      },
      {
        "name": "index",
        "type": "number",
        "description": "Índice de la fila en los datos."
      },
      {
        "name": "color",
        "type": "string",
        "default": "neutral",
        "description": "Color semántico del editor."
      },
      {
        "name": "variant",
        "type": "string",
        "default": "ghost",
        "description": "Variante visual del editor."
      },
      {
        "name": "validation",
        "type": "{ success: boolean; error: string | null }",
        "description": "Estado de validación: success y mensaje de error."
      },
      {
        "name": "inlineEdit",
        "type": "boolean",
        "default": "false",
        "description": "Muestra el editor directo en toda la tabla, sin lápiz."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita la edición de la celda."
      }
    ],
    "events": [
      {
        "name": "edit-start",
        "type": "() => void",
        "description": "Se inicia la edición de la celda."
      },
      {
        "name": "edit-save",
        "type": "() => void",
        "description": "Se guarda el nuevo valor de la celda."
      },
      {
        "name": "edit-cancel",
        "type": "() => void",
        "description": "Se cancela la edición de la celda."
      },
      {
        "name": "edit-error",
        "type": "() => void",
        "description": "El valor no pasa la validación de la columna."
      }
    ],
    "interfaceCode": `interface AutocompleteItem {
    label: string;
    value?: string;
    icon?: string;
  }
  
  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    color?: string;
    variant?: string;
  }
  
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
  }`
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", props: {"value":"Ada Lovelace","row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
      ],
      vue: `  <EditableTableCell value="Ada Lovelace" row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: edit-start, edit-save, edit-cancel, edit-error.
        ],
      },
    },

    {
      id: "value",
      title: "Value",
      variants: [
        { id: "false", props: {"value":false,"row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
        { id: "true", props: {"value":true,"row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
      ],
      vue: `  <EditableTableCell row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>
  <EditableTableCell value row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: edit-start, edit-save, edit-cancel, edit-error.
        ],
      },
    },

    {
      id: "inline-edit",
      title: "InlineEdit",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"inlineEdit":false,"value":"Ada Lovelace","row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
        { id: "true", props: {"inlineEdit":true,"value":"Ada Lovelace","row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
      ],
      vue: `  <EditableTableCell value="Ada Lovelace" row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>
  <EditableTableCell inline-edit value="Ada Lovelace" row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: edit-start, edit-save, edit-cancel, edit-error.
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"disabled":false,"value":"Ada Lovelace","row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
        { id: "true", props: {"disabled":true,"value":"Ada Lovelace","row":{"name":"Ada Lovelace","email":"ada@example.com"},"column":{"key":"name","label":"Nombre","editable":true},"index":0,"validation":{"success":true,"error":null}} },
      ],
      vue: `  <EditableTableCell value="Ada Lovelace" row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>
  <EditableTableCell disabled value="Ada Lovelace" row="[object Object]" column="[object Object]" :index="0" validation="[object Object]"></EditableTableCell>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: edit-start, edit-save, edit-cancel, edit-error.
        ],
      },
    },
  ],
};
