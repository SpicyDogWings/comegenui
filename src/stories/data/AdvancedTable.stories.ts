import AdvancedTable from "@/components/data/AdvancedTable.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./AdvancedTable.stories.extras";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "status", label: "Estado" },
];

const DATA = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Inactive" },
];

export const cuAdvancedTableStories: ComponentStory = {
  component: "cu-advanced-table",
  vue: AdvancedTable,
  tokens: [
    "--cu-color-surface",
    "--cu-space-2xl",
    "--cu-space-2xs",
    "--cu-space-lg",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-advanced-table",
    "cu-advanced-table-actions",
    "cu-advanced-table-actions-btn",
    "cu-advanced-table-cell-badges",
    "cu-advanced-table-cell-buttons",
    "cu-advanced-table-icon",
    "cu-advanced-table-pagination",
    "cu-advanced-table-search"
  ],
  subComponents: [
    {
      "label": "Table",
      "path": "/playground/components/table#style"
    },
    {
      "label": "Pagination",
      "path": "/playground/components/pagination#style"
    },
    {
      "label": "Input",
      "path": "/playground/components/input#style"
    },
    {
      "label": "Button",
      "path": "/playground/components/button#style"
    },
    {
      "label": "Badge",
      "path": "/playground/components/badge#style"
    },
    {
      "label": "DropdownMenu",
      "path": "/playground/components/dropdown-menu#style"
    }
  ],
  api: {
    "components": [
      {
        "label": "Table",
        "path": "/playground/components/table"
      },
      {
        "label": "Pagination",
        "path": "/playground/components/pagination"
      },
      {
        "label": "Input",
        "path": "/playground/components/input"
      },
      {
        "label": "EditableTableCell",
        "path": "/playground/components/editable-table-cell"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Badge",
        "path": "/playground/components/badge"
      },
      {
        "label": "DropdownMenu",
        "path": "/playground/components/dropdown-menu"
      }
    ],
    "props": [
      {
        "name": "theme",
        "type": "string",
        "default": "light"
      },
      {
        "name": "columns",
        "type": "Array as () => Column[]",
        "description": "Definición de columnas (ver Interfaces)"
      },
      {
        "name": "data",
        "type": "Array as () => Record<string",
        "description": "Filas: objetos key → valor"
      },
      {
        "name": "empty",
        "type": "string",
        "default": "No hay datos que mostrar",
        "description": "Mensaje sin datos"
      },
      {
        "name": "pagination",
        "type": "boolean",
        "default": "true",
        "description": "Paginación client-side"
      },
      {
        "name": "itemsPerPage",
        "type": "number",
        "default": "10",
        "description": "Items por página (v-model:items-per-page)"
      },
      {
        "name": "showPageSize",
        "type": "boolean",
        "default": "false",
        "description": "Select de items por página"
      },
      {
        "name": "pageSizeOptions",
        "type": "Array as () => number[]",
        "description": "Opciones del select"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle",
        "default": "soft",
        "description": "solid, outlined, soft, ghost, subtle"
      },
      {
        "name": "searchEnabled",
        "type": "boolean",
        "default": "false",
        "description": "Buscador sobre los datos"
      },
      {
        "name": "searchPlaceholder",
        "type": "string",
        "default": "Buscar...",
        "description": "Placeholder del buscador"
      },
      {
        "name": "searchFields",
        "type": "Array as () => string[]",
        "description": "Campos donde buscar (vacío = todos)"
      },
      {
        "name": "searchValue",
        "type": "string",
        "default": "",
        "description": "Valor inicial del buscador (v-model:search)"
      },
      {
        "name": "tableMaxHeight",
        "type": "string",
        "default": "",
        "description": "Altura máxima con scroll"
      },
      {
        "name": "filters",
        "type": "Object as () => Record<string",
        "description": "Filtros a aplicar sobre los datos"
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "description": "Muestra loader en el body"
      },
      {
        "name": "actions",
        "type": "Array as () => ButtonConfig[]",
        "description": "Acciones bajo la tabla"
      },
      {
        "name": "rowDisabled",
        "type": "[Boolean",
        "default": "false",
        "description": "Deshabilita filas completas"
      },
      {
        "name": "footer",
        "type": "Array as () => FooterRow[]",
        "description": "Filas de pie programáticas"
      },
      {
        "name": "compact",
        "type": "boolean",
        "default": "false",
        "description": "Densidad compacta"
      },
      {
        "name": "inlineEditing",
        "type": "boolean",
        "default": "false",
        "description": "Editores directos (sin lápiz) en todas las columnas editables"
      }
    ],
    "slots": [
      {
        "name": "default"
      },
      {
        "name": "toggle"
      },
      {
        "name": "search",
        "description": "Buscador custom (scoped: query, update)"
      },
      {
        "name": "slotName"
      },
      {
        "name": "empty",
        "description": "Contenido custom del estado vacío"
      },
      {
        "name": "footer",
        "description": "Filas de pie (scoped: columns)"
      }
    ],
    "events": [
      {
        "name": "update:currentPage",
        "type": "() => void",
        "description": "Cambia la página (v-model:current-page)"
      },
      {
        "name": "update:itemsPerPage",
        "type": "() => void",
        "description": "Cambia items por página (v-model:items-per-page)"
      },
      {
        "name": "update:search",
        "type": "() => void",
        "description": "Cambia la búsqueda (v-model:search)"
      },
      {
        "name": "row-click",
        "type": "() => void",
        "description": "Click en una fila"
      },
      {
        "name": "row-dblclick",
        "type": "() => void",
        "description": "Doble click en una fila"
      },
      {
        "name": "cell-click",
        "type": "() => void",
        "description": "Click en una celda"
      },
      {
        "name": "edit-start",
        "type": "() => void",
        "description": "Se abre el editor de una celda"
      },
      {
        "name": "edit-save",
        "type": "() => void",
        "description": "Se guarda el valor editado"
      },
      {
        "name": "edit-cancel",
        "type": "() => void",
        "description": "Se cancela la edición"
      },
      {
        "name": "edit-error",
        "type": "() => void",
        "description": "Validación falló (input en rojo)"
      }
    ],
    "exposes": [
      {
        "name": "updateRow()",
        "type": "() => void"
      },
      {
        "name": "getData()",
        "type": "() => void"
      },
      {
        "name": "getRow()",
        "type": "() => void"
      },
      {
        "name": "removeRow()",
        "type": "() => void"
      },
      {
        "name": "addRow()",
        "type": "() => void"
      },
      {
        "name": "pushData()",
        "type": "() => void"
      },
      {
        "name": "updateRow",
        "type": "(index: number, patch: Record<string, any>) => void",
        "description": "Actualiza una fila"
      },
      {
        "name": "getData",
        "type": "() => Record<string, any>[]",
        "description": "Devuelve las filas actuales"
      },
      {
        "name": "getRow",
        "type": "(index: number) => Record<string, any>",
        "description": "Devuelve una fila"
      },
      {
        "name": "removeRow",
        "type": "(index: number) => void",
        "description": "Elimina una fila"
      },
      {
        "name": "addRow",
        "type": "(row: Record<string, any>) => void",
        "description": "Agrega una fila"
      },
      {
        "name": "pushData",
        "type": "(rows: Record<string, any>[]) => void",
        "description": "Agrega varias filas"
      }
    ],
    "interfaceCode": `interface Column {
    key: string
    label?: string
    width?: string
    align?: "left" | "center" | "right"
    editorAlign?: "start" | "center" | "end"
    cell?: (row: Record<string, any>) => string | string[]
    sortable?: boolean | "string" | "number" | "boolean"
    badges?: (row: Record<string, any>) => BadgeConfig[]
    buttons?: (row: Record<string, any>) => ButtonConfig[]
    editable?: boolean | RegExp | ((row: Record<string, any>) => boolean)
    inlineEdit?: boolean
    inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch"
    disabled?: boolean | ((row: Record<string, any>) => boolean)
    cellDisabled?: (row: Record<string, any>) => boolean
    date?: {
      format?: string
      min?: string | number | Date
      max?: string | number | Date
      yearNavigation?: boolean
      disabledWeekdays?: number[] | string
      disabledDates?: (string | Date)[] | string
      position?: string
      align?: string
      fixed?: boolean
    }
    select?: { options: SelectOption[]; color?: string; variant?: string }
    autocomplete?: { items: AutocompleteItem[]; minChars?: number }
    textarea?: { rows?: number; noResize?: boolean }
    input?: { type?: string; startValue?: string }
    switch?: { size?: "sm" | "md"; color?: string }
  }
  
  interface BadgeConfig {
    value: string
    color?: string
    variant?: string
  }
  
  interface ButtonConfig {
    label?: string
    icon?: string | Component
    onClick?: (row: Record<string, any>) => void
    to?: string
    target?: string
    color?: string
    variant?: string
    disabled?: boolean
  }
  
  // FooterRow/FooterCell: ver la página Table (Base) → API → Interfaces`
  },
  extras,
  sections: [
    {
      id: "basic",
      title: "Basic",
      layout: "col",
      variants: [
        { id: "v1", props: { columns: COLUMNS, data: DATA, pagination: false } },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "renderiza headers y celdas desde columns+data",
            run({ wrapper, expect }) {
              const headers = wrapper.findAll("th").map((th) => th.text().trim());
              expect(headers).toEqual(["ID", "Nombre", "Estado"]);
              const cells = wrapper.findAll("td").map((td) => td.text().trim());
              expect(cells).toContain("Alice Johnson");
              expect(cells).toContain("Bob Smith");
              expect(cells).toContain("Active");
              expect(cells).toContain("Inactive");
            },
          },
        ],
      },
    },

    {
      id: "sortable",
      title: "Sortable",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: {
            columns: [{ key: "name", label: "Nombre", sortable: true }],
            data: [{ name: "beta" }, { name: "alpha" }],
            pagination: false,
          },
        },
      ],
      vue: `  <!-- sortable: true | "string" | "number" | "boolean" -->
  <AdvancedTable
    :columns="[{ key: 'name', label: 'Name', sortable: true }]"
    :data="data"
    :pagination="false"
  />`,
      checks: {
        l1: [
          {
            name: "click en el header ordena asc y desc",
            async run({ wrapper, expect }) {
              const sortBtn = wrapper.find("th .cu-button");
              expect(sortBtn.exists()).toBe(true);
              await sortBtn.trigger("click");
              await wrapper.vm.$nextTick();
              let cells = wrapper.findAll("td").map((td) => td.text().trim());
              expect(cells[0]).toBe("alpha");
              expect(cells[1]).toBe("beta");
              await sortBtn.trigger("click");
              await wrapper.vm.$nextTick();
              cells = wrapper.findAll("td").map((td) => td.text().trim());
              expect(cells[0]).toBe("beta");
              expect(cells[1]).toBe("alpha");
            },
          },
        ],
      },
    },

    {
      id: "badges",
      title: "With Badges",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: {
            columns: [
              { key: "name", label: "Name" },
              {
                key: "status",
                label: "Status",
                badges: (row: Record<string, unknown>) => [
                  {
                    value: row.status,
                    color: row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger",
                    variant: "soft",
                  },
                ],
              },
            ],
            data: [
              { name: "Alice Johnson", status: "Active" },
              { name: "Bob Smith", status: "Pending" },
            ],
            pagination: false,
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "renderiza badges por fila",
            run({ wrapper, expect }) {
              expect(wrapper.findAll(".cu-badge").length).toBeGreaterThan(0);
            },
          },
        ],
      },
    },

    {
      id: "buttons",
      title: "With Buttons",
      layout: "col",
      variants: [
        {
          id: "with-label",
          props: {
            columns: [
              { key: "name", label: "Name" },
              {
                key: "actions",
                label: "Actions",
                buttons: () => [
                  { label: "Edit", color: "primary", variant: "ghost", onClick: () => {} },
                  { label: "Delete", color: "danger", variant: "ghost", onClick: () => {} },
                ],
              },
            ],
            data: [{ name: "Alice Johnson" }],
            pagination: false,
          },
        },
        {
          id: "with-icon",
          props: {
            columns: [
              { key: "name", label: "Name" },
              {
                key: "actions",
                label: "Actions",
                buttons: () => [{ color: "primary", variant: "ghost", icon: "<svg></svg>", onClick: () => {} }],
              },
            ],
            data: [{ name: "Alice Johnson" }],
            pagination: false,
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "renderiza los botones de acción de la fila",
            run({ wrapper, expect }, variant) {
              const rowButtons = wrapper.findAll("td .cu-button");
              expect(rowButtons.length).toBeGreaterThan(0);
              if (variant.id === "with-label") {
                const texts = rowButtons.map((b) => b.text());
                expect(texts).toContain("Edit");
                expect(texts).toContain("Delete");
              }
            },
          },
        ],
      },
    },

    {
      id: "pagination",
      title: "Pagination",
      badge: "true",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: {
            columns: [
              { key: "id", label: "ID" },
              { key: "name", label: "Nombre" },
            ],
            data: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` })),
            pagination: true,
            itemsPerPage: 5,
            showPageSize: true,
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :pagination="true" :items-per-page="5" :show-page-size="true" />`,
      checks: {
        l1: [
          {
            name: "con >itemsPerPage filas muestra el control y emite update:currentPage",
            async run({ wrapper, expect }) {
              expect(wrapper.find(".cu-advanced-table-pagination").exists()).toBe(true);
              const pageButtons = wrapper.findAll(".cu-advanced-table-pagination button");
              const page2 = pageButtons.find((b) => b.text().trim() === "2");
              expect(page2).toBeTruthy();
              await page2!.trigger("click");
              await wrapper.vm.$nextTick();
              const pages = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(pages).toBeTruthy();
              expect(pages![0]![0]).toBe(2);
            },
          },
        ],
      },
    },

    {
      id: "search",
      title: "With Search",
      badge: "false",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: {
            columns: COLUMNS,
            data: DATA,
            pagination: false,
            searchEnabled: true,
            searchFields: ["name"],
            searchPlaceholder: "Buscar...",
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :pagination="false" :search-enabled="true" />
  <!-- search-fields="['name', 'email']" limita los campos donde busca -->`,
      checks: {
        l1: [
          {
            name: "escribe en el buscador y emite update:search",
            async run({ wrapper, expect }) {
              const input = wrapper.find("input");
              expect(input.attributes("placeholder")).toBe("Buscar...");
              await input.setValue("alice");
              await wrapper.vm.$nextTick();
              const searches = wrapper.emitted("update:search") as unknown[][] | undefined;
              expect(searches).toBeTruthy();
              expect(searches![0]![0]).toBe("alice");
            },
          },
        ],
      },
    },

    {
      id: "empty",
      title: "Empty State",
      layout: "col",
      variants: [
        { id: "v1", props: { columns: COLUMNS, data: [], empty: "Sin registros", pagination: false } },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="[]" empty="Sin registros" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "muestra el mensaje empty cuando no hay data",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-table-empty").text()).toBe("Sin registros");
            },
          },
        ],
      },
    },

    {
      id: "row-disabled",
      title: "Row Disabled",
      layout: "col",
      variants: [
        {
          id: "predicate",
          props: {
            columns: [{ key: "name", label: "Nombre" }],
            data: [
              { id: 1, name: "Alice", blocked: true },
              { id: 2, name: "Bob", blocked: false },
            ],
            rowDisabled: (row: Record<string, unknown>) => row.blocked === true,
            pagination: false,
          },
        },
        {
          id: "all",
          props: {
            columns: [{ key: "name", label: "Nombre" }],
            data: [{ name: "Alice" }],
            rowDisabled: true,
            pagination: false,
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :row-disabled="(row) => row.blocked" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "rowDisabled: marca la fila con cu-table-row--disabled",
            run({ wrapper, expect }, variant) {
              const rows = wrapper.findAll("tr.cu-table-row");
              if (variant.id === "all") {
                expect(rows[0]!.classes()).toContain("cu-table-row--disabled");
              } else {
                expect(rows[0]!.classes()).toContain("cu-table-row--disabled");
                expect(rows[1]!.classes()).not.toContain("cu-table-row--disabled");
              }
            },
          },
        ],
      },
    },

    {
      id: "inline-editing",
      title: "Inline Editing",
      layout: "col",
      variants: [
        {
          id: "editable",
          props: {
            columns: [{ key: "name", label: "Nombre", editable: true }],
            data: [{ id: 1, name: "Alice" }],
            inlineEditing: true,
            pagination: false,
          },
        },
        {
          id: "col-disabled",
          props: {
            columns: [{ key: "name", label: "Nombre", editable: true, disabled: true }],
            data: [{ id: 1, name: "Alice" }],
            pagination: false,
          },
        },
        {
          id: "cell-disabled",
          props: {
            columns: [
              {
                key: "name",
                label: "Nombre",
                editable: true,
                cellDisabled: (row: Record<string, unknown>) => row.name === "Bob",
              },
            ],
            data: [
              { id: 1, name: "Alice" },
              { id: 2, name: "Bob" },
            ],
            pagination: false,
          },
        },
      ],
      vue: `  <AdvancedTable :columns="columns" :data="data" :inline-editing="true" :pagination="false" />`,
      checks: {
        l1: [
          {
            name: "edit-save: guarda y emite edit-save",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "editable") return;
              const input = wrapper.find("input");
              expect(input.exists()).toBe(true);
              await input.setValue("Bob Smith");
              await input.trigger("keydown", { key: "Enter" });
              await wrapper.vm.$nextTick();
              const saves = wrapper.emitted("edit-save") as unknown[][] | undefined;
              expect(saves).toBeTruthy();
              const payload = saves![0]![0] as { value: string; index: number; column: { key: string } };
              expect(payload.value).toBe("Bob Smith");
              expect(payload.index).toBe(0);
              expect(payload.column.key).toBe("name");
            },
          },
          {
            name: "columna disabled: la celda editable no entra en edición",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "col-disabled") return;
              const cell = wrapper.find(".cu-editable-cell");
              expect(cell.classes()).toContain("cu-editable-cell--disabled");
              await cell.trigger("click");
              await wrapper.vm.$nextTick();
              expect(wrapper.find("input").exists()).toBe(false);
            },
          },
          {
            name: "cellDisabled: deshabilita solo la celda puntual",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "cell-disabled") return;
              const cells = wrapper.findAll(".cu-editable-cell");
              expect(cells[0]!.classes()).not.toContain("cu-editable-cell--disabled");
              expect(cells[1]!.classes()).toContain("cu-editable-cell--disabled");
            },
          },
        ],
      },
    },
  ],
};
