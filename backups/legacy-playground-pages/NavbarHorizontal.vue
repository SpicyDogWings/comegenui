<script setup lang="ts">
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import { cuNavbarHorizontalStories } from "@/stories/navigation/NavbarHorizontal.stories";

const outlineItems = [
  ...cuNavbarHorizontalStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const componentTokens = [
  '--cu-font-size-sm',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'items', type: 'NavItem[]', default: '—', description: 'Árbol de navegación: { label, path?, icon?, children? }. Los padres se renderizan como Dropdown en cascada (anidamiento infinito), las hojas como items de menú nativos' },
  { name: 'trigger', type: '"click" | "hover"', default: '"click"', description: 'Cómo abren los submenús: click (default) o hover' },
  { name: 'activePath', type: 'string', default: '""', description: 'Path del item activo (manual). En apps Vue se toma de useRoute() si no se pasa; en vanilla/PHP setealo vos' },
];

const interfaceCode = `interface NavItem {
  label: string
  path?: string
  icon?: string
  children?: NavItem[]
}`;
</script>

<template>
  <PlaygroundLayout title="NavbarHorizontal" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuNavbarHorizontalStories" />

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
