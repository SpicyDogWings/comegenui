<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import FileInputZone from "@/components/form/FileInputZone.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const files1 = ref<File | File[] | null>(null);
const files2 = ref<File | File[] | null>(null);
const files3 = ref<File | File[] | null>(null);

const progRef = ref<InstanceType<typeof FileInputZone> | null>(null);
const progFiles = ref<File | File[] | null>(null);
const progGet = ref("");

function filesLabel(files: File | File[] | null) {
  if (!files) return "null";
  if (Array.isArray(files)) return `${files.length} archivo(s)`;
  return files.name;
}

function makeFiles() {
  return [
    new File(["contenido A"], "demo-a.txt", { type: "text/plain" }),
    new File(["contenido B"], "demo-b.txt", { type: "text/plain" }),
  ];
}

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Colors', id: 'colors' },
  { label: 'Multiple', id: 'multiple' },
  { label: 'With Accept', id: 'accept' },
  { label: 'With Max Size', id: 'maxsize' },
  { label: 'Directory', id: 'directory' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'ReadOnly', id: 'readonly' },
    { label: 'Programmatic', id: 'programmatic' },
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
    ],
  },
];

const vueImport = `<script setup>
import FileInputZone from '@/components/form/FileInputZone.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import { ref } from 'vue'
import FileInputZone from '@/components/form/FileInputZone.vue'

const files = ref(null)
<\/script>

<template>
  <FileInputZone v-model="files" />
</template>`;

const colorsVue = vueSnippet(`  <FileInputZone color="primary" placeholder="primary" />
  <FileInputZone color="secondary" placeholder="secondary" />
  <FileInputZone color="neutral" placeholder="neutral" />
  <FileInputZone color="success" placeholder="success" />
  <FileInputZone color="warning" placeholder="warning" />
  <FileInputZone color="danger" placeholder="danger" />`);

const multipleVue = vueSnippet(`  <FileInputZone multiple placeholder="Sube varios archivos" />`);

const acceptVue = vueSnippet(`  <FileInputZone accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs" />`);

const maxsizeVue = vueSnippet(`  <FileInputZone :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB por archivo" />`);

const directoryVue = vueSnippet(`  <FileInputZone directory placeholder="Selecciona una carpeta" />
  <FileInputZone directory :directory-deep="1" placeholder="Carpeta con 1 nivel de subcarpetas" />`);

const disabledVue = vueSnippet(`  <FileInputZone disabled placeholder="No disponible" />`);

const readonlyVue = vueSnippet(`  <FileInputZone read-only placeholder="Solo lectura" />`);

const defaultVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone></cu-file-input-zone>`;

const colorsVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone color="primary" placeholder="primary"></cu-file-input-zone>
<cu-file-input-zone color="secondary" placeholder="secondary"></cu-file-input-zone>
<cu-file-input-zone color="neutral" placeholder="neutral"></cu-file-input-zone>
<cu-file-input-zone color="success" placeholder="success"></cu-file-input-zone>
<cu-file-input-zone color="warning" placeholder="warning"></cu-file-input-zone>
<cu-file-input-zone color="danger" placeholder="danger"></cu-file-input-zone>`;

const multipleVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone multiple placeholder="Sube varios archivos"></cu-file-input-zone>`;

const acceptVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs"></cu-file-input-zone>`;

const maxsizeVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone max-size="5242880" placeholder="Máximo 5MB por archivo"></cu-file-input-zone>`;

const directoryVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone directory placeholder="Selecciona una carpeta"></cu-file-input-zone>
<cu-file-input-zone directory directory-deep="1" placeholder="Carpeta con 1 nivel de subcarpetas"></cu-file-input-zone>`;

const disabledVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone disabled placeholder="No disponible"></cu-file-input-zone>`;

const readonlyVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone read-only placeholder="Solo lectura"></cu-file-input-zone>`;

const progVue = `<script setup>
import { ref } from 'vue'
import FileInputZone from '@/components/form/FileInputZone.vue'

const fiz = ref(null)

const demo = () => {
  const files = fiz.value.get()    // File | File[] | null
  fiz.value.set([
    new File(['contenido A'], 'demo-a.txt', { type: 'text/plain' }),
    new File(['contenido B'], 'demo-b.txt', { type: 'text/plain' }),
  ])
  fiz.value.reset()                // limpia la selección
  fiz.value.focus()                // pone el foco
  fiz.value.trigger()              // abre el diálogo de archivos
}
<\/script>

<template>
  <FileInputZone ref="fiz" />
</template>`;

const progVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>

<cu-file-input-zone id="fiz"></cu-file-input-zone>

<script>
  customElements.whenDefined('cu-file-input-zone').then(() => {
    const fiz = document.getElementById('fiz');

    const files = fiz.get();   // File | File[] | null
    const demo = [
      new File(['contenido A'], 'demo-a.txt', { type: 'text/plain' }),
      new File(['contenido B'], 'demo-b.txt', { type: 'text/plain' }),
    ];
    fiz.set(demo);             // File | File[] | null
    fiz.reset();               // limpia la selección
    fiz.focus();               // pone el foco
    fiz.trigger();             // abre el diálogo de archivos
  });
<\/script>`;

const componentTokens = [
  '--zone-bg',
  '--zone-text',
  '--zone-ghost-hover',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-weight-medium',
  '--cu-radius',
  '--cu-border-thin',
  '--cu-border-thick',
  '--cu-border-color',
  '--cu-space-2xs',
  '--cu-space-md',
  '--cu-space-xl',
  '--cu-space-2xl',
];

const componentDeps = [
  { label: 'FileList', path: '/playground/components/advanced-table' }
];

const styleSubComponents = [
  { label: 'FileList', path: '/playground/components/advanced-table#style' }
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'v-model', type: 'File | File[] | null', default: 'null', description: 'Archivo(s) seleccionado(s)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'placeholder', type: 'string', default: '"Selecciona un archivo o arrastra aquí"', description: 'Texto cuando la zona está vacía' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la zona' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura: bloquea click, teclado y drag & drop' },
  { name: 'accept', type: 'string', default: '—', description: 'Formatos aceptados; se listan bajo el placeholder y se validan al seleccionar/soltar' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Permite seleccionar múltiples archivos' },
  { name: 'maxSize', type: 'number', default: '—', description: 'Tamaño máximo por archivo en bytes' },
  { name: 'directory', type: 'boolean', default: 'false', description: 'Selección de carpetas (webkitdirectory); implica multiple' },
  { name: 'directoryDeep', type: 'number', default: '0', description: 'Profundidad de subcarpetas incluidas; -1 = ilimitada' },
  { name: 'maxHeight', type: 'string', default: '""', description: 'Altura máxima (CSS) de la lista de archivos' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'v-model: emite File | File[] | null según la selección' },
  { name: 'click', type: 'nativo', description: 'Click sobre la zona (abre el selector de archivos)' },
  { name: 'keydown', type: 'nativo', description: 'Enter o Space abren el selector de archivos' },
  { name: 'focus', type: 'nativo', description: 'La zona recibe foco' },
  { name: 'blur', type: 'nativo', description: 'La zona pierde foco' },
  { name: 'dragover', type: 'nativo', description: 'Archivos se arrastran sobre la zona' },
  { name: 'drop', type: 'nativo', description: 'Se sueltan archivos o carpetas sobre la zona' },
];

const exposesData = [
  { name: 'get', type: 'method', description: 'Devuelve File | File[] | null según la selección' },
  { name: 'set', type: 'method', description: 'set(files: File | File[] | null): establece los archivos' },
  { name: 'reset', type: 'method', description: 'Limpia la selección' },
  { name: 'focus', type: 'method', description: 'Pone el foco en la zona' },
  { name: 'trigger', type: 'method', description: 'Abre el diálogo de selección de archivos' },
];
</script>

<template>
  <PlaygroundLayout title="FileInputZone" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <FileInputZone v-model="files1" />
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
          <div class="playground-col">
            <FileInputZone color="primary" placeholder="primary" />
            <FileInputZone color="secondary" placeholder="secondary" />
            <FileInputZone color="neutral" placeholder="neutral" />
            <FileInputZone color="success" placeholder="success" />
            <FileInputZone color="warning" placeholder="warning" />
            <FileInputZone color="danger" placeholder="danger" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="multiple" class="playground-section">
        <div class="playground-heading">
          <h2>Multiple</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="multipleVue" :vanilla-code="multipleVanilla">
          <div class="playground-col">
            <FileInputZone v-model="files2" multiple placeholder="Sube varios archivos" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="accept" class="playground-section">
        <div class="playground-heading">
          <h2>With Accept</h2>
        </div>
        <SectionDemo :vue-code="acceptVue" :vanilla-code="acceptVanilla">
          <div class="playground-col">
            <FileInputZone v-model="files3" accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="maxsize" class="playground-section">
        <div class="playground-heading">
          <h2>With Max Size</h2>
        </div>
        <SectionDemo :vue-code="maxsizeVue" :vanilla-code="maxsizeVanilla">
          <div class="playground-col">
            <FileInputZone :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB por archivo" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="directory" class="playground-section">
        <div class="playground-heading">
          <h2>Directory</h2>
        </div>
        <SectionDemo :vue-code="directoryVue" :vanilla-code="directoryVanilla">
          <div class="playground-col">
            <FileInputZone directory placeholder="Selecciona una carpeta" />
            <FileInputZone directory :directory-deep="1" placeholder="Carpeta con 1 nivel de subcarpetas" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue" :vanilla-code="disabledVanilla">
          <div class="playground-col">
            <FileInputZone disabled placeholder="No disponible" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="readonly" class="playground-section">
        <div class="playground-heading">
          <h2>ReadOnly</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="readonlyVue" :vanilla-code="readonlyVanilla">
          <div class="playground-col">
            <FileInputZone read-only placeholder="Solo lectura" />
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
              <Button color="neutral" @click="progGet = filesLabel(progRef?.get() ?? null)">get()</Button>
              <Button color="neutral" @click="progRef?.set(makeFiles())">set(2 archivos)</Button>
              <Button color="neutral" @click="progRef?.reset()">reset()</Button>
              <Button color="neutral" @click="progRef?.focus()">focus()</Button>
              <Button color="neutral" @click="progRef?.trigger()">trigger()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGet || '—' }}</strong>
              · v-model: <strong>{{ filesLabel(progFiles) }}</strong>
            </p>
            <FileInputZone ref="progRef" v-model="progFiles" placeholder="Archivos de prueba" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>        <PlaygroundApiComponents :deps="componentDeps" />

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="[]" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
