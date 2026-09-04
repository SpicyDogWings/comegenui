<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const checked1 = ref(false);
const checked2 = ref(true);
const programmaticRef = ref<InstanceType<typeof Checkbox> | null>(null);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
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
import Checkbox from '@/components/form/Checkbox.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/form/Checkbox.vue'

const checked1 = ref(false)
const checked2 = ref(true)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Checkbox v-model="checked1" label="Accept terms" />
    <Checkbox v-model="checked2" label="Pre-checked" />
  </div>
</template>`;

const labelsVue = vueSnippet(`  <Checkbox label="Con label" />
  <Checkbox />`);

const sizesVue = vueSnippet(`  <Checkbox size="md" label="md (default)" />
  <Checkbox size="sm" label="sm" />`);

const colorsVue = vueSnippet(`  <Checkbox color="primary" label="primary" />
  <Checkbox color="secondary" label="secondary" />
  <Checkbox color="neutral" label="neutral" />
  <Checkbox color="success" label="success" />
  <Checkbox color="warning" label="warning" />
  <Checkbox color="danger" label="danger" />`);

const disabledVue = vueSnippet(`  <Checkbox disabled label="Disabled unchecked" />
  <Checkbox :model-value="true" disabled label="Disabled checked" />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/form/Checkbox.vue'

const checkboxRef = ref(null)
<\/script>

<template>
  <div style="display:flex;align-items:center;gap:12px">
    <Checkbox ref="checkboxRef" label="Programmatic checkbox" />
    <button class="demo-btn" @click="checkboxRef.set(true)">set(true)</button>
    <button class="demo-btn" @click="checkboxRef.set(false)">set(false)</button>
    <button class="demo-btn" @click="checkboxRef.reset()">reset()</button>
  </div>
</template>`;

const defaultVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;align-items:center;gap:8px">
    <cu-checkbox id="cb-terms" label="Accept terms"></cu-checkbox>
    <span id="cb-terms-label">unchecked</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <cu-checkbox id="cb-news" label="Pre-checked" model-value="true"></cu-checkbox>
    <span id="cb-news-label">checked</span>
  </div>
</div>

<script>
  function bindCheckbox(id) {
    const cb = document.getElementById(id);
    const label = document.getElementById(id + '-label');
    cb.addEventListener('change', (e) => {
      const checked = e.detail?.target?.checked ?? e.detail;
      label.textContent = checked ? 'checked' : 'unchecked';
    });
  }
  bindCheckbox('cb-terms');
  bindCheckbox('cb-news');
<\/script>`;

const labelsVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox label="Con label"></cu-checkbox>
<cu-checkbox></cu-checkbox>`;

const sizesVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox size="md" label="md (default)"></cu-checkbox>
<cu-checkbox size="sm" label="sm"></cu-checkbox>`;

const colorsVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox color="primary" label="primary"></cu-checkbox>
<cu-checkbox color="secondary" label="secondary"></cu-checkbox>
<cu-checkbox color="neutral" label="neutral"></cu-checkbox>
<cu-checkbox color="success" label="success"></cu-checkbox>
<cu-checkbox color="warning" label="warning"></cu-checkbox>
<cu-checkbox color="danger" label="danger"></cu-checkbox>`;

const disabledVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox disabled label="Disabled unchecked"></cu-checkbox>
<cu-checkbox model-value="true" disabled label="Disabled checked"></cu-checkbox>`;

const programmaticVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>

<div style="display:flex;align-items:center;gap:12px">
  <cu-checkbox id="mi-checkbox" label="Programmatic checkbox"></cu-checkbox>
  <button class="demo-btn" id="btn-on">set(true)</button>
  <button class="demo-btn" id="btn-off">set(false)</button>
  <button class="demo-btn" id="btn-reset">reset()</button>
</div>

<script>
  const cb = document.getElementById('mi-checkbox');
  document.getElementById('btn-on').addEventListener('click', () => cb.set(true));
  document.getElementById('btn-off').addEventListener('click', () => cb.set(false));
  document.getElementById('btn-reset').addEventListener('click', () => cb.reset());
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado del checkbox (v-model)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del checkbox: sm, md' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y atenúa el componente' },
  { name: 'label', type: 'string', default: '—', description: 'Texto mostrado a la derecha del checkbox' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Se emite al cambiar (v-model). detail: boolean' },
  { name: 'change', type: 'custom', description: 'Cambio de estado. detail: Event nativo del input, o { target: { checked } } al usar set()/reset()' },
  { name: 'click', type: 'nativo', description: 'Click sobre el label (alterna el estado)' },
  { name: 'focus', type: 'nativo', description: 'El input interno recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El input interno pierde el foco' },
];

const exposesData = [
  { name: 'get', type: '() => boolean', default: '—', description: 'Devuelve el estado actual (checked)' },
  { name: 'set', type: '(value: boolean) => void', default: '—', description: 'Setea el estado y emite change' },
  { name: 'reset', type: '() => void', default: '—', description: 'Restaura el estado a false y emite change' },
  { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el input interno' },
];
</script>

<template>
  <PlaygroundLayout title="Checkbox" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
          <Badge color="neutral" title="modelValue por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Checkbox v-model="checked1" label="Accept terms" />
              <span class="playground-code">{{ checked1 ? 'checked' : 'unchecked' }}</span>
            </div>
            <div class="playground-row">
              <Checkbox v-model="checked2" label="Pre-checked" />
              <span class="playground-code">{{ checked2 ? 'checked' : 'unchecked' }}</span>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="labels" class="playground-section">
        <div class="playground-heading">
          <h2>Labels</h2>
        </div>
        <SectionDemo :vue-code="labelsVue" :vanilla-code="labelsVanilla">
          <div class="playground-row">
            <Checkbox label="Con label" />
            <Checkbox />
            <span class="playground-code">sin label</span>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-row">
            <Checkbox size="md" label="md (default)" />
            <Checkbox size="sm" label="sm" />
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
          <div class="playground-row">
            <Checkbox v-for="color in colors" :key="color" :color="color" :label="color" />
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
            <Checkbox disabled label="Disabled unchecked" />
            <Checkbox :model-value="true" disabled label="Disabled checked" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic Control</h2>
        </div>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-row">
            <Checkbox ref="programmaticRef" label="Programmatic checkbox" />
            <button class="demo-btn" @click="programmaticRef?.set(true)">set(true)</button>
            <button class="demo-btn" @click="programmaticRef?.set(false)">set(false)</button>
            <button class="demo-btn" @click="programmaticRef?.reset()">reset()</button>
          </div>
        </SectionDemo>
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

<style scoped>
.demo-btn {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background: var(--cu-color-surface);
  cursor: pointer;
}

.demo-btn:hover {
  background: var(--cu-color-neutral-soft);
}
</style>
