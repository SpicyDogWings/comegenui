<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Size', id: 'size' },
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
import ToggleColorScheme from '@/components/buttons/ToggleColorSheme.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <ToggleColorScheme variant="ghost" />
  <ToggleColorScheme variant="soft" />
  <ToggleColorScheme variant="outlined" />
  <ToggleColorScheme variant="subtle" />
  <ToggleColorScheme variant="solid" />`);

const sizeVue = vueSnippet(`  <ToggleColorScheme :size="16" />
  <ToggleColorScheme :size="20" />
  <ToggleColorScheme :size="24" />`);

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const togglecolorscheme_tokens = [
  '--cu-radius-full',
  '--cu-space-sm',
  '--cu-shadow-sm',
  '--cu-font-size-sm',
];

const styleData = togglecolorscheme_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentTokens = [
  ,
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'variant', type: 'string', default: '"ghost"', description: 'Variante del botón: solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'size', type: 'number', default: '20', description: 'Tamaño del ícono en px' },
];

const eventsData = [
  { name: 'click', type: 'nativo', description: 'Alterna entre el tema light y dark (persiste en localStorage)' },
];
</script>

<template>
  <PlaygroundLayout title="ToggleColorScheme" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">ghost</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue">
          <div class="playground-row">
            <ToggleColorSheme />
            <ToggleColorSheme variant="soft" />
            <ToggleColorSheme variant="outlined" />
            <ToggleColorSheme variant="subtle" />
            <ToggleColorSheme variant="solid" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="size" class="playground-section">
        <div class="playground-heading">
          <h2>Size</h2>
          <Badge color="neutral" title="Tamaño por defecto (px)">20</Badge>
        </div>
        <SectionDemo :vue-code="sizeVue">
          <div class="playground-row">
            <ToggleColorSheme :size="16" />
            <ToggleColorSheme :size="20" />
            <ToggleColorSheme :size="24" />
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

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="[]" empty="No tiene slots (el ícono es interno)" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
