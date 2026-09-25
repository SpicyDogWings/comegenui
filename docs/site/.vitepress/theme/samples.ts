// docs/site/.vitepress/theme/samples.ts
//
// Objetos de ejemplo (JSON-válidos) para las props complejas del playground.
// Se cargan como valor real en `Demo.values` (para que el preview renderice algo
// con sentido) y se muestran serializados en un `Collapse` de solo lectura.
//
// No van funciones ni `File`: no son JSON (esas props quedan fuera del playground).
export const samples: Record<string, Record<string, unknown>> = {
  AdvancedTable: {
    columns: [
      { key: "nombre", label: "Nombre" },
      { key: "email", label: "Email" },
    ],
    data: [
      { nombre: "Ana", email: "ana@ejemplo.com" },
      { nombre: "Luis", email: "luis@ejemplo.com" },
    ],
    pageSizeOptions: [5, 10, 20],
    searchFields: ["nombre", "email"],
    filters: {},
    actions: [{ label: "Editar" }, { label: "Eliminar", color: "danger" }],
    footer: [{ cells: [{ value: "Total", colspan: 1 }, { value: "2", align: "right" }] }],
  },
  Table: {
    columns: [
      { key: "nombre", label: "Nombre" },
      { key: "email", label: "Email" },
    ],
    data: [
      { nombre: "Ana", email: "ana@ejemplo.com" },
      { nombre: "Luis", email: "luis@ejemplo.com" },
    ],
    footer: [{ cells: [{ value: "Total", colspan: 1 }, { value: "2", align: "right" }] }],
  },
  Select: {
    options: [
      { value: "a", label: "Opción A" },
      { value: "b", label: "Opción B" },
      { value: "c", label: "Opción C", disabled: true },
    ],
  },
  Autocomplete: {
    items: [{ label: "Opción 1" }, { label: "Opción 2" }],
  },
  Tabs: {
    tabs: [
      { key: "uno", label: "Uno" },
      { key: "dos", label: "Dos" },
      { key: "tres", label: "Tres", disabled: true },
    ],
  },
  Pagination: {
    pageSizeOptions: [5, 10, 20, 50],
  },
  Calendar: {
    events: [
      { date: "2026-09-10", color: "primary" },
      { date: "2026-09-20", color: "success" },
    ],
    disabledWeekdays: [0, 6],
    disabledDates: ["2026-09-15"],
  },
  DualCalendar: {
    startDate: "2026-09-03",
    endDate: "2026-09-15",
    events: [
      { date: "2026-09-10", color: "primary" },
      { date: "2026-09-20", color: "success" },
    ],
    disabledWeekdays: [0, 6],
    disabledDates: ["2026-09-15"],
  },
  DatePicker: {
    mode: "range",
    startDate: "2026-09-03",
    endDate: "2026-09-15",
    events: [
      { date: "2026-09-10", color: "primary" },
      { date: "2026-09-20", color: "success" },
    ],
    disabledWeekdays: [0, 6],
    disabledDates: ["2026-09-15"],
  },
  Navbar: {
    items: [
      { label: "Inicio", path: "/" },
      {
        label: "Componentes",
        children: [
          { label: "Button", path: "/botones/button" },
          { label: "Input", path: "/formularios/input" },
        ],
      },
    ],
    searchFields: ["label"],
    highlightItem: { label: "Inicio", path: "/" },
  },
  NavbarHorizontal: {
    items: [
      { label: "Inicio", path: "/" },
      {
        label: "Componentes",
        children: [
          { label: "Button", path: "/botones/button" },
          { label: "Input", path: "/formularios/input" },
        ],
      },
    ],
  },
  NavbarList: {
    items: [
      { label: "Inicio", path: "/" },
      {
        label: "Componentes",
        children: [
          { label: "Button", path: "/botones/button" },
          { label: "Input", path: "/formularios/input" },
        ],
      },
    ],
    searchFields: ["label"],
    highlightTarget: { label: "Inicio", path: "/" },
    activeItem: { label: "Inicio", path: "/" },
  },
  NavbarMenu: {
    items: [
      { label: "Inicio", path: "/" },
      {
        label: "Componentes",
        children: [
          { label: "Button", path: "/botones/button" },
          { label: "Input", path: "/formularios/input" },
        ],
      },
    ],
  },
  Dropdown: {
    items: [
      { label: "Perfil" },
      { label: "Configuración" },
      { divider: true },
      { label: "Cerrar sesión" },
    ],
  },
  DropdownMenu: {
    items: [
      { label: "Editar" },
      { label: "Duplicar" },
      { divider: true },
      { label: "Eliminar", color: "danger" },
    ],
  },
  CellsImporter: {
    columns: [
      { key: "nombre", label: "Nombre", type: "string", required: true },
      { key: "edad", label: "Edad", type: "integer" },
    ],
    formats: [".xlsx", ".csv"],
    template: { enabled: true, type: "xlsx", filename: "plantilla" },
  },
  EditableTableCell: {
    row: { nombre: "Ana" },
    column: { key: "nombre", label: "Nombre", editable: true },
  },
};
