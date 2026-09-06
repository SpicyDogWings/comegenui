<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import Navbar from "@/components/lab/collapse/navigation/Navbar.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Search', id: 'search' },
  { label: 'Search Modes', id: 'modes', children: [
    { label: 'Filter', id: 'mode-filter' },
    { label: 'Scroll', id: 'mode-scroll' },
  ]},
  { label: 'Search Fields', id: 'fields' },
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
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

const basicItems = [
  { label: 'Inicio', path: '/playground/components/navbar' },
  { label: 'Componentes', children: [
    { label: 'Buttons', children: [
      { label: 'Button', path: '/playground/components/button' },
      { label: 'CopyButton', path: '/playground/components/copy-button' },
      { label: 'FloatingButton', path: '/playground/components/floating-button' },
    ]},
    { label: 'Form', children: [
      { label: 'Input', path: '/playground/components/input' },
      { label: 'Select', path: '/playground/components/select' },
      { label: 'Textarea', path: '/playground/components/textarea' },
    ]},
    { label: 'Data', children: [
      { label: 'Table', path: '/playground/components/table' },
      { label: 'AdvancedTable', path: '/playground/components/advanced-table' },
    ]},
  ]},
  { label: 'Configuración', children: [
    { label: 'Perfil', path: '/perfil' },
    { label: 'Seguridad', path: '/seguridad' },
    { label: 'Notificaciones', path: '/notificaciones' },
  ]},
  { label: 'Ayuda', path: '/ayuda' },
];

const vueImport = `<script setup lang="ts">
import Navbar from '@/components/lab/collapse/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Componentes', children: [
    { label: 'Button', path: '/componentes/button' },
    { label: 'Input', path: '/componentes/input' },
  ]},
  { label: 'Configuración', children: [
    { label: 'Perfil', path: '/perfil' },
    { label: 'Seguridad', path: '/seguridad' },
  ]},
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Navbar :items="items" />`);

const searchVue = vueSnippet(`  <Navbar :items="items" search />`);

const filterVue = vueSnippet(`  <!-- filter (default): oculta lo que no matchea.
       Si matchea un subitem, se muestra su árbol entero -->
  <Navbar :items="items" search search-mode="filter" />`);

const scrollVue = vueSnippet(`  <!-- scroll: deja el árbol completo y resalta + scrollea
       al primer match -->
  <Navbar :items="items" search search-mode="scroll" />`);

const fieldsVue = `<script setup lang="ts">
import Navbar from '@/components/lab/collapse/navigation/Navbar.vue'

// Por defecto busca en TODA la interfaz del item (todos los campos menos
// children). Con searchFields se limita a los campos indicados, como en las
// tablas.
const items = [
  { label: 'Perfil', path: '/perfil', tag: 'usuario' },
  { label: 'Seguridad', path: '/seguridad', tag: 'sesión' },
]
<\/script>

<template>
  <!-- Solo busca por label: "/seguridad" ya no matchea -->
  <Navbar :items="items" search :search-fields="['label']" />
</template>`;

const componentTokens = [];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'items', type: 'NavItem[]', default: '—', description: 'Árbol de navegación: { label, path?, children? }. Los items con children se renderizan como Collapse' },
  { name: 'search', type: 'boolean', default: 'false', description: 'Activa el input de búsqueda arriba del menú; filtra/resalta items automáticamente' },
  { name: 'searchPlaceholder', type: 'string', default: '"Buscar..."', description: 'Placeholder del input de búsqueda' },
  { name: 'searchMode', type: 'string', default: '"filter"', description: 'filter: oculta lo que no matchea (mostrando el árbol entero del match). scroll: deja el árbol completo y resalta + scrollea al primer match' },
  { name: 'searchFields', type: 'string[]', default: '[]', description: 'Campos a buscar. Vacío = toda la interfaz del item (todos los campos menos children)' },
];

const eventsData = [
  { name: 'search', type: 'string', description: 'Se emite al escribir; payload con el query actual' },
];
</script>

<template>
  <PlaygroundLayout title="Navbar" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
          <Badge color="neutral" title="Items con children se renderizan como Collapse">tree</Badge>
        </div>
        <SectionDemo :vue-code="basicVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="basicItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="search" class="playground-section">
        <div class="playground-heading">
          <h2>Search</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="searchVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="basicItems" search />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="modes" class="playground-section">
        <div class="playground-heading">
          <h2>Search Modes</h2>
          <Badge color="neutral" title="Modo por defecto">filter</Badge>
        </div>

        <h3 id="mode-filter">Filter</h3>
        <SectionDemo :vue-code="filterVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="basicItems" search search-mode="filter" />
            </div>
          </div>
        </SectionDemo>

        <h3 id="mode-scroll">Scroll</h3>
        <SectionDemo :vue-code="scrollVue">
          <div class="playground-col">
            <div class="demo-panel demo-panel--scroll">
              <Navbar :items="basicItems" search search-mode="scroll" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fields" class="playground-section">
        <div class="playground-heading">
          <h2>Search Fields</h2>
          <Badge color="neutral" title="Vacío busca en toda la interfaz del item">[]</Badge>
        </div>
        <SectionDemo :vue-code="fieldsVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="basicItems" search :search-fields="['label']" />
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

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.demo-panel {
  max-width: 320px;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
}

.demo-panel--scroll {
  max-height: 280px;
  overflow-y: auto;
}
</style>
