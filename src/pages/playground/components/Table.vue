<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Colors', id: 'colors' },
  { label: 'Variants', id: 'variants' },
  { label: 'Scroll', id: 'scroll' },
  { label: 'Scroll (Sticky)', id: 'scroll-sticky' },
  { label: 'Empty State', id: 'empty' },
  { label: 'Footer', id: 'footer' },
  { label: 'Loading', id: 'loading' },
  { label: 'Compact', id: 'compact' },
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
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "Admin", amount: 250.00 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Pending", role: "User", amount: 175.50 },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "Active", role: "Editor", amount: 320.00 },
  { id: 4, name: "David Brown", email: "david@example.com", status: "Inactive", role: "User", amount: 89.90 },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", status: "Active", role: "Admin", amount: 410.25 },
  { id: 6, name: "Frank Lee", email: "frank@example.com", status: "Pending", role: "User", amount: 132.75 },
  { id: 7, name: "Grace Kim", email: "grace@example.com", status: "Active", role: "Editor", amount: 298.00 },
  { id: 8, name: "Henry Park", email: "henry@example.com", status: "Inactive", role: "User", amount: 156.60 },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
  { key: "amount", label: "Amount", align: "right" as const },
];

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"];
const variants = ["soft", "solid", "outlined", "ghost"];

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const styleData = [
  { name: '--table-bg', description: 'Fondo tabla' },
  { name: '--table-bd', description: 'Color bordes' },
  { name: '--table-bg-hover', description: 'Fondo hover fila' },
  { name: '--cu-font-sans', description: 'Fuente' },
  { name: '--cu-font-weight-medium', description: 'Peso medio' },
  { name: '--cu-font-weight-semibold', description: 'Peso semi-bold' },
  { name: '--cu-radius-md', description: 'Radio' },
  { name: '--cu-border-thin', description: 'Borde fino' },
  { name: '--cu-border-medium', description: 'Borde medio' },
  { name: '--cu-space-xs', description: 'Espaciado xs' },
  { name: '--cu-space-sm', description: 'Espaciado sm' },
  { name: '--cu-space-md', description: 'Espaciado md' },
  { name: '--cu-space-xl', description: 'Espaciado xl' },
  { name: '--cu-color-surface', description: 'Color superficie' },
  { name: '--cu-color-neutral-soft', description: 'Fondo neutral' },
  { name: '--cu-color-neutral-subtle-border', description: 'Borde neutral' },
  { name: '--cu-color-neutral-text', description: 'Texto neutral' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'columns', type: 'Column[]', default: '[]', description: 'Definición de columnas' },
  { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Filas: objetos key → valor' },
  { name: 'empty', type: 'string', default: '"No hay datos que mostrar"', description: 'Mensaje sin datos' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle, none' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Muestra loader en el body' },
  { name: 'maxHeight', type: 'string', default: '""', description: 'Altura máxima con scroll (ej: 300px)' },
  { name: 'rowDisabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción de filas' },
  { name: 'htmlCells', type: 'boolean', default: 'false', description: 'Renderiza los valores como HTML' },
  { name: 'footer', type: 'FooterRow[]', default: '[]', description: 'Filas de pie programáticas' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Densidad compacta' },
];

const slotsData = [
  { name: 'header-{key}', description: 'Contenido del header de la columna' },
  { name: 'cell-{key}', description: 'Contenido de la celda (por columna)' },
  { name: 'footer', description: 'Filas de pie (scoped: columns). Sin slot ni prop footer → no renderiza tfoot' },
  { name: 'empty', description: 'Contenido custom del estado vacío' },
];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const interfaceCode = `interface Column {
  key: string
  label?: string
  width?: string
  align?: "left" | "center" | "right"
}

interface FooterCell {
  value: string
  colspan?: number
  align?: "left" | "center" | "right"
}

interface FooterRow {
  cells: FooterCell[]
}`;

// ── Snippets Vue ──

const vueImport = `<script setup>
import Table from '@/components/data/Table.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', align: 'right' },
]

const data = [
  { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', amount: 250 },
  { name: 'Bob Smith', email: 'bob@example.com', status: 'Pending', amount: 175.5 },
  { name: 'Carol White', email: 'carol@example.com', status: 'Active', amount: 320 },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Table :columns="columns" :data="data" />`);

const colorsVue = vueSnippet(`  <Table color="primary" :columns="columns" :data="data" />
  <Table color="secondary" :columns="columns" :data="data" />
  <Table color="neutral" :columns="columns" :data="data" />
  <Table color="success" :columns="columns" :data="data" />
  <Table color="warning" :columns="columns" :data="data" />
  <Table color="danger" :columns="columns" :data="data" />`);

const variantsVue = vueSnippet(`  <Table variant="soft" :columns="columns" :data="data" />
  <Table variant="solid" :columns="columns" :data="data" />
  <Table variant="outlined" :columns="columns" :data="data" />
  <Table variant="ghost" :columns="columns" :data="data" />`);

const scrollVue = vueSnippet(`  <!-- Scroll con contenedor propio -->
  <div style="max-height: 300px; overflow-y: auto;">
    <Table :columns="columns" :data="data" />
  </div>`);

const scrollStickyVue = vueSnippet(`  <!-- Header sticky con la prop max-height -->
  <Table :columns="columns" :data="data" max-height="300px" />`);

const emptyVue = vueSnippet(`  <Table :columns="columns" :data="[]" />
  <Table :columns="columns" :data="[]" empty="Sin resultados para tu búsqueda" />`);

const footerVue = vueSnippet(`  <Table :columns="columns" :data="data" color="primary" variant="soft">
    <template #footer="{ columns: cols }">
      <tr>
        <td :colspan="cols.length - 1">Total</td>
        <td>{{ data.reduce((sum, r) => sum + r.amount, 0).toFixed(2) }}</td>
      </tr>
    </template>
  </Table>

  <!-- Alternativa programática (sin slot): prop footer -->
  <!-- table.footer = [{ cells: [{ value: 'Total', colspan: 3 }, { value: '$745.50', align: 'right' }] }] -->`);

const loadingVue = vueSnippet(`  <Table :columns="columns" :data="data" loading />`);

const compactVue = vueSnippet(`  <Table :columns="columns" :data="data" compact />
  <Table :columns="columns" :data="data" variant="outlined" compact />`);

// ── Snippets Vanilla ──

const tableImportVanilla = `<script src="dist/CuTable.umd.js"><\/script>`;

const tableDataAssignVanilla = `    table.columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'amount', label: 'Amount', align: 'right' },
    ];
    table.data = [
      { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', amount: 250 },
      { name: 'Bob Smith', email: 'bob@example.com', status: 'Pending', amount: 175.5 },
      { name: 'Carol White', email: 'carol@example.com', status: 'Active', amount: 320 },
    ];`;

const basicVanilla = `${tableImportVanilla}

<cu-table id="tbl-basic"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-basic');
${tableDataAssignVanilla}
  });
<\/script>`;

const colorsVanilla = `${tableImportVanilla}

<cu-table id="tbl-primary" color="primary"></cu-table>
<cu-table id="tbl-secondary" color="secondary"></cu-table>
<cu-table id="tbl-neutral" color="neutral"></cu-table>
<cu-table id="tbl-success" color="success"></cu-table>
<cu-table id="tbl-warning" color="warning"></cu-table>
<cu-table id="tbl-danger" color="danger"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'].forEach((c) => {
      const table = document.getElementById('tbl-' + c);
${tableDataAssignVanilla}
    });
  });
<\/script>`;

const variantsVanilla = `${tableImportVanilla}

<cu-table id="tbl-soft" variant="soft"></cu-table>
<cu-table id="tbl-solid" variant="solid"></cu-table>
<cu-table id="tbl-outlined" variant="outlined"></cu-table>
<cu-table id="tbl-ghost" variant="ghost"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    ['soft', 'solid', 'outlined', 'ghost'].forEach((v) => {
      const table = document.getElementById('tbl-' + v);
${tableDataAssignVanilla}
    });
  });
<\/script>`;

const scrollVanilla = `${tableImportVanilla}

<div style="max-height: 300px; overflow-y: auto;">
  <cu-table id="tbl-scroll"></cu-table>
</div>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-scroll');
${tableDataAssignVanilla}
  });
<\/script>`;

const scrollStickyVanilla = `${tableImportVanilla}

<cu-table id="tbl-sticky" max-height="300px"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-sticky');
${tableDataAssignVanilla}
  });
<\/script>`;

const emptyVanilla = `${tableImportVanilla}

<cu-table id="tbl-empty" empty="Sin resultados para tu búsqueda"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    document.getElementById('tbl-empty').columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ];
  });
<\/script>`;

const footerVanilla = `${tableImportVanilla}

<cu-table id="tbl-footer" color="primary" variant="soft"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-footer');
${tableDataAssignVanilla}
    table.footer = [
      { cells: [
        { value: 'Total', colspan: 3 },
        { value: '$745.50', align: 'right' },
      ]},
    ];
  });
<\/script>`;

const loadingVanilla = `${tableImportVanilla}

<cu-table id="tbl-loading" loading></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-loading');
${tableDataAssignVanilla}
  });
<\/script>`;

const compactVanilla = `${tableImportVanilla}

<cu-table id="tbl-compact" compact></cu-table>
<cu-table id="tbl-compact-outlined" variant="outlined" compact></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    ['tbl-compact', 'tbl-compact-outlined'].forEach((id) => {
      const table = document.getElementById(id);
${tableDataAssignVanilla}
    });
  });
<\/script>`;

const totalDemo = sampleData.reduce((sum, r) => sum + r.amount, 0).toFixed(2);
</script>

<template>
  <PlaygroundLayout title="Table (Base)" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <Table :columns="columns" :data="sampleData" />
            <Button variant="link" to="#api-interfaces">Ver interfaz Column ↓</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-grid">
            <div v-for="color in colors" :key="color">
              <span class="playground-label">{{ color }}</span>
              <Table :color="color" :columns="columns" :data="sampleData.slice(0, 3)" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-grid">
            <div v-for="variant in variants" :key="variant">
              <span class="playground-label">{{ variant }}</span>
              <Table :variant="variant" :columns="columns" :data="sampleData.slice(0, 3)" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="scroll" class="playground-section">
        <div class="playground-heading">
          <h2>Scroll</h2>
        </div>
        <SectionDemo :vue-code="scrollVue" :vanilla-code="scrollVanilla">
          <div class="playground-col">
            <div style="max-height: 300px; overflow-y: auto; border: var(--cu-border-thin) solid var(--cu-border-color); border-radius: var(--cu-radius-md);">
              <Table :columns="columns" :data="sampleData" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="scroll-sticky" class="playground-section">
        <div class="playground-heading">
          <h2>Scroll (Sticky Header)</h2>
        </div>
        <SectionDemo :vue-code="scrollStickyVue" :vanilla-code="scrollStickyVanilla">
          <div class="playground-col">
            <Table :columns="columns" :data="sampleData" max-height="300px" />
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
            <Table :columns="columns" :data="[]" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="footer" class="playground-section">
        <div class="playground-heading">
          <h2>Footer (Totals)</h2>
        </div>
        <SectionDemo :vue-code="footerVue" :vanilla-code="footerVanilla">
          <div class="playground-col">
            <Table :columns="columns" :data="sampleData" color="primary" variant="soft">
              <template #footer="{ columns: cols }">
                <tr>
                  <td :colspan="cols.length - 1" class="cu-table-td cu-table-td--footer">Total</td>
                  <td class="cu-table-td cu-table-td--footer cu-table-td--right">
                    ${{ totalDemo }}
                  </td>
                </tr>
              </template>
            </Table>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="loading" class="playground-section">
        <div class="playground-heading">
          <h2>Loading</h2>
          <Badge color="neutral" title="loading por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="loadingVue" :vanilla-code="loadingVanilla">
          <div class="playground-col">
            <Table :columns="columns" :data="sampleData.slice(0, 3)" loading />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="compact" class="playground-section">
        <div class="playground-heading">
          <h2>Compact</h2>
          <Badge color="neutral" title="compact por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="compactVue" :vanilla-code="compactVanilla">
          <div class="playground-col">
            <p class="playground-code">Menos padding en celdas (th/td) — compone con cualquier variante.</p>
            <Table :columns="columns" :data="sampleData.slice(0, 4)" compact />
            <Table :columns="columns" :data="sampleData.slice(0, 4)" variant="outlined" compact />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.playground-label {
  display: block;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}
</style>
