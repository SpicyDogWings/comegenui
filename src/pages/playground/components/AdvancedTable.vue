<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Sortable', id: 'sortable' },
  { label: 'With Badges', id: 'badges' },
  { label: 'With Buttons', id: 'buttons' },
  { label: 'Buttons with Icons', id: 'buttons-icons' },
  { label: 'Pagination', id: 'pagination' },
  { label: 'Search', id: 'search' },
  { label: 'Empty State', id: 'empty' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const sampleData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Pending", role: "User" },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "Active", role: "Editor" },
  { id: 4, name: "David Brown", email: "david@example.com", status: "Inactive", role: "User" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", status: "Active", role: "Admin" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", status: "Pending", role: "User" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", status: "Active", role: "Editor" },
  { id: 8, name: "Henry Park", email: "henry@example.com", status: "Inactive", role: "User" },
  { id: 9, name: "Ivy Chen", email: "ivy@example.com", status: "Active", role: "Admin" },
  { id: 10, name: "Jack Wilson", email: "jack@example.com", status: "Pending", role: "User" },
  { id: 11, name: "Kate Brown", email: "kate@example.com", status: "Active", role: "Editor" },
  { id: 12, name: "Leo Garcia", email: "leo@example.com", status: "Inactive", role: "User" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
];

const sortableColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "status", label: "Status", sortable: "string" as const },
  { key: "role", label: "Role" },
];

const badgeColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    badges: (row: any) => [
      {
        value: row.status,
        color: row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger",
        variant: "soft",
      },
    ],
  },
];

const multiBadgeColumns = [
  { key: "name", label: "Name" },
  {
    key: "skills",
    label: "Skills (multi-badge)",
    width: "220px",
    badges: (row: any) => [
      { value: "Vue", color: "primary", variant: "soft" },
      { value: "TypeScript", color: "primary", variant: "soft" },
      { value: "Node", color: "success", variant: "soft" },
      { value: "Docker", color: "neutral", variant: "soft" },
      { value: "PostgreSQL", color: "warning", variant: "soft" },
      { value: "CI/CD", color: "danger", variant: "soft" },
      ...(row.senior ? [{ value: "Arquitectura", color: "secondary", variant: "soft" }] : []),
    ],
  },
];

const buttonColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "actions",
    label: "Actions",
    buttons: (row: any) => [
      { label: "Edit", color: "primary", variant: "ghost", onClick: () => console.log("edit", row) },
      { label: "Delete", color: "danger", variant: "ghost", onClick: () => console.log("delete", row) },
    ],
  },
];

const iconButtonColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "actions",
    label: "Actions",
    buttons: (row: any) => [
      {
        color: "primary",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
        onClick: () => console.log("edit", row),
      },
      {
        color: "neutral",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
        onClick: () => console.log("more", row),
      },
      {
        color: "danger",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        onClick: () => console.log("delete", row),
      },
    ],
  },
];

const advancedtable_tokens = [
  '--cu-font-sans',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-space-2xl',
  '--cu-color-surface',
];

const styleData = advancedtable_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [
  { label: 'Table', path: '/playground/components/table' },
  { label: 'Pagination', path: '/playground/components/pagination' },
  { label: 'Input', path: '/playground/components/input' },
  { label: 'Button', path: '/playground/components/button' },
  { label: 'Badge', path: '/playground/components/badge' },
  { label: 'DropdownMenu', path: '/playground/components/dropdown-menu' },
];

const styleSubComponents = [
  { label: 'Table', path: '/playground/components/table#style' },
  { label: 'Pagination', path: '/playground/components/pagination#style' },
  { label: 'Input', path: '/playground/components/input#style' },
  { label: 'Button', path: '/playground/components/button#style' },
  { label: 'Badge', path: '/playground/components/badge#style' },
  { label: 'DropdownMenu', path: '/playground/components/dropdown-menu#style' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'columns', type: 'Column[]', default: '[]', description: 'Definición de columnas (ver Interfaces)' },
  { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Filas: objetos key → valor' },
  { name: 'empty', type: 'string', default: '"No hay datos que mostrar"', description: 'Mensaje sin datos' },
  { name: 'pagination', type: 'boolean', default: 'true', description: 'Paginación client-side' },
  { name: 'itemsPerPage', type: 'number', default: '10', description: 'Items por página (v-model:items-per-page)' },
  { name: 'showPageSize', type: 'boolean', default: 'false', description: 'Select de items por página' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[5, 10, 20, 50]', description: 'Opciones del select' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'searchEnabled', type: 'boolean', default: 'false', description: 'Buscador sobre los datos' },
  { name: 'searchPlaceholder', type: 'string', default: '"Buscar..."', description: 'Placeholder del buscador' },
  { name: 'searchFields', type: 'string[]', default: '[]', description: 'Campos donde buscar (vacío = todos)' },
  { name: 'searchValue', type: 'string', default: '""', description: 'Valor inicial del buscador (v-model:search)' },
  { name: 'tableMaxHeight', type: 'string', default: '""', description: 'Altura máxima con scroll' },
  { name: 'filters', type: 'Record<string, any>', default: '{}', description: 'Filtros a aplicar sobre los datos' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Muestra loader en el body' },
  { name: 'actions', type: 'ButtonConfig[]', default: '[]', description: 'Acciones bajo la tabla' },
  { name: 'inlineEditing', type: 'boolean', default: 'false', description: 'Editores directos (sin lápiz) en todas las columnas editables' },
  { name: 'rowDisabled', type: 'boolean | (row) => boolean', default: 'false', description: 'Deshabilita filas completas' },
  { name: 'footer', type: 'FooterRow[]', default: '[]', description: 'Filas de pie programáticas' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Densidad compacta' },
];

const slotsData = [
  { name: 'search', description: 'Buscador custom (scoped: query, update)' },
  { name: 'empty', description: 'Contenido custom del estado vacío' },
  { name: 'footer', description: 'Filas de pie (scoped: columns)' },
];

const eventsData = [
  { name: 'update:currentPage', type: '(page: number) => void', description: 'Cambia la página (v-model:current-page)' },
  { name: 'update:itemsPerPage', type: '(n: number) => void', description: 'Cambia items por página (v-model:items-per-page)' },
  { name: 'update:search', type: '(q: string) => void', description: 'Cambia la búsqueda (v-model:search)' },
  { name: 'row-click', type: '(e: { row, index, event }) => void', description: 'Click en una fila' },
  { name: 'row-dblclick', type: '(e: { row, index, event }) => void', description: 'Doble click en una fila' },
  { name: 'cell-click', type: '(e: { row, column, value, event }) => void', description: 'Click en una celda' },
  { name: 'edit-start', type: '(e: { index, column }) => void', description: 'Se abre el editor de una celda' },
  { name: 'edit-save', type: '(e: { index, column, value }) => void', description: 'Se guarda el valor editado' },
  { name: 'edit-cancel', type: '(e: { index, column }) => void', description: 'Se cancela la edición' },
  { name: 'edit-error', type: '(e: { index, column, value }) => void', description: 'Validación falló (input en rojo)' },
];

const exposesData = [
  { name: 'updateRow', type: '(index: number, patch: Record<string, any>) => void', description: 'Actualiza una fila' },
  { name: 'getData', type: '() => Record<string, any>[]', description: 'Devuelve las filas actuales' },
  { name: 'getRow', type: '(index: number) => Record<string, any>', description: 'Devuelve una fila' },
  { name: 'removeRow', type: '(index: number) => void', description: 'Elimina una fila' },
  { name: 'addRow', type: '(row: Record<string, any>) => void', description: 'Agrega una fila' },
  { name: 'pushData', type: '(rows: Record<string, any>[]) => void', description: 'Agrega varias filas' },
];

const interfaceCode = `interface Column {
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

// FooterRow/FooterCell: ver la página Table (Base) → API → Interfaces`;

// ── Snippets Vue ──

const vueImport = `<script setup>
import AdvancedTable from '@/components/data/AdvancedTable.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
]

const data = [
  { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', status: 'Pending', role: 'User' },
  { name: 'Carol White', email: 'carol@example.com', status: 'Active', role: 'Editor' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <AdvancedTable :columns="columns" :data="data" :pagination="false" />`);

const sortableVue = vueSnippet(`  <!-- sortable: true | "string" | "number" | "boolean" -->
  <AdvancedTable
    :columns="[
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'status', label: 'Status', sortable: 'string' },
      { key: 'role', label: 'Role' },
    ]"
    :data="data"
    :pagination="false"
  />`);

const badgesVue = `<script setup>
import AdvancedTable from '@/components/data/AdvancedTable.vue'

const columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    badges: (row) => [{
      value: row.status,
      color: row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger',
      variant: 'soft',
    }],
  },
]

const data = [
  { name: 'Alice Johnson', status: 'Active' },
  { name: 'Bob Smith', status: 'Pending' },
  { name: 'David Brown', status: 'Inactive' },
]
<\/script>

<template>
  <AdvancedTable :columns="columns" :data="data" :pagination="false" />
</template>`;

const buttonsVue = `<script setup>
import AdvancedTable from '@/components/data/AdvancedTable.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'actions',
    label: 'Actions',
    buttons: (row) => [
      { label: 'Edit', color: 'primary', variant: 'ghost', onClick: () => console.log('edit', row) },
      { label: 'Delete', color: 'danger', variant: 'ghost', onClick: () => console.log('delete', row) },
    ],
  },
]

const data = [
  { name: 'Alice Johnson', email: 'alice@example.com' },
  { name: 'Bob Smith', email: 'bob@example.com' },
]
<\/script>

<template>
  <AdvancedTable :columns="columns" :data="data" :pagination="false" />
</template>`;

const buttonsIconsVue = `<script setup>
import AdvancedTable from '@/components/data/AdvancedTable.vue'
import Button from '@/components/buttons/Button.vue';

const columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'actions',
    label: 'Actions',
    buttons: (row) => [
      { color: 'primary', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('edit', row) },
      { color: 'neutral', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('more', row) },
      { color: 'danger', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('delete', row) },
    ],
  },
]

const data = [
  { name: 'Alice Johnson' },
  { name: 'Bob Smith' },
]
<\/script>

<template>
  <AdvancedTable :columns="columns" :data="data" :pagination="false" />
</template>`;

const paginationVue = vueSnippet(`  <AdvancedTable :columns="columns" :data="data" :pagination="true" :items-per-page="5" />`);

const searchVue = vueSnippet(`  <AdvancedTable :columns="columns" :data="data" :pagination="false" :search-enabled="true" />
  <!-- search-fields="['name', 'email']" limita los campos donde busca -->`);

const emptyVue = vueSnippet(`  <AdvancedTable :columns="columns" :data="[]" :pagination="false" />`);

// ── Snippets Vanilla ──

const tableImportVanilla = `<script src="dist/CuTable.umd.js"><\/script>`;

const tableDataAssignVanilla = `    table.columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'role', label: 'Role' },
    ];
    table.data = [
      { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', role: 'Admin' },
      { name: 'Bob Smith', email: 'bob@example.com', status: 'Pending', role: 'User' },
      { name: 'Carol White', email: 'carol@example.com', status: 'Active', role: 'Editor' },
    ];`;

const basicVanilla = `${tableImportVanilla}

<cu-table id="atbl-basic" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-basic');
${tableDataAssignVanilla}
  });
<\/script>`;

const sortableVanilla = `${tableImportVanilla}

<cu-table id="atbl-sortable" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-sortable');
    table.columns = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'status', label: 'Status', sortable: 'string' },
      { key: 'role', label: 'Role' },
    ];
    table.data = [
      { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', role: 'Admin' },
      { name: 'Bob Smith', email: 'bob@example.com', status: 'Pending', role: 'User' },
      { name: 'Carol White', email: 'carol@example.com', status: 'Active', role: 'Editor' },
    ];
  });
<\/script>`;

const badgesVanilla = `${tableImportVanilla}

<cu-table id="atbl-badges" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-badges');
    table.columns = [
      { key: 'name', label: 'Name' },
      {
        key: 'status',
        label: 'Status',
        badges: (row) => [{
          value: row.status,
          color: row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger',
          variant: 'soft',
        }],
      },
    ];
    table.data = [
      { name: 'Alice Johnson', status: 'Active' },
      { name: 'Bob Smith', status: 'Pending' },
      { name: 'David Brown', status: 'Inactive' },
    ];
  });
<\/script>`;

const buttonsVanilla = `${tableImportVanilla}

<cu-table id="atbl-buttons" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-buttons');
    table.columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      {
        key: 'actions',
        label: 'Actions',
        buttons: (row) => [
          { label: 'Edit', color: 'primary', variant: 'ghost', onClick: () => console.log('edit', row) },
          { label: 'Delete', color: 'danger', variant: 'ghost', onClick: () => console.log('delete', row) },
        ],
      },
    ];
    table.data = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
    ];
  });
<\/script>`;

const buttonsIconsVanilla = `${tableImportVanilla}

<cu-table id="atbl-icons" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-icons');
    table.columns = [
      { key: 'name', label: 'Name' },
      {
        key: 'actions',
        label: 'Actions',
        buttons: (row) => [
          { color: 'primary', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('edit', row) },
          { color: 'neutral', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('more', row) },
          { color: 'danger', variant: 'ghost', icon: '<svg ...></svg>', onClick: () => console.log('delete', row) },
        ],
      },
    ];
    table.data = [
      { name: 'Alice Johnson' },
      { name: 'Bob Smith' },
    ];
  });
<\/script>`;

const paginationVanilla = `${tableImportVanilla}

<cu-table id="atbl-pag" items-per-page="5"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-pag');
${tableDataAssignVanilla}
    table.addEventListener('update:currentPage', (e) => console.log('page:', e.detail));
  });
<\/script>`;

const searchVanilla = `${tableImportVanilla}

<cu-table id="atbl-search" search-enabled></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-search');
${tableDataAssignVanilla}
    table.addEventListener('update:search', (e) => console.log('query:', e.detail));
  });
<\/script>`;

const emptyVanilla = `${tableImportVanilla}

<cu-table id="atbl-empty" pagination="false"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('atbl-empty');
    table.columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'role', label: 'Role' },
    ];
  });
<\/script>`;
</script>

<template>
  <PlaygroundLayout title="AdvancedTable" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="columns" :data="sampleData" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sortable" class="playground-section">
        <div class="playground-heading">
          <h2>Sortable</h2>
        </div>
        <SectionDemo :vue-code="sortableVue" :vanilla-code="sortableVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="sortableColumns" :data="sampleData" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="badges" class="playground-section">
        <div class="playground-heading">
          <h2>With Badges</h2>
        </div>
        <Button variant="link" to="#api-interfaces">Ver interfaz BadgeConfig ↓</Button>
        <SectionDemo :vue-code="badgesVue" :vanilla-code="badgesVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="badgeColumns" :data="sampleData" :pagination="false" />
            <h3>Multi-badge con wrap</h3>
            <p class="playground-desc">
              Cuando una celda devuelve <strong>varios badges</strong>, el contenedor hace
              <code>flex-wrap: wrap</code>: los badges saltan de línea entre sí en lugar de
              estirarse en una fila larga.
            </p>
            <AdvancedTable :columns="multiBadgeColumns" :data="sampleData" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="buttons" class="playground-section">
        <div class="playground-heading">
          <h2>With Buttons</h2>
        </div>
        <Button variant="link" to="#api-interfaces">Ver interfaz ButtonConfig ↓</Button>
        <SectionDemo :vue-code="buttonsVue" :vanilla-code="buttonsVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="buttonColumns" :data="sampleData" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="buttons-icons" class="playground-section">
        <div class="playground-heading">
          <h2>Buttons with Icons</h2>
        </div>
        <SectionDemo :vue-code="buttonsIconsVue" :vanilla-code="buttonsIconsVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="iconButtonColumns" :data="sampleData" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="pagination" class="playground-section">
        <div class="playground-heading">
          <h2>Pagination</h2>
          <Badge color="neutral" title="pagination por defecto">true</Badge>
        </div>
        <SectionDemo :vue-code="paginationVue" :vanilla-code="paginationVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="columns" :data="sampleData" :pagination="true" :items-per-page="5" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="search" class="playground-section">
        <div class="playground-heading">
          <h2>With Search</h2>
          <Badge color="neutral" title="searchEnabled por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="searchVue" :vanilla-code="searchVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="columns" :data="sampleData" :pagination="false" :search-enabled="true" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="empty" class="playground-section">
        <div class="playground-heading">
          <h2>Empty State</h2>
        </div>
        <SectionDemo :vue-code="emptyVue" :vanilla-code="emptyVanilla">
          <div class="playground-col">
            <AdvancedTable :columns="columns" :data="[]" :pagination="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

<h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
