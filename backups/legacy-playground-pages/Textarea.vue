<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Textarea from "@/components/form/Textarea.vue";
import { cuTextareaStories } from "@/stories/form/Textarea.stories";

const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
const progGet = ref("—");

function readProgrammaticState() {
  const el = textareaRef.value;
  if (!el) return;
  progGet.value = el.get() || "(vacío)";
}

const outlineItems = [
  ...cuTextareaStories.sections.map((section) => ({ label: section.title, id: section.id })),
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

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Textarea from '@/components/form/Textarea.vue'
import Button from '@/components/buttons/Button.vue'

const taRef = ref(null)

function logValue() {
  console.log('get():', taRef.value.get())
}
<\/script>

<template>
  <Textarea ref="taRef" placeholder="Escribí algo..." :rows="3" />
  <Button color="neutral" @click="logValue()">get()</Button>
  <Button color="neutral" @click="taRef.set('Hola mundo'); logValue()">set('Hola mundo')</Button>
  <Button color="neutral" @click="taRef.reset(); logValue()">reset()</Button>
  <Button color="neutral" @click="taRef.focus()">focus()</Button>
</template>`;

const programmaticVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea id="ta" placeholder="Escribí algo..." rows="3"></cu-textarea>
<cu-button id="btn-get">get()</cu-button>
<cu-button id="btn-set">set('Hola mundo')</cu-button>
<cu-button id="btn-reset">reset()</cu-button>
<cu-button id="btn-focus">focus()</cu-button>

<script>
  customElements.whenDefined('cu-textarea').then(() => {
    const ta = document.getElementById('ta');
    document.getElementById('btn-get').addEventListener('click', () => console.log('get():', ta.get()));
    document.getElementById('btn-set').addEventListener('click', () => ta.set('Hola mundo'));
    document.getElementById('btn-reset').addEventListener('click', () => ta.reset());
    document.getElementById('btn-focus').addEventListener('click', () => ta.focus());
  });
<\/script>`;

const componentTokens = [
  '--btn-bg',
  '--btn-bg-hover',
  '--btn-soft',
  '--btn-soft-hover',
  '--btn-subtle',
  '--btn-subtle-hover',
  '--btn-subtle-border',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-weight-medium',
  '--cu-radius-md',
  '--cu-border-thin',
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
  { name: 'v-model', type: 'string', default: '""', description: 'Valor del textarea (defineModel)' },
  { name: 'startValue', type: 'string', default: '—', description: 'Valor inicial alternativo (declarado pero sin efecto actualmente; usar v-model)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Texto de ayuda cuando está vacío' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el textarea' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura (seleccionable, no editable)' },
  { name: 'rows', type: 'number', default: '3', description: 'Cantidad de filas visibles' },
  { name: 'noResize', type: 'boolean', default: 'false', description: 'Desactiva el redimensionado manual' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Emite el valor actualizado en detail al escribir (v-model)' },
  { name: 'input', type: 'nativo', description: 'Evento input nativo del textarea interno (compone hacia el host)' },
];

const exposesData = [
  { name: 'get', type: '() => string', description: 'Devuelve el valor actual' },
  { name: 'set', type: '(value: string | number) => void', description: 'Setea el valor' },
  { name: 'reset', type: '() => void', description: 'Limpia el valor' },
  { name: 'focus', type: '() => void', description: 'Pone el foco en el textarea' },
];
</script>

<template>
  <PlaygroundLayout title="Textarea" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuTextareaStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="readProgrammaticState()">get()</Button>
              <Button color="neutral" @click="textareaRef?.set('Hola mundo'); readProgrammaticState()">set('Hola mundo')</Button>
              <Button color="neutral" @click="textareaRef?.reset(); readProgrammaticState()">reset()</Button>
              <Button color="neutral" @click="textareaRef?.focus()">focus()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGet }}</strong>
            </p>
            <Textarea ref="textareaRef" placeholder="Textarea programático" :rows="3" />
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
