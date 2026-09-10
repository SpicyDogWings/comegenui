<script setup lang="ts">
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import { cuCopyButtonStories } from "@/stories/buttons/CopyButton.stories";

const outlineItems = [
  ...cuCopyButtonStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-radius',
  '--cu-space-sm',
  '--cu-color-surface',
  '--cu-border-thin',
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
  { name: 'text', type: 'string', default: '—', description: 'Contenido a copiar (obligatorio)' },
  { name: 'label', type: 'string', default: '""', description: 'Texto siempre visible junto al icono; vacío = icon-only (aria: "Copiar")' },
  { name: 'copiedLabel', type: 'string', default: '"Copiado"', description: 'Texto animado + aria-label durante el estado copied (2s)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico del Button interno' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'Variante del Button interno' },
];

const eventsData = [
  { name: 'click', type: 'nativo', description: 'Click nativo del Button interno; dispara la copia al portapapeles' },
];
</script>

<template>
  <PlaygroundLayout title="CopyButton" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuCopyButtonStories" />

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="[]" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
