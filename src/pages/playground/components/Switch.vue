<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Switch from "@/components/form/Switch.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const checked1 = ref(false);
const checked2 = ref(true);
const labelChecked1 = ref(true);
const labelChecked2 = ref(false);

const switchRef = ref<InstanceType<typeof Switch> | null>(null);
const progChecked = ref(false);
const progGetResult = ref<boolean | null>(null);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'With Label', id: 'with-label' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  {
    label: 'Programmatic',
    id: 'programmatic',
    children: [
      { label: 'get()', id: 'prog-get' },
      { label: 'set()', id: 'prog-set' },
      { label: 'reset()', id: 'prog-reset' },
      { label: 'focus()', id: 'prog-focus' },
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
  <Switch v-model="notifications" label="Notificaciones" />
  <Switch v-model="darkMode" label="Modo oscuro" />
</template>`;

const sizesVue = vueSnippet(`  <Switch size="md" label="md (default)" />
  <Switch size="sm" label="sm" />`);

const withLabelVue = vueSnippet(`  <Switch v-model="notifications" label="Notificaciones" />
  <Switch v-model="darkMode" color="success">
    Modo oscuro automático
  </Switch>`);

const withLabelVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch id="switch-label-1" label="Notificaciones"></cu-switch>
<cu-switch id="switch-label-2" color="success">Modo oscuro automático</cu-switch>

<script>
  customElements.whenDefined('cu-switch').then(() => {
    const one = document.getElementById('switch-label-1');
    const two = document.getElementById('switch-label-2');
    one.addEventListener('change', (e) => { one.modelValue = e.detail; });
    two.addEventListener('change', (e) => { two.modelValue = e.detail; });
  });
<\/script>`;

const colorsVue = vueSnippet(`  <Switch color="primary" label="primary" />
  <Switch color="secondary" label="secondary" />
  <Switch color="neutral" label="neutral" />
  <Switch color="success" label="success" />
  <Switch color="warning" label="warning" />
  <Switch color="danger" label="danger" />`);

const disabledVue = vueSnippet(`  <Switch disabled label="Disabled unchecked" />
  <Switch :model-value="true" disabled label="Disabled checked" />`);

const defaultVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch label="Notificaciones"></cu-switch>
<cu-switch label="Modo oscuro" model-value="true"></cu-switch>`;

const sizesVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch size="md" label="md (default)"></cu-switch>
<cu-switch size="sm" label="sm"></cu-switch>`;

const colorsVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch color="primary" label="primary"></cu-switch>
<cu-switch color="secondary" label="secondary"></cu-switch>
<cu-switch color="neutral" label="neutral"></cu-switch>
<cu-switch color="success" label="success"></cu-switch>
<cu-switch color="warning" label="warning"></cu-switch>
<cu-switch color="danger" label="danger"></cu-switch>`;

const disabledVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch disabled label="Disabled unchecked"></cu-switch>
<cu-switch model-value="true" disabled label="Disabled checked"></cu-switch>`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Switch from '@/components/form/Switch.vue'

const checked = ref(false)
const switchRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Switch ref="switchRef" v-model="checked" />
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button @click="console.log(switchRef?.get())">get()</button>
      <button @click="switchRef?.set(true)">set(true)</button>
      <button @click="switchRef?.set(false)">set(false)</button>
      <button @click="switchRef?.reset()">reset()</button>
      <button @click="switchRef?.focus()">focus()</button>
    </div>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-switch id="sw-prog"></cu-switch>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button id="sw-prog-get">get()</button>
    <button id="sw-prog-set-true">set(true)</button>
    <button id="sw-prog-set-false">set(false)</button>
    <button id="sw-prog-reset">reset()</button>
    <button id="sw-prog-focus">focus()</button>
  </div>
  <span id="sw-prog-state">OFF</span>
</div>

<script>
  customElements.whenDefined('cu-switch').then(() => {
    const sw = document.getElementById('sw-prog');
    const state = document.getElementById('sw-prog-state');
    sw.addEventListener('change', (e) => {
      state.textContent = e.detail ? 'ON' : 'OFF';
    });
    document.getElementById('sw-prog-get').addEventListener('click', () => {
      state.textContent = 'get(): ' + sw.get();
    });
    document.getElementById('sw-prog-set-true').addEventListener('click', () => sw.set(true));
    document.getElementById('sw-prog-set-false').addEventListener('click', () => sw.set(false));
    document.getElementById('sw-prog-reset').addEventListener('click', () => sw.reset());
    document.getElementById('sw-prog-focus').addEventListener('click', () => sw.focus());
  });
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado del switch (v-model)' },
  { name: 'label', type: 'string', default: '""', description: 'Texto del label (usa el componente Label); también acepta slot default. El click sobre el label alterna el switch' },
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
            <Switch v-model="checked1" label="Notificaciones" />
            <Switch v-model="checked2" label="Modo oscuro" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="with-label" class="playground-section">
        <div class="playground-heading">
          <h2>With Label</h2>
        </div>
        <SectionDemo :vue-code="withLabelVue" :vanilla-code="withLabelVanilla">
          <div class="playground-col">
            <Switch v-model="labelChecked1" label="Notificaciones" />
            <Switch v-model="labelChecked2" color="success">
              Modo oscuro automático
            </Switch>
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
            <Switch size="md" label="md (default)" />
            <Switch size="sm" label="sm" />
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
            <Switch v-for="color in colors" :key="color" :color="color" :label="color" />
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
            <Switch disabled label="Disabled unchecked" />
            <Switch :model-value="true" disabled label="Disabled checked" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Switch ref="switchRef" v-model="progChecked" label="Términos" />
              <span class="playground-code">{{ progChecked ? 'ON' : 'OFF' }}</span>
            </div>
            <h3 id="prog-get">get()</h3>
            <div class="playground-row">
              <Button color="neutral" @click="progGetResult = switchRef?.get() ?? null">get()</Button>
              <span class="playground-code">{{ progGetResult ?? '—' }}</span>
            </div>
            <h3 id="prog-set">set()</h3>
            <div class="playground-row">
              <Button color="neutral" @click="switchRef?.set(true)">set(true)</Button>
              <Button color="neutral" variant="soft" @click="switchRef?.set(false)">set(false)</Button>
            </div>
            <h3 id="prog-reset">reset()</h3>
            <div class="playground-row">
              <Button color="neutral" @click="switchRef?.reset()">reset()</Button>
            </div>
            <h3 id="prog-focus">focus()</h3>
            <div class="playground-row">
              <Button color="neutral" @click="switchRef?.focus()">focus()</Button>
            </div>
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
