import { defineComponent, h, onMounted, ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";
import {
  parseCSV,
  parseFile,
  validateRows,
  validateValue,
  buildTemplateCSV,
  type CellColumn,
} from "@/utils/cellsImporter";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./CellsImporter.stories.extras";

const DEMO_COLUMNS: CellColumn[] = [
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
  { key: "email", label: "Email", type: "email" },
];

const OUT_OF_ORDER_COLUMNS: CellColumn[] = [
  { key: "email", label: "Email", type: "email" },
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
];

const ONLY_CSV_COLUMNS: CellColumn[] = [{ key: "name", label: "Nombre", required: true }];

const DEMO_CSV = "Nombre,Edad,Email\nJuan,30,juan@x.com\nAna,200,correo-invalido\n,25,pepe@y.com";

function demoFile(): File {
  return new File([DEMO_CSV], "demo.csv", { type: "text/csv" });
}

const vueImport = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [
  { key: 'name', label: 'Nombre', required: true },
  { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
  { key: 'email', label: 'Email', type: 'email' },
]
<\/script>`;

function vueSnippet(body: string): string {
  return `${vueImport}

<template>
${body}
</template>`;
}

/**
 * Preview de la sección Validación: carga un CSV con filas válidas e inválidas
 * para mostrar la tabla de errores y el resumen del importador.
 */
const CellsImporterValidationPreview = defineComponent({
  name: "CellsImporterValidationPreview",
  setup() {
    const importerRef = ref<InstanceType<typeof CellsImporter> | null>(null);

    onMounted(() => {
      importerRef.value?.set(demoFile());
    });

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { style: "margin:0;font-size:var(--cu-font-size-sm);opacity:0.7" }, [
          "Archivo con ",
          h("strong", "Juan"),
          " (válida), ",
          h("strong", "Ana"),
          " (edad 200 y email inválido) y una fila sin nombre.",
        ]),
        h(CellsImporter, { ref: importerRef, columns: DEMO_COLUMNS }),
      ]);
  },
});

export const cuCellsImporterStories: ComponentStory = {
  component: "cu-cells-importer",
  vue: CellsImporter,
  extras,
  tokens: [
    '--ci-accent',
    '--cu-color-neutral-text',
    '--cu-color-success',
    '--cu-color-warning',
    '--cu-color-warning-soft',
    '--cu-color-danger',
    '--cu-font-sans',
    '--cu-font-size-xs',
    '--cu-font-size-sm',
    '--cu-radius',
    '--cu-space-2xs',
    '--cu-space-sm',
  ],
  api: {
    props: [
      { name: 'columns', type: 'CellColumn[]', default: '[]', description: 'Esquema de columnas (header esperado, tipo, reglas). Obligatorio.' },
      { name: 'formats', type: 'string[]', default: '[".xlsx", ".csv"]', description: 'Formatos deseados; se propagan al input (accept) y se muestran al usuario' },
      { name: 'delimiter', type: 'string', default: '","', description: 'Delimitador para archivos CSV' },
      { name: 'hasHeader', type: 'boolean', default: 'true', description: 'La primera fila del archivo es el encabezado' },
      { name: 'strict', type: 'boolean', default: 'false', description: 'false = las columnas se matchean por label sin importar el orden; true = respeta el orden del schema' },
      { name: 'sheet', type: 'string | number', default: '0', description: 'Hoja a leer en .xlsx (índice o nombre)' },
      { name: 'template', type: '{ enabled, type, filename }', default: '{ enabled: false, type: "csv", filename: "template" }', description: 'Configura el botón de descarga de plantilla (csv | xlsx)' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"outlined"', description: 'outlined, soft, ghost, subtle' },
      { name: 'placeholder', type: 'string', default: '"Seleccionar archivo"', description: 'Texto cuando no hay archivo' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la selección' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura: bloquea selección' },
      { name: 'maxSize', type: 'number', default: '—', description: 'Tamaño máximo en bytes' },
      { name: 'inputType', type: 'string', default: '"input"', description: 'Control de selección: input o zone (drag & drop)' },
    ],
    events: [
      { name: 'parse', type: 'custom', description: '{ rows, headers, fileName } al leer correctamente un archivo' },
      { name: 'error', type: 'custom', description: 'CellError[] con los errores de validación del contenido' },
      { name: 'change', type: 'custom', description: 'File | null al seleccionar o quitar archivo' },
    ],
    exposes: [
      { name: 'getRows', type: '() => Record<string, unknown>[]', description: 'Devuelve las filas parseadas' },
      { name: 'getHeaders', type: '() => string[]', description: 'Devuelve los encabezados del archivo' },
      { name: 'getErrors', type: '() => CellError[]', description: 'Devuelve los errores de validación' },
      { name: 'getFile', type: '() => File | null', description: 'Devuelve el File seleccionado o null' },
      { name: 'validate', type: '() => CellError[]', description: 'Re-valida las filas actuales y devuelve los errores' },
      { name: 'downloadTemplate', type: '() => void', description: 'Descarga la plantilla configurada (csv/xlsx)' },
      { name: 'reset', type: '() => void', description: 'Limpia archivo, filas y errores' },
      { name: 'set', type: '(file: File | null) => void', description: 'Establece el archivo programáticamente' },
      { name: 'trigger', type: '() => void', description: 'Abre el diálogo de selección de archivos' },
      { name: 'focus', type: '() => void', description: 'Pone el foco en el control' },
    ],
    interfaceCode: `// CellColumn
interface CellColumn {
  key: string                       // identificador de la columna
  label: string                     // header esperado en el archivo
  type?: 'string' | 'integer' | 'number' | 'date' | 'boolean' | 'email'
  required?: boolean                // rechaza celdas vacías
  min?: number                      // valor mínimo (number/integer)
  max?: number                      // valor máximo (number/integer)
  minLength?: number                // largo mínimo (string)
  maxLength?: number                // largo máximo (string)
  pattern?: string | RegExp         // regex de formato (string)
  enum?: (string | number)[]        // valores permitidos
  unique?: boolean                  // rechaza duplicados en la columna
  validate?: (value: unknown, row: Record<string, unknown>)
    => string | boolean | undefined // regla custom
}

// CellError
interface CellError {
  row: number          // índice de la fila (0-based)
  columnKey: string
  columnLabel: string
  message: string
}`,
  },
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "input",
      badgeTitle: "inputType por defecto",
      layout: "col",
      variants: [{ id: "default", props: { columns: DEMO_COLUMNS } }],
      vue: vueSnippet(`  <CellsImporter :columns="columns" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    imp.columns = [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
      { key: 'email', label: 'Email', type: 'email' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el FileInput por defecto",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-input").exists()).toBe(true);
              expect(wrapper.find(".cu-file-zone").exists()).toBe(false);
            },
          },
          {
            name: "expone los métodos del importador",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as Record<string, unknown>;
              for (const method of [
                "getRows",
                "getHeaders",
                "getErrors",
                "getFile",
                "validate",
                "downloadTemplate",
                "reset",
                "set",
                "trigger",
                "focus",
              ]) {
                expect(typeof vm[method]).toBe("function");
              }
              expect((vm.getRows as () => unknown[])()).toEqual([]);
              expect((vm.getHeaders as () => unknown[])()).toEqual([]);
              expect((vm.getErrors as () => unknown[])()).toEqual([]);
              expect((vm.getFile as () => unknown)()).toBeNull();
            },
          },
        ],
      },
    },

    {
      id: "input-type",
      title: "Formas de input",
      badge: "input",
      badgeTitle: "inputType por defecto",
      layout: "col",
      variants: [
        { id: "input", props: { columns: DEMO_COLUMNS, inputType: "input" } },
        { id: "zone", props: { columns: DEMO_COLUMNS, inputType: "zone" } },
      ],
      vue: vueSnippet(`  <CellsImporter :columns="columns" />                       <!-- input (default) -->
  <CellsImporter :columns="columns" input-type="zone" />      <!-- zona drag & drop -->`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer input-type="zone" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "inputType decide entre FileInput y FileInputZone",
            run({ wrapper, expect }, variant) {
              const type = (variant.props?.inputType as string | undefined) ?? "input";
              if (type === "zone") {
                expect(wrapper.find(".cu-file-zone").exists()).toBe(true);
                expect(wrapper.find(".cu-file-input").exists()).toBe(false);
              } else {
                expect(wrapper.find(".cu-file-input").exists()).toBe(true);
                expect(wrapper.find(".cu-file-zone").exists()).toBe(false);
              }
            },
          },
        ],
      },
    },

    {
      id: "strict",
      title: "Orden (strict)",
      badge: "false",
      badgeTitle: "strict por defecto",
      layout: "col",
      variants: [
        { id: "false", props: { columns: OUT_OF_ORDER_COLUMNS, strict: false } },
        { id: "true", props: { columns: OUT_OF_ORDER_COLUMNS, strict: true } },
      ],
      description:
        "false = las columnas se matchean por label sin importar el orden; true = respeta la posición del schema.",
      vue: vueSnippet(`  <p>Por label, sin importar el orden (strict=false)</p>
  <CellsImporter :columns="columns" />
  <p>Respetando el orden (strict)</p>
  <CellsImporter :columns="columns" strict />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="a" columns='[{"key":"email","label":"Email"}]'></cu-cells-importer>
<cu-cells-importer id="b" strict columns='[{"key":"email","label":"Email"}]'></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "parseFile mapea por label o por posición según strict",
            async run({ expect }, variant) {
              const strict = Boolean(variant.props?.strict);
              const file = new File(["Email,Edad,Nombre\nx@y.com,30,Juan"], "d.csv", {
                type: "text/csv",
              });
              const { rows, warnings } = await parseFile(file, OUT_OF_ORDER_COLUMNS, {
                hasHeader: true,
                strict,
              });
              if (strict) {
                expect(rows[0]).not.toHaveProperty("name");
                expect(warnings.some((w) => w.includes("Nombre"))).toBe(true);
              } else {
                expect(rows[0]).toMatchObject({ name: "Juan", age: 30, email: "x@y.com" });
              }
            },
          },
        ],
      },
    },

    {
      id: "template",
      title: "Plantilla",
      badge: "disabled",
      badgeTitle: "template.enabled por defecto: false",
      layout: "col",
      variants: [
        { id: "disabled", props: { columns: DEMO_COLUMNS } },
        {
          id: "csv",
          props: {
            columns: DEMO_COLUMNS,
            template: { enabled: true, type: "csv", filename: "plantilla" },
          },
        },
      ],
      vue: vueSnippet(`  <CellsImporter
    :columns="columns"
    :template="{ enabled: true, type: 'csv', filename: 'plantilla' }"
  />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer
  id="imp"
  columns='[{"key":"name","label":"Nombre","required":true},{"key":"age","label":"Edad","type":"integer"}]'
  template='{"enabled":true,"type":"csv","filename":"plantilla"}'
></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "muestra el botón de plantilla solo si template.enabled",
            run({ wrapper, expect }, variant) {
              const enabled = Boolean(
                (variant.props?.template as { enabled?: boolean } | undefined)?.enabled,
              );
              expect(wrapper.text().includes("Descargar plantilla")).toBe(enabled);
            },
          },
          {
            name: "buildTemplateCSV escapa comas en los labels",
            run({ expect }) {
              const csv = buildTemplateCSV([
                { key: "a", label: "A, B" },
                { key: "b", label: "C" },
              ]);
              expect(csv).toBe('"A, B",C\n');
            },
          },
        ],
      },
    },

    {
      id: "formats",
      title: "Formatos",
      badge: ".xlsx, .csv",
      badgeTitle: "formats por defecto",
      layout: "col",
      variants: [
        { id: "default", props: { columns: DEMO_COLUMNS } },
        { id: "csv-only", props: { columns: ONLY_CSV_COLUMNS, formats: [".csv"] } },
      ],
      vue: vueSnippet(`  <CellsImporter :columns="columns" />                     <!-- default: .xlsx, .csv -->
  <CellsImporter :columns="columns" :formats="['.csv']" /> <!-- solo .csv -->`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]' formats='[".csv"]'></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "propaga formats al accept del input",
            run({ wrapper, expect }, variant) {
              const formats = (variant.props?.formats as string[] | undefined) ?? [".xlsx", ".csv"];
              const input = wrapper.find(".cu-file-input input[type='file']");
              expect(input.exists()).toBe(true);
              expect(input.attributes("accept")).toBe(formats.join(","));
            },
          },
        ],
      },
    },

    {
      id: "delimiter",
      title: "Delimitador",
      badge: '","',
      badgeTitle: "delimiter por defecto",
      layout: "col",
      variants: [
        { id: "comma", props: { columns: DEMO_COLUMNS, delimiter: "," } },
        { id: "semicolon", props: { columns: DEMO_COLUMNS, delimiter: ";" } },
      ],
      vue: vueSnippet(`  <CellsImporter :columns="columns" />          <!-- delimiter="," (default) -->
  <CellsImporter :columns="columns" delimiter=";" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp" columns='[{"key":"name","label":"Nombre","required":true}]' delimiter=";"></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "parseCSV respeta el delimiter del variant y las comillas",
            run({ expect }, variant) {
              const delimiter = (variant.props?.delimiter as string | undefined) ?? ",";
              expect(parseCSV(`a${delimiter}b\n1${delimiter}2`, delimiter)).toEqual([
                ["a", "b"],
                ["1", "2"],
              ]);
              if (delimiter === ",") {
                expect(parseCSV('a,"hola, mundo","x ""y"""\n1,2,3')).toEqual([
                  ["a", "hola, mundo", 'x "y"'],
                  ["1", "2", "3"],
                ]);
              }
            },
          },
        ],
      },
    },

    {
      id: "has-header",
      title: "Encabezado",
      badge: "true",
      badgeTitle: "hasHeader por defecto",
      layout: "col",
      variants: [
        { id: "true", props: { columns: DEMO_COLUMNS, hasHeader: true } },
        { id: "false", props: { columns: DEMO_COLUMNS, hasHeader: false } },
      ],
      vue: vueSnippet(`  <!-- has-header (default true): consume la 1ª fila como encabezado -->
  <CellsImporter :columns="columns" />
  <!-- has-header=false: la 1ª fila es dato (mapea por posición) -->
  <CellsImporter :columns="columns" :has-header="false" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="a" columns='[{"key":"name","label":"Nombre"}]'></cu-cells-importer>
<cu-cells-importer id="b" columns='[{"key":"name","label":"Nombre"}]'></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    // en CE los booleanos van por propiedad, no por atributo "false"
    document.getElementById('b').hasHeader = false;
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "parseFile usa la primera fila como header o como dato",
            async run({ expect }, variant) {
              const hasHeader = variant.props?.hasHeader !== false;
              const file = new File(["Juan,30,x@y.com"], "d.csv", { type: "text/csv" });
              const { rows, headers } = await parseFile(file, DEMO_COLUMNS, {
                hasHeader,
                strict: false,
              });
              if (hasHeader) {
                expect(headers).toEqual(["Juan", "30", "x@y.com"]);
                expect(rows).toEqual([]);
              } else {
                expect(rows[0]).toMatchObject({ name: "Juan", age: 30, email: "x@y.com" });
              }
            },
          },
        ],
      },
    },

    {
      id: "appearance",
      title: "Apariencia",
      badge: "neutral",
      badgeTitle: "color neutral · variant outlined",
      layout: "col",
      variants: [
        { id: "primary-soft", props: { columns: DEMO_COLUMNS, color: "primary", variant: "soft" } },
        {
          id: "success-subtle",
          props: { columns: DEMO_COLUMNS, color: "success", variant: "subtle" },
        },
        {
          id: "warning-ghost",
          props: { columns: DEMO_COLUMNS, color: "warning", variant: "ghost" },
        },
        { id: "danger-outlined", props: { columns: DEMO_COLUMNS, color: "danger" } },
      ],
      vue: vueSnippet(`  <CellsImporter :columns="columns" color="primary" variant="soft" />
  <CellsImporter :columns="columns" color="success" variant="subtle" />
  <CellsImporter :columns="columns" color="warning" variant="ghost" />
  <CellsImporter :columns="columns" color="danger" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer color="primary" variant="soft" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer color="success" variant="subtle" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer color="warning" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color})`);
            },
          },
          {
            name: "aplica la clase cu-file-input--{variant}",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string | undefined) ?? "outlined";
              expect(wrapper.find(".cu-file-input").classes()).toContain(`cu-file-input--${value}`);
            },
          },
        ],
      },
    },

    {
      id: "state",
      title: "Estado",
      badge: "false",
      badgeTitle: "disabled / readOnly por defecto",
      layout: "col",
      variants: [
        { id: "disabled", props: { columns: DEMO_COLUMNS, disabled: true, placeholder: "Deshabilitado" } },
        { id: "read-only", props: { columns: DEMO_COLUMNS, readOnly: true, placeholder: "Solo lectura" } },
        { id: "max-size", props: { columns: DEMO_COLUMNS, maxSize: 1024, placeholder: "Máximo 1KB" } },
      ],
      vue: vueSnippet(`  <CellsImporter :columns="columns" disabled placeholder="Deshabilitado" />
  <CellsImporter :columns="columns" read-only placeholder="Solo lectura" />
  <CellsImporter :columns="columns" :max-size="1024" placeholder="Máximo 1KB" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer disabled columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Deshabilitado"></cu-cells-importer>
<cu-cells-importer read-only columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Solo lectura"></cu-cells-importer>
<cu-cells-importer max-size="1024" columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Máximo 1KB"></cu-cells-importer>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "disabled aplica la clase y aria-disabled",
            run({ wrapper, expect }, variant) {
              const control = wrapper.find(".cu-file-input");
              if (variant.props?.disabled) {
                expect(control.classes()).toContain("cu-file-input--disabled");
                expect(control.attributes("aria-disabled")).toBe("true");
              } else {
                expect(control.classes()).not.toContain("cu-file-input--disabled");
              }
            },
          },
          {
            name: "maxSize se muestra en el placeholder",
            run({ wrapper, expect }, variant) {
              if (!variant.props?.maxSize) return;
              expect(wrapper.text()).toContain("máx");
            },
          },
        ],
      },
    },

    {
      id: "validation",
      title: "Validación",
      layout: "col",
      description:
        "Al cargar un archivo, las celdas se validan contra el schema y se listan los errores por fila.",
      variants: [{ id: "columns", props: { columns: DEMO_COLUMNS } }],
      preview: CellsImporterValidationPreview,
      vue: vueSnippet(`  <CellsImporter :columns="columns" />`),
      vanilla: `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    const csv = 'Nombre,Edad,Email\\nJuan,30,juan@x.com\\nAna,200,correo-invalido\\n,25,pepe@y.com';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-cells-importer",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-cells-importer").exists()).toBe(true);
            },
          },
          {
            name: "validateValue aplica requerido, rango, entero, email y enum",
            run({ expect }) {
              expect(validateValue({ key: "a", label: "A", required: true }, "", {})).toBe(
                "Campo obligatorio",
              );
              expect(validateValue({ key: "a", label: "A", required: true }, "x", {})).toBeNull();
              expect(
                validateValue({ key: "a", label: "A", type: "integer", min: 0, max: 120 }, "200", {}),
              ).toMatch(/menor o igual/);
              expect(
                validateValue({ key: "a", label: "A", type: "integer", min: 0 }, "-1", {}),
              ).toMatch(/mayor o igual/);
              expect(validateValue({ key: "a", label: "A", type: "integer" }, "abc", {})).toMatch(
                /entero/,
              );
              expect(validateValue({ key: "a", label: "A", type: "integer" }, "42", {})).toBeNull();
              expect(validateValue({ key: "a", label: "A", type: "email" }, "malo", {})).toMatch(
                /email/,
              );
              expect(validateValue({ key: "a", label: "A", type: "email" }, "a@b.com", {})).toBeNull();
              expect(validateValue({ key: "a", label: "A", enum: ["x", "y"] }, "z", {})).toMatch(
                /uno de/,
              );
              expect(validateValue({ key: "a", label: "A", enum: ["x", "y"] }, "x", {})).toBeNull();
            },
          },
          {
            name: "parseFile + validateRows detectan email inválido y edad fuera de rango",
            async run({ expect }) {
              const file = new File(["Nombre,Edad,Email\nAna,300,correo"], "d.csv", {
                type: "text/csv",
              });
              const { rows } = await parseFile(file, DEMO_COLUMNS, {
                hasHeader: true,
                strict: false,
              });
              const errors = validateRows(rows, DEMO_COLUMNS);
              expect(errors.some((e) => e.columnKey === "email")).toBe(true);
              expect(errors.some((e) => e.columnKey === "age")).toBe(true);
            },
          },
          {
            name: "validate() re-valida y devuelve los errores",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as { getErrors: () => unknown[]; validate: () => unknown[] };
              expect(vm.getErrors()).toEqual([]);
              expect(vm.validate()).toEqual([]);
            },
          },
        ],
      },
    },
  ],
};
