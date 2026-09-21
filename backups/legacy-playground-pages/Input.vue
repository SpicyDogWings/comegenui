<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import { cuInputStories } from "@/stories/form/Input.stories";

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const progValue = ref("");
const progGetResult = ref<string | null>(null);

const outlineItems = [
  ...cuInputStories.sections.map((section) => ({ label: section.title, id: section.id })),
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
import Input from '@/components/form/Input.vue'

const value = ref('')
const inputRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Input ref="inputRef" v-model="value" placeholder="Escribí algo" style="max-width:280px" />
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="console.log(inputRef?.get())">get()</Button>
      <Button color="neutral" @click="inputRef?.set('Hola')">set('Hola')</Button>
      <Button color="neutral" @click="inputRef?.set(42)">set(42)</Button>
      <Button color="neutral" @click="inputRef?.reset()">reset()</Button>
      <Button color="neutral" @click="inputRef?.focus()">focus()</Button>
    </div>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-input id="in-prog" placeholder="Escribí algo" style="max-width:280px"></cu-input>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="in-prog-get">get()</cu-button>
    <cu-button id="in-prog-set">set('Hola')</cu-button>
    <cu-button id="in-prog-set-number">set(42)</cu-button>
    <cu-button id="in-prog-reset">reset()</cu-button>
    <cu-button id="in-prog-focus">focus()</cu-button>
  </div>
  <span id="in-prog-state">""</span>
</div>

<script>
  customElements.whenDefined('cu-input').then(() => {
    const input = document.getElementById('in-prog');
    const state = document.getElementById('in-prog-state');
    const showValue = () => {
      state.textContent = 'get(): ' + JSON.stringify(input.get());
    };
    document.getElementById('in-prog-get').addEventListener('click', showValue);
    document.getElementById('in-prog-set').addEventListener('click', () => {
      input.set('Hola');
      showValue();
    });
    document.getElementById('in-prog-set-number').addEventListener('click', () => {
      input.set(42);
      showValue();
    });
    document.getElementById('in-prog-reset').addEventListener('click', () => {
      input.reset();
      showValue();
    });
    document.getElementById('in-prog-focus').addEventListener('click', () => input.focus());
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
  { name: 'modelValue', type: 'string', default: '""', description: 'Valor del input (v-model)' },
  { name: 'startValue', type: 'string', default: '—', description: 'Declarado en el componente pero actualmente sin efecto' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico del foco: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'Estilo visual: outlined, soft, ghost, subtle' },
  { name: 'type', type: 'string', default: '"text"', description: 'Tipo del input: text, password, email, number, tel, url, search' },
  { name: 'placeholder', type: 'string', default: '—', description: 'Texto de ayuda cuando el input está vacío' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el input' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Muestra el valor pero no permite editarlo' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Se emite al escribir (v-model). detail: string' },
  { name: 'input', type: 'nativo', description: 'El usuario escribe; el componente usa este evento para actualizar el modelo' },
  { name: 'change', type: 'nativo', description: 'El valor se confirma (blur o Enter)' },
  { name: 'focus', type: 'nativo', description: 'El input recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El input pierde el foco' },
  { name: 'keydown', type: 'nativo', description: 'Tecla presionada con foco en el input' },
  { name: 'keyup', type: 'nativo', description: 'Tecla soltada con foco en el input' },
];

const exposesData = [
  { name: 'get', type: '() => string', description: 'Devuelve el valor actual' },
  { name: 'set', type: '(value: string | number) => void', description: 'Setea el valor (convertido a string)' },
  { name: 'reset', type: '() => void', description: 'Vacía el campo' },
  { name: 'focus', type: '() => void', description: 'Pone el foco en el input' },
];
</script>

<template>
  <PlaygroundLayout title="Input" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuInputStories" />

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
              <Button color="neutral" @click="progGetResult = inputRef?.get() ?? null">get()</Button>
              <Button color="neutral" @click="inputRef?.set('Hola')">set('Hola')</Button>
              <Button color="neutral" variant="soft" @click="inputRef?.set(42)">set(42)</Button>
              <Button color="neutral" @click="inputRef?.reset()">reset()</Button>
              <Button color="neutral" @click="inputRef?.focus()">focus()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGetResult ?? '—' }}</strong>
              · v-model: <strong>{{ progValue ?? '—' }}</strong>
            </p>
            <Input ref="inputRef" v-model="progValue" placeholder="Escribí algo" style="max-width:280px" />
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
