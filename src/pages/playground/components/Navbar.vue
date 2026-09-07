<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import Navbar from "@/components/overlay/Navbar.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Vertical', id: 'vertical' },
  { label: 'Horizontal', id: 'horizontal' },
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
    ],
  },
];

const navItems = [
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
import Navbar from '@/components/overlay/Navbar.vue'

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

const verticalVue = vueSnippet(`  <!-- Vertical (default): submenús con Collapse -->
  <Navbar :items="items" />`);

const horizontalVue = vueSnippet(`  <!-- Horizontal: submenús con Dropdown -->
  <Navbar :items="items" orientation="horizontal" />`);

const searchVue = vueSnippet(`  <Navbar :items="items" search />`);

const filterVue = vueSnippet(`  <!-- filter (default): oculta lo que no matchea -->
  <Navbar :items="items" search search-mode="filter" />`);

const scrollVue = vueSnippet(`  <!-- scroll: resalta + scrollea al match -->
  <Navbar :items="items" search search-mode="scroll" />`);

const fieldsVue = `<script setup lang="ts">
import Navbar from '@/components/overlay/Navbar.vue'

const items = [
  { label: 'Perfil', path: '/perfil', tag: 'usuario' },
  { label: 'Seguridad', path: '/seguridad', tag: 'sesión' },
]
<\/script>

<template>
  <!-- Solo busca por label -->
  <Navbar :items="items" search :search-fields="['label']" />
</template>`;

const componentTokens = [
  '--cu-font-size-sm',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'items', type: 'NavItem[]', default: '—', description: 'Árbol de navegación: { label, path?, children? }. Los items con children se renderizan como Collapse (vertical) o Dropdown (horizontal)' },
  { name: 'orientation', type: '"vertical" | "horizontal"', default: '"vertical"', description: 'Orientación del navbar. Vertical usa Collapse para submenús; horizontal usa Dropdown' },
  { name: 'search', type: 'boolean', default: 'false', description: 'Activa el input de búsqueda arriba del menú; filtra/resalta items automáticamente' },
  { name: 'searchPlaceholder', type: 'string', default: '"Buscar..."', description: 'Placeholder del input de búsqueda' },
  { name: 'searchMode', type: 'string', default: '"filter"', description: 'filter: oculta lo que no matchea. scroll: deja el árbol completo y resalta + scrollea al primer match' },
  { name: 'searchFields', type: 'string[]', default: '[]', description: 'Campos a buscar. Vacío = toda la interfaz del item (todos los campos menos children)' },
];

const eventsData = [
  { name: 'search', type: 'string', description: 'Se emite al escribir; payload con el query actual' },
];
</script>

<template>
  <PlaygroundLayout title="Navbar" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="vertical" class="playground-section">
        <div class="playground-heading">
          <h2>Vertical</h2>
          <Badge color="neutral" title="Orientación por defecto">default</Badge>
        </div>
        <SectionDemo :vue-code="verticalVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="navItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="horizontal" class="playground-section">
        <div class="playground-heading">
          <h2>Horizontal</h2>
          <Badge color="neutral" title="Con Dropdown para submenús">orientation="horizontal"</Badge>
        </div>
        <SectionDemo :vue-code="horizontalVue">
          <div class="playground-col">
            <div class="demo-panel demo-panel--horizontal">
              <Navbar :items="navItems" orientation="horizontal" />
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
              <Navbar :items="navItems" search />
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
              <Navbar :items="navItems" search search-mode="filter" />
            </div>
          </div>
        </SectionDemo>

        <h3 id="mode-scroll">Scroll</h3>
        <SectionDemo :vue-code="scrollVue">
          <div class="playground-col">
            <div class="demo-panel demo-panel--scroll">
              <Navbar :items="navItems" search search-mode="scroll" />
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
              <Navbar :items="navItems" search :search-fields="['label']" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />
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

.demo-panel--horizontal {
  max-width: 100%;
  width: 100%;
}

.demo-panel--scroll {
  max-height: 280px;
  overflow-y: auto;
}
</style>
