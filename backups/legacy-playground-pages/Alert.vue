<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Alert from "@/components/information/Alert.vue";
import { cuAlertStories } from "@/stories/information/Alert.stories";

const outlineItems = [
  ...cuAlertStories.sections.map((section) => ({ label: section.title, id: section.id })),
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

const componentTokens = [
  '--alert-bg',
  '--alert-text',
  '--alert-soft',
  '--alert-subtle',
  '--alert-subtle-border',
  '--alert-ghost-hover',
  '--alert-ghost-active',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-lg',
  '--cu-font-weight-bold',
  '--cu-radius',
  '--cu-radius-sm',
  '--cu-border-thin',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-color-surface',
];

const componentDeps = [
  { label: 'Button', path: '/playground/components/button' },
];

const styleSubComponents = [
  { label: 'Button', path: '/playground/components/button#style' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'title', type: 'string', default: '—', description: 'Título del alert' },
  { name: 'close', type: 'boolean', default: 'false', description: 'Muestra el botón X para cerrar' },
  { name: 'show', type: 'boolean', default: 'true', description: 'Visibilidad (v-model:show)' },
];

const slotsData = [
  { name: 'default', description: 'Contenido del alert' },
  { name: 'icon', description: 'Icono junto al título' },
];

const eventsData = [
  { name: 'close', type: '() => void', description: 'Se cerró el alert' },
  { name: 'open', type: '() => void', description: 'Se abrió el alert' },
  { name: 'update:show', type: '(value: boolean) => void', description: 'Cambió la visibilidad (v-model:show)' },
];

const exposesData = [
  { name: 'open()', type: '() => void', description: 'Abre el alert' },
  { name: 'close()', type: '() => void', description: 'Cierra el alert' },
  { name: 'toggle()', type: '() => void', description: 'Alterna abierto/cerrado' },
  { name: 'isOpen()', type: '() => boolean', description: 'Estado actual' },
];

const alertRef = ref<any>(null);
const progOpen = ref(true);

function progCall(fn: 'open' | 'close' | 'toggle') {
  alertRef.value?.[fn]?.();
}

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Alert from '@/components/information/Alert.vue'
import Button from '@/components/buttons/Button.vue'

const alertRef = ref(null)
const isOpen = ref(true)
<\/script>

<template>
  <Button @click="alertRef?.open()">open()</Button>
  <Button @click="alertRef?.close()">close()</Button>
  <Button @click="alertRef?.toggle()">toggle()</Button>
  <Alert
    ref="alertRef"
    title="Controlado por API"
    color="warning"
    @open="isOpen = true"
    @close="isOpen = false"
  >
    Estado: {{ isOpen ? 'abierto' : 'cerrado' }}
  </Alert>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Alert" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuAlertStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el alert cambia en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progCall('open')">open()</Button>
              <Button color="neutral" @click="progCall('close')">close()</Button>
              <Button color="neutral" @click="progCall('toggle')">toggle()</Button>
            </div>
            <p class="playground-state">isOpen: <strong>{{ progOpen }}</strong></p>
            <Alert
              ref="alertRef"
              title="Controlado por API"
              color="warning"
              close
              @open="progOpen = true"
              @close="progOpen = false"
            >
              Este alert se controla con open()/close()/toggle().
            </Alert>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

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
