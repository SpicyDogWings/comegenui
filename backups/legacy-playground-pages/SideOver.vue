<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import Button from "@/components/buttons/Button.vue";
import Table from "@/components/data/Table.vue";
import { cuSideOverStories } from "@/stories/overlay/SideOver.stories";

const outlineItems = [
  ...cuSideOverStories.sections.map((section) => ({ label: section.title, id: section.id })),
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [{ label: 'CSS Variables', id: 'style-variables' }],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
    ],
  },
];

const programmatic = ref(false);

const programmaticVue = `<script setup lang="ts">
import { ref } from 'vue'
import SideOver from '@/components/overlay/SideOver.vue'
import Button from '@/components/buttons/Button.vue'

const open = ref(false)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="primary" @click="open = true">open()</Button>
      <Button variant="ghost" @click="open = false">close()</Button>
    </div>
    <p>open: {{ open }}</p>
    <SideOver v-model="open" title="Programmatic" position="right" size="300px">
      <p>Controlado por open() / close() vía v-model.</p>
    </SideOver>
  </div>
</template>`;

const programmaticVanilla = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuSideOver.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="side-open">open()</cu-button>
  <cu-button id="side-close">close()</cu-button>
</div>

<cu-side-over id="side" title="Programmatic" position="right" size="300px">
  <p>Controlado por open() / close() vía v-model.</p>
</cu-side-over>

<script>
  customElements.whenDefined('cu-side-over').then(() => {
    const side = document.getElementById('side');
    document.getElementById('side-open').addEventListener('click', () => side.open = true);
    document.getElementById('side-close').addEventListener('click', () => side.open = false);
  });
<\/script>`;

const componentTokens = [
  '--cu-color-surface',
  '--cu-shadow-xl',
  '--cu-radius-md',
  '--cu-font-sans',
  '--cu-border-color',
  '--cu-sideover-size-md',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Abre/cierra el panel (v-model)' },
  { name: 'title', type: 'string', default: '""', description: 'Título del panel. Se muestra en el header junto al botón de cerrar' },
  { name: 'position', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: 'Desde qué borde desliza el panel' },
  { name: 'size', type: 'string', default: '"300px"', description: 'Ancho (left/right) o alto (top/bottom) del panel. Acepta CSS ("300px", "40vw") o preset "sm" | "md" | "lg" | "xl" | "full". Ignorado en fullscreen' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Ocupa toda la pantalla (inset 0)' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'No se cierra por backdrop, Escape ni el botón de cerrar (que se oculta)' },
  { name: 'zIndex', type: 'number', default: '1100', description: 'Z-index del overlay' },
];

const slotsData = [
  { name: 'default', type: 'contenido', default: '—', description: 'Contenido del panel' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'boolean', description: 'Se emite al abrir/cerrar' },
  { name: 'close', type: '—', description: 'Se emite cuando se cierra (backdrop/Escape)' },
];
</script>

<template>
  <PlaygroundLayout title="SideOver" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuSideOverStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          El panel se controla con v-model; el custom element además expone open() / close() / toggle().
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="primary" @click="programmatic = true">open()</Button>
              <Button variant="ghost" @click="programmatic = false">close()</Button>
            </div>
            <p class="playground-state">
              open: <strong>{{ programmatic ? 'true' : 'false' }}</strong>
            </p>
            <SideOver v-model="programmatic" title="Programmatic" position="right" size="300px">
              <div class="sideover-demo"><p>Controlado por open() / close() vía v-model.</p></div>
            </SideOver>
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
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />
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

/* Estilos de los previews de la story (renderizados dentro de la página) */
.sideover-demo h3 {
  margin: 0 0 var(--cu-space-sm);
}
.sideover-form {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
}
.sideover-form label {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
}
</style>
