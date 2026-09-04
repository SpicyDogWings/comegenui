<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Input from "@/components/form/Input.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

const nombre = ref("");

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const progValue = ref("");
const progGetResult = ref<string | null>(null);

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Types', id: 'types' },
  { label: 'With Values', id: 'values' },
  { label: 'v-model', id: 'v-model' },
  { label: 'Read Only', id: 'readonly' },
    { label: 'Programmatic', id: 'programmatic' },
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

const vueImport = `<script setup>
import Input from '@/components/form/Input.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Input variant="soft" placeholder="soft (default)" />
  <Input variant="outlined" placeholder="outlined" />
  <Input variant="ghost" placeholder="ghost" />
  <Input variant="subtle" placeholder="subtle" />`);

const colorsVue = vueSnippet(`  <Input color="primary" placeholder="primary" />
  <Input color="secondary" placeholder="secondary" />
  <Input color="neutral" placeholder="neutral" />
  <Input color="success" placeholder="success" />
  <Input color="warning" placeholder="warning" />
  <Input color="danger" placeholder="danger" />`);

const disabledVue = vueSnippet(`  <Input color="primary" disabled placeholder="Disabled" />
  <Input color="neutral" disabled placeholder="Disabled" />`);

const typesVue = vueSnippet(`  <Input type="text" placeholder="Text" />
  <Input type="password" placeholder="Password" />
  <Input type="email" placeholder="Email" />
  <Input type="number" placeholder="Number" />`);

const valuesVue = vueSnippet(`  <Input model-value="Default input" />
  <Input variant="outlined" model-value="Outlined input" />
  <Input variant="ghost" model-value="Ghost input" />`);

const vmodelVue = `<script setup>
import { ref } from 'vue'
import Input from '@/components/form/Input.vue'

const nombre = ref('')
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Input v-model="nombre" placeholder="Escribí tu nombre" style="max-width:280px" />
    <span>Hola, {{ nombre || 'extraño' }}</span>
  </div>
</template>`;

const readonlyVue = vueSnippet(`  <Input read-only model-value="Solo lectura" />
  <Input read-only variant="outlined" model-value="Outlined read-only" />`);

const variantsVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input variant="soft" placeholder="soft (default)"></cu-input>
<cu-input variant="outlined" placeholder="outlined"></cu-input>
<cu-input variant="ghost" placeholder="ghost"></cu-input>
<cu-input variant="subtle" placeholder="subtle"></cu-input>`;

const colorsVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input color="primary" placeholder="primary"></cu-input>
<cu-input color="secondary" placeholder="secondary"></cu-input>
<cu-input color="neutral" placeholder="neutral"></cu-input>
<cu-input color="success" placeholder="success"></cu-input>
<cu-input color="warning" placeholder="warning"></cu-input>
<cu-input color="danger" placeholder="danger"></cu-input>`;

const disabledVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input color="primary" disabled placeholder="Disabled"></cu-input>
<cu-input color="neutral" disabled placeholder="Disabled"></cu-input>`;

const typesVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input type="text" placeholder="Text"></cu-input>
<cu-input type="password" placeholder="Password"></cu-input>
<cu-input type="email" placeholder="Email"></cu-input>
<cu-input type="number" placeholder="Number"></cu-input>`;

const valuesVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input model-value="Default input"></cu-input>
<cu-input variant="outlined" model-value="Outlined input"></cu-input>
<cu-input variant="ghost" model-value="Ghost input"></cu-input>`;

const vmodelVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-input id="mi-nombre" placeholder="Escribí tu nombre" style="max-width:280px"></cu-input>
  <span id="saludo">Hola, extraño</span>
</div>

<script>
  const nombre = document.getElementById('mi-nombre');
  nombre.addEventListener('update:modelValue', (e) => {
    document.getElementById('saludo').textContent = 'Hola, ' + (e.detail || 'extraño');
  });
<\/script>`;

const readonlyVanilla = `<script src="dist/CuInput.umd.js"><\/script>

<cu-input read-only model-value="Solo lectura"></cu-input>
<cu-input read-only variant="outlined" model-value="Outlined read-only"></cu-input>`;

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
  { name: 'get', type: '() => string', default: '—', description: 'Devuelve el valor actual' },
  { name: 'set', type: '(value: string | number) => void', default: '—', description: 'Setea el valor (convertido a string)' },
  { name: 'reset', type: '() => void', default: '—', description: 'Vacía el campo' },
  { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el input' },
];
</script>

<template>
  <PlaygroundLayout title="Input" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-col">
            <Input variant="soft" placeholder="soft (default)" />
            <Input variant="outlined" placeholder="outlined" />
            <Input variant="ghost" placeholder="ghost" />
            <Input variant="subtle" placeholder="subtle" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-col">
            <Input color="primary" placeholder="primary" />
            <Input color="secondary" placeholder="secondary" />
            <Input color="neutral" placeholder="neutral" />
            <Input color="success" placeholder="success" />
            <Input color="warning" placeholder="warning" />
            <Input color="danger" placeholder="danger" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue" :vanilla-code="disabledVanilla">
          <div class="playground-col">
            <Input color="primary" disabled placeholder="Disabled" />
            <Input color="neutral" disabled placeholder="Disabled" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="types" class="playground-section">
        <div class="playground-heading">
          <h2>Types</h2>
          <Badge color="neutral" title="Tipo por defecto">text</Badge>
        </div>
        <SectionDemo :vue-code="typesVue" :vanilla-code="typesVanilla">
          <div class="playground-col">
            <Input type="text" placeholder="Text" />
            <Input type="password" placeholder="Password" />
            <Input type="email" placeholder="Email" />
            <Input type="number" placeholder="Number" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="values" class="playground-section">
        <div class="playground-heading">
          <h2>With Values</h2>
        </div>
        <SectionDemo :vue-code="valuesVue" :vanilla-code="valuesVanilla">
          <div class="playground-col">
            <Input model-value="Default input" />
            <Input variant="outlined" model-value="Outlined input" />
            <Input variant="ghost" model-value="Ghost input" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="v-model" class="playground-section">
        <div class="playground-heading">
          <h2>v-model</h2>
        </div>
        <SectionDemo :vue-code="vmodelVue" :vanilla-code="vmodelVanilla">
          <div class="playground-col">
            <Input v-model="nombre" placeholder="Escribí tu nombre" style="max-width:280px" />
            <span class="playground-code">Hola, {{ nombre || 'extraño' }}</span>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="readonly" class="playground-section">
        <div class="playground-heading">
          <h2>Read Only</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="readonlyVue" :vanilla-code="readonlyVanilla">
          <div class="playground-col">
            <Input read-only model-value="Solo lectura" />
            <Input read-only variant="outlined" model-value="Outlined read-only" />
          </div>
        </SectionDemo>
      </section>

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

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="[]" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
