<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import ColorPicker from "@/components/form/ColorPicker.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const pickerRef = ref<InstanceType<typeof ColorPicker> | null>(null);
const programmaticValue = ref("#000000");
const vmColor = ref("#3b82f6");

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function readValue() {
  programmaticValue.value = pickerRef.value?.get() ?? "—";
}

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Colores', id: 'colors' },
  { label: 'v-model', id: 'v-model' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programático', id: 'programmatic' },
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
import ColorPicker from '@/components/form/ColorPicker.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <ColorPicker />`);

const colorsVue = vueSnippet(`  <ColorPicker color="primary" />
  <ColorPicker color="secondary" />
  <ColorPicker color="neutral" />
  <ColorPicker color="success" />
  <ColorPicker color="warning" />
  <ColorPicker color="danger" />`);

const vmodelVue = `<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/form/ColorPicker.vue'

const color = ref('#3b82f6')
<\/script>

<template>
  <ColorPicker v-model="color" />
  <p>Seleccionado: {{ color }}</p>
</template>`;

const disabledVue = vueSnippet(`  <ColorPicker color="primary" disabled />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/form/ColorPicker.vue'

const picker = ref(null)
const value = ref(null)

function readValue() {
  value.value = picker.value?.get() ?? null
}
<\/script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap">
    <button @click="picker?.set('#ff6600'); readValue()">set('#ff6600')</button>
    <button @click="readValue()">get()</button>
    <button @click="picker?.reset(); readValue()">reset()</button>
    <button @click="picker?.focus()">focus()</button>
  </div>
  <p>get(): {{ value ?? '—' }}</p>
  <ColorPicker ref="picker" />
</template>`;

const defaultVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker></cu-color-picker>`;

const colorsVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker color="primary"></cu-color-picker>
<cu-color-picker color="secondary"></cu-color-picker>
<cu-color-picker color="neutral"></cu-color-picker>
<cu-color-picker color="success"></cu-color-picker>
<cu-color-picker color="warning"></cu-color-picker>
<cu-color-picker color="danger"></cu-color-picker>`;

const vmodelVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker id="cp" model-value="#3b82f6"></cu-color-picker>
<p id="cp-out">Seleccionado: #3b82f6</p>

<script>
  customElements.whenDefined('cu-color-picker').then(() => {
    const picker = document.getElementById('cp');
    picker.addEventListener('change', (e) => {
      document.getElementById('cp-out').textContent = 'Seleccionado: ' + e.detail;
    });
    // picker.modelValue = '#00ff00'; // setear programáticamente
  });
<\/script>`;

const disabledVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker color="primary" disabled></cu-color-picker>`;

const programmaticVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker id="cp"></cu-color-picker>

<script>
  customElements.whenDefined('cu-color-picker').then(() => {
    const picker = document.getElementById('cp');
    // picker.set('#ff6600');
    // picker.get(); // hex actual
    // picker.reset(); // vuelve a #000000
    // picker.focus(); // enfoca el input hex
    console.log(picker.get());
  });
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string', default: '"#000000"', description: 'Color seleccionado en hex (v-model)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico para foco/bordes: primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita swatch e input hex' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'v-model: nuevo hex al cambiar' },
  { name: 'change', type: 'custom', description: 'Hex al cambiar: siempre desde el picker nativo; desde el texto solo si matchea #rrggbb' },
];

const exposesData = [
  { name: 'get', type: '() => string', default: '—', description: 'Devuelve el hex actual' },
  { name: 'set', type: '(value: string) => void', default: '—', description: 'Setea el color programáticamente' },
  { name: 'reset', type: '() => void', default: '—', description: 'Vuelve al valor por defecto (#000000)' },
  { name: 'focus', type: '() => void', default: '—', description: 'Enfoca el input hex' },
];
</script>

<template>
  <PlaygroundLayout title="ColorPicker" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Swatch que abre el color picker nativo del navegador + input hex editable (valida <code>#rrggbb</code>).
        </p>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-row">
            <ColorPicker />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colores</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <ColorPicker v-for="color in colors" :key="color" :color="color" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="v-model" class="playground-section">
        <div class="playground-heading">
          <h2>v-model</h2>
          <Badge color="neutral" title="Valor por defecto (modelValue)">#000000</Badge>
        </div>
        <SectionDemo :vue-code="vmodelVue" :vanilla-code="vmodelVanilla">
          <div class="playground-col">
            <ColorPicker v-model="vmColor" />
            <p class="playground-state">
              Seleccionado: <strong>{{ vmColor }}</strong>
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
          <div class="playground-row">
            <ColorPicker color="primary" disabled />
            <ColorPicker color="danger" disabled model-value="#ef4444" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Control programático</h2>
        </div>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button @click="pickerRef?.set('#ff6600'); readValue()" color="success" variant="soft">set('#ff6600')</Button>
              <Button @click="readValue()" color="primary" variant="solid">get()</Button>
              <Button @click="pickerRef?.reset(); readValue()" color="warning" variant="soft">reset()</Button>
              <Button @click="pickerRef?.focus()" color="neutral" variant="ghost">focus()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ programmaticValue }}</strong>
            </p>
            <ColorPicker ref="pickerRef" />
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

<style scoped>
.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
