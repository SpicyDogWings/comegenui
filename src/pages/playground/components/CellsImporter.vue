<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import CellsImporter from "@/components/form/CellsImporter.vue";
import type { CellColumn, CellError } from "@/utils/cellsImporter";

const demoColumns: CellColumn[] = [
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
  { key: "email", label: "Email", type: "email" },
];

const outOfOrderColumns: CellColumn[] = [
  { key: "email", label: "Email", type: "email" },
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
];

const demoRef = ref<InstanceType<typeof CellsImporter> | null>(null);
const demoState = ref("Sin archivo");

function demoCSV() {
  const csv = "Nombre,Edad,Email\nJuan,30,juan@x.com\nAna,200,correo-invalido\n,25,pepe@y.com";
  return new File([csv], "demo.csv", { type: "text/csv" });
}

function loadDemo() {
  demoRef.value?.set(demoCSV());
  demoState.value = "Cargado demo.csv";
}
function resetDemo() {
  demoRef.value?.reset();
  demoState.value = "Limpio";
}
function readState() {
  const rows = demoRef.value?.getRows() ?? [];
  const errors = demoRef.value?.getErrors() ?? [];
  demoState.value = `${rows.length} filas · ${errors.length} errores`;
}

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Formas de input', id: 'inputtype' },
  { label: 'Orden (strict)', id: 'strict' },
  { label: 'Plantilla', id: 'template' },
  { label: 'Formatos', id: 'formats' },
  { label: 'Delimitador', id: 'delimiter' },
  { label: 'Encabezado', id: 'hasheader' },
  { label: 'Apariencia', id: 'apariencia' },
  { label: 'Estado', id: 'estado' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'API', id: 'api', children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const vueImport = `<script setup>
import { ref } from 'vue'
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [
  { key: 'name', label: 'Nombre', required: true },
  { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
  { key: 'email', label: 'Email', type: 'email' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <CellsImporter :columns="columns" />`);

const inputTypeVue = vueSnippet(`  <CellsImporter :columns="columns" />                       <!-- input (default) -->
  <CellsImporter :columns="columns" input-type="zone" />  <!-- zona drag & drop -->`);

const inputTypeVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer input-type="zone" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>`;

const strictVue = vueSnippet(`  <p>Por label, sin importar el orden (strict=false)</p>
  <CellsImporter :columns="columns" />
  <p>Respetando el orden (strict)</p>
  <CellsImporter :columns="columns" strict />`);

const templateVue = vueSnippet(`  <CellsImporter
    :columns="columns"
    :template="{ enabled: true, type: 'csv', filename: 'plantilla' }"
  />`);

const progVue = `<script setup>
import { ref } from 'vue'
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [
  { key: 'name', label: 'Nombre', required: true },
  { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
  { key: 'email', label: 'Email', type: 'email' },
]
const imp = ref(null)

function loadDemo() {
  const csv = 'Nombre,Edad,Email\\nJuan,30,juan@x.com\\nAna,200,correo-invalido\\n,25,pepe@y.com'
  imp.value.set(new File([csv], 'demo.csv', { type: 'text/csv' }))
}
const rows = () => imp.value.getRows()          // filas parseadas
const errors = () => imp.value.getErrors()      // errores de validación
const file = () => imp.value.getFile()          // File | null
<\/script>

<template>
  <CellsImporter ref="imp" :columns="columns" />
</template>`;

const defaultVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

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
<\/script>`;

const strictVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="a" columns='[{"key":"email","label":"Email"}]'></cu-cells-importer>
<cu-cells-importer id="b" strict columns='[{"key":"email","label":"Email"}]'></cu-cells-importer>`;

const templateVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer
  id="imp"
  columns='[{"key":"name","label":"Nombre","required":true},{"key":"age","label":"Edad","type":"integer"}]'
  template='{"enabled":true,"type":"csv","filename":"plantilla"}'
></cu-cells-importer>`;

const progVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    const csv = 'Nombre,Edad,Email\\nJuan,30,juan@x.com\\nAna,200,correo-invalido\\n,25,pepe@y.com';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
    imp.getRows();   // filas parseadas
    imp.getErrors(); // errores de validación
  });
<\/script>`;

// --- Formatos ---
const onlyCsvColumns: CellColumn[] = [
  { key: "name", label: "Nombre", required: true },
];

// --- Delimitador ---
const delimDefaultRef = ref<InstanceType<typeof CellsImporter> | null>(null);
const delimPipeRef = ref<InstanceType<typeof CellsImporter> | null>(null);
const delimDefaultState = ref("Sin cargar");
const delimPipeState = ref("Sin cargar");
const pipeCSV = "Nombre;Edad;Email\nJuan;30;juan@x.com\nAna;25;ana@x.com\nPepe;40;pepe@x.com";

function pipeFile() {
  return new File([pipeCSV], "datos.csv", { type: "text/csv" });
}
function loadDelimDefault() {
  delimDefaultRef.value?.set(pipeFile());
}
function loadDelimPipe() {
  delimPipeRef.value?.set(pipeFile());
}
function syncDelimDefault() {
  delimDefaultState.value = `${delimDefaultRef.value?.getRows()?.length ?? 0} filas · ${delimDefaultRef.value?.getErrors()?.length ?? 0} errores`;
}
function syncDelimPipe() {
  delimPipeState.value = `${delimPipeRef.value?.getRows()?.length ?? 0} filas · ${delimPipeRef.value?.getErrors()?.length ?? 0} errores`;
}

// --- hasHeader ---
const hhTrueRef = ref<InstanceType<typeof CellsImporter> | null>(null);
const hhFalseRef = ref<InstanceType<typeof CellsImporter> | null>(null);
const hhTrueState = ref("Sin cargar");
const hhFalseState = ref("Sin cargar");
const headerlessCSV = "Juan,30,juan@x.com\nAna,25,ana@x.com";

function headerlessFile() {
  return new File([headerlessCSV], "sin-encabezado.csv", { type: "text/csv" });
}
function loadHhTrue() {
  hhTrueRef.value?.set(headerlessFile());
}
function loadHhFalse() {
  hhFalseRef.value?.set(headerlessFile());
}
function syncHhTrue() {
  hhTrueState.value = `${hhTrueRef.value?.getRows()?.length ?? 0} filas · ${hhTrueRef.value?.getErrors()?.length ?? 0} errores`;
}
function syncHhFalse() {
  hhFalseState.value = `${hhFalseRef.value?.getRows()?.length ?? 0} filas · ${hhFalseRef.value?.getErrors()?.length ?? 0} errores`;
}

const colorsCSV = "Nombre,Edad,Email\nJuan,30,juan@x.com";

const formatsVue = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [{ key: 'name', label: 'Nombre', required: true }]
<\/script>

<template>
  <CellsImporter :columns="columns" />                     <!-- default: .xlsx, .csv -->
  <CellsImporter :columns="columns" :formats="['.csv']" /> <!-- solo .csv -->
</template>`;

const formatsVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer columns='[{"key":"name","label":"Nombre","required":true}]' formats='[".csv"]'></cu-cells-importer>`;

const delimiterVue = `<script setup>
import { ref } from 'vue'
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [{ key: 'name', label: 'Nombre', required: true }]
const imp = ref(null)

function load() {
  const csv = 'Nombre;Edad\\nJuan;30'     // separado por ;
  imp.value.set(new File([csv], 'datos.csv', { type: 'text/csv' }))
}
<\/script>

<template>
  <CellsImporter ref="imp" :columns="columns" delimiter=";" />
</template>`;

const delimiterVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp" columns='[{"key":"name","label":"Nombre","required":true}]' delimiter=";"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    const csv = 'Nombre;Edad\\nJuan;30';
    imp.set(new File([csv], 'datos.csv', { type: 'text/csv' }));
  });
<\/script>`;

const hasHeaderVue = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'age', label: 'Edad' },
  { key: 'email', label: 'Email' },
]
const headerless = 'Juan,30,juan@x.com\\nAna,25,ana@x.com'
<\/script>

<template>
  <!-- has-header (default true): consume la 1ª fila como encabezado -->
  <CellsImporter :columns="columns" />
  <!-- has-header=false: la 1ª fila es dato (mapea por posición) -->
  <CellsImporter :columns="columns" :has-header="false" />
</template>`;

const hasHeaderVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="a" columns='[{"key":"name","label":"Nombre"}]'></cu-cells-importer>
<cu-cells-importer id="b" columns='[{"key":"name","label":"Nombre"}]'></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    // en CE los booleanos van por propiedad, no por atributo "false"
    document.getElementById('b').hasHeader = false;
  });
<\/script>`;

const aparienciaVue = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [{ key: 'name', label: 'Nombre', required: true }]
<\/script>

<template>
  <CellsImporter :columns="columns" color="primary" variant="soft" />
  <CellsImporter :columns="columns" color="success" variant="subtle" />
  <CellsImporter :columns="columns" color="warning" />
</template>`;

const aparienciaVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer color="primary" variant="soft" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer color="success" variant="subtle" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>
<cu-cells-importer color="warning" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>`;

const estadoVue = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [{ key: 'name', label: 'Nombre', required: true }]
<\/script>

<template>
  <CellsImporter :columns="columns" disabled placeholder="Deshabilitado" />
  <CellsImporter :columns="columns" read-only placeholder="Solo lectura" />
  <CellsImporter :columns="columns" :max-size="1024" placeholder="Máximo 1KB" />
</template>`;

const estadoVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer disabled columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Deshabilitado"></cu-cells-importer>
<cu-cells-importer read-only columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Solo lectura"></cu-cells-importer>
<cu-cells-importer max-size="1024" columns='[{"key":"name","label":"Nombre","required":true}]' placeholder="Máximo 1KB"></cu-cells-importer>`;

const interfaceCode = `// CellColumn
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
}`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
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
];

const eventsData = [
  { name: 'parse', type: 'custom', description: '{ rows, headers, fileName } al leer correctamente un archivo' },
  { name: 'error', type: 'custom', description: 'CellError[] con los errores de validación del contenido' },
  { name: 'change', type: 'custom', description: 'File | null al seleccionar o quitar archivo' },
];

const exposesData = [
  { name: 'getRows', type: 'method', description: 'Devuelve las filas parseadas' },
  { name: 'getHeaders', type: 'method', description: 'Devuelve los encabezados del archivo' },
  { name: 'getErrors', type: 'method', description: 'Devuelve los errores de validación' },
  { name: 'getFile', type: 'method', description: 'Devuelve el File seleccionado o null' },
  { name: 'validate', type: 'method', description: 'Re-valida las filas actuales y devuelve los errores' },
  { name: 'downloadTemplate', type: 'method', description: 'Descarga la plantilla configurada (csv/xlsx)' },
  { name: 'reset', type: 'method', description: 'Limpia archivo, filas y errores' },
  { name: 'set', type: 'method', description: 'set(file: File | null): establece el archivo programáticamente' },
  { name: 'trigger', type: 'method', description: 'Abre el diálogo de selección de archivos' },
  { name: 'focus', type: 'method', description: 'Pone el foco en el control' },
];
</script>

<template>
  <PlaygroundLayout title="CellsImporter" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <CellsImporter :columns="demoColumns" />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              Acepta <strong>.xlsx</strong> y <strong>.csv</strong>; valida nombre (obligatorio), edad (entero 0-120) y email.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="inputtype" class="playground-section">
        <div class="playground-heading">
          <h2>Formas de input</h2>
          <Badge color="neutral" title="Valor por defecto">input</Badge>
        </div>
        <SectionDemo :vue-code="inputTypeVue" :vanilla-code="inputTypeVanilla">
          <div class="playground-col">
            <CellsImporter :columns="demoColumns" />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              <code>input-type="input"</code> (default): input compacto.
            </p>
            <CellsImporter :columns="demoColumns" input-type="zone" />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              <code>input-type="zone"</code>: zona drag &amp; drop (single file). La validación y la tabla de errores son las mismas.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="strict" class="playground-section">
        <div class="playground-heading">
          <h2>Orden (strict)</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="strictVue" :vanilla-code="strictVanilla">
          <div class="playground-col">
            <p style="margin:0;font-size:var(--cu-font-size-sm)">
              Por label, sin importar el orden (schema en otro orden que el archivo):
            </p>
            <CellsImporter :columns="outOfOrderColumns" />
            <p style="margin:0;font-size:var(--cu-font-size-sm)">
              Respetando el orden (strict):
            </p>
            <CellsImporter :columns="outOfOrderColumns" strict />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="template" class="playground-section">
        <div class="playground-heading">
          <h2>Plantilla</h2>
          <Badge color="neutral" title="Por defecto">disabled</Badge>
        </div>
        <SectionDemo :vue-code="templateVue" :vanilla-code="templateVanilla">
          <div class="playground-col">
            <CellsImporter
              :columns="demoColumns"
              :template="{ enabled: true, type: 'csv', filename: 'plantilla' }"
            />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              El botón descarga un .csv con los headers esperados.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="formats" class="playground-section">
        <div class="playground-heading">
          <h2>Formatos</h2>
          <Badge color="neutral" title="Valor por defecto">.xlsx, .csv</Badge>
        </div>
        <SectionDemo :vue-code="formatsVue" :vanilla-code="formatsVanilla">
          <div class="playground-col">
            <CellsImporter :columns="demoColumns" />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              Default: acepta <strong>.xlsx</strong> y <strong>.csv</strong> (se listan en el input).
            </p>
            <CellsImporter :columns="onlyCsvColumns" :formats="['.csv']" />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              Restringido a <strong>.csv</strong>: el accept y la etiqueta reflejan solo ese formato.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="delimiter" class="playground-section">
        <div class="playground-heading">
          <h2>Delimitador</h2>
          <Badge color="neutral" title="Valor por defecto">","</Badge>
        </div>
        <SectionDemo :vue-code="delimiterVue" :vanilla-code="delimiterVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="loadDelimDefault">default (",")</Button>
              <Button color="neutral" @click="loadDelimPipe">delimiter=";"</Button>
            </div>
            <p class="playground-state">
              default: <strong>{{ delimDefaultState }}</strong>
              · con ";" : <strong>{{ delimPipeState }}</strong>
            </p>
            <CellsImporter
              ref="delimDefaultRef"
              :columns="demoColumns"
              @parse="syncDelimDefault"
              @error="syncDelimDefault"
            />
            <CellsImporter
              ref="delimPipeRef"
              :columns="demoColumns"
              delimiter=";"
              @parse="syncDelimPipe"
              @error="syncDelimPipe"
            />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              Ambos cargan el mismo archivo separado por <strong>";"</strong>. El de <code>","</code> no
              matchea columnas (celdas vacías → errores); el de <code>";"</code> lee las 3 filas sin errores.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="hasheader" class="playground-section">
        <div class="playground-heading">
          <h2>Encabezado</h2>
          <Badge color="neutral" title="Valor por defecto">true</Badge>
        </div>
        <SectionDemo :vue-code="hasHeaderVue" :vanilla-code="hasHeaderVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="loadHhTrue">has-header (true)</Button>
              <Button color="neutral" @click="loadHhFalse">has-header=false</Button>
            </div>
            <p class="playground-state">
              true: <strong>{{ hhTrueState }}</strong>
              · false: <strong>{{ hhFalseState }}</strong>
            </p>
            <CellsImporter
              ref="hhTrueRef"
              :columns="demoColumns"
              @parse="syncHhTrue"
              @error="syncHhTrue"
            />
            <CellsImporter
              ref="hhFalseRef"
              :columns="demoColumns"
              :has-header="false"
              @parse="syncHhFalse"
              @error="syncHhFalse"
            />
            <p style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              Ambos cargan un CSV <strong>sin encabezado</strong> ("Juan,30,…"). Con
              <code>has-header</code> (true) la 1ª fila se consume como encabezado y no matchea las
              columnas; con <code>false</code> la 1ª fila se lee como dato (mapeo por posición).
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="apariencia" class="playground-section">
        <div class="playground-heading">
          <h2>Apariencia</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
          <Badge color="neutral" title="Variante por defecto">outlined</Badge>
        </div>
        <SectionDemo :vue-code="aparienciaVue" :vanilla-code="aparienciaVanilla">
          <div class="playground-col">
            <CellsImporter :columns="demoColumns" color="primary" variant="soft" />
            <CellsImporter :columns="demoColumns" color="success" variant="subtle" />
            <CellsImporter :columns="demoColumns" color="warning" variant="ghost" />
            <CellsImporter :columns="demoColumns" color="danger" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="estado" class="playground-section">
        <div class="playground-heading">
          <h2>Estado</h2>
          <Badge color="neutral" title="disabled por defecto">false</Badge>
          <Badge color="neutral" title="readOnly por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="estadoVue" :vanilla-code="estadoVanilla">
          <div class="playground-col">
            <CellsImporter :columns="demoColumns" disabled placeholder="Deshabilitado" />
            <CellsImporter :columns="demoColumns" read-only placeholder="Solo lectura" />
            <CellsImporter :columns="demoColumns" :max-size="1024" placeholder="Máximo 1KB" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="progVue" :vanilla-code="progVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="loadDemo">set(demo.csv)</Button>
              <Button color="neutral" @click="readState">getRows()/getErrors()</Button>
              <Button color="neutral" @click="resetDemo">reset()</Button>
            </div>
            <p class="playground-state">{{ demoState }}</p>
            <CellsImporter
              ref="demoRef"
              :columns="demoColumns"
              @parse="readState"
              @error="readState"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

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