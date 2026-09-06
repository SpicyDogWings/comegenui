<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import ColorPicker from "@/components/form/ColorPicker.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const vmColor = ref("#3b82f6");

const progRef = ref<InstanceType<typeof ColorPicker> | null>(null);
const progColor = ref("#3b82f6");
const progGet = ref("");

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'v-model', id: 'v-model' },
  { label: 'Disabled', id: 'disabled' },
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
      { label: 'Components', id: 'api-components' },
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

const defaultVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker></cu-color-picker>`;

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

const progVue = `<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/form/ColorPicker.vue'

const cp = ref(null)

const demo = () => {
  const hex = cp.value.get()   // hex actual
  cp.value.set('#3b82f6')      // setea el color
  cp.value.reset()             // vuelve a #000000
  cp.value.focus()             // enfoca el input hex
}
<\/script>

<template>
  <ColorPicker ref="cp" />
</template>`;

const progVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker id="cp"></cu-color-picker>

<script>
  customElements.whenDefined('cu-color-picker').then(() => {
    const cp = document.getElementById('cp');

    const hex = cp.get();      // hex actual
    cp.set('#3b82f6');         // setea el color
    cp.reset();                // vuelve a #000000
    cp.focus();                // enfoca el input hex
  });
<\/script>`;

const colorpicker_tokens = [
  '--cp-subtle-border',
  '--cu-font-sans',
  '--cu-radius-md',
  '--cu-border-thin',
  '--cu-space-sm',
  '--cu-space-2xl',
  '--cu-space-5xl',
];

const componentDeps = [
  { label: 'Input', path: '/playground/components/input' },
];

const styleSubComponents = [
  { label: 'Input', path: '/playground/components/input#style' },
];

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
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="progVue" :vanilla-code="progVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progGet = progRef?.get() || 'null'">get()</Button>
              <Button color="neutral" @click="progRef?.set('#3b82f6')">set('#3b82f6')</Button>
              <Button color="neutral" @click="progRef?.reset()">reset()</Button>
              <Button color="neutral" @click="progRef?.focus()">focus()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGet || '—' }}</strong>
              · v-model: <strong>{{ progColor }}</strong>
            </p>
            <ColorPicker ref="progRef" v-model="progColor" />
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
