<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Loader from "@/components/information/Loader.vue";
import { cuLoaderStories } from "@/stories/information/Loader.stories";

const progAnimation = ref('loading');
const progKey = ref(0);

const outlineItems = [
  ...cuLoaderStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
  '--cu-loader-color',
  '--cu-loader-delay',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'animation', type: 'string', default: '"loading"', description: 'loading (slide infinito) | cooldown (se vacía en `delay` ms)' },
  { name: 'delay', type: 'number', default: '2000', description: 'Duración del cooldown en ms (solo animation="cooldown")' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Loader from '@/components/information/Loader.vue'
import Button from '@/components/buttons/Button.vue'

const animation = ref('loading')
const key = ref(0)
<\/script>

<template>
  <Button color="neutral" @click="animation = 'loading'">loading()</Button>
  <Button color="neutral" @click="animation = 'cooldown'">cooldown()</Button>
  <Button color="neutral" @click="key++">restart()</Button>
  <div class="demo-box">
    <Loader :key="key" :animation="animation" :delay="2000" />
  </div>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Loader" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuLoaderStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la animación cambia en vivo. No expone métodos: se maneja por props (el <code>:key</code> reinicia el cooldown).
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progAnimation = 'loading'">loading()</Button>
              <Button color="neutral" @click="progAnimation = 'cooldown'">cooldown()</Button>
              <Button color="neutral" @click="progKey++">restart()</Button>
            </div>
            <p class="playground-state">
              animation: <strong>{{ progAnimation }}</strong>
              · restarts: <strong>{{ progKey }}</strong>
            </p>
            <div class="playground-demo-box">
              <Loader :key="progKey" :animation="progAnimation" :delay="2000" />
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
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos (se maneja por props)" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-demo-box {
  position: relative;
  height: 3px;
  background: var(--cu-color-neutral-subtle, rgba(0, 0, 0, 0.06));
  border-radius: 2px;
  overflow: hidden;
  min-width: 200px;
}
</style>

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
