<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import SideOver from "@/components/overlay/SideOver.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Positions', id: 'positions' },
  { label: 'Fullscreen', id: 'fullscreen' },
  { label: 'Persistent', id: 'persistent' },
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

const openRight = ref(false);
const openLeft = ref(false);
const openTop = ref(false);
const openBottom = ref(false);
const openFull = ref(false);
const openPersistent = ref(false);
const programmatic = ref(false);

const vueImport = `<script setup lang="ts">
import SideOver from '@/components/overlay/SideOver.vue'

const open = ref(false)
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Button @click="open = true">Abrir</Button>
  <SideOver v-model="open" position="left">
    <h3>Contenido</h3>
    <p>Panel que desliza desde la izquierda.</p>
  </SideOver>`);

const fullVue = vueSnippet(`  <SideOver v-model="open" fullscreen position="bottom">
    <h3>Pantalla completa</h3>
    <p>Ocupa toda la pantalla (100dvh).</p>
  </SideOver>`);

const persistentVue = vueSnippet(`  <!-- No se cierra por backdrop ni Escape -->
  <SideOver v-model="open" persistent>
    <p>Solo se cierra con open=false</p>
  </SideOver>`);

const vanillaImport = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuSideOver.umd.js"><\/script>`;

const vanillaSnippet = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" position="left" size="300px">
  <div style="padding: 1rem">
    <h3>Contenido</h3>
    <p>Panel desde la izquierda.</p>
  </div>
</cu-side-over>
<script>
  document.querySelector('#btn').addEventListener('click', () => {
    document.querySelector('#side').open = true
  })
<\/script>`;

const componentTokens = [
  '--cu-color-surface',
  '--cu-shadow-xl',
  '--cu-radius-md',
  '--cu-font-sans',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Abre/cierra el panel (v-model)' },
  { name: 'position', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: 'Desde qué borde desliza el panel' },
  { name: 'size', type: 'string', default: '"300px"', description: 'Ancho (left/right) o alto (top/bottom) del panel. Ignorado en fullscreen' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Ocupa toda la pantalla (inset 0)' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'No se cierra por backdrop ni Escape' },
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

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Valor por defecto">right</Badge>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="vanillaSnippet">
          <div class="playground-row">
            <Button @click="openRight = true" color="primary" variant="soft">Right</Button>
            <Button @click="openLeft = true" variant="soft">Left</Button>
            <Button @click="openTop = true" variant="soft">Top</Button>
            <Button @click="openBottom = true" variant="soft">Bottom</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fullscreen" class="playground-section">
        <div class="playground-heading">
          <h2>Fullscreen</h2>
          <Badge color="neutral" title="Ocupa toda la pantalla">fullscreen</Badge>
        </div>
        <SectionDemo :vue-code="fullVue">
          <Button @click="openFull = true" color="primary" variant="soft">Abrir fullscreen</Button>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="persistent" class="playground-section">
        <div class="playground-heading">
          <h2>Persistent</h2>
          <Badge color="neutral" title="No se cierra por backdrop ni Escape">persistent</Badge>
        </div>
        <SectionDemo :vue-code="persistentVue">
          <Button @click="openPersistent = true" color="warning" variant="soft">Abrir persistent</Button>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <div class="playground-row">
          <Button @click="programmatic = true" color="primary" variant="solid">open()</Button>
          <Button @click="programmatic = false" variant="ghost">close()</Button>
        </div>
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

  <SideOver v-model="openRight" position="right"><div class="sideover-demo"><h3>Right</h3></div></SideOver>
  <SideOver v-model="openLeft" position="left" size="300px"><div class="sideover-demo"><h3>Left</h3></div></SideOver>
  <SideOver v-model="openTop" position="top" size="200px"><div class="sideover-demo"><h3>Top</h3></div></SideOver>
  <SideOver v-model="openBottom" position="bottom" size="200px"><div class="sideover-demo"><h3>Bottom</h3></div></SideOver>
  <SideOver v-model="openFull" fullscreen position="bottom"><div class="sideover-demo"><h3>Fullscreen</h3></div></SideOver>
  <SideOver v-model="openPersistent" position="right" persistent>
    <div class="sideover-demo"><h3>Persistent</h3><p>Se cierra solo con open=false</p></div>
  </SideOver>
  <SideOver v-model="programmatic" position="right" size="300px"><div class="sideover-demo"><h3>Programmatic</h3></div></SideOver>
</template>

<style scoped>
.sideover-demo {
  padding: var(--cu-space-lg);
}
.sideover-demo h3 {
  margin: 0 0 var(--cu-space-sm);
}
</style>