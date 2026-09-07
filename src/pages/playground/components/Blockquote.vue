<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Blockquote from "@/components/markdown/Blockquote.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Colors', id: 'colors' },
  { label: 'Con formato', id: 'con-formato' },
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

// ── Snippets Vue ──

const vueImport = `<script setup>
import Blockquote from '@/components/markdown/Blockquote.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <Blockquote html="<p>Esta es una cita importante con estilo por defecto.</p>" />`);

const colorsVue = vueSnippet(`  <Blockquote color="primary" html="<p>Cita con color primary.</p>" />
  <Blockquote color="secondary" html="<p>Cita con color secondary.</p>" />
  <Blockquote color="neutral" html="<p>Cita con color neutral.</p>" />
  <Blockquote color="success" html="<p>Cita con color success.</p>" />
  <Blockquote color="warning" html="<p>Cita con color warning.</p>" />
  <Blockquote color="danger" html="<p>Cita con color danger.</p>" />`);

const conFormatoVue = vueSnippet(`  <Blockquote html="<p>Cita con <strong>negrita</strong> y <em>cursiva</em>.</p><p>Múltiples párrafos soportados.</p>" />`);

const slotVue = vueSnippet(`  <Blockquote color="success">
    <p>Cita pasada por slot (alternativa a html).</p>
  </Blockquote>`);

const componentTokens = [
  '--cu-border-thick',
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
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'html', type: 'string', default: '""', description: 'Contenido HTML de la cita. Si se omite, usa el slot default' },
];

const slotsData = [
  { name: 'default', description: 'Contenido de la cita cuando no se pasa html' },
];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];
</script>

<template>
  <PlaygroundLayout title="Blockquote" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue">
          <div class="playground-col">
            <Blockquote html="<p>Esta es una cita importante con estilo por defecto.</p>" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue">
          <div class="playground-col">
            <Blockquote color="primary" html="<p>Cita con color primary.</p>" />
            <Blockquote color="secondary" html="<p>Cita con color secondary.</p>" />
            <Blockquote color="neutral" html="<p>Cita con color neutral.</p>" />
            <Blockquote color="success" html="<p>Cita con color success.</p>" />
            <Blockquote color="warning" html="<p>Cita con color warning.</p>" />
            <Blockquote color="danger" html="<p>Cita con color danger.</p>" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="con-formato" class="playground-section">
        <div class="playground-heading">
          <h2>Con formato inline</h2>
        </div>
        <SectionDemo :vue-code="conFormatoVue">
          <div class="playground-col">
            <Blockquote html="<p>Cita con <strong>negrita</strong> y <em>cursiva</em>.</p><p>Múltiples párrafos soportados.</p>" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="slot" class="playground-section">
        <div class="playground-heading">
          <h2>Con slot (alternativa a html)</h2>
        </div>
        <SectionDemo :vue-code="slotVue">
          <div class="playground-col">
            <Blockquote color="success">
              <p>Cita pasada por slot (alternativa a html).</p>
            </Blockquote>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
