<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import { cuTooltipStories } from "@/stories/overlay/Tooltip.stories";

const outlineItems = [
  ...cuTooltipStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
    ],
  },
];

const componentTokens = [
  '--cu-color-neutral',
  '--cu-color-neutral-text',
  '--cu-font-size-xs',
  '--cu-radius-sm',
  '--cu-shadow-md',
  '--cu-space-xs',
  '--cu-space-sm',
];

const componentDeps = [
  { label: 'Popover', path: '/playground/components/popover' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'text', type: 'string', default: '""', description: 'Texto del tooltip. El slot #content tiene prioridad' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'position', type: 'string', default: '"top"', description: 'bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"center"', description: 'start, center, end' },
  { name: 'offset', type: 'number', default: '6', description: 'Distancia del tooltip al trigger (px)' },
  { name: 'delay', type: 'number', default: '200', description: 'Delay en ms hasta mostrar el tooltip' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'No muestra el tooltip' },
];

const slotsData = [
  { name: 'default', description: 'Trigger del tooltip (se le hace hover)' },
  { name: 'content', description: 'Contenido custom del tooltip. Si no se usa, se muestra la prop text' },
];
</script>

<template>
  <PlaygroundLayout title="Tooltip" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuTooltipStories" />

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" :sub-components="componentDeps" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
