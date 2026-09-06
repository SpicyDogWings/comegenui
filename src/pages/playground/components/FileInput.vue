<script setup lang="ts">
import { ref } from "vue";
import { getTokenDescription } from '@/config/css-tokens';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import FileInput from "@/components/form/FileInput.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const file1 = ref<File | null>(null);
const file2 = ref<File | null>(null);
const file3 = ref<File | null>(null);

const progRef = ref<InstanceType<typeof FileInput> | null>(null);
const progFile = ref<File | null>(null);
const progGet = ref("");

function makeFile() {
  return new File(["contenido de prueba"], "demo.txt", { type: "text/plain" });
}

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Accept', id: 'accept' },
  { label: 'With Max Size', id: 'maxsize' },
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
import FileInput from '@/components/form/FileInput.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import { ref } from 'vue'
import FileInput from '@/components/form/FileInput.vue'

const file = ref(null)
<\/script>

<template>
  <FileInput v-model="file" />
</template>`;

const variantsVue = vueSnippet(`  <FileInput variant="outlined" placeholder="outlined (default)" />
  <FileInput variant="soft" placeholder="soft" />
  <FileInput variant="ghost" placeholder="ghost" />
  <FileInput variant="subtle" placeholder="subtle" />`);

const colorsVue = vueSnippet(`  <FileInput color="primary" placeholder="primary" />
  <FileInput color="secondary" placeholder="secondary" />
  <FileInput color="neutral" placeholder="neutral" />
  <FileInput color="success" placeholder="success" />
  <FileInput color="warning" placeholder="warning" />
  <FileInput color="danger" placeholder="danger" />`);

const acceptVue = vueSnippet(`  <FileInput accept=".pdf,.jpg,.png" placeholder="Subir documento" />`);

const maxsizeVue = vueSnippet(`  <FileInput :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB" />`);

const disabledVue = vueSnippet(`  <FileInput disabled placeholder="No disponible" />`);

const readonlyVue = vueSnippet(`  <FileInput read-only placeholder="Solo lectura" />`);

const defaultVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input></cu-file-input>`;

const variantsVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input variant="outlined" placeholder="outlined (default)"></cu-file-input>
<cu-file-input variant="soft" placeholder="soft"></cu-file-input>
<cu-file-input variant="ghost" placeholder="ghost"></cu-file-input>
<cu-file-input variant="subtle" placeholder="subtle"></cu-file-input>`;

const colorsVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input color="primary" placeholder="primary"></cu-file-input>
<cu-file-input color="secondary" placeholder="secondary"></cu-file-input>
<cu-file-input color="neutral" placeholder="neutral"></cu-file-input>
<cu-file-input color="success" placeholder="success"></cu-file-input>
<cu-file-input color="warning" placeholder="warning"></cu-file-input>
<cu-file-input color="danger" placeholder="danger"></cu-file-input>`;

const acceptVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input accept=".pdf,.jpg,.png" placeholder="Subir documento"></cu-file-input>`;

const maxsizeVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input max-size="5242880" placeholder="Máximo 5MB"></cu-file-input>`;

const disabledVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input disabled placeholder="No disponible"></cu-file-input>`;

const readonlyVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input read-only placeholder="Solo lectura"></cu-file-input>`;

const progVue = `<script setup>
import { ref } from 'vue'
import FileInput from '@/components/form/FileInput.vue'

const fi = ref(null)

const demo = () => {
  const file = fi.value.get()      // File | null
  fi.value.set(new File(['contenido'], 'demo.txt', { type: 'text/plain' }))
  fi.value.reset()                 // limpia la selección
  fi.value.focus()                 // pone el foco
  fi.value.trigger()               // abre el diálogo de archivos
}
<\/script>

<template>
  <FileInput ref="fi" />
</template>`;

const progVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input id="fi"></cu-file-input>

<script>
  customElements.whenDefined('cu-file-input').then(() => {
    const fi = document.getElementById('fi');

    const file = fi.get();     // File | null
    fi.set(new File(['contenido'], 'demo.txt', { type: 'text/plain' }));
    fi.reset();                // limpia la selección
    fi.focus();                // pone el foco
    fi.trigger();              // abre el diálogo de archivos
  });
<\/script>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const fileinput_tokens = [
  '--input-bg',
  '--input-text',
  '--input-soft',
  '--input-soft-hover',
  '--input-ghost-hover',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-weight-medium',
  '--cu-radius',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-color-surface',
];

const styleData = fileinput_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'v-model', type: 'File | null', default: 'null', description: 'Archivo seleccionado (defineModel)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"outlined"', description: 'outlined, soft, ghost, subtle' },
  { name: 'placeholder', type: 'string', default: '"Seleccionar archivo"', description: 'Texto cuando no hay archivo; agrega formatos aceptados y tamaño máximo si aplican' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la selección' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura: bloquea click, teclado y drag & drop' },
  { name: 'accept', type: 'string', default: '—', description: 'Tipos aceptados (attr accept): .pdf, image/*, etc; rechaza los que no coinciden' },
  { name: 'maxSize', type: 'number', default: '—', description: 'Tamaño máximo en bytes; rechaza archivos mayores' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'v-model: emite el File seleccionado o null al quitarlo' },
  { name: 'click', type: 'nativo', description: 'Click sobre el control (abre el selector de archivos)' },
  { name: 'keydown', type: 'nativo', description: 'Enter o Space abren el selector de archivos' },
  { name: 'focus', type: 'nativo', description: 'El control recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El control pierde foco' },
  { name: 'dragover', type: 'nativo', description: 'Un archivo se arrastra sobre el control' },
  { name: 'drop', type: 'nativo', description: 'Se suelta un archivo sobre el control' },
];

const exposesData = [
  { name: 'get', type: 'method', description: 'Devuelve el File seleccionado o null' },
  { name: 'set', type: 'method', description: 'set(file: File | null): establece el archivo programáticamente' },
  { name: 'reset', type: 'method', description: 'Limpia la selección' },
  { name: 'focus', type: 'method', description: 'Pone el foco en el control' },
  { name: 'trigger', type: 'method', description: 'Abre el diálogo de selección de archivos' },
];
</script>

<template>
  <PlaygroundLayout title="FileInput" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <FileInput v-model="file1" />
            <p v-if="file1" style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              v-model → {{ file1.name }}
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">outlined</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-col">
            <FileInput variant="outlined" placeholder="outlined (default)" />
            <FileInput variant="soft" placeholder="soft" />
            <FileInput variant="ghost" placeholder="ghost" />
            <FileInput variant="subtle" placeholder="subtle" />
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
            <FileInput color="primary" placeholder="primary" />
            <FileInput color="secondary" placeholder="secondary" />
            <FileInput color="neutral" placeholder="neutral" />
            <FileInput color="success" placeholder="success" />
            <FileInput color="warning" placeholder="warning" />
            <FileInput color="danger" placeholder="danger" />
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
            <FileInput v-model="file2" accept=".pdf,.jpg,.png" placeholder="Subir documento" />
            <p v-if="file2" style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              v-model → {{ file2.name }}
            </p>
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
            <FileInput v-model="file3" :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB" />
            <p v-if="file3" style="margin:0;font-size:var(--cu-font-size-sm);opacity:0.7">
              v-model → {{ file3.name }}
            </p>
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
            <FileInput disabled placeholder="No disponible" />
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
            <FileInput read-only placeholder="Solo lectura" />
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
              <Button color="neutral" @click="progGet = progRef?.get()?.name || 'null'">get()</Button>
              <Button color="neutral" @click="progRef?.set(makeFile())">set(demo.txt)</Button>
              <Button color="neutral" @click="progRef?.reset()">reset()</Button>
              <Button color="neutral" @click="progRef?.focus()">focus()</Button>
              <Button color="neutral" @click="progRef?.trigger()">trigger()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGet || '—' }}</strong>
              · v-model: <strong>{{ progFile ? progFile.name : 'null' }}</strong>
            </p>
            <FileInput ref="progRef" v-model="progFile" placeholder="Archivo de prueba" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

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
        <Table :columns="apiColumns" :data="[]" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
