<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Tabs from "@/components/Tabs.vue";
import Button from "@/components/buttons/Button.vue";
import { cuTabsStories } from "@/stories/Tabs.stories";

const controlled = ref('first');
const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

const outlineItems = [
  ...cuTabsStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const componentTokens = [
  '--tabs-color',
  '--tabs-soft',
  '--tabs-soft-hover',
  '--tabs-soft-active',
  '--tabs-subtle-border',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-md',
  '--cu-font-size-xs',
  '--cu-font-weight-medium',
  '--cu-radius-sm',
  '--cu-radius-md',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-border-color-focus',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'tabs', type: 'TabItem[]', default: '— (requerido)', description: 'Pestañas' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'ghost, solid, boxed, soft' },
  { name: 'size', type: 'string', default: '"md"', description: 'sm, md, lg' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita todas las pestañas' },
];

const slotsData = [
  { name: '{key}', description: 'Contenido del panel de la pestaña (slot dinámico por key)' },
  { name: 'tab-icon-{key}', description: 'Ícono del tab (fallback: solo si la tab no trae la prop icon)' },
];

const eventsData = [
  { name: 'update:modelValue', type: '(key: string) => void', description: 'Pestaña activa (v-model)' },
  { name: 'change', type: '(key: string) => void', description: 'Cambia la pestaña activa' },
];

const exposesData = [
  { name: 'getActive', type: '() => string', description: 'Key de la pestaña activa' },
  { name: 'setActive', type: '(key: string) => void', description: 'Activa la pestaña' },
  { name: 'next', type: '() => void', description: 'Activa la siguiente' },
  { name: 'prev', type: '() => void', description: 'Activa la anterior' },
];

const interfaceCode = `interface TabItem {
  key: string
  label: string
  icon?: string      // HTML/SVG string (render con v-html); si falta, slot tab-icon-{key}
  disabled?: boolean
  keepAlive?: boolean // panel montado siempre (v-show): el estado sobrevive al cambio de tab
}`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Button from '@/components/buttons/Button.vue'

const active = ref('first')
const tabsRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="active = 'first'">first</Button>
      <Button color="neutral" @click="active = 'second'">second</Button>
      <Button color="neutral" @click="active = 'third'">third</Button>
      <Button color="neutral" @click="tabsRef?.next()">next()</Button>
      <Button color="neutral" @click="tabsRef?.prev()">prev()</Button>
    </div>
    <Tabs ref="tabsRef" v-model="active" :tabs="[
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ]">
      <template #first>Contenido First</template>
      <template #second>Contenido Second</template>
      <template #third>Contenido Third</template>
    </Tabs>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuTabs.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="tabs-prog-first">first</cu-button>
  <cu-button id="tabs-prog-second">second</cu-button>
  <cu-button id="tabs-prog-third">third</cu-button>
  <cu-button id="tabs-prog-next">next()</cu-button>
  <cu-button id="tabs-prog-prev">prev()</cu-button>
</div>

<cu-tabs id="tabs-prog">
  <div slot="first">Contenido First</div>
  <div slot="second">Contenido Second</div>
  <div slot="third">Contenido Third</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('tabs-prog');
    tabs.tabs = [
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ];
    document.getElementById('tabs-prog-first').addEventListener('click', () => (tabs.modelValue = 'first'));
    document.getElementById('tabs-prog-second').addEventListener('click', () => (tabs.modelValue = 'second'));
    document.getElementById('tabs-prog-third').addEventListener('click', () => (tabs.modelValue = 'third'));
    document.getElementById('tabs-prog-next').addEventListener('click', () => tabs.next());
    document.getElementById('tabs-prog-prev').addEventListener('click', () => tabs.prev());
    tabs.addEventListener('update:modelValue', (e) => console.log('active:', e.detail));
  });
<\/script>`;
</script>

<template>
  <PlaygroundLayout title="Tabs" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuTabsStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — v-model y métodos en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="controlled = 'first'">first</Button>
              <Button color="neutral" @click="controlled = 'second'">second</Button>
              <Button color="neutral" @click="controlled = 'third'">third</Button>
              <Button color="neutral" @click="tabsRef?.next()">next()</Button>
              <Button color="neutral" @click="tabsRef?.prev()">prev()</Button>
            </div>
            <p class="playground-state">
              active: <strong>{{ controlled }}</strong>
            </p>
            <Tabs ref="tabsRef" v-model="controlled" :tabs="[
              { key: 'first', label: 'First' },
              { key: 'second', label: 'Second' },
              { key: 'third', label: 'Third' },
            ]">
              <template #first>Contenido First</template>
              <template #second>Contenido Second</template>
              <template #third>Contenido Third</template>
            </Tabs>
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

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" />
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
