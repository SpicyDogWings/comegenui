<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import CopyButton from "@/components/buttons/CopyButton.vue";
import Table from "@/components/data/Table.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";

const variantsVue = `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
<\/script>

<template>
  <CopyButton text="Contenido a copiar" variant="soft" />
  <CopyButton text="Contenido a copiar" variant="solid" />
  <CopyButton text="Contenido a copiar" variant="outlined" />
  <CopyButton text="Contenido a copiar" variant="ghost" />
  <CopyButton text="Contenido a copiar" variant="subtle" />
</template>`;

const colorsVue = `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
<\/script>

<template>
  <CopyButton text="Contenido" color="primary" />
  <CopyButton text="Contenido" color="secondary" />
  <CopyButton text="Contenido" color="neutral" />
  <CopyButton text="Contenido" color="success" />
  <CopyButton text="Contenido" color="warning" />
  <CopyButton text="Contenido" color="danger" />
</template>`;

const labelsVue = `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
import Button from '@/components/buttons/Button.vue';
<\/script>

<template>
  <!-- icon-only (label vacío) -->
  <CopyButton text='{"id": 1, "nombre": "Ana"}' />

  <!-- label siempre visible + copiedLabel animado -->
  <CopyButton text='{"id": 1, "nombre": "Ana"}' label="Copiar JSON" copiedLabel="¡JSON copiado!" />
  <CopyButton text="npm install comegen-ui" label="Copiar comando" copiedLabel="¡Comando copiado!" />
</template>`;

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Labels', id: 'labels' },
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

const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const;

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
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue">
          <div class="playground-row">
            <CopyButton text="Contenido soft" variant="soft" />
            <CopyButton text="Contenido solid" variant="solid" />
            <CopyButton text="Contenido outlined" variant="outlined" />
            <CopyButton text="Contenido ghost" variant="ghost" />
            <CopyButton text="Contenido subtle" variant="subtle" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue">
          <div class="playground-row">
            <CopyButton v-for="color in colors" :key="color" text="Contenido copiable" :color="color" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="labels" class="playground-section">
        <div class="playground-heading">
          <h2>Labels</h2>
          <Badge color="neutral" title="label vacío por defecto: solo icono">icon-only</Badge>
        </div>
        <SectionDemo :vue-code="labelsVue">
          <div class="playground-row">
            <CopyButton text='{"id": 1, "nombre": "Ana"}' />
            <CopyButton text='{"id": 1, "nombre": "Ana"}' label="Copiar JSON" copiedLabel="¡JSON copiado!" />
            <CopyButton text="npm install comegen-ui" label="Copiar comando" copiedLabel="¡Comando copiado!" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      

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
