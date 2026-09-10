<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Switch from "@/components/form/Switch.vue";
import { cuSwitchStories } from "@/stories/form/Switch.stories";

const switchRef = ref<any>(null);
const progChecked = ref(false);
const progGetResult = ref<boolean | null>(null);

const outlineItems = [
  ...cuSwitchStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
      <Button color="neutral" @click="console.log(switchRef?.get())">get()</Button>
      <Button color="neutral" @click="switchRef?.set(true)">set(true)</Button>
      <Button color="neutral" @click="switchRef?.set(false)">set(false)</Button>
      <Button color="neutral" @click="switchRef?.reset()">reset()</Button>
      <Button color="neutral" @click="switchRef?.focus()">focus()</Button>
    </div>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-switch id="sw-prog"></cu-switch>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="sw-prog-get">get()</cu-button>
    <cu-button id="sw-prog-set-true">set(true)</cu-button>
    <cu-button id="sw-prog-set-false">set(false)</cu-button>
    <cu-button id="sw-prog-reset">reset()</cu-button>
    <cu-button id="sw-prog-focus">focus()</cu-button>
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

const componentTokens = [
  '--switch-bg',
  '--switch-ghost-hover',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-radius-full',
  '--cu-shadow-sm',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-lg',
  '--cu-space-xl',
  '--cu-space-2xl',
  '--cu-space-3xl',
];

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

const slotsData = [
  { name: 'default', description: 'Texto del label (alternativa al prop label)' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Se emite al alternar (v-model). detail: boolean' },
  { name: 'change', type: 'custom', description: 'Se emite al alternar. detail: boolean (nuevo estado)' },
  { name: 'click', type: 'nativo', description: 'Click sobre el switch (alterna el estado)' },
  { name: 'focus', type: 'nativo', description: 'El input interno recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El input interno pierde el foco' },
];

const exposesData = [
  { name: 'get', type: '() => boolean', description: 'Devuelve el estado actual (checked)' },
  { name: 'set', type: '(value: boolean) => void', description: 'Setea el estado y emite change' },
  { name: 'reset', type: '() => void', description: 'Restaura el estado a false y emite change' },
  { name: 'focus', type: '() => void', description: 'Pone el foco en el input interno' },
];
</script>

<template>
  <PlaygroundLayout title="Switch" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuSwitchStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progGetResult = switchRef?.get() ?? null">get()</Button>
              <Button color="neutral" @click="switchRef?.set(true)">set(true)</Button>
              <Button color="neutral" variant="soft" @click="switchRef?.set(false)">set(false)</Button>
              <Button color="neutral" @click="switchRef?.reset()">reset()</Button>
              <Button color="neutral" @click="switchRef?.focus()">focus()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGetResult ?? '—' }}</strong>
              · v-model: <strong>{{ progChecked ? 'ON' : 'OFF' }}</strong>
            </p>
            <Switch ref="switchRef" v-model="progChecked" label="Términos" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.playground-state {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}
</style>
