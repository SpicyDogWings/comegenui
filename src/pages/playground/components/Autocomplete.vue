<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const selected = ref("ts");

const items = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rs" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
];

const iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>';

const itemsWithIcon = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts", icon: iconSvg },
  { label: "Python", value: "py", icon: iconSvg },
  { label: "Rust", value: "rs" },
  { label: "Go", value: "go" },
];

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Items', id: 'items' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Min Chars', id: 'min-chars' },
  { label: 'v-model', id: 'v-model' },
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
import Autocomplete from '@/components/form/Autocomplete.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
  { label: 'Rust', value: 'rs' },
  { label: 'Go', value: 'go' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Autocomplete variant="soft" :items="items" placeholder="soft (default)" style="max-width:200px" />
  <Autocomplete variant="outlined" :items="items" placeholder="outlined" style="max-width:200px" />
  <Autocomplete variant="ghost" :items="items" placeholder="ghost" style="max-width:200px" />
  <Autocomplete variant="subtle" :items="items" placeholder="subtle" style="max-width:200px" />`);

const colorsVue = vueSnippet(`  <Autocomplete color="primary" :items="items" placeholder="primary" style="max-width:200px" />
  <Autocomplete color="secondary" :items="items" placeholder="secondary" style="max-width:200px" />
  <Autocomplete color="neutral" :items="items" placeholder="neutral" style="max-width:200px" />
  <Autocomplete color="success" :items="items" placeholder="success" style="max-width:200px" />
  <Autocomplete color="warning" :items="items" placeholder="warning" style="max-width:200px" />
  <Autocomplete color="danger" :items="items" placeholder="danger" style="max-width:200px" />`);

const itemsVue = `<script setup>
import Autocomplete from '@/components/form/Autocomplete.vue'

// Cada item acepta: label, value?, icon? (icon es un string HTML/SVG, se renderiza con v-html)
const icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts', icon },
  { label: 'Python', value: 'py', icon },
  { label: 'Rust', value: 'rs' },
]
<\/script>

<template>
  <Autocomplete :items="items" placeholder="Buscar lenguaje..." style="max-width:300px" />
</template>`;

const disabledVue = vueSnippet(`  <Autocomplete color="primary" disabled :items="items" placeholder="Disabled" style="max-width:300px" />`);

const minCharsVue = vueSnippet(`  <Autocomplete :items="items" :min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px" />`);

const vmodelVue = `<script setup>
import { ref } from 'vue'
import Autocomplete from '@/components/form/Autocomplete.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
  { label: 'Rust', value: 'rs' },
]
const selected = ref('ts')
<\/script>

<template>
  <Autocomplete v-model="selected" :items="items" placeholder="Search..." style="max-width:300px" />
  <p>Selected: {{ selected }}</p>
</template>`;

const assignItemsJs = `  // items es una prop Array: se asigna por JS (no por atributo)
  const items = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Rust', value: 'rs' },
    { label: 'Go', value: 'go' },
  ];
  document.querySelectorAll('cu-autocomplete').forEach((el) => { el.items = items; });`;

const vanillaSnippet = (markup: string, scriptBody: string) => `<script src="dist/CuAutocomplete.umd.js"><\/script>

${markup}

<script>
${scriptBody}
<\/script>`;

const variantsVanilla = vanillaSnippet(`<cu-autocomplete id="a1" variant="soft" placeholder="soft (default)" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a2" variant="outlined" placeholder="outlined" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a3" variant="ghost" placeholder="ghost" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a4" variant="subtle" placeholder="subtle" style="max-width:200px"></cu-autocomplete>`, assignItemsJs);

const colorsVanilla = vanillaSnippet(`<cu-autocomplete id="c1" color="primary" placeholder="primary" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c2" color="secondary" placeholder="secondary" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c3" color="neutral" placeholder="neutral" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c4" color="success" placeholder="success" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c5" color="warning" placeholder="warning" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c6" color="danger" placeholder="danger" style="max-width:200px"></cu-autocomplete>`, assignItemsJs);

const itemsVanilla = vanillaSnippet(`<cu-autocomplete id="demo" placeholder="Buscar lenguaje..." style="max-width:300px"></cu-autocomplete>`, `  // items es una prop Array: se asigna por JS (no por atributo).
  // icon es un string HTML/SVG que se renderiza con v-html dentro de la opción.
  const icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>';
  document.getElementById('demo').items = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts', icon },
    { label: 'Python', value: 'py', icon },
    { label: 'Rust', value: 'rs' },
  ];`);

const disabledVanilla = vanillaSnippet(`<cu-autocomplete id="disabled-demo" color="primary" disabled placeholder="Disabled" style="max-width:300px"></cu-autocomplete>`, assignItemsJs);

const minCharsVanilla = vanillaSnippet(`<cu-autocomplete id="min-chars-demo" min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px"></cu-autocomplete>`, assignItemsJs);

const vmodelVanilla = `<script src="dist/CuAutocomplete.umd.js"><\/script>

<cu-autocomplete id="leng" model-value="ts" placeholder="Search..." style="max-width:300px"></cu-autocomplete>
<p id="out">Selected: ts</p>

<script>
  // items es una prop Array: se asigna por JS (no por atributo)
  const ac = document.getElementById('leng');
  ac.items = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Rust', value: 'rs' },
  ];
  ac.addEventListener('update:modelValue', (e) => {
    document.getElementById('out').textContent = 'Selected: ' + e.detail;
  });
  ac.addEventListener('select', (e) => console.log('select', e.detail));
<\/script>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'v-model', type: 'string', default: '""', description: 'Texto/value actual (defineModel)' },
  { name: 'items', type: 'AutocompleteItem[]', default: '[]', description: 'Items: { label, value?, icon? }; icon es un string HTML/SVG (v-html)' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
  { name: 'type', type: 'string', default: '"text"', description: 'Tipo del input: text, email, password, etc.' },
  { name: 'placeholder', type: 'string', default: '""', description: 'Texto de ayuda cuando está vacío' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el input y el panel' },
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura (seleccionable, no editable)' },
  { name: 'minChars', type: 'number', default: '0', description: 'Mínimo de caracteres antes de abrir el panel' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'Posición del panel: bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'Alineación del panel: start, center, end' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Posiciona el panel con position: fixed (útil dentro de contenedores con overflow)' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'Texto actualizado en detail (v-model)' },
  { name: 'select', type: 'custom', description: 'Emite el item seleccionado completo en detail' },
  { name: 'blur', type: 'custom', description: 'El componente perdió el foco (focusout fuera del root)' },
];

const exposesData = [
  { name: 'get', type: '() => string', default: '—', description: 'Devuelve el texto actual' },
  { name: 'set', type: '(val: string) => void', default: '—', description: 'Setea el texto (input y modelo)' },
  { name: 'reset', type: '() => void', default: '—', description: 'Limpia el texto' },
  { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el input' },
  { name: 'isOpen', type: '() => boolean', default: '—', description: 'Indica si el panel está abierto' },
  { name: 'selectedItem', type: '() => AutocompleteItem | null', default: '—', description: 'Último item seleccionado' },
];
</script>

<template>
  <PlaygroundLayout title="Autocomplete" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <Autocomplete variant="soft" :items="items" placeholder="soft (default)" style="max-width:200px" />
            <Autocomplete variant="outlined" :items="items" placeholder="outlined" style="max-width:200px" />
            <Autocomplete variant="ghost" :items="items" placeholder="ghost" style="max-width:200px" />
            <Autocomplete variant="subtle" :items="items" placeholder="subtle" style="max-width:200px" />
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
            <Autocomplete color="primary" :items="items" placeholder="primary" style="max-width:200px" />
            <Autocomplete color="secondary" :items="items" placeholder="secondary" style="max-width:200px" />
            <Autocomplete color="neutral" :items="items" placeholder="neutral" style="max-width:200px" />
            <Autocomplete color="success" :items="items" placeholder="success" style="max-width:200px" />
            <Autocomplete color="warning" :items="items" placeholder="warning" style="max-width:200px" />
            <Autocomplete color="danger" :items="items" placeholder="danger" style="max-width:200px" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="items" class="playground-section">
        <div class="playground-heading">
          <h2>Items</h2>
        </div>
        <SectionDemo :vue-code="itemsVue" :vanilla-code="itemsVanilla">
          <div class="playground-col">
            <Autocomplete :items="itemsWithIcon" placeholder="Buscar lenguaje..." style="max-width:300px" />
            <p class="playground-code">Cada item acepta: label, value?, icon? (string HTML/SVG)</p>
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
          <Autocomplete color="primary" disabled :items="items" placeholder="Disabled" style="max-width:300px" />
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="min-chars" class="playground-section">
        <div class="playground-heading">
          <h2>Min Chars</h2>
          <Badge color="neutral" title="Valor por defecto">0</Badge>
        </div>
        <SectionDemo :vue-code="minCharsVue" :vanilla-code="minCharsVanilla">
          <Autocomplete :items="items" :min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px" />
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="v-model" class="playground-section">
        <div class="playground-heading">
          <h2>v-model</h2>
        </div>
        <SectionDemo :vue-code="vmodelVue" :vanilla-code="vmodelVanilla">
          <div class="playground-col">
            <Autocomplete v-model="selected" :items="items" placeholder="Search..." style="max-width:300px" />
            <p class="playground-code">Selected: {{ selected || '(ninguno)' }}</p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

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
