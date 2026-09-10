<script setup lang="ts">
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import { cuButtonStories } from "@/stories/buttons/Button.stories";

const outlineItems = [
  ...cuButtonStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
  '--btn-bg',
  '--btn-bg-hover',
  '--btn-bg-active',
  '--btn-soft',
  '--btn-soft-hover',
  '--btn-soft-active',
  '--btn-subtle',
  '--btn-subtle-hover',
  '--btn-subtle-active',
  '--btn-subtle-border',
  '--btn-ghost-hover',
  '--btn-ghost-active',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-size-lg',
  '--cu-font-weight-medium',
  '--cu-radius',
  '--cu-border-thin',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-space-xl',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del botón: sm, md, lg' },
  { name: 'type', type: 'string', default: '"button"', description: 'Tipo del button: button, submit, reset' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Estado deshabilitado' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner en lugar del contenido; deshabilita mientras está activo' },
  { name: 'to', type: 'string', default: '—', description: 'Si se define, el botón se renderiza como link (<a>)' },
  { name: 'target', type: 'string', default: '"_self"', description: 'Target del link cuando to está definido: _self, _blank, _parent, _top' },
];

const slotsData = [
  { name: 'default', type: 'slot', description: 'Contenido del botón: label y/o iconos SVG inline' },
];

const eventsData = [
  { name: 'click', type: 'nativo', description: 'Activación del botón (mouse o teclado)' },
  { name: 'dblclick', type: 'nativo', description: 'Doble click' },
  { name: 'focus', type: 'nativo', description: 'El botón recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El botón pierde el foco' },
  { name: 'mousedown', type: 'nativo', description: 'Botón del mouse presionado' },
  { name: 'mouseup', type: 'nativo', description: 'Botón del mouse soltado' },
  { name: 'mouseenter', type: 'nativo', description: 'El puntero entra al botón' },
  { name: 'mouseleave', type: 'nativo', description: 'El puntero sale del botón' },
  { name: 'keydown', type: 'nativo', description: 'Tecla presionada con foco en el botón' },
  { name: 'keyup', type: 'nativo', description: 'Tecla soltada con foco en el botón' },
  { name: 'contextmenu', type: 'nativo', description: 'Menú contextual (click derecho)' },
];
</script>

<template>
  <PlaygroundLayout title="Button" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuButtonStories" />

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
