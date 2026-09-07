<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import Navbar from "@/components/navigation/Navbar.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Nested', id: 'nested' },
  { label: 'Icons', id: 'icons' },
  { label: 'Compact', id: 'compact' },
  { label: 'Triggers', id: 'triggers' },
  { label: 'Collapsed', id: 'collapsed' },
  { label: 'Compactable', id: 'compactable' },
  { label: 'Responsive', id: 'responsive' },
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
      { label: 'Interfaces', id: 'api-interfaces' },
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

// Con iconos: cada item lleva un `icon` (HTML/emoji) que se renderiza antes del label.
const iconItems = [
  { label: 'Inicio', path: '/playground/components/navbar', icon: '🏠' },
  { label: 'Componentes', icon: '🧩', children: [
    { label: 'Buttons', icon: '🔘', children: [
      { label: 'Button', path: '/playground/components/button', icon: '🅱️' },
      { label: 'CopyButton', path: '/playground/components/copy-button', icon: '📋' },
    ]},
    { label: 'Form', icon: '📝', children: [
      { label: 'Input', path: '/playground/components/input', icon: '⌨️' },
      { label: 'Select', path: '/playground/components/select', icon: '🔽' },
    ]},
  ]},
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
    { label: 'Seguridad', path: '/seguridad', icon: '🔒' },
  ]},
  { label: 'Ayuda', path: '/ayuda', icon: '❓' },
];

const vueImport = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

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

const iconsVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
]
<\/script>

<template>
  <Navbar :items="items" />
</template>`;

const compactVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

// Compact: solo iconos (o la inicial del label si no hay icono).
const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
  { label: 'Ayuda', path: '/ayuda' },
]
<\/script>

<template>
  <Navbar :items="items" compact />
</template>`;

const triggersVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
    { label: 'Seguridad', path: '/seguridad', icon: '🔒' },
  ]},
]
<\/script>

<template>
  <!-- Los items con children muestran un chevron › (LucideChevronRight) y abren
       un flyout (Dropdown) con NavbarMenu adentro, como el horizontal -->
  <Navbar :items="items" compact />

  <!-- Los flyout también abren por hover con trigger="hover" -->
  <Navbar :items="items" compact trigger="hover" />
</template>`;

const collapsedVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Configuración', children: [
    { label: 'Perfil', path: '/perfil' },
    { label: 'Seguridad', path: '/seguridad' },
  ]},
]
<\/script>

<template>
  <!-- collapsed: los submenús arrancan colapsados (se expanden con un click) -->
  <Navbar :items="items" collapsed />
</template>`;

const compactableVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
]
<\/script>

<template>
  <!-- El botón de compactar va junto al search en la misma row: con search
       habilitado, el toggle queda a la derecha del input -->
  <Navbar :items="items" search compactable />
</template>`;

const responsiveVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Configuración', children: [
    { label: 'Perfil', path: '/perfil' },
  ]},
]
<\/script>

<template>
  <!-- Bajo 768px se vuelve un drawer overlay con botón hamburguesa -->
  <Navbar :items="items" responsive />
</template>`;

const searchVue = vueSnippet(`  <Navbar :items="items" search />`);

const filterVue = vueSnippet(`  <!-- filter (default): oculta lo que no matchea -->
  <Navbar :items="items" search search-mode="filter" />`);

const scrollVue = vueSnippet(`  <!-- scroll: resalta + scrollea al match -->
  <Navbar :items="items" search search-mode="scroll" />`);

const fieldsVue = `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Perfil', path: '/perfil', tag: 'usuario' },
  { label: 'Seguridad', path: '/seguridad', tag: 'sesión' },
]
<\/script>

<template>
  <!-- Solo busca por label -->
  <Navbar :items="items" search :search-fields="['label']" />
</template>`;

const vanillaImport = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuNavbar.umd.js"><\/script>`;

const basicVanilla = `${vanillaImport}

<cu-navbar id="navbar"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    const el = document.querySelector('#navbar')
    el.items = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Componentes', children: [
        { label: 'Button', path: '/componentes/button' },
        { label: 'Input', path: '/componentes/input' },
      ]},
    ]
    // Sin vue-router no hay match automático: seteá el item activo manualmente
    // (en una app PHP, la ruta actual la da tu backend)
    el.activePath = '/inicio'
  })
<\/script>`;

// Anidamiento profundo: el componente es recursivo, no hay límite de niveles.
const deepItems = [
  { label: 'Nivel 1', children: [
    { label: 'Nivel 2', children: [
      { label: 'Nivel 3', children: [
        { label: 'Nivel 4', path: '/nivel-4' },
        { label: 'Otro nivel 4', path: '/nivel-4-b' },
      ]},
      { label: 'Hoja nivel 3', path: '/hoja-3' },
    ]},
    { label: 'Hoja nivel 2', path: '/hoja-2' },
  ]},
  { label: 'Inicio', path: '/inicio' },
];

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
  { name: 'items', type: 'NavItem[]', default: '—', description: 'Árbol de navegación: { label, path?, icon?, children? }. Los items con children se renderizan como Collapse' },
  { name: 'compact', type: 'boolean', default: 'false', description: 'Modo compacto: solo iconos (o la inicial); los submenús pasan a Dropdown flyout como en el horizontal' },
  { name: 'compactable', type: 'boolean', default: 'false', description: 'Agrega un botón nativo en la misma row que el search para alternar el modo compact' },
  { name: 'collapsed', type: 'boolean', default: 'false', description: 'Los submenús (Collapse) arrancan colapsados en lugar de expandidos' },
  { name: 'trigger', type: '"click" | "hover"', default: '"click"', description: 'Cómo abren los flyout de submenú en modo compact: click (default) o hover' },
  { name: 'activePath', type: 'string', default: '""', description: 'Path del item activo (manual). Sin esto, en apps Vue se toma de useRoute(); en vanilla/PHP setealo vos' },
  { name: 'responsive', type: 'boolean', default: 'false', description: 'Bajo 768px la nav se abre desde un botón hamburguesa dentro de un SideOver' },
  { name: 'responsiveMode', type: '"auto" | "side" | "fullscreen"', default: '"auto"', description: 'Cómo se muestra el SideOver: auto = fullscreen en <480px y lateral en el resto; side = siempre lateral; fullscreen = siempre pantalla completa' },
  { name: 'search', type: 'boolean', default: 'false', description: 'Activa el input de búsqueda arriba del menú; filtra/resalta items automáticamente' },
  { name: 'searchPlaceholder', type: 'string', default: '"Buscar..."', description: 'Placeholder del input de búsqueda' },
  { name: 'searchMode', type: 'string', default: '"filter"', description: 'filter: oculta lo que no matchea. scroll: deja el árbol completo y resalta + scrollea al primer match' },
  { name: 'searchFields', type: 'string[]', default: '[]', description: 'Campos a buscar. Vacío = toda la interfaz del item (todos los campos menos children)' },
];

const eventsData = [
  { name: 'search', type: 'string', description: 'Se emite al escribir; payload con el query actual' },
];

const interfaceCode = `interface NavItem {
  label: string
  path?: string
  icon?: string
  children?: NavItem[]
}`;
</script>

<template>
  <PlaygroundLayout title="Navbar" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
          <Badge color="neutral" title="Items con children se renderizan como Collapse">tree</Badge>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="navItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="nested" class="playground-section">
        <div class="playground-heading">
          <h2>Nested</h2>
          <Badge color="neutral" title="El anidamiento es infinito">∞</Badge>
        </div>
        <SectionDemo :vue-code="basicVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="deepItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <div class="playground-heading">
          <h2>Icons</h2>
          <Badge color="neutral" title="Campo icon en NavItem">icon</Badge>
        </div>
        <SectionDemo :vue-code="iconsVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="iconItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="compact" class="playground-section">
        <div class="playground-heading">
          <h2>Compact</h2>
          <Badge color="neutral" title="Solo iconos o la inicial del label">compact</Badge>
        </div>
        <SectionDemo :vue-code="compactVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="iconItems" compact />
            </div>
            <div class="demo-panel">
              <Navbar :items="navItems" compact />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="triggers" class="playground-section">
        <div class="playground-heading">
          <h2>Triggers</h2>
          <Badge color="neutral" title="Submenús en compact abren como Dropdown a la derecha con chevron ›">trigger</Badge>
        </div>
        <SectionDemo :vue-code="triggersVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="iconItems" compact />
            </div>
            <div class="demo-panel">
              <Navbar :items="iconItems" compact trigger="hover" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="collapsed" class="playground-section">
        <div class="playground-heading">
          <h2>Collapsed</h2>
          <Badge color="neutral" title="Los Collapse arrancan colapsados">collapsed</Badge>
        </div>
        <SectionDemo :vue-code="collapsedVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="navItems" collapsed />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="compactable" class="playground-section">
        <div class="playground-heading">
          <h2>Compactable</h2>
          <Badge color="neutral" title="Botón nativo junto al search para alternar compact">compactable</Badge>
        </div>
        <SectionDemo :vue-code="compactableVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="iconItems" search compactable />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="responsive" class="playground-section">
        <div class="playground-heading">
          <h2>Responsive</h2>
          <Badge color="neutral" title="Botón hamburguesa que abre un SideOver (lateral o fullscreen)">SideOver</Badge>
        </div>
        <SectionDemo :vue-code="responsiveVue">
          <div class="playground-col">
            <div class="demo-panel">
              <Navbar :items="navItems" responsive />
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

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
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