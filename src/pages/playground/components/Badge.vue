<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'All Combinations', id: 'combinations' },
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

const componentTokens = [];

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

const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'];
const VARIANTS = ['solid', 'soft', 'ghost', 'subtle', 'outlined'];

const variantsVue = `<script setup>
import Badge from '@/components/information/Badge.vue'
<\/script>

<template>
  <Badge color="primary" variant="solid">solid</Badge>
  <Badge color="primary" variant="soft">soft</Badge>
  <Badge color="primary" variant="ghost">ghost</Badge>
  <Badge color="primary" variant="subtle">subtle</Badge>
  <Badge color="primary" variant="outlined">outlined</Badge>
</template>`;
const variantsVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuBadge.umd.js"><\/script>

<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>`;

const colorsVue = `<Badge color="primary">primary</Badge>
<Badge color="secondary">secondary</Badge>
<Badge color="neutral">neutral</Badge>
<Badge color="success">success</Badge>
<Badge color="warning">warning</Badge>
<Badge color="danger">danger</Badge>`;
const colorsVanilla = `<cu-badge color="primary">primary</cu-badge>
<cu-badge color="secondary">secondary</cu-badge>
<cu-badge color="neutral">neutral</cu-badge>
<cu-badge color="success">success</cu-badge>
<cu-badge color="warning">warning</cu-badge>
<cu-badge color="danger">danger</cu-badge>`;

const combinationsVue = `<Badge color="success" variant="solid">solid</Badge>
<Badge color="danger" variant="outlined">outlined</Badge>
<Badge color="warning" variant="subtle">subtle</Badge>`;
const combinationsVanilla = `<cu-badge color="success" variant="solid">solid</cu-badge>
<cu-badge color="danger" variant="outlined">outlined</cu-badge>
<cu-badge color="warning" variant="subtle">subtle</cu-badge>`;

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
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <Badge color="primary" variant="solid">solid</Badge>
            <Badge color="primary" variant="soft">soft</Badge>
            <Badge color="primary" variant="ghost">ghost</Badge>
            <Badge color="primary" variant="subtle">subtle</Badge>
            <Badge color="primary" variant="outlined">outlined</Badge>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <Badge color="primary">primary</Badge>
            <Badge color="secondary">secondary</Badge>
            <Badge color="neutral">neutral</Badge>
            <Badge color="success">success</Badge>
            <Badge color="warning">warning</Badge>
            <Badge color="danger">danger</Badge>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="combinations" class="playground-section">
        <h2>All Combinations</h2>
        <SectionDemo :vue-code="combinationsVue" :vanilla-code="combinationsVanilla">
          <table class="playground-badge-table">
            <thead>
              <tr>
                <th>variant \ color</th>
                <th v-for="color in COLORS" :key="color">{{ color }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="variant in VARIANTS" :key="variant">
                <td class="playground-badge-label">{{ variant }}</td>
                <td v-for="color in COLORS" :key="color">
                  <Badge :color="color" :variant="variant">{{ variant }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </SectionDemo>
      </section>

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
