<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import { cuBadgeStories } from "@/stories/information/Badge.stories";

const outlineItems = [
  ...cuBadgeStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
  '--badge-bg',
  '--badge-text',
  '--badge-soft',
  '--badge-soft-hover',
  '--badge-subtle',
  '--badge-subtle-border',
  '--badge-ghost-hover',
  '--cu-font-sans',
  '--cu-font-size-xs',
  '--cu-font-weight-medium',
  '--cu-line-height-tight',
  '--cu-radius',
  '--cu-border-thin',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
];

const slotsData = [
  { name: 'default', description: 'Texto del badge' },
];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const progColor = ref('primary');
const progVariant = ref('soft');

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Badge from '@/components/information/Badge.vue'
import Button from '@/components/buttons/Button.vue'

const color = ref('primary')
const variant = ref('soft')
<\/script>

<template>
  <Button @click="color = 'danger'">color = 'danger'</Button>
  <Button @click="variant = 'solid'">variant = 'solid'</Button>
  <Badge :color="color" :variant="variant">{{ color }} · {{ variant }}</Badge>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Badge" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuBadgeStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el badge cambia en vivo. No expone métodos ni eventos: se maneja por props.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progColor = 'danger'">color = 'danger'</Button>
              <Button color="neutral" @click="progColor = 'success'">color = 'success'</Button>
              <Button color="neutral" @click="progVariant = 'solid'">variant = 'solid'</Button>
              <Button color="neutral" @click="progVariant = 'outlined'">variant = 'outlined'</Button>
            </div>
            <p class="playground-state">
              color: <strong>{{ progColor }}</strong>
              · variant: <strong>{{ progVariant }}</strong>
            </p>
            <div>
              <Badge :color="progColor" :variant="progVariant">{{ progColor }} · {{ progVariant }}</Badge>
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

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.playground-state {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}
</style>
