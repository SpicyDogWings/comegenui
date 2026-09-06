<script setup lang="ts">
import { ref } from "vue";
import { getTokenDescription } from '@/config/css-tokens';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Alert from "@/components/information/Alert.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Close', id: 'close' },
  { label: 'v-model:show', id: 'toggle' },
  { label: 'With Icon', id: 'icons' },
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
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const alert_tokens = [
  '--alert-bg',
  '--alert-text',
  '--alert-soft',
  '--alert-subtle',
  '--alert-subtle-border',
  '--alert-ghost-hover',
  '--alert-ghost-active',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-lg',
  '--cu-font-weight-bold',
  '--cu-radius',
  '--cu-radius-sm',
  '--cu-border-thin',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-color-surface',
];

const styleData = alert_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [{ label: 'Button', path: '/playground/components/button' }];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'title', type: 'string', default: '—', description: 'Título del alert' },
  { name: 'close', type: 'boolean', default: 'false', description: 'Muestra el botón X para cerrar' },
  { name: 'show', type: 'boolean', default: 'true', description: 'Visibilidad (v-model:show)' },
];

const slotsData = [
  { name: 'default', description: 'Contenido del alert' },
  { name: 'icon', description: 'Icono junto al título' },
];

const eventsData = [
  { name: 'close', type: '() => void', description: 'Se cerró el alert' },
  { name: 'open', type: '() => void', description: 'Se abrió el alert' },
  { name: 'update:show', type: '(value: boolean) => void', description: 'Cambió la visibilidad (v-model:show)' },
];

const exposesData = [
  { name: 'open()', type: '() => void', description: 'Abre el alert' },
  { name: 'close()', type: '() => void', description: 'Cierra el alert' },
  { name: 'toggle()', type: '() => void', description: 'Alterna abierto/cerrado' },
  { name: 'isOpen()', type: '() => boolean', description: 'Estado actual' },
];

const showAlert = ref(true);
const alertRef = ref<any>(null);
const progOpen = ref(true);

function progCall(fn: 'open' | 'close' | 'toggle') {
  alertRef.value?.[fn]?.();
}

const variantsVue = `<script setup>
import Alert from '@/components/information/Alert.vue'
<\/script>

<template>
  <Alert title="Solid" color="primary" variant="solid">This is a solid alert.</Alert>
  <Alert title="Soft" color="primary" variant="soft">This is a soft alert.</Alert>
  <Alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</Alert>
  <Alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</Alert>
  <Alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</Alert>
</template>`;
const variantsVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Solid" color="primary" variant="solid">This is a solid alert.</cu-alert>
<cu-alert title="Soft" color="primary" variant="soft">This is a soft alert.</cu-alert>
<cu-alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</cu-alert>
<cu-alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</cu-alert>
<cu-alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</cu-alert>`;

const colorsVue = `<Alert title="Primary" color="primary">Primary alert</Alert>
<Alert title="Secondary" color="secondary">Secondary alert</Alert>
<Alert title="Neutral" color="neutral">Neutral alert</Alert>
<Alert title="Success" color="success">Success alert</Alert>
<Alert title="Warning" color="warning">Warning alert</Alert>
<Alert title="Danger" color="danger">Danger alert</Alert>`;
const colorsVanilla = `<cu-alert title="Primary" color="primary">Primary alert</cu-alert>
<cu-alert title="Secondary" color="secondary">Secondary alert</cu-alert>
<cu-alert title="Neutral" color="neutral">Neutral alert</cu-alert>
<cu-alert title="Success" color="success">Success alert</cu-alert>
<cu-alert title="Warning" color="warning">Warning alert</cu-alert>
<cu-alert title="Danger" color="danger">Danger alert</cu-alert>`;

const closeVue = `<script setup>
import Alert from '@/components/information/Alert.vue'
<\/script>

<template>
  <Alert title="Closeable" color="primary" close>
    Click the X to close this alert.
  </Alert>
</template>`;
const closeVanilla = `<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Closeable" color="primary" close>
  Click the X to close this alert.
</cu-alert>`;

const toggleVue = `<script setup>
import { ref } from 'vue'
import Alert from '@/components/information/Alert.vue'

const show = ref(true)
<\/script>

<template>
  <Button @click="show = !show">Toggle</Button>
  <Alert v-model:show="show" title="Toggleable" color="success" close>
    This alert is controlled via v-model:show.
  </Alert>
</template>`;
const toggleVanilla = `<script src="CuAlert.umd.js"><\/script>

<cu-alert id="my-alert" title="Toggleable" color="success" close>
  This alert is controlled via v-model:show.
</cu-alert>

<script>
  const alert = document.getElementById('my-alert')
  alert.addEventListener('update:show', (e) => console.log('show:', e.detail))
  alert.show = false // prop nativa del Custom Element<\/script>`;

const iconsVue = `<Alert title="Info" color="primary" variant="soft">
  <template #icon>
    <svg ...>...</svg>
  </template>
  This alert has an icon in the title.
</Alert>`;
const iconsVanilla = `<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Info" color="primary" variant="soft">
  <svg slot="icon" ...>...</svg>
  This alert has an icon in the title.
</cu-alert>`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Alert from '@/components/information/Alert.vue'
import Button from '@/components/buttons/Button.vue'

const alertRef = ref(null)
const isOpen = ref(true)
<\/script>

<template>
  <Button @click="alertRef?.open()">open()</Button>
  <Button @click="alertRef?.close()">close()</Button>
  <Button @click="alertRef?.toggle()">toggle()</Button>
  <Alert
    ref="alertRef"
    title="Controlado por API"
    color="warning"
    @open="isOpen = true"
    @close="isOpen = false"
  >
    Estado: {{ isOpen ? 'abierto' : 'cerrado' }}
  </Alert>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Alert" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-col">
            <Alert title="Solid" color="primary" variant="solid">This is a solid alert.</Alert>
            <Alert title="Soft" color="primary" variant="soft">This is a soft alert.</Alert>
            <Alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</Alert>
            <Alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</Alert>
            <Alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</Alert>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-col">
            <Alert title="Primary" color="primary">Primary alert</Alert>
            <Alert title="Secondary" color="secondary">Secondary alert</Alert>
            <Alert title="Neutral" color="neutral">Neutral alert</Alert>
            <Alert title="Success" color="success">Success alert</Alert>
            <Alert title="Warning" color="warning">Warning alert</Alert>
            <Alert title="Danger" color="danger">Danger alert</Alert>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="close" class="playground-section">
        <h2>With Close</h2>
        <SectionDemo :vue-code="closeVue" :vanilla-code="closeVanilla">
          <Alert title="Closeable" color="primary" close>Click the X to close this alert.</Alert>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="toggle" class="playground-section">
        <h2>v-model:show</h2>
        <SectionDemo :vue-code="toggleVue" :vanilla-code="toggleVanilla">
          <div class="playground-col">
            <Button @click="showAlert = !showAlert">Toggle Alert ({{ showAlert ? 'visible' : 'hidden' }})</Button>
            <Alert v-model:show="showAlert" title="Toggleable" color="success" close>This alert is controlled via v-model:show.</Alert>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <h2>With Icon</h2>
        <SectionDemo :vue-code="iconsVue" :vanilla-code="iconsVanilla">
          <Alert title="Info" color="primary" variant="soft">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </template>
            This alert has an icon in the title.
          </Alert>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el alert cambia en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progCall('open')">open()</Button>
              <Button color="neutral" @click="progCall('close')">close()</Button>
              <Button color="neutral" @click="progCall('toggle')">toggle()</Button>
            </div>
            <p class="playground-state">isOpen: <strong>{{ progOpen }}</strong></p>
            <Alert
              ref="alertRef"
              title="Controlado por API"
              color="warning"
              close
              @open="progOpen = true"
              @close="progOpen = false"
            >
              Este alert se controla con open()/close()/toggle().
            </Alert>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />

        <h4>Sub-componentes con estilos propios</h4>
        <ul class="playground-component-links">
          <li><a href="/playground/components/button" class="playground-component-link">Button</a> — revisá sus variables CSS en su propia sección Style</li>
        </ul>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-components">Components</h3>
        <p class="playground-desc">
          Este componente usa los siguientes sub-componentes:
        </p>
        <ul class="playground-component-links">
          <li v-for="dep in [{ label: 'Button', path: '/playground/components/button' }]" :key="dep.label">
            <Button :to="dep.path" variant="link" size="sm">{{ dep.label }}</Button>
          </li>
        </ul>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
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
