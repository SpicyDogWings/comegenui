<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Textarea from "@/components/form/Textarea.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const vmodelText = ref("");

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'ReadOnly', id: 'readonly' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Rows', id: 'rows' },
  { label: 'v-model', id: 'v-model' },
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
import Textarea from '@/components/form/Textarea.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Textarea variant="soft" placeholder="soft (default)" :rows="2" />
  <Textarea variant="outlined" placeholder="outlined" :rows="2" />
  <Textarea variant="ghost" placeholder="ghost" :rows="2" />
  <Textarea variant="subtle" placeholder="subtle" :rows="2" />`);

const colorsVue = vueSnippet(`  <Textarea color="primary" placeholder="primary" :rows="2" />
  <Textarea color="secondary" placeholder="secondary" :rows="2" />
  <Textarea color="neutral" placeholder="neutral" :rows="2" />
  <Textarea color="success" placeholder="success" :rows="2" />
  <Textarea color="warning" placeholder="warning" :rows="2" />
  <Textarea color="danger" placeholder="danger" :rows="2" />`);

const readonlyVue = vueSnippet(`  <Textarea color="primary" read-only model-value="Este contenido es de solo lectura" :rows="2" />`);

const disabledVue = vueSnippet(`  <Textarea color="primary" disabled placeholder="Disabled" :rows="2" />
  <Textarea color="neutral" disabled placeholder="Disabled (neutral)" :rows="2" />`);

const rowsVue = vueSnippet(`  <Textarea placeholder="2 rows" :rows="2" />
  <Textarea placeholder="4 rows" :rows="4" />
  <Textarea placeholder="6 rows, no resize" :rows="6" no-resize />`);

const vmodelVue = `<script setup>
import { ref } from 'vue'
import Textarea from '@/components/form/Textarea.vue'

const text = ref('')
<\/script>

<template>
  <Textarea v-model="text" placeholder="Escribí algo..." :rows="3" />
  <p>Value: {{ text }}</p>
</template>`;

const variantsVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea variant="soft" placeholder="soft (default)" rows="2"></cu-textarea>
<cu-textarea variant="outlined" placeholder="outlined" rows="2"></cu-textarea>
<cu-textarea variant="ghost" placeholder="ghost" rows="2"></cu-textarea>
<cu-textarea variant="subtle" placeholder="subtle" rows="2"></cu-textarea>`;

const colorsVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" placeholder="primary" rows="2"></cu-textarea>
<cu-textarea color="secondary" placeholder="secondary" rows="2"></cu-textarea>
<cu-textarea color="neutral" placeholder="neutral" rows="2"></cu-textarea>
<cu-textarea color="success" placeholder="success" rows="2"></cu-textarea>
<cu-textarea color="warning" placeholder="warning" rows="2"></cu-textarea>
<cu-textarea color="danger" placeholder="danger" rows="2"></cu-textarea>`;

const readonlyVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" read-only model-value="Este contenido es de solo lectura" rows="2"></cu-textarea>`;

const disabledVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" disabled placeholder="Disabled" rows="2"></cu-textarea>
<cu-textarea color="neutral" disabled placeholder="Disabled (neutral)" rows="2"></cu-textarea>`;

const rowsVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea placeholder="2 rows" rows="2"></cu-textarea>
<cu-textarea placeholder="4 rows" rows="4"></cu-textarea>
<cu-textarea placeholder="6 rows, no resize" rows="6" no-resize></cu-textarea>`;

const vmodelVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea id="mi-textarea" placeholder="Escribí algo..." rows="3"></cu-textarea>
<p id="out">Value: </p>

<script>
  const ta = document.getElementById('mi-textarea');
  const out = document.getElementById('out');
  // El valor también puede setearse por propiedad: ta.modelValue = 'texto inicial'
  ta.addEventListener('update:modelValue', (e) => {
    out.textContent = 'Value: ' + e.detail;
  });
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'v-model', type: 'string', default: '""', description: 'Valor del textarea (defineModel)' },
  { name: 'startValue', type: 'string', default: '—', description: 'Valor inicial alternativo (declarado pero sin efecto actualmente; usar v-model)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Texto de ayuda cuando está vacío' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el textarea' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura (seleccionable, no editable)' },
  { name: 'rows', type: 'number', default: '3', description: 'Cantidad de filas visibles' },
  { name: 'noResize', type: 'boolean', default: 'false', description: 'Desactiva el redimensionado manual' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Emite el valor actualizado en detail al escribir (v-model)' },
  { name: 'input', type: 'nativo', description: 'Evento input nativo del textarea interno (compone hacia el host)' },
];

const exposesData = [
  { name: 'get', type: '() => string', default: '—', description: 'Devuelve el valor actual' },
  { name: 'set', type: '(value: string | number) => void', default: '—', description: 'Setea el valor' },
  { name: 'reset', type: '() => void', default: '—', description: 'Limpia el valor' },
  { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el textarea' },
];
</script>

<template>
  <PlaygroundLayout title="Textarea" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-col">
            <Textarea variant="soft" placeholder="soft (default)" :rows="2" />
            <Textarea variant="outlined" placeholder="outlined" :rows="2" />
            <Textarea variant="ghost" placeholder="ghost" :rows="2" />
            <Textarea variant="subtle" placeholder="subtle" :rows="2" />
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
            <Textarea color="primary" placeholder="primary" :rows="2" />
            <Textarea color="secondary" placeholder="secondary" :rows="2" />
            <Textarea color="neutral" placeholder="neutral" :rows="2" />
            <Textarea color="success" placeholder="success" :rows="2" />
            <Textarea color="warning" placeholder="warning" :rows="2" />
            <Textarea color="danger" placeholder="danger" :rows="2" />
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
          <Textarea color="primary" read-only model-value="Este contenido es de solo lectura" :rows="2" />
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
            <Textarea color="primary" disabled placeholder="Disabled" :rows="2" />
            <Textarea color="neutral" disabled placeholder="Disabled (neutral)" :rows="2" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="rows" class="playground-section">
        <div class="playground-heading">
          <h2>Rows</h2>
          <Badge color="neutral" title="Filas por defecto">3</Badge>
        </div>
        <SectionDemo :vue-code="rowsVue" :vanilla-code="rowsVanilla">
          <div class="playground-col">
            <Textarea placeholder="2 rows" :rows="2" />
            <Textarea placeholder="4 rows" :rows="4" />
            <Textarea placeholder="6 rows, no resize" :rows="6" no-resize />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="v-model" class="playground-section">
        <div class="playground-heading">
          <h2>v-model</h2>
        </div>
        <SectionDemo :vue-code="vmodelVue" :vanilla-code="vmodelVanilla">
          <div class="playground-col">
            <Textarea v-model="vmodelText" placeholder="Escribí algo..." :rows="3" />
            <p class="playground-code">Value: {{ vmodelText || '(vacío)' }}</p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
