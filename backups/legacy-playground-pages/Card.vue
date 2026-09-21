<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Card from "@/components/information/Card.vue";
import { cuCardStories } from "@/stories/information/Card.stories";

const outlineItems = [
  ...cuCardStories.sections.map((section) => ({ label: section.title, id: section.id })),
  { label: 'Programmatic', id: 'programmatic' },
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
  '--card-bg',
  '--card-text',
  '--card-soft',
  '--card-subtle',
  '--card-subtle-border',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-lg',
  '--cu-font-weight-bold',
  '--cu-line-height-relaxed',
  '--cu-radius-lg',
  '--cu-shadow-md',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'ghost, outlined, soft, subtle, solid' },
  { name: 'layout', type: 'string', default: '"vertical"', description: 'vertical (media arriba) | horizontal (media al costado)' },
  { name: 'title', type: 'string', default: '—', description: 'Título (reemplazado por el slot #header)' },
  { name: 'subtitle', type: 'string', default: '—', description: 'Subtítulo bajo el title' },
  { name: 'image', type: 'string', default: '—', description: 'URL de imagen de la media (alternativa al slot #media)' },
];

const slotsData = [
  { name: 'default', description: 'Contenido principal' },
  { name: 'media', description: 'Media personalizada (reemplaza image)' },
  { name: 'header', description: 'Reemplaza title/subtitle' },
  { name: 'footer', description: 'Acciones o info adicional' },
];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const progVariant = ref('ghost');
const progLayout = ref('vertical');

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Card from '@/components/information/Card.vue'
import Button from '@/components/buttons/Button.vue'

const variant = ref('ghost')
const layout = ref('vertical')
<\/script>

<template>
  <Button @click="variant = 'solid'">variant = 'solid'</Button>
  <Button @click="layout = 'horizontal'">layout = 'horizontal'</Button>
  <Card title="En vivo" :variant="variant" :layout="layout">
    La tarjeta cambia por props.
  </Card>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Card" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuCardStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la tarjeta cambia en vivo. No expone métodos ni eventos: se maneja por props.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progVariant = 'solid'">variant = 'solid'</Button>
              <Button color="neutral" @click="progVariant = 'outlined'">variant = 'outlined'</Button>
              <Button color="neutral" @click="progVariant = 'ghost'">variant = 'ghost'</Button>
              <Button color="neutral" @click="progLayout = progLayout === 'vertical' ? 'horizontal' : 'vertical'">toggle layout</Button>
            </div>
            <p class="playground-state">
              variant: <strong>{{ progVariant }}</strong>
              · layout: <strong>{{ progLayout }}</strong>
            </p>
            <div class="prog-card">
              <Card title="En vivo" subtitle="Cambia por props" :variant="progVariant" :layout="progLayout" color="primary">
                La tarjeta se re-renderiza con cada cambio de prop.
              </Card>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos (se maneja por props)" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.prog-card {
  max-width: 420px;
}

.media-block {
  padding: 2rem;
  text-align: center;
  background-color: var(--cu-color-primary-soft);
  color: var(--cu-color-primary);
}

.media-side {
  padding: 2rem;
  text-align: center;
  background-color: var(--cu-color-primary-soft);
  color: var(--cu-color-primary);
}
</style>
