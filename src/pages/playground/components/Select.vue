<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Select from "@/components/form/Select.vue";
import Badge from "@/components/information/Badge.vue";
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const selected = ref("opt1");
const searchSelected = ref("");

const options = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
  { value: "opt4", label: "Option 4 (disabled)", disabled: true },
];

const customOptions = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil", color: "primary" },
  { value: "cl", label: "Chile", color: "success", variant: "soft" },
  { value: "py", label: "Paraguay", disabled: true },
];

const countryOptions = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "ec", label: "Ecuador" },
  { value: "mx", label: "México" },
  { value: "pe", label: "Perú" },
  { value: "uy", label: "Uruguay" },
  { value: "ve", label: "Venezuela" },
  { value: "py", label: "Paraguay" },
  { value: "bo", label: "Bolivia" },
];

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Options', id: 'options' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'v-model', id: 'v-model' },
  { label: 'Searchable', id: 'searchable' },
  { label: 'Search Cooldown', id: 'cooldown' },
  { label: 'Loading', id: 'loading' },
  { label: 'Positions', id: 'positions' },
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
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const vueImport = `<script setup>
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4 (disabled)', disabled: true },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Select variant="soft" :options="options" placeholder="soft (default)" style="max-width:200px" />
  <Select variant="outlined" :options="options" placeholder="outlined" style="max-width:200px" />
  <Select variant="ghost" :options="options" placeholder="ghost" style="max-width:200px" />
  <Select variant="subtle" :options="options" placeholder="subtle" style="max-width:200px" />`);

const colorsVue = vueSnippet(`  <Select color="primary" :options="options" placeholder="primary" style="max-width:200px" />
  <Select color="secondary" :options="options" placeholder="secondary" style="max-width:200px" />
  <Select color="neutral" :options="options" placeholder="neutral" style="max-width:200px" />
  <Select color="success" :options="options" placeholder="success" style="max-width:200px" />
  <Select color="warning" :options="options" placeholder="warning" style="max-width:200px" />
  <Select color="danger" :options="options" placeholder="danger" style="max-width:200px" />`);

const optionsVue = `<script setup>
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil', color: 'primary' },
  { value: 'cl', label: 'Chile', color: 'success', variant: 'soft' },
  { value: 'py', label: 'Paraguay', disabled: true },
]
<\/script>

<template>
  <Select :options="options" placeholder="Opciones custom" style="max-width:300px" />
</template>`;

const disabledVue = vueSnippet(`  <Select color="primary" disabled :options="options" placeholder="Disabled" style="max-width:300px" />`);

const vmodelVue = `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]
const selected = ref('opt1')
<\/script>

<template>
  <Select v-model="selected" :options="options" style="max-width:300px" />
  <p>Selected: {{ selected }}</p>
</template>`;

const countriesTs = `const countries = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú' },
  { value: 'uy', label: 'Uruguay' },
]`;

const searchableVue = `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'

${countriesTs}
const selected = ref('')
<\/script>

<template>
  <Select v-model="selected" :options="countries" search-enabled placeholder="Buscar país..." style="max-width:300px" />
</template>`;

const cooldownVue = `<script setup>
import Select from '@/components/form/Select.vue'

${countriesTs}
<\/script>

<template>
  <Select :options="countries" search-enabled color="primary" :search-reset-delay="2000" placeholder="primary" style="max-width:200px" />
  <Select :options="countries" search-enabled color="success" :search-reset-delay="2000" placeholder="success" style="max-width:200px" />
  <Select :options="countries" search-enabled color="danger" :search-reset-delay="2000" placeholder="danger" style="max-width:200px" />
</template>`;

const loadingVue = vueSnippet(`  <Select :options="options" loading placeholder="Cargando opciones..." style="max-width:300px" />`);

const assignOptionsJs = `  // options es una prop Array: se asigna por JS (no por atributo)
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
    { value: 'opt4', label: 'Option 4 (disabled)', disabled: true },
  ];
  document.querySelectorAll('cu-select').forEach((el) => { el.options = options; });`;

const assignCountriesJs = `  // options es una prop Array: se asigna por JS (no por atributo)
  const countries = [
    { value: 'ar', label: 'Argentina' },
    { value: 'br', label: 'Brasil' },
    { value: 'cl', label: 'Chile' },
    { value: 'co', label: 'Colombia' },
    { value: 'ec', label: 'Ecuador' },
    { value: 'mx', label: 'México' },
    { value: 'pe', label: 'Perú' },
    { value: 'uy', label: 'Uruguay' },
  ];
  document.querySelectorAll('cu-select').forEach((el) => { el.options = countries; });`;

const vanillaSnippet = (markup: string, scriptBody: string) => `<script src="dist/CuSelect.umd.js"><\/script>

${markup}

<script>
${scriptBody}
<\/script>`;

const variantsVanilla = vanillaSnippet(`<cu-select id="s1" variant="soft" placeholder="soft (default)" style="max-width:200px"></cu-select>
<cu-select id="s2" variant="outlined" placeholder="outlined" style="max-width:200px"></cu-select>
<cu-select id="s3" variant="ghost" placeholder="ghost" style="max-width:200px"></cu-select>
<cu-select id="s4" variant="subtle" placeholder="subtle" style="max-width:200px"></cu-select>`, assignOptionsJs);

const colorsVanilla = vanillaSnippet(`<cu-select id="c1" color="primary" placeholder="primary" style="max-width:200px"></cu-select>
<cu-select id="c2" color="secondary" placeholder="secondary" style="max-width:200px"></cu-select>
<cu-select id="c3" color="neutral" placeholder="neutral" style="max-width:200px"></cu-select>
<cu-select id="c4" color="success" placeholder="success" style="max-width:200px"></cu-select>
<cu-select id="c5" color="warning" placeholder="warning" style="max-width:200px"></cu-select>
<cu-select id="c6" color="danger" placeholder="danger" style="max-width:200px"></cu-select>`, assignOptionsJs);

const optionsVanilla = vanillaSnippet(`<cu-select id="custom" placeholder="Opciones custom" style="max-width:300px"></cu-select>`, `    const select = document.getElementById('custom');
  select.options = [
    { value: 'ar', label: 'Argentina' },
    { value: 'br', label: 'Brasil', color: 'primary' },
    { value: 'cl', label: 'Chile', color: 'success', variant: 'soft' },
    { value: 'py', label: 'Paraguay', disabled: true },
  ];`);

const disabledVanilla = vanillaSnippet(`<cu-select id="disabled-demo" color="primary" disabled placeholder="Disabled" style="max-width:300px"></cu-select>`, assignOptionsJs);

const vmodelVanilla = `<script src="dist/CuSelect.umd.js"><\/script>

<cu-select id="pais" model-value="opt1" placeholder="Seleccionar..." style="max-width:300px"></cu-select>
<p id="out">Selected: opt1</p>

<script>
  // options es una prop Array: se asigna por JS (no por atributo)
  const select = document.getElementById('pais');
  select.options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];
  select.addEventListener('update:modelValue', (e) => {
    document.getElementById('out').textContent = 'Selected: ' + e.detail;
  });
  select.addEventListener('select', (e) => console.log('select', e.detail));
<\/script>`;

const searchableVanilla = vanillaSnippet(`<cu-select id="pais" search-enabled placeholder="Buscar país..." style="max-width:300px"></cu-select>`, assignCountriesJs);

const cooldownVanilla = vanillaSnippet(`<cu-select id="k1" search-enabled color="primary" search-reset-delay="2000" placeholder="primary" style="max-width:200px"></cu-select>
<cu-select id="k2" search-enabled color="success" search-reset-delay="2000" placeholder="success" style="max-width:200px"></cu-select>
<cu-select id="k3" search-enabled color="danger" search-reset-delay="2000" placeholder="danger" style="max-width:200px"></cu-select>`, assignCountriesJs);

const loadingVanilla = vanillaSnippet(`<cu-select id="loading-demo" loading placeholder="Cargando opciones..." style="max-width:300px"></cu-select>`, assignOptionsJs);

const selectRef = ref<InstanceType<typeof Select> | null>(null);
const progGet = ref("—");
const progIsOpen = ref("—");
const progSelectedItem = ref("—");

function readProgrammaticState() {
  const el = selectRef.value;
  if (!el) return;
  progGet.value = el.get() || "(ninguno)";
  progIsOpen.value = String(el.isOpen());
  const option = el.selectedItem();
  progSelectedItem.value = option ? JSON.stringify(option) : "(ninguno)";
}

const positionsVue = vueSnippet(`  <Select position="bottom" :options="options" placeholder="bottom" style="max-width:200px" />
  <Select position="top" :options="options" placeholder="top" style="max-width:200px" />
  <Select position="left" :options="options" placeholder="left" style="max-width:200px" />
  <Select position="right" :options="options" placeholder="right" style="max-width:200px" />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'
import Button from '@/components/buttons/Button.vue'

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]
const selectRef = ref(null)

function logState() {
  console.log('get():', selectRef.value.get())
  console.log('isOpen():', selectRef.value.isOpen())
  console.log('selectedItem():', selectRef.value.selectedItem())
}
<\/script>

<template>
  <Button color="neutral" @click="selectRef.set('opt2'); logState()">set('opt2')</Button>
  <Button color="neutral" @click="selectRef.set('opt3'); logState()">set('opt3')</Button>
  <Button color="neutral" @click="selectRef.reset(); logState()">reset()</Button>
  <Button color="neutral" @click="selectRef.focus()">focus()</Button>
  <Button color="neutral" @click="logState()">get()</Button>
  <Select ref="selectRef" :options="options" placeholder="Select programático" style="max-width:300px" />
</template>`;

const positionsVanilla = vanillaSnippet(`<cu-select id="pos-bottom" position="bottom" placeholder="bottom" style="max-width:200px"></cu-select>
<cu-select id="pos-top" position="top" placeholder="top" style="max-width:200px"></cu-select>
<cu-select id="pos-left" position="left" placeholder="left" style="max-width:200px"></cu-select>
<cu-select id="pos-right" position="right" placeholder="right" style="max-width:200px"></cu-select>`, assignOptionsJs);

const programmaticVanilla = vanillaSnippet(`<cu-button id="sel-prog-set">set('opt2')</cu-button>
<cu-button id="sel-prog-set3">set('opt3')</cu-button>
<cu-button id="sel-prog-reset">reset()</cu-button>
<cu-button id="sel-prog-focus">focus()</cu-button>
<cu-button id="sel-prog-get">get()</cu-button>
<cu-select id="sel" placeholder="Select programático" style="max-width:300px"></cu-select>`, `  customElements.whenDefined('cu-select').then(() => {
    const select = document.getElementById('sel');
    select.options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
    ];
    const logState = () => {
      console.log('get():', select.get());
      console.log('isOpen():', select.isOpen());
      console.log('selectedItem():', select.selectedItem());
    };
    document.getElementById('sel-prog-set').addEventListener('click', () => { select.set('opt2'); logState(); });
    document.getElementById('sel-prog-set3').addEventListener('click', () => { select.set('opt3'); logState(); });
    document.getElementById('sel-prog-reset').addEventListener('click', () => { select.reset(); logState(); });
    document.getElementById('sel-prog-focus').addEventListener('click', () => select.focus());
    document.getElementById('sel-prog-get').addEventListener('click', logState);
  });`);

const interfaceCode = `interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}`;

const componentTokens = [
  '--btn-subtle-border',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-border-thin',
  '--cu-space-md',
];

const componentDeps = [
  { label: 'Dropdown', path: '/playground/components/dropdown' },
  { label: 'Button', path: '/playground/components/button' },
];

const styleSubComponents = [
  { label: 'Dropdown', path: '/playground/components/dropdown#style' },
  { label: 'Button', path: '/playground/components/button#style' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string', default: '""', description: 'Valor seleccionado (v-model)' },
  { name: 'options', type: 'SelectOption[]', default: '[]', description: 'Array de opciones: { value, label, disabled?, color?, variant? }' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
  { name: 'placeholder', type: 'string', default: '""', description: 'Texto cuando no hay selección' },
  { name: 'placeholderWrap', type: 'boolean', default: 'false', description: 'Permite que el label del toggle haga wrap en vez de ellipsis' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el select' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'Posición del panel: bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'Alineación del panel: start, center, end' },
  { name: 'textAlign', type: 'string', default: '"left"', description: 'Alineación del texto de las opciones: left, center, right' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Posiciona el panel con position: fixed (útil dentro de contenedores con overflow)' },
  { name: 'searchEnabled', type: 'boolean', default: 'false', description: 'Búsqueda por teclado como select nativo; hace scroll a la opción que coincide' },
  { name: 'searchResetDelay', type: 'number', default: '2000', description: 'Ms antes de resetear el texto de búsqueda' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Muestra estado de carga en el panel (delegado al Dropdown interno)' },
  { name: 'cooldownVariant', type: 'string', default: '"ghost-hover"', description: 'Variante de la barra de cooldown de la búsqueda' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Nuevo valor seleccionado en detail (v-model)' },
  { name: 'select', type: 'custom', description: 'Emite la opción seleccionada completa en detail' },
  { name: 'close', type: 'custom', description: 'El panel se cerró' },
  { name: 'blur', type: 'custom', description: 'El select perdió el foco (focusout fuera del root)' },
];

const exposesData = [
  { name: 'get', type: '() => string', default: '—', description: 'Devuelve el valor seleccionado' },
  { name: 'set', type: '(value: string) => void', default: '—', description: 'Setea el valor seleccionado' },
  { name: 'reset', type: '() => void', default: '—', description: 'Limpia la selección' },
  { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el select' },
  { name: 'isOpen', type: '() => boolean', default: '—', description: 'Indica si el panel está abierto' },
  { name: 'selectedItem', type: '() => SelectOption | null', default: '—', description: 'Opción seleccionada actualmente' },
];
</script>

<template>
  <PlaygroundLayout title="Select" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <Select variant="soft" :options="options" placeholder="soft (default)" style="max-width:200px" />
            <Select variant="outlined" :options="options" placeholder="outlined" style="max-width:200px" />
            <Select variant="ghost" :options="options" placeholder="ghost" style="max-width:200px" />
            <Select variant="subtle" :options="options" placeholder="subtle" style="max-width:200px" />
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
          <div class="playground-row">
            <Select color="primary" :options="options" placeholder="primary" style="max-width:200px" />
            <Select color="secondary" :options="options" placeholder="secondary" style="max-width:200px" />
            <Select color="neutral" :options="options" placeholder="neutral" style="max-width:200px" />
            <Select color="success" :options="options" placeholder="success" style="max-width:200px" />
            <Select color="warning" :options="options" placeholder="warning" style="max-width:200px" />
            <Select color="danger" :options="options" placeholder="danger" style="max-width:200px" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="options" class="playground-section">
        <div class="playground-heading">
          <h2>Options</h2>
        </div>
        <SectionDemo :vue-code="optionsVue" :vanilla-code="optionsVanilla">
          <div class="playground-col">
            <Select :options="customOptions" placeholder="Opciones custom" style="max-width:300px" />
            <Button variant="link" to="#api-interfaces">Ver interfaz SelectOption ↓</Button>
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
          <Select color="primary" disabled :options="options" placeholder="Disabled" style="max-width:300px" />
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="v-model" class="playground-section">
        <div class="playground-heading">
          <h2>v-model</h2>
        </div>
        <SectionDemo :vue-code="vmodelVue" :vanilla-code="vmodelVanilla">
          <div class="playground-col">
            <Select v-model="selected" :options="options" style="max-width:300px" />
            <p class="playground-code">Selected: {{ selected || '(ninguno)' }}</p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="searchable" class="playground-section">
        <div class="playground-heading">
          <h2>Searchable</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="searchableVue" :vanilla-code="searchableVanilla">
          <div class="playground-col">
            <Select v-model="searchSelected" :options="countryOptions" search-enabled placeholder="Buscar país..." style="max-width:300px" />
            <p class="playground-code">Selected: {{ searchSelected || '(ninguno)' }}</p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="cooldown" class="playground-section">
        <div class="playground-heading">
          <h2>Search Cooldown</h2>
        </div>
        <SectionDemo :vue-code="cooldownVue" :vanilla-code="cooldownVanilla">
          <div class="playground-row">
            <Select :options="countryOptions" search-enabled color="primary" :search-reset-delay="2000" placeholder="primary" style="max-width:200px" />
            <Select :options="countryOptions" search-enabled color="success" :search-reset-delay="2000" placeholder="success" style="max-width:200px" />
            <Select :options="countryOptions" search-enabled color="danger" :search-reset-delay="2000" placeholder="danger" style="max-width:200px" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="loading" class="playground-section">
        <div class="playground-heading">
          <h2>Loading</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="loadingVue" :vanilla-code="loadingVanilla">
          <Select :options="options" loading placeholder="Cargando opciones..." style="max-width:300px" />
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Posición por defecto">bottom</Badge>
        </div>
        <SectionDemo :vue-code="positionsVue" :vanilla-code="positionsVanilla">
          <div class="playground-row">
            <Select :options="options" position="bottom" placeholder="bottom" style="max-width:200px" />
            <Select :options="options" position="top" placeholder="top" style="max-width:200px" />
            <Select :options="options" position="left" placeholder="left" style="max-width:200px" />
            <Select :options="options" position="right" placeholder="right" style="max-width:200px" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el panel abre acá al lado.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="selectRef?.set('opt2'); readProgrammaticState()">set('opt2')</Button>
              <Button color="neutral" @click="selectRef?.set('opt3'); readProgrammaticState()">set('opt3')</Button>
              <Button color="neutral" @click="selectRef?.reset(); readProgrammaticState()">reset()</Button>
              <Button color="neutral" @click="selectRef?.focus()">focus()</Button>
              <Button color="neutral" @click="readProgrammaticState()">get()</Button>
            </div>
            <p class="playground-state">
              get(): <strong>{{ progGet }}</strong>
              · isOpen(): <strong>{{ progIsOpen }}</strong>
              · selectedItem(): <strong>{{ progSelectedItem }}</strong>
            </p>
            <Select
              ref="selectRef"
              :options="options"
              placeholder="Select programático"
              style="max-width:300px"
              @update:model-value="readProgrammaticState()"
              @close="readProgrammaticState()"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

<h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
