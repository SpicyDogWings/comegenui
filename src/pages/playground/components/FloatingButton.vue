<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import { getTokenDescription } from '@/config/css-tokens';
import FloatingButton from "@/components/buttons/FloatingButton.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import LucideSave from "@/components/icons/LucideSave.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";

const outlineItems = [
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Slot', id: 'slot' },
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

const vueImport = `<script setup>
import FloatingButton from '@/components/buttons/FloatingButton.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const colorsVue = vueSnippet(`  <FloatingButton color="primary" style="position:static" />
  <FloatingButton color="secondary" style="position:static" />
  <FloatingButton color="neutral" style="position:static" />
  <FloatingButton color="success" style="position:static" />
  <FloatingButton color="warning" style="position:static" />
  <FloatingButton color="danger" style="position:static" />`);

const disabledVue = vueSnippet(`  <FloatingButton color="primary" style="position:static" />
  <FloatingButton color="primary" style="position:static" disabled />`);

const slotVue = vueSnippet(`  <FloatingButton color="primary" style="position:static">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  </FloatingButton>
  <FloatingButton color="secondary" style="position:static">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  </FloatingButton>`);

const colorsVanilla = `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static"></cu-floating-button>
<cu-floating-button color="secondary" style="position:static"></cu-floating-button>
<cu-floating-button color="neutral" style="position:static"></cu-floating-button>
<cu-floating-button color="success" style="position:static"></cu-floating-button>
<cu-floating-button color="warning" style="position:static"></cu-floating-button>
<cu-floating-button color="danger" style="position:static"></cu-floating-button>`;

const disabledVanilla = `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static"></cu-floating-button>
<cu-floating-button color="primary" style="position:static" disabled></cu-floating-button>`;

const slotVanilla = `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
</cu-floating-button>
<cu-floating-button color="secondary" style="position:static">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
</cu-floating-button>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const floatingbutton_tokens = [
  '--fab-bg',
  '--fab-bg-hover',
  '--fab-bg-active',
  '--cu-radius-full',
  '--cu-shadow-lg',
  '--cu-shadow-xl',
  '--cu-space-lg',
  '--cu-space-3xl',
  '--cu-color-surface',
];

const styleData = floatingbutton_tokens.map(name => ({ name, description: getTokenDescription(name) }));

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
      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <FloatingButton color="primary" style="position: static"><LucideSave /></FloatingButton>
            <FloatingButton color="secondary" style="position: static"><LucideCheck /></FloatingButton>
            <FloatingButton color="neutral" style="position: static"><LucideCheck /></FloatingButton>
            <FloatingButton color="success" style="position: static"><LucideCheck /></FloatingButton>
            <FloatingButton color="warning" style="position: static"><LucideCheck /></FloatingButton>
            <FloatingButton color="danger" style="position: static"><LucideCheck /></FloatingButton>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue" :vanilla-code="disabledVanilla">
          <div class="playground-row">
            <FloatingButton color="primary" style="position: static"><LucideSave /></FloatingButton>
            <FloatingButton color="primary" style="position: static" disabled><LucideSave /></FloatingButton>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="slot" class="playground-section">
        <div class="playground-heading">
          <h2>Slot</h2>
          <Badge color="neutral" title="Único slot">default</Badge>
        </div>
        <SectionDemo :vue-code="slotVue" :vanilla-code="slotVanilla">
          <div class="playground-row">
            <FloatingButton color="primary" style="position: static">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </FloatingButton>
            <FloatingButton color="secondary" style="position: static">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </FloatingButton>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

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
