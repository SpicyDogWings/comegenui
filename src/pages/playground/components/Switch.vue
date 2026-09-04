<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Switch from "@/components/form/Switch.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const checked1 = ref(false);
const checked2 = ref(true);
const programmaticRef = ref<InstanceType<typeof Switch> | null>(null);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
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
import Switch from '@/components/form/Switch.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import { ref } from 'vue'
import Switch from '@/components/form/Switch.vue'

const notifications = ref(false)
const darkMode = ref(true)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;align-items:center;gap:8px">
      <Switch v-model="notifications" />
      <span>Notifications: {{ notifications ? 'ON' : 'OFF' }}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <Switch v-model="darkMode" />
      <span>Dark mode: {{ darkMode ? 'ON' : 'OFF' }}</span>
    </div>
  </div>
</template>`;

const sizesVue = vueSnippet(`  <Switch size="md" />
  <Switch size="sm" />`);

const colorsVue = vueSnippet(`  <Switch color="primary" />
  <Switch color="secondary" />
  <Switch color="neutral" />
  <Switch color="success" />
  <Switch color="warning" />
  <Switch color="danger" />`);

const disabledVue = vueSnippet(`  <Switch disabled />
  <Switch :model-value="true" disabled />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Switch from '@/components/form/Switch.vue'

const switchRef = ref(null)
<\/script>

<template>
  <div style="display:flex;align-items:center;gap:12px">
    <Switch ref="switchRef" />
    <button class="demo-btn" @click="switchRef.set(true)">set(true)</button>
    <button class="demo-btn" @click="switchRef.set(false)">set(false)</button>
    <button class="demo-btn" @click="switchRef.reset()">reset()</button>
  </div>
</template>`;

const defaultVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;align-items:center;gap:8px">
    <cu-switch id="sw-notif"></cu-switch>
    <span id="sw-notif-label">Notifications: OFF</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <cu-switch id="sw-dark" model-value="true"></cu-switch>
    <span id="sw-dark-label">Dark mode: ON</span>
  </div>
</div>

<script>
  function bindSwitch(id) {
    const sw = document.getElementById(id);
    const label = document.getElementById(id + '-label');
    sw.addEventListener('change', (e) => {
      const name = label.textContent.split(':')[0];
      label.textContent = name + ': ' + (e.detail ? 'ON' : 'OFF');
    });
  }
  bindSwitch('sw-notif');
  bindSwitch('sw-dark');
<\/script>`;

const sizesVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch size="md"></cu-switch>
<cu-switch size="sm"></cu-switch>`;

const colorsVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch color="primary"></cu-switch>
<cu-switch color="secondary"></cu-switch>
<cu-switch color="neutral"></cu-switch>
<cu-switch color="success"></cu-switch>
<cu-switch color="warning"></cu-switch>
<cu-switch color="danger"></cu-switch>`;

const disabledVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch disabled></cu-switch>
<cu-switch model-value="true" disabled></cu-switch>`;

const programmaticVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<div style="display:flex;align-items:center;gap:12px">
  <cu-switch id="mi-switch"></cu-switch>
  <button class="demo-btn" id="btn-on">set(true)</button>
  <button class="demo-btn" id="btn-off">set(false)</button>
  <button class="demo-btn" id="btn-reset">reset()</button>
</div>

<script>
  const sw = document.getElementById('mi-switch');
  document.getElementById('btn-on').addEventListener('click', () => sw.set(true));
  document.getElementById('btn-off').addEventListener('click', () => sw.set(false));
  document.getElementById('btn-reset').addEventListener('click', () => sw.reset());
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado del switch (v-model)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del switch: sm, md' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y atenúa el componente' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Se emite al alternar (v-model). detail: boolean' },
  { name: 'change', type: 'custom', description: 'Se emite al alternar. detail: boolean (nuevo estado)' },
  { name: 'click', type: 'nativo', description: 'Click sobre el switch (alterna el estado)' },
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
  <PlaygroundLayout title="Switch" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
          <Badge color="neutral" title="modelValue por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Switch v-model="checked1" />
              <span class="playground-code">{{ checked1 ? 'ON' : 'OFF' }}</span>
            </div>
            <div class="playground-row">
              <Switch v-model="checked2" />
              <span class="playground-code">{{ checked2 ? 'ON' : 'OFF' }}</span>
            </div>
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
            <div style="display:flex;align-items:center;gap:8px">
              <Switch size="md" />
              <span class="playground-code">md (default)</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <Switch size="sm" />
              <span class="playground-code">sm</span>
            </div>
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
            <div v-for="color in colors" :key="color" style="display:flex;align-items:center;gap:8px">
              <Switch :color="color" />
              <span class="playground-code">{{ color }}</span>
            </div>
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
            <div style="display:flex;align-items:center;gap:8px">
              <Switch disabled />
              <span class="playground-code">OFF (disabled)</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <Switch :model-value="true" disabled />
              <span class="playground-code">ON (disabled)</span>
            </div>
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
            <div style="display:flex;align-items:center;gap:8px">
              <Switch ref="programmaticRef" />
              <span class="playground-code">Control por métodos</span>
            </div>
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
