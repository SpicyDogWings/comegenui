<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Loader from "@/components/information/Loader.vue";

const outlineItems = [
  { label: 'Loading', id: 'loading' },
  { label: 'Cooldown', id: 'cooldown' },
  { label: 'Colors', id: 'colors' },
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

const loader_tokens = [
  '--cu-loader-color',
  '--cu-loader-delay',
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

const loadingVue = `<script setup>
import Loader from '@/components/information/Loader.vue'
<\/script>

<template>
  <div class="demo-box">
    <Loader color="primary" animation="loading" />
  </div>
</template>

<style>
.demo-box { position: relative; height: 3px; min-width: 200px; }
</style>`;

const loadingVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuLoader.umd.js"><\/script>

<div style="position: relative; height: 3px; min-width: 200px">
  <cu-loader color="primary" animation="loading"></cu-loader>
</div>`;

const cooldownVue = `<script setup>
import { ref } from 'vue'
import Loader from '@/components/information/Loader.vue'
import Button from '@/components/buttons/Button.vue'

const key = ref(0)
<\/script>

<template>
  <div class="demo-box">
    <Loader :key="key" animation="cooldown" :delay="2000" />
  </div>
  <Button color="neutral" variant="soft" @click="key++">Reiniciar</Button>
</template>`;

const colorsVue = `<script setup>
import Loader from '@/components/information/Loader.vue'
<\/script>

<template>
  <Loader color="primary" animation="loading" />
  <Loader color="secondary" animation="loading" />
  <Loader color="neutral" animation="loading" />
  <Loader color="success" animation="loading" />
  <Loader color="warning" animation="loading" />
  <Loader color="danger" animation="loading" />
</template>`;

const colorsVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuLoader.umd.js"><\/script>

<cu-loader color="primary" animation="loading"></cu-loader>
<cu-loader color="secondary" animation="loading"></cu-loader>
<cu-loader color="neutral" animation="loading"></cu-loader>
<cu-loader color="success" animation="loading"></cu-loader>
<cu-loader color="warning" animation="loading"></cu-loader>
<cu-loader color="danger" animation="loading"></cu-loader>`;

const progAnimation = ref('loading');
const progKey = ref(0);

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
      <section id="loading" class="playground-section">
        <div class="playground-heading">
          <h2>Loading</h2>
          <Badge color="neutral" title="animation por defecto">loading</Badge>
        </div>
        <p class="playground-desc">Barra de carga infinita (slide de izquierda a derecha). Usada en tablas, dropdowns, etc.</p>
        <SectionDemo :vue-code="loadingVue" :vanilla-code="loadingVanilla">
          <div class="playground-demo-box">
            <Loader color="primary" animation="loading" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="cooldown" class="playground-section">
        <div class="playground-heading">
          <h2>Cooldown</h2>
          <Badge color="neutral" title="delay por defecto (ms)">2000</Badge>
        </div>
        <p class="playground-desc">Barra que se vacía en el tiempo configurable (<code>delay</code> ms). Se reinicia con cada tecla (estilo select nativo).</p>
        <SectionDemo :vue-code="cooldownVue">
          <div class="playground-col">
            <div class="playground-demo-box">
              <Loader :key="progKey" animation="cooldown" :delay="2000" />
            </div>
            <div class="playground-row">
              <Button color="neutral" variant="soft" @click="progKey++">
                Reiniciar cooldown
              </Button>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-grid">
            <div v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color">
              <span class="playground-label">{{ color }}</span>
              <div class="playground-demo-box">
                <Loader :color="color" animation="loading" />
              </div>
            </div>
          </div>
        </SectionDemo>
      </section>

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

      <hr class="playground-separator" />

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" />

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

.playground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.playground-label {
  display: block;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

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
