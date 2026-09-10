<script setup lang="ts">
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import { cuLabelStories } from "@/stories/form/Label.stories";

const outlineItems = [
  ...cuLabelStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
  '--label-fg',
  '--cu-font-sans',
  '--cu-space-xs',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'for', type: 'string', default: '""', description: 'ID del elemento a enfocar al hacer click en el texto del label' },
  { name: 'label', type: 'string', default: '""', description: 'Texto del label; si está vacío no se renderiza el span' },
  { name: 'color', type: 'string', default: '"#2c2c2c"', description: 'Color del texto (valor CSS). En cu-label acepta nombres semánticos: primary, neutral, success, warning, danger' },
  { name: 'hightContrast', type: 'boolean', default: 'false', description: 'Alto contraste. Typo persistente del codebase (documentado tal cual); declarado pero sin efecto visual en la versión actual' },
];

const slotsData = [
  { name: 'default', type: 'slot', description: 'Contenido bajo el texto del label: inputs, selects, textareas, etc.' },
];

const eventsData = [
  { name: 'click', type: 'custom', description: 'Click en el texto del label; antes enfoca el elemento for si está definido' },
];
</script>

<template>
  <PlaygroundLayout title="Label" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuLabelStories" />

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
