<script setup lang="ts">
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import { cuFloatingButtonStories } from "@/stories/buttons/FloatingButton.stories";

const outlineItems = [
  ...cuFloatingButtonStories.sections.map((section) => ({ label: section.title, id: section.id })),
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

const componentTokens = [
  '--fab-bg',
  '--fab-bg-hover',
  '--fab-bg-active',
  '--cu-radius-full',
  '--cu-shadow-lg',
  '--cu-shadow-xl',
  '--cu-space-lg',
  '--cu-space-3xl',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"primary"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Estado deshabilitado' },
];

const slotsData = [
  { name: 'default', type: 'slot', description: 'Contenido del FAB: ícono SVG inline' },
];

const eventsData = [
  { name: 'click', type: 'custom', description: 'Emitido al hacer click; no se emite si está disabled' },
];
</script>

<template>
  <PlaygroundLayout title="FloatingButton" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuFloatingButtonStories" />

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
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
