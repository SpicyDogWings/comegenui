<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Trigger', id: 'trigger' },
  { label: 'Nested', id: 'nested' },
  { label: 'Flat', id: 'flat' },
  { label: 'Icons', id: 'icons' },
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
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const navItems = [
  { label: 'Inicio', path: '/playground/components/navbar-horizontal' },
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

// Nav plana: solo hojas (top-level sin children). Los items sin path se
// renderizan deshabilitados (no linkean).
const flatItems = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Docs', path: '/docs' },
  { label: 'Sin destino' },
  { label: 'Contacto', path: '/contacto' },
];

// Con iconos: cada item lleva un `icon` (HTML/emoji) que se renderiza antes del label.
const iconItems = [
  { label: 'Inicio', path: '/playground/components/navbar-horizontal', icon: '🏠' },
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

// Anidamiento profundo: los items con children se renderizan como Dropdown en
// cascada, sin límite de profundidad (NavbarMenu es recursivo).
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

const vueImport = `<script setup lang="ts">
import NavbarHorizontal from '@/components/navigation/NavbarHorizontal.vue'

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

const basicVue = vueSnippet(`  <NavbarHorizontal :items="items" />`);

const hoverVue = vueSnippet(`  <!-- Los submenús abren al pasar el mouse -->
  <NavbarHorizontal :items="items" trigger="hover" />`);

const nestedVue = `<script setup lang="ts">
import NavbarHorizontal from '@/components/navigation/NavbarHorizontal.vue'

// El anidamiento es infinito: cada nivel con children es un Dropdown en cascada
const items = [
  { label: 'Nivel 1', children: [
    { label: 'Nivel 2', children: [
      { label: 'Nivel 3', children: [
        { label: 'Nivel 4', path: '/nivel-4' },
      ]},
    ]},
  ]},
]
<\/script>

<template>
  <NavbarHorizontal :items="items" />
</template>`;

const flatVue = `<script setup lang="ts">
import NavbarHorizontal from '@/components/navigation/NavbarHorizontal.vue'

// Nav plana: solo hojas. Los items sin path se renderizan deshabilitados.
const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Docs', path: '/docs' },
  { label: 'Sin destino' },
]
<\/script>

<template>
  <NavbarHorizontal :items="items" />
</template>`;

const iconsVue = `<script setup lang="ts">
import NavbarHorizontal from '@/components/navigation/NavbarHorizontal.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Componentes', icon: '🧩', children: [
    { label: 'Buttons', icon: '🔘', children: [
      { label: 'Button', path: '/componentes/button', icon: '🅱️' },
    ]},
  ]},
]
<\/script>

<template>
  <NavbarHorizontal :items="items" />
</template>`;

const vanillaImport = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuNavbarHorizontal.umd.js"><\/script>`;

const basicVanilla = `${vanillaImport}

<cu-navbar-horizontal id="navbar"></cu-navbar-horizontal>
<script>
  customElements.whenDefined('cu-navbar-horizontal').then(() => {
    const el = document.querySelector('#navbar')
    el.items = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Componentes', children: [
        { label: 'Button', path: '/componentes/button' },
        { label: 'Input', path: '/componentes/input' },
      ]},
    ]
    // Sin vue-router no hay match automático: seteá el item activo manualmente
    el.activePath = '/inicio'
  })
<\/script>`;

const hoverVanilla = `${vanillaImport}

<cu-navbar-horizontal id="navbar" trigger="hover"></cu-navbar-horizontal>
<script>
  customElements.whenDefined('cu-navbar-horizontal').then(() => {
    document.querySelector('#navbar').items = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Componentes', children: [
        { label: 'Button', path: '/componentes/button' },
        { label: 'Input', path: '/componentes/input' },
      ]},
    ]
  })
<\/script>`;

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
  { name: 'items', type: 'NavItem[]', default: '—', description: 'Árbol de navegación: { label, path?, icon?, children? }. Los padres se renderizan como Dropdown en cascada (anidamiento infinito), las hojas como items de menú nativos' },
  { name: 'trigger', type: '"click" | "hover"', default: '"click"', description: 'Cómo abren los submenús: click (default) o hover' },
  { name: 'activePath', type: 'string', default: '""', description: 'Path del item activo (manual). En apps Vue se toma de useRoute() si no se pasa; en vanilla/PHP setealo vos' },
];

const interfaceCode = `interface NavItem {
  label: string
  path?: string
  icon?: string
  children?: NavItem[]
}`;
</script>

<template>
  <PlaygroundLayout title="NavbarHorizontal" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
          <Badge color="neutral" title="Submenús con Dropdown en cascada">dropdown</Badge>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <div class="demo-panel">
              <NavbarHorizontal :items="navItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="trigger" class="playground-section">
        <div class="playground-heading">
          <h2>Trigger</h2>
          <Badge color="neutral" title="Valor por defecto">click</Badge>
        </div>
        <SectionDemo :vue-code="hoverVue" :vanilla-code="hoverVanilla">
          <div class="playground-col">
            <div class="demo-panel">
              <NavbarHorizontal :items="navItems" trigger="hover" />
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
        <SectionDemo :vue-code="nestedVue">
          <div class="playground-col">
            <div class="demo-panel">
              <NavbarHorizontal :items="deepItems" />
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="flat" class="playground-section">
        <div class="playground-heading">
          <h2>Flat</h2>
          <Badge color="neutral" title="Sin children: las hojas top-level son Buttons; sin path se deshabilitan">hojas</Badge>
        </div>
        <SectionDemo :vue-code="flatVue">
          <div class="playground-col">
            <div class="demo-panel">
              <NavbarHorizontal :items="flatItems" />
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
              <NavbarHorizontal :items="iconItems" />
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

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.demo-panel {
  width: 100%;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
}
</style>