<script setup lang="ts">
import { ref } from "vue";
import { getTokenDescription } from '@/config/css-tokens';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);

function toggleLoading1() {
  loading1.value = true;
  setTimeout(() => { loading1.value = false; }, 2000);
}
function toggleLoading2() {
  loading2.value = true;
  setTimeout(() => { loading2.value = false; }, 2000);
}
function toggleLoading3() {
  loading3.value = true;
  setTimeout(() => { loading3.value = false; }, 2000);
}

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'With Icon', id: 'icons' },
  { label: 'Loading', id: 'loading' },
  { label: 'As Link', id: 'links' },
  { label: 'Full Width', id: 'fullwidth' },
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

const vueImport = `<script setup>
import Button from '@/components/buttons/Button.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Button color="primary" variant="solid">Solid</Button>
  <Button color="primary" variant="soft">Soft</Button>
  <Button color="primary" variant="ghost">Ghost</Button>
  <Button color="primary" variant="subtle">Subtle</Button>
  <Button color="primary" variant="outlined">Outlined</Button>
  <Button color="primary" variant="link">Link</Button>`);

const colorsVue = vueSnippet(`  <Button color="primary">Primary</Button>
  <Button color="secondary">Secondary</Button>
  <Button color="neutral">Neutral</Button>
  <Button color="success">Success</Button>
  <Button color="warning">Warning</Button>
  <Button color="danger">Danger</Button>`);

const disabledVue = vueSnippet(`  <Button color="primary" disabled>Primary</Button>
  <Button color="secondary" disabled>Secondary</Button>
  <Button color="neutral" disabled>Neutral</Button>
  <Button color="success" disabled>Success</Button>
  <Button color="warning" disabled>Warning</Button>
  <Button color="danger" disabled>Danger</Button>`);

const sizesVue = vueSnippet(`  <Button color="primary" size="sm">Small</Button>
  <Button color="primary" size="md">Medium</Button>
  <Button color="primary" size="lg">Large</Button>`);

const iconsVue = vueSnippet(`  <Button color="primary">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
    Next
  </Button>
  <Button color="secondary">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
    Back
  </Button>`);

const loadingVue = `<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'

const loading = ref(false)

async function guardar() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 2000))
  loading.value = false
}
<\/script>

<template>
  <Button color="primary" :loading="loading" @click="guardar">
    {{ loading ? 'Loading...' : 'Click to Load' }}
  </Button>
</template>`;

const linksVue = vueSnippet(`  <Button color="primary" to="https://google.com" target="_blank">External Link</Button>
  <Button color="secondary" to="/playground/components/button">Internal Link</Button>`);

const fullwidthVue = vueSnippet(`  <Button color="primary" variant="solid" style="width:100%">Full Width Solid</Button>
  <Button color="success" variant="soft" style="width:100%">Full Width Soft</Button>
  <Button color="warning" variant="outlined" style="width:100%">Full Width Outlined</Button>
  <Button color="danger" variant="subtle" style="width:100%">Full Width Subtle</Button>`);

const variantsVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary" variant="solid">Solid</cu-button>
<cu-button color="primary" variant="soft">Soft</cu-button>
<cu-button color="primary" variant="ghost">Ghost</cu-button>
<cu-button color="primary" variant="subtle">Subtle</cu-button>
<cu-button color="primary" variant="outlined">Outlined</cu-button>
<cu-button color="primary" variant="link">Link</cu-button>`;

const colorsVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary">Primary</cu-button>
<cu-button color="secondary">Secondary</cu-button>
<cu-button color="neutral">Neutral</cu-button>
<cu-button color="success">Success</cu-button>
<cu-button color="warning">Warning</cu-button>
<cu-button color="danger">Danger</cu-button>`;

const disabledVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary" disabled>Primary</cu-button>
<cu-button color="secondary" disabled>Secondary</cu-button>
<cu-button color="neutral" disabled>Neutral</cu-button>
<cu-button color="success" disabled>Success</cu-button>
<cu-button color="warning" disabled>Warning</cu-button>
<cu-button color="danger" disabled>Danger</cu-button>`;

const sizesVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary" size="sm">Small</cu-button>
<cu-button color="primary" size="md">Medium</cu-button>
<cu-button color="primary" size="lg">Large</cu-button>`;

const iconsVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
  Next
</cu-button>
<cu-button color="secondary">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
  </svg>
  Back
</cu-button>`;

const loadingVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary" variant="solid" id="guardar">Guardar</cu-button>

<script>
  const btn = document.getElementById('guardar');
  btn.addEventListener('click', async () => {
    btn.loading = true;
    await new Promise((r) => setTimeout(r, 2000));
    btn.loading = false;
  });
<\/script>`;

const linksVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button to="https://google.com" target="_blank">External Link</cu-button>
<cu-button to="/playground/components/button">Internal Link</cu-button>`;

const fullwidthVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button color="primary" variant="solid" style="width:100%">Full Width Solid</cu-button>
<cu-button color="success" variant="soft" style="width:100%">Full Width Soft</cu-button>
<cu-button color="warning" variant="outlined" style="width:100%">Full Width Outlined</cu-button>
<cu-button color="danger" variant="subtle" style="width:100%">Full Width Subtle</cu-button>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const button_tokens = [
  '--btn-bg',
  '--btn-bg-hover',
  '--btn-bg-active',
  '--btn-fg',
  '--btn-bd',
  '--btn-soft',
  '--btn-soft-hover',
  '--btn-soft-active',
  '--btn-subtle',
  '--btn-subtle-hover',
  '--btn-subtle-active',
  '--btn-subtle-border',
  '--btn-ghost-hover',
  '--btn-ghost-active',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-size-lg',
  '--cu-font-weight-medium',
  '--cu-radius',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-space-xl',
  '--cu-border-thin',
  '--cu-color-surface',
];

const styleData = button_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del botón: sm, md, lg' },
  { name: 'type', type: 'string', default: '"button"', description: 'Tipo del button: button, submit, reset' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Estado deshabilitado' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner en lugar del contenido; deshabilita mientras está activo' },
  { name: 'to', type: 'string', default: '—', description: 'Si se define, el botón se renderiza como link (<a>)' },
  { name: 'target', type: 'string', default: '"_self"', description: 'Target del link cuando to está definido: _self, _blank, _parent, _top' },
];

const slotsData = [
  { name: 'default', type: 'slot', description: 'Contenido del botón: label y/o iconos SVG inline' },
];

const eventsData = [
  { name: 'click', type: 'nativo', description: 'Activación del botón (mouse o teclado)' },
  { name: 'dblclick', type: 'nativo', description: 'Doble click' },
  { name: 'focus', type: 'nativo', description: 'El botón recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El botón pierde el foco' },
  { name: 'mousedown', type: 'nativo', description: 'Botón del mouse presionado' },
  { name: 'mouseup', type: 'nativo', description: 'Botón del mouse soltado' },
  { name: 'mouseenter', type: 'nativo', description: 'El puntero entra al botón' },
  { name: 'mouseleave', type: 'nativo', description: 'El puntero sale del botón' },
  { name: 'keydown', type: 'nativo', description: 'Tecla presionada con foco en el botón' },
  { name: 'keyup', type: 'nativo', description: 'Tecla soltada con foco en el botón' },
  { name: 'contextmenu', type: 'nativo', description: 'Menú contextual (click derecho)' },
];
</script>

<template>
  <PlaygroundLayout title="Button" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">ghost</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <Button color="primary" variant="solid">Solid</Button>
            <Button color="primary" variant="soft">Soft</Button>
            <Button color="primary" variant="ghost">Ghost</Button>
            <Button color="primary" variant="subtle">Subtle</Button>
            <Button color="primary" variant="outlined">Outlined</Button>
            <Button color="primary" variant="link">Link</Button>
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
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="neutral">Neutral</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
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
          <div class="playground-row">
            <Button color="primary" disabled>Primary</Button>
            <Button color="secondary" disabled>Secondary</Button>
            <Button color="neutral" disabled>Neutral</Button>
            <Button color="success" disabled>Success</Button>
            <Button color="warning" disabled>Warning</Button>
            <Button color="danger" disabled>Danger</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-row">
            <Button color="primary" size="sm">Small</Button>
            <Button color="primary" size="md">Medium</Button>
            <Button color="primary" size="lg">Large</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <div class="playground-heading">
          <h2>With Icon</h2>
        </div>
        <SectionDemo :vue-code="iconsVue" :vanilla-code="iconsVanilla">
          <div class="playground-row">
            <Button color="primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Next
            </Button>
            <Button color="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back
            </Button>
            <Button color="danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Delete
            </Button>
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
          <div class="playground-row">
            <Button color="primary" :loading="loading1" @click="toggleLoading1">
              {{ loading1 ? 'Loading...' : 'Click to Load' }}
            </Button>
            <Button color="secondary" variant="soft" :loading="loading2" @click="toggleLoading2">
              {{ loading2 ? 'Saving...' : 'Save' }}
            </Button>
            <Button color="danger" variant="solid" :loading="loading3" @click="toggleLoading3">
              {{ loading3 ? 'Deleting...' : 'Delete' }}
            </Button>
            <Button color="primary" :loading="true">Always Loading</Button>
            <Button color="primary" loading disabled>Disabled + Loading</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="links" class="playground-section">
        <div class="playground-heading">
          <h2>As Link</h2>
          <Badge color="neutral" title="Target por defecto">_self</Badge>
        </div>
        <SectionDemo :vue-code="linksVue" :vanilla-code="linksVanilla">
          <div class="playground-row">
            <Button color="primary" to="https://google.com" target="_blank">External Link</Button>
            <Button color="secondary" to="/playground/components/button">Internal Link</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fullwidth" class="playground-section">
        <div class="playground-heading">
          <h2>Full Width</h2>
        </div>
        <SectionDemo :vue-code="fullwidthVue" :vanilla-code="fullwidthVanilla">
          <div class="playground-col">
            <Button color="primary" variant="solid" style="width:100%">Full Width Solid</Button>
            <Button color="success" variant="soft" style="width:100%">Full Width Soft</Button>
            <Button color="warning" variant="outlined" style="width:100%">Full Width Outlined</Button>
            <Button color="danger" variant="subtle" style="width:100%">Full Width Subtle</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
