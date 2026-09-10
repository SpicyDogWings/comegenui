import { h } from "vue";
import Table from "@/components/data/Table.vue";
import type { ComponentStory, SlotContent } from "@/stories/types";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "status", label: "Estado" },
];

const DATA = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Inactive" },
];

const COLUMNS_ALIGN = [
  { key: "id", label: "ID", align: "right" },
  { key: "name", label: "Nombre", align: "center" },
];

const UMD = `<script src="dist/CuTable.umd.js"><\\/script>`;

const vanillaAssign = `table.columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre' },
      { key: 'status', label: 'Estado' },
    ]
    table.data = [
      { id: 1, name: 'Alice Johnson', status: 'Active' },
      { id: 2, name: 'Bob Smith', status: 'Inactive' },
    ]`;

export const cuTableStories: ComponentStory = {
  component: "cu-table",
  vue: Table,
  tokens: [
    '--table-bg-hover',
    '--table-bd',
    '--cu-font-sans',
    '--cu-font-weight-medium',
    '--cu-font-weight-semibold',
    '--cu-radius-md',
    '--cu-border-thin',
    '--cu-border-medium',
    '--cu-space-xs',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-space-xl',
    '--cu-color-surface',
    '--cu-color-neutral-soft',
    '--cu-color-neutral-subtle-border',
    '--cu-color-neutral-text',
  ],
  subComponents: [
    { label: 'Loader', path: '/playground/components/loader#style' },
  ],
  api: {
    components: [
      { label: 'Loader', path: '/playground/components/loader' },
    ],
    props: [
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
    ],
    slots: [
      { name: 'header-{key}', description: 'Contenido del header de la columna' },
      { name: 'cell-{key}', description: 'Contenido de la celda (por columna)' },
      { name: 'footer', description: 'Filas de pie (scoped: columns). Sin slot ni prop footer → no renderiza tfoot' },
      { name: 'empty', description: 'Contenido custom del estado vacío' },
    ],
    events: [],
    exposes: [],
    interfaceCode: `interface Column {
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
}`,
  },
  sections: [
    {
      id: "basic",
      title: "Basic",
      layout: "col",
      variants: [
        { id: "default", props: { columns: COLUMNS, data: DATA } },
        { id: "derived", props: { columns: [], data: DATA } },
        { id: "align", props: { columns: COLUMNS_ALIGN, data: DATA } },
      ],
      vue: `  <Table :columns="columns" :data="data" />`,
      vanilla: `${UMD}

<cu-table id="tbl-basic"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-basic');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza headers y celdas desde columns+data",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "default") return;
              const headers = wrapper.findAll("th").map((th) => th.text().trim());
              expect(headers).toEqual(["ID", "Nombre", "Estado"]);
              const cells = wrapper.findAll("td").map((td) => td.text().trim());
              expect(cells).toContain("Alice Johnson");
              expect(cells).toContain("Bob Smith");
            },
          },
          {
            name: "deriva columnas de la data cuando columns está vacío",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "derived") return;
              const headers = wrapper.findAll("th").map((th) => th.text().trim());
              expect(headers).toEqual(["id", "name", "status"]);
              expect(wrapper.find("td").text().trim()).toBe("1");
            },
          },
          {
            name: "respeta align por columna",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "align") return;
              const tds = wrapper.findAll("td");
              expect(tds[0]!.classes()).toContain("cu-table-td--right");
              expect(tds[1]!.classes()).toContain("cu-table-td--center");
            },
          },
          {
            name: "es presentacional: no emite eventos",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "default") return;
              expect(wrapper.emitted()).toEqual({});
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      variants: [
        { id: "primary", props: { columns: COLUMNS, data: DATA, color: "primary" } },
        { id: "secondary", props: { columns: COLUMNS, data: DATA, color: "secondary" } },
        { id: "neutral", props: { columns: COLUMNS, data: DATA, color: "neutral" } },
        { id: "success", props: { columns: COLUMNS, data: DATA, color: "success" } },
        { id: "warning", props: { columns: COLUMNS, data: DATA, color: "warning" } },
        { id: "danger", props: { columns: COLUMNS, data: DATA, color: "danger" } },
      ],
      vue: `  <Table color="primary" :columns="columns" :data="data" />
  <Table color="secondary" :columns="columns" :data="data" />
  <Table color="neutral" :columns="columns" :data="data" />
  <Table color="success" :columns="columns" :data="data" />
  <Table color="warning" :columns="columns" :data="data" />
  <Table color="danger" :columns="columns" :data="data" />`,
      vanilla: `${UMD}

<cu-table id="tbl-color" color="primary"></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-color');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      variants: [
        { id: "soft", props: { columns: COLUMNS, data: DATA, variant: "soft" } },
        { id: "solid", props: { columns: COLUMNS, data: DATA, variant: "solid" } },
        { id: "outlined", props: { columns: COLUMNS, data: DATA, variant: "outlined" } },
        { id: "ghost", props: { columns: COLUMNS, data: DATA, variant: "ghost" } },
      ],
      vue: `  <Table variant="soft" :columns="columns" :data="data" />
  <Table variant="solid" :columns="columns" :data="data" />
  <Table variant="outlined" :columns="columns" :data="data" />
  <Table variant="ghost" :columns="columns" :data="data" />`,
      vanilla: `${UMD}

<cu-table id="tbl-variant" variant="outlined"></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-variant');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza y aplica la clase cu-table--outlined",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-table").exists()).toBe(true);
              const value = variant.props?.variant as string | undefined;
              if (value === "outlined") {
                expect(wrapper.find(".cu-table").classes()).toContain("cu-table--outlined");
              }
            },
          },
        ],
      },
    },

    {
      id: "scroll",
      title: "Scroll",
      layout: "col",
      variants: [{ id: "v1", props: { columns: COLUMNS, data: DATA } }],
      vue: `  <!-- Scroll con contenedor propio -->
  <div style="max-height: 300px; overflow-y: auto;">
    <Table :columns="columns" :data="data" />
  </div>`,
      vanilla: `${UMD}

<div style="max-height: 300px; overflow-y: auto;">
  <cu-table id="tbl-scroll"></cu-table>
</div>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-scroll');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-table",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-table").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "scroll-sticky",
      title: "Scroll (Sticky Header)",
      layout: "col",
      variants: [{ id: "v1", props: { columns: COLUMNS, data: DATA, maxHeight: "300px" } }],
      vue: `  <!-- Header sticky con la prop max-height -->
  <Table :columns="columns" :data="data" max-height="300px" />`,
      vanilla: `${UMD}

<cu-table id="tbl-sticky" max-height="300px"></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-sticky');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-table con maxHeight",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-table").exists()).toBe(true);
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
        { id: "default", props: { columns: COLUMNS, data: [] } },
        { id: "custom", props: { columns: COLUMNS, data: [], empty: "Sin registros" } },
      ],
      vue: `  <Table :columns="columns" :data="[]" />
  <Table :columns="columns" :data="[]" empty="Sin resultados para tu búsqueda" />`,
      vanilla: `${UMD}

<cu-table id="tbl-empty" empty="Sin resultados para tu búsqueda"></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    document.getElementById('tbl-empty').columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el mensaje empty y el colspan de las columnas",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "custom") return;
              const empty = wrapper.find(".cu-table-empty");
              expect(empty.text()).toBe("Sin registros");
              expect(empty.attributes("colspan")).toBe("3");
            },
          },
          {
            name: "usa el texto empty por defecto",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "default") return;
              expect(wrapper.find(".cu-table-empty").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "footer",
      title: "Footer (Totals)",
      layout: "col",
      variants: [
        {
          id: "slot",
          props: { columns: COLUMNS, data: DATA, color: "primary", variant: "soft" },
          slots: {
            footer: (({ columns }: { columns: unknown[] }) =>
              h("tr", {}, [
                h("td", { colspan: columns.length }, `Total: ${columns.length} columnas`),
              ])) as unknown as SlotContent,
          },
        },
        { id: "none", props: { columns: COLUMNS, data: DATA, color: "primary", variant: "soft" } },
      ],
      vue: `  <Table :columns="columns" :data="data" color="primary" variant="soft">
    <template #footer="{ columns: cols }">
      <tr>
        <td :colspan="cols.length">Total: {{ cols.length }} columnas</td>
      </tr>
    </template>
  </Table>`,
      vanilla: `${UMD}

<cu-table id="tbl-footer" color="primary" variant="soft"></cu-table>

<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-footer');
    ${vanillaAssign}
    table.footer = [
      { cells: [
        { value: 'Total', colspan: 2 },
        { value: '2 filas', align: 'right' },
      ]},
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el slot footer",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "slot") return;
              expect(wrapper.find("tfoot").exists()).toBe(true);
              expect(wrapper.find("tfoot td").text()).toBe("Total: 3 columnas");
            },
          },
          {
            name: "no muestra tfoot si no hay footer",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "none") return;
              expect(wrapper.find("tfoot").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "slots",
      title: "Named Slots",
      layout: "col",
      variants: [
        {
          id: "header",
          props: { columns: COLUMNS, data: DATA },
          slots: { "header-id": "<span class='custom-header'>Custom ID</span>" },
        },
        {
          id: "cell",
          props: { columns: COLUMNS, data: DATA },
          slots: {
            "cell-name": (({ value, row }: { value: string; row: Record<string, unknown> }) =>
              h("span", { class: "custom-cell" }, `[${value}] (id:${row.id})`)) as unknown as SlotContent,
          },
        },
      ],
      vue: `  <Table :columns="columns" :data="data">
    <template #header-id>
      <span class="custom-header">Custom ID</span>
    </template>
  </Table>

  <Table :columns="columns" :data="data">
    <template #cell-name="{ value, row }">
      <span class="custom-cell">[{{ value }}] (id:{{ row.id }})</span>
    </template>
  </Table>`,
      vanilla: `${UMD}

<cu-table id="tbl-slots"></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-slots');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "slot header-{key} reemplaza el contenido del header",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "header") return;
              expect(wrapper.find(".custom-header").exists()).toBe(true);
              expect(wrapper.find(".custom-header").text()).toBe("Custom ID");
            },
          },
          {
            name: "slot cell-{key} recibe value y row",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "cell") return;
              expect(wrapper.find(".custom-cell").exists()).toBe(true);
              expect(wrapper.find("td .custom-cell").text()).toBe("[Alice Johnson] (id:1)");
            },
          },
        ],
      },
    },

    {
      id: "loading",
      title: "Loading",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { columns: COLUMNS, data: DATA, loading: true } }],
      vue: `  <Table :columns="columns" :data="data" loading />`,
      vanilla: `${UMD}

<cu-table id="tbl-loading" loading></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-loading');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el loader cuando loading=true",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-loader").exists()).toBe(true);
              expect(wrapper.find(".cu-loader-bar--loading").exists()).toBe(true);
              expect(wrapper.find("tbody").classes()).toContain("cu-table-loading");
            },
          },
        ],
      },
    },

    {
      id: "compact",
      title: "Compact",
      badge: "false",
      layout: "col",
      variants: [
        { id: "soft", props: { columns: COLUMNS, data: DATA, compact: true } },
        { id: "outlined", props: { columns: COLUMNS, data: DATA, variant: "outlined", compact: true } },
      ],
      vue: `  <Table :columns="columns" :data="data" compact />
  <Table :columns="columns" :data="data" variant="outlined" compact />`,
      vanilla: `${UMD}

<cu-table id="tbl-compact" compact></cu-table>
<script>
  customElements.whenDefined('cu-table').then(() => {
    const table = document.getElementById('tbl-compact');
    ${vanillaAssign}
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-table (compact)",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-table").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
