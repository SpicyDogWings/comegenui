import Navbar from "@/components/navigation/Navbar.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Navbar.stories.extras";

const TREE = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Componentes",
    children: [
      {
        label: "Buttons",
        children: [
          { label: "Button", path: "/components/button" },
          { label: "CopyButton", path: "/components/copy-button" },
        ],
      },
      {
        label: "Form",
        children: [
          { label: "Input", path: "/components/input" },
          { label: "Select", path: "/components/select" },
        ],
      },
    ],
  },
  {
    label: "Configuración",
    children: [
      { label: "Perfil", path: "/perfil" },
      { label: "Seguridad", path: "/seguridad" },
    ],
  },
];

const ICON_TREE = [
  { label: "Inicio", path: "/inicio", icon: "🏠" },
  {
    label: "Componentes",
    children: [
      { label: "Perfil", path: "/perfil" },
      { label: "Seguridad", path: "/seguridad", icon: "🔒" },
    ],
  },
  { label: "Ayuda", path: "/ayuda" },
];

const TAG_TREE = [
  { label: "Perfil", path: "/perfil", tag: "usuario" },
  { label: "Seguridad", path: "/seguridad", tag: "sesión" },
];

const vanillaImport = `<script src="dist/CuNavbar.umd.js"><\\/script>`;

export const cuNavbarStories: ComponentStory = {
  component: "cu-navbar",
  vue: Navbar,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-radius-sm",
    "--cu-space-xs"
  ],
  classes: [
    "cu-navbar-responsive",
    "cu-navbar-responsive-toggle"
  ],
  api: {
    "components": [
      {
        "label": "SideOver",
        "path": "/playground/components/side-over"
      },
      {
        "label": "NavbarList",
        "path": "/playground/components/navbar-list"
      }
    ],
    "props": [
      {
        "name": "items",
        "type": "Array as () => NavItem[]",
        "description": "Árbol de navegación: { label, path?, icon?, children? }. Los items con children se renderizan como Collapse"
      },
      {
        "name": "search",
        "type": "boolean",
        "default": "false",
        "description": "Activa el input de búsqueda arriba del menú; filtra/resalta items automáticamente"
      },
      {
        "name": "searchPlaceholder",
        "type": "string",
        "default": "Buscar...",
        "description": "Placeholder del input de búsqueda"
      },
      {
        "name": "searchMode",
        "type": "filter | scroll",
        "default": "filter",
        "description": "filter: oculta lo que no matchea. scroll: deja el árbol completo y resalta + scrollea al primer match"
      },
      {
        "name": "searchFields",
        "type": "Array as () => string[]",
        "description": "Campos a buscar. Vacío = toda la interfaz del item (todos los campos menos children)"
      },
      {
        "name": "compact",
        "type": "boolean",
        "default": "false",
        "description": "Modo compacto: solo iconos (o la inicial); los submenús pasan a Dropdown flyout como en el horizontal"
      },
      {
        "name": "compactable",
        "type": "boolean",
        "default": "false",
        "description": "Agrega un botón nativo en la misma row que el search para alternar el modo compact"
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "default": "false",
        "description": "Los submenús (Collapse) arrancan colapsados en lugar de expandidos"
      },
      {
        "name": "trigger",
        "type": "\\\\\\\\\\\\\\\"click\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"hover\\\\\\\\\\\\\\\"",
        "default": "\\\\\\\\\\\\\\\"click\\\\\\\\\\\\\\\"",
        "description": "Cómo abren los flyout de submenú en modo compact: click (default) o hover"
      },
      {
        "name": "activePath",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "Path del item activo (manual). Sin esto, en apps Vue se toma de useRoute(); en vanilla/PHP setealo vos"
      },
      {
        "name": "responsive",
        "type": "boolean",
        "default": "false",
        "description": "Modo manual: reemplaza la nav inline por un botón hamburguesa que abre el menú en un SideOver"
      },
      {
        "name": "responsiveMode",
        "type": "\\\\\\\\\\\\\\\"auto\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"side\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"fullscreen\\\\\\\\\\\\\\\"",
        "default": "\\\\\\\\\\\\\\\"auto\\\\\\\\\\\\\\\"",
        "description": "Cómo se muestra el SideOver: auto = fullscreen en <480px y lateral en el resto; side = siempre lateral; fullscreen = siempre pantalla completa"
      },
      {
        "name": "sideOverPosition",
        "type": "\\\\\\\\\\\\\\\"left\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"right\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"top\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"bottom\\\\\\\\\\\\\\\"",
        "default": "\\\\\\\\\\\\\\\"left\\\\\\\\\\\\\\\"",
        "description": "Desde qué borde desliza el SideOver del responsive"
      }
    ],
    "events": [
      {
        "name": "search",
        "type": "() => void",
        "description": "Se emite al escribir; payload con el query actual"
      }
    ],
    "interfaceCode": `export interface NavbarItem extends NavItem {}`
  },
  extras,
  setup: () => {
    if (!window.matchMedia) {
      (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })) as unknown as (q: string) => MediaQueryList;
    }
  },
  sections: [
    {
      id: "basic",
      title: "Basic",
      badge: "tree",
      layout: "col",
      variants: [{ id: "v1", props: { items: TREE } }],
      vue: `  <Navbar :items="items" />`,
      vanilla: `${vanillaImport}

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
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-navbar con los items",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar").exists()).toBe(true);
              expect(wrapper.text()).toContain("Button");
            },
          },
          {
            name: "sin search no renderiza el input",
            run({ wrapper, expect }) {
              expect(wrapper.find("input").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "nested",
      title: "Nested",
      badge: "∞",
      layout: "col",
      variants: [{ id: "v1", props: { items: TREE } }],
      vue: `  <Navbar :items="items" />`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-nested"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    const el = document.querySelector('#navbar-nested')
    el.items = [
      { label: 'Componentes', children: [
        { label: 'Buttons', children: [
          { label: 'Button', path: '/components/button' },
        ]},
      ]},
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el árbol anidado",
            run({ wrapper, expect }) {
              expect(wrapper.text()).toContain("Componentes");
              expect(wrapper.text()).toContain("Buttons");
              expect(wrapper.text()).toContain("Button");
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "Icons",
      badge: '""',
      layout: "col",
      variants: [{ id: "v1", props: { items: ICON_TREE } }],
      vue: `<script setup lang="ts">
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
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-icons"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    const el = document.querySelector('#navbar-icons')
    el.items = [{ label: 'Inicio', path: '/inicio', icon: '🏠' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el icono del item",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-icon").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "compact",
      title: "Compact",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { items: ICON_TREE, compact: true } }],
      vue: `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Componentes', children: [{ label: 'Perfil', path: '/perfil' }] },
  { label: 'Ayuda', path: '/ayuda' },
]
<\/script>

<template>
  <Navbar :items="items" compact />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-compact" compact></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-compact').items = [
      { label: 'Inicio', path: '/inicio', icon: '🏠' },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "aplica la clase compact",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar").classes()).toContain("cu-navbar--compact");
            },
          },
        ],
      },
    },

    {
      id: "triggers",
      title: "Triggers",
      badge: "click",
      layout: "col",
      variants: [
        { id: "click", props: { items: ICON_TREE, compact: true } },
        { id: "hover", props: { items: ICON_TREE, compact: true, trigger: "hover" } },
      ],
      vue: `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
]
<\/script>

<template>
  <Navbar :items="items" compact />
  <Navbar :items="items" compact trigger="hover" />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-triggers" compact trigger="hover"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-triggers').items = [
      { label: 'Configuración', children: [{ label: 'Perfil', path: '/perfil' }] },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "los items con children muestran el trigger compacto",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-compact-trigger").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "collapsed",
      title: "Collapsed",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { items: TREE, collapsed: true } }],
      vue: `<script setup lang="ts">
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
  <Navbar :items="items" collapsed />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-collapsed" collapsed></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-collapsed').items = [
      { label: 'Configuración', children: [{ label: 'Perfil', path: '/perfil' }] },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el navbar colapsado",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar").exists()).toBe(true);
              expect(wrapper.text()).toContain("Configuración");
            },
          },
        ],
      },
    },

    {
      id: "compactable",
      title: "Compactable",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { items: ICON_TREE, search: true, compactable: true } }],
      vue: `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
]
<\/script>

<template>
  <Navbar :items="items" search compactable />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-compactable" search compactable></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-compactable').items = [
      { label: 'Inicio', path: '/inicio', icon: '🏠' },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el toggle de compactar junto al search",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-search-input").exists()).toBe(true);
              expect(wrapper.find(".cu-navbar-compact-toggle").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "responsive",
      title: "Responsive",
      badge: "false",
      layout: "col",
      variants: [
        { id: "left", props: { items: TREE, responsive: true } },
        { id: "right", props: { items: TREE, responsive: true, sideOverPosition: "right" } },
      ],
      vue: `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Configuración', children: [{ label: 'Perfil', path: '/perfil' }] },
]
<\/script>

<template>
  <Navbar :items="items" responsive />
  <Navbar :items="items" responsive side-over-position="right" />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-responsive" responsive side-over-position="right"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-responsive').items = [
      { label: 'Inicio', path: '/inicio' },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el botón hamburguesa",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-responsive-toggle").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "search",
      title: "Search",
      badge: "false",
      layout: "col",
      variants: [{ id: "filter", props: { items: TREE, search: true } }],
      vue: `  <Navbar :items="items" search />`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-search" search></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-search').items = [
      { label: 'Inicio', path: '/inicio' },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el input de búsqueda",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-search-input").exists()).toBe(true);
            },
          },
          {
            name: "un subitem matcheado muestra su árbol y oculta ramas ajenas",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("copybutton");
              const text = wrapper.text();
              expect(text).toContain("Componentes");
              expect(text).toContain("Buttons");
              expect(text).toContain("CopyButton");
              expect(text).not.toContain("Configuración");
              expect(text).not.toContain("Inicio");
            },
          },
          {
            name: "un item raíz matcheado conserva todo su subárbol",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("form");
              const text = wrapper.text();
              expect(text).toContain("Form");
              expect(text).toContain("Input");
              expect(text).toContain("Select");
              expect(text).not.toContain("Buttons");
            },
          },
          {
            name: "por defecto busca en toda la interfaz (matchea por path)",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("/seguridad");
              expect(wrapper.text()).toContain("Seguridad");
              expect(wrapper.text()).toContain("Configuración");
              expect(wrapper.text()).not.toContain("Button");
            },
          },
          {
            name: "ignora acentos y mayúsculas",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("configuracion");
              expect(wrapper.text()).toContain("Perfil");
            },
          },
          {
            name: "sin resultados muestra el estado vacío",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("zzz");
              expect(wrapper.text()).toContain("Sin resultados");
            },
          },
          {
            name: "emite search con el query actual",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("per");
              expect(wrapper.emitted("search")).toEqual([["per"]]);
            },
          },
        ],
      },
    },

    {
      id: "modes",
      title: "Search Modes",
      badge: "filter",
      layout: "col",
      variants: [
        { id: "filter", props: { items: TREE, search: true, searchMode: "filter" } },
        { id: "scroll", props: { items: TREE, search: true, searchMode: "scroll" } },
      ],
      vue: `  <!-- filter (default): oculta lo que no matchea -->
  <Navbar :items="items" search search-mode="filter" />
  <!-- scroll: muestra todo y resalta el primer match -->
  <Navbar :items="items" search search-mode="scroll" />`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-modes" search search-mode="scroll"></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    document.querySelector('#navbar-modes').items = [{ label: 'Inicio', path: '/inicio' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "scroll muestra todo el árbol y resalta solo el primer match",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.searchMode !== "scroll") return;
              if (!Element.prototype.scrollIntoView) {
                Element.prototype.scrollIntoView = () => {};
              }
              await wrapper.find("input").setValue("copy");
              const text = wrapper.text();
              expect(text).toContain("Inicio");
              expect(text).toContain("Input");
              expect(text).toContain("Seguridad");
              const matches = wrapper.findAll("[data-navbar-match]");
              expect(matches).toHaveLength(1);
              expect(matches[0]!.text()).toContain("CopyButton");
            },
          },
          {
            name: "filter oculta los que no matchean",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.searchMode !== "filter") return;
              await wrapper.find("input").setValue("copy");
              expect(wrapper.text()).not.toContain("Seguridad");
            },
          },
        ],
      },
    },

    {
      id: "fields",
      title: "Search Fields",
      badge: "[]",
      layout: "col",
      variants: [{ id: "label", props: { items: TAG_TREE, search: true, searchFields: ["label"] } }],
      vue: `<script setup lang="ts">
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Perfil', path: '/perfil', tag: 'usuario' },
  { label: 'Seguridad', path: '/seguridad', tag: 'sesión' },
]
<\/script>

<template>
  <!-- Solo busca por label -->
  <Navbar :items="items" search :search-fields="['label']" />
</template>`,
      vanilla: `${vanillaImport}

<cu-navbar id="navbar-fields" search></cu-navbar>
<script>
  customElements.whenDefined('cu-navbar').then(() => {
    const el = document.querySelector('#navbar-fields')
    el.items = [
      { label: 'Perfil', path: '/perfil', tag: 'usuario' },
      { label: 'Seguridad', path: '/seguridad', tag: 'sesión' },
    ]
    el.searchFields = ['label']
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "searchFields limita los campos buscados",
            async run({ wrapper, expect }) {
              await wrapper.find("input").setValue("/seguridad");
              expect(wrapper.text()).toContain("Sin resultados");
            },
          },
        ],
      },
    },
  ],
};
