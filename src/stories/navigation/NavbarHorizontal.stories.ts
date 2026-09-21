import { nextTick } from "vue";
import NavbarHorizontal from "@/components/navigation/NavbarHorizontal.vue";
import type { ComponentStory } from "@/stories/types";

// ── Datos de demo (mismos que la página del playground) ──────────────────────

const navItems = [
  { label: "Inicio", path: "/playground/components/navbar-horizontal" },
  {
    label: "Componentes",
    children: [
      {
        label: "Buttons",
        children: [
          { label: "Button", path: "/playground/components/button" },
          { label: "CopyButton", path: "/playground/components/copy-button" },
          { label: "FloatingButton", path: "/playground/components/floating-button" },
        ],
      },
      {
        label: "Form",
        children: [
          { label: "Input", path: "/playground/components/input" },
          { label: "Select", path: "/playground/components/select" },
          { label: "Textarea", path: "/playground/components/textarea" },
        ],
      },
      {
        label: "Data",
        children: [
          { label: "Table", path: "/playground/components/table" },
          { label: "AdvancedTable", path: "/playground/components/advanced-table" },
        ],
      },
    ],
  },
  {
    label: "Configuración",
    children: [
      { label: "Perfil", path: "/perfil" },
      { label: "Seguridad", path: "/seguridad" },
      { label: "Notificaciones", path: "/notificaciones" },
    ],
  },
  { label: "Ayuda", path: "/ayuda" },
];

// Nav plana: solo hojas (top-level sin children). Los items sin path no linkean.
const flatItems = [
  { label: "Inicio", path: "/inicio" },
  { label: "Docs", path: "/docs" },
  { label: "Sin destino" },
  { label: "Contacto", path: "/contacto" },
];

// Con iconos: cada item lleva un `icon` (HTML/emoji) que se renderiza antes del label.
const iconItems = [
  { label: "Inicio", path: "/playground/components/navbar-horizontal", icon: "🏠" },
  {
    label: "Componentes",
    icon: "🧩",
    children: [
      {
        label: "Buttons",
        icon: "🔘",
        children: [
          { label: "Button", path: "/playground/components/button", icon: "🅱️" },
          { label: "CopyButton", path: "/playground/components/copy-button", icon: "📋" },
        ],
      },
      {
        label: "Form",
        icon: "📝",
        children: [
          { label: "Input", path: "/playground/components/input", icon: "⌨️" },
          { label: "Select", path: "/playground/components/select", icon: "🔽" },
        ],
      },
    ],
  },
  {
    label: "Configuración",
    icon: "⚙️",
    children: [
      { label: "Perfil", path: "/perfil", icon: "👤" },
      { label: "Seguridad", path: "/seguridad", icon: "🔒" },
    ],
  },
  { label: "Ayuda", path: "/ayuda", icon: "❓" },
];

// Anidamiento profundo: los items con children se renderizan como Dropdown en
// cascada, sin límite de profundidad (NavbarMenu es recursivo).
const deepItems = [
  {
    label: "Nivel 1",
    children: [
      {
        label: "Nivel 2",
        children: [
          {
            label: "Nivel 3",
            children: [
              { label: "Nivel 4", path: "/nivel-4" },
              { label: "Otro nivel 4", path: "/nivel-4-b" },
            ],
          },
          { label: "Hoja nivel 3", path: "/hoja-3" },
        ],
      },
      { label: "Hoja nivel 2", path: "/hoja-2" },
    ],
  },
  { label: "Inicio", path: "/inicio" },
];

// ── Snippets ────────────────────────────────────────────────────────────────

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

const activeVue = vueSnippet(`  <!-- Sin vue-router, el activo se marca a mano -->
  <NavbarHorizontal :items="items" active-path="/inicio" />`);

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

const vanillaSnippet = (attrs: string, items: string, extra = "") => `${vanillaImport}

<cu-navbar-horizontal id="navbar"${attrs}></cu-navbar-horizontal>
<script>
  customElements.whenDefined('cu-navbar-horizontal').then(() => {
    const el = document.querySelector('#navbar')
    el.items = [${items}]
${extra}  })
<\/script>`;

const activeVanilla = vanillaSnippet(
  ' active-path="/inicio"',
  `
  { label: 'Inicio', path: '/inicio' },
  { label: 'Componentes', children: [
    { label: 'Button', path: '/componentes/button' },
  ]},
`,
);

const nestedVanilla = vanillaSnippet(
  "",
  `
  { label: 'Nivel 1', children: [
    { label: 'Nivel 2', children: [
      { label: 'Nivel 3', children: [
        { label: 'Nivel 4', path: '/nivel-4' },
      ]},
    ]},
  ]},
`,
);

const flatVanilla = vanillaSnippet(
  "",
  `
  { label: 'Inicio', path: '/inicio' },
  { label: 'Docs', path: '/docs' },
  { label: 'Sin destino' },
`,
);

const iconsVanilla = vanillaSnippet(
  "",
  `
  { label: 'Inicio', path: '/inicio', icon: '🏠' },
  { label: 'Configuración', icon: '⚙️', children: [
    { label: 'Perfil', path: '/perfil', icon: '👤' },
  ]},
`,
);

// ── Helpers ─────────────────────────────────────────────────────────────────

function byText<T extends { text: () => string }>(elements: T[], text: string): T | undefined {
  return elements.find((el) => el.text().includes(text));
}

// ── Story ───────────────────────────────────────────────────────────────────

export const cuNavbarHorizontalStories: ComponentStory = {
  component: "cu-navbar-horizontal",
  vue: NavbarHorizontal,
  tokens: [
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-color-primary-soft",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-radius-sm",
    "--cu-space-2xs",
    "--cu-space-md",
    "--cu-space-sm",
    "--cu-space-xs"
  ],
  classes: [
    "cu-button",
    "cu-dropdown-panel",
    "cu-navbar",
    "cu-navbar-chevron",
    "cu-navbar-dropdown-trigger",
    "cu-navbar-icon",
    "cu-navbar-item--match"
  ],
  api: {
    "components": [
      {
        "label": "Dropdown",
        "path": "/playground/components/dropdown"
      },
      {
        "label": "NavbarMenu",
        "path": "/playground/components/navbar-menu"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "items",
        "type": "Array as () => NavItem[]",
        "description": "Árbol de navegación: { label, path?, icon?, children? }. Los padres se renderizan como Dropdown en cascada (anidamiento infinito), las hojas como items de menú nativos"
      },
      {
        "name": "trigger",
        "type": "\\\\\\\\\\\\\\\"click\\\\\\\\\\\\\\\" | \\\\\\\\\\\\\\\"hover\\\\\\\\\\\\\\\"",
        "default": "\\\\\\\\\\\\\\\"click\\\\\\\\\\\\\\\"",
        "description": "Cómo abren los submenús: click (default) o hover"
      },
      {
        "name": "activePath",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "Path del item activo (manual). En apps Vue se toma de useRoute() si no se pasa; en vanilla/PHP setealo vos"
      }
    ],
    "interfaceCode": `export interface NavbarHorizontalItem extends NavItem {}`
  },
  setup() {
    // jsdom no implementa scrollIntoView y useNavbar lo llama al montar con un
    // item activo (`activePath`).
    Element.prototype.scrollIntoView = () => {};
  },
  sections: [
    {
      id: "basic",
      title: "Basic",
      badge: "dropdown",
      badgeTitle: "Submenús con Dropdown en cascada",
      layout: "col",
      variants: [{ id: "default", props: { items: navItems } }],
      vue: basicVue,
      vanilla: basicVanilla,
      checks: {
        l1: [
          {
            name: "renderiza nav.cu-navbar",
            run({ wrapper, expect }) {
              expect(wrapper.find("nav.cu-navbar").exists()).toBe(true);
            },
          },
          {
            name: "las hojas con path se renderizan como <a> con href",
            run({ wrapper, expect }) {
              const inicio = wrapper.find(
                'a.cu-button-link[href="/playground/components/navbar-horizontal"]',
              );
              expect(inicio.exists()).toBe(true);
              expect(inicio.text()).toContain("Inicio");
              expect(wrapper.find('a.cu-button-link[href="/ayuda"]').text()).toContain("Ayuda");
            },
          },
          {
            name: "los items con children se renderizan como dropdown trigger con chevron",
            run({ wrapper, expect }) {
              const triggers = wrapper.findAll(".cu-navbar-dropdown-trigger");
              expect(triggers).toHaveLength(2);
              expect(byText(triggers, "Componentes")).toBeDefined();
              expect(byText(triggers, "Configuración")).toBeDefined();
              expect(byText(triggers, "Componentes")?.find(".cu-navbar-chevron").exists()).toBe(true);
            },
          },
          {
            name: "el click en el trigger abre el panel con los children",
            async run({ wrapper, expect }) {
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              await wrapper.find(".cu-navbar-dropdown-trigger").trigger("click");
              const panel = wrapper.find(".cu-dropdown-panel");
              expect(panel.exists()).toBe(true);
              expect(panel.text()).toContain("Buttons");
              expect(panel.text()).toContain("Form");
              expect(panel.text()).toContain("Data");
              const buttons = byText(wrapper.findAll(".cu-dropdown-menu-item"), "Buttons");
              expect(buttons).toBeDefined();
              await buttons!.trigger("click");
              await nextTick();
              expect(
                wrapper.find('a.cu-navbar-menu-item[href="/playground/components/button"]').exists(),
              ).toBe(true);
            },
          },
          {
            name: "sin activePath no marca ningún item activo",
            run({ wrapper, expect }) {
              expect(wrapper.find("[data-navbar-active]").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "active",
      title: "Active",
      badge: "activePath",
      badgeTitle: "Path activo manual (sin vue-router)",
      layout: "col",
      variants: [
        {
          id: "match",
          props: { items: navItems, activePath: "/playground/components/navbar-horizontal" },
        },
        { id: "no-match", props: { items: navItems, activePath: "/ruta-inexistente" } },
      ],
      vue: activeVue,
      vanilla: activeVanilla,
      checks: {
        l1: [
          {
            name: "marca la hoja activa con data-navbar-active y variant soft",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "match") return;
              const active = wrapper.find("[data-navbar-active]");
              expect(active.exists()).toBe(true);
              expect(active.text()).toContain("Inicio");
              expect(active.classes()).toContain("cu-navbar-item--active");
              expect(active.find("button.cu-button").classes()).toContain("cu-button--soft");
            },
          },
          {
            name: "la hoja activa resuelve --btn-bg al color primary",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "match") return;
              const style = wrapper.find("[data-navbar-active] button.cu-button").attributes("style") ?? "";
              expect(style).toContain("--btn-bg: var(--cu-color-primary)");
            },
          },
          {
            name: "un activePath sin match no marca nada",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "no-match") return;
              expect(wrapper.find("[data-navbar-active]").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "triggers",
      title: "Triggers",
      badge: "click",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [
        { id: "click", props: { items: navItems } },
        { id: "hover", props: { items: navItems, trigger: "hover" } },
      ],
      vue: hoverVue,
      vanilla: hoverVanilla,
      checks: {
        l1: [
          {
            name: "el trigger (click o hover) abre el panel de children",
            async run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              if (variant.props?.trigger === "hover") {
                await wrapper.find(".cu-dropdown").trigger("mouseenter");
              } else {
                await wrapper.find(".cu-navbar-dropdown-trigger").trigger("click");
              }
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              expect(wrapper.find(".cu-navbar-menu").exists()).toBe(true);
            },
          },
          {
            name: "click: el segundo click cierra el panel",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.trigger === "hover") return;
              const trigger = wrapper.find(".cu-navbar-dropdown-trigger");
              await trigger.trigger("click");
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              await trigger.trigger("click");
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "nested",
      title: "Nested",
      badge: "∞",
      badgeTitle: "El anidamiento es infinito",
      layout: "col",
      variants: [{ id: "deep", props: { items: deepItems } }],
      vue: nestedVue,
      vanilla: nestedVanilla,
      checks: {
        l1: [
          {
            name: "renderiza el trigger del primer nivel",
            run({ wrapper, expect }) {
              const trigger = wrapper.find(".cu-navbar-dropdown-trigger");
              expect(trigger.exists()).toBe(true);
              expect(trigger.text()).toContain("Nivel 1");
            },
          },
          {
            name: "abre submenús en cascada hasta la hoja del nivel 4",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-navbar-dropdown-trigger").trigger("click");
              await nextTick();
              const level2 = byText(wrapper.findAll(".cu-dropdown-menu-item"), "Nivel 2");
              expect(level2).toBeDefined();
              await level2!.trigger("click");
              await nextTick();
              const level3 = byText(wrapper.findAll(".cu-dropdown-menu-item"), "Nivel 3");
              expect(level3).toBeDefined();
              await level3!.trigger("click");
              await nextTick();
              const leaf = wrapper.find('a.cu-navbar-menu-item[href="/nivel-4"]');
              expect(leaf.exists()).toBe(true);
              expect(leaf.text()).toContain("Nivel 4");
            },
          },
          {
            name: "las hojas del submenú se renderizan como links",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-navbar-dropdown-trigger").trigger("click");
              await nextTick();
              expect(wrapper.find('a.cu-navbar-menu-item[href="/hoja-2"]').exists()).toBe(true);
              expect(wrapper.find('a.cu-navbar-menu-item[href="/hoja-3"]').exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "flat",
      title: "Flat",
      badge: "hojas",
      badgeTitle: "Sin children: las hojas top-level son Buttons; sin path se deshabilitan",
      layout: "col",
      variants: [{ id: "flat", props: { items: flatItems } }],
      vue: flatVue,
      vanilla: flatVanilla,
      checks: {
        l1: [
          {
            name: "las hojas con path se renderizan como <a> con href",
            run({ wrapper, expect }) {
              expect(wrapper.find('a.cu-button-link[href="/inicio"]').exists()).toBe(true);
              expect(wrapper.find('a.cu-button-link[href="/docs"]').exists()).toBe(true);
              expect(wrapper.find('a.cu-button-link[href="/contacto"]').exists()).toBe(true);
              expect(wrapper.findAll("a.cu-button-link")).toHaveLength(3);
            },
          },
          {
            name: "el item sin path no se linkea",
            run({ wrapper, expect }) {
              const item = byText(wrapper.findAll("button.cu-button"), "Sin destino");
              expect(item).toBeDefined();
              expect(item!.element.closest("a")).toBeNull();
            },
          },
          {
            name: "la nav plana no renderiza dropdowns",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-dropdown-trigger").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "Icons",
      badge: '""',
      badgeTitle: "Default: sin icono (cadena vacía)",
      layout: "col",
      variants: [{ id: "icons", props: { items: iconItems } }],
      vue: iconsVue,
      vanilla: iconsVanilla,
      checks: {
        l1: [
          {
            name: "renderiza el icono de la hoja top-level (v-html)",
            run({ wrapper, expect }) {
              const icons = wrapper.findAll(".cu-button .cu-navbar-icon");
              expect(icons.some((el) => el.html().includes("🏠"))).toBe(true);
              expect(icons.some((el) => el.html().includes("❓"))).toBe(true);
            },
          },
          {
            name: "renderiza el icono del trigger de dropdown",
            run({ wrapper, expect }) {
              const trigger = wrapper.find(".cu-navbar-dropdown-trigger");
              expect(trigger.find(".cu-navbar-icon").html()).toContain("🧩");
            },
          },
          {
            name: "renderiza los iconos de los hijos dentro del panel",
            async run({ wrapper, expect }) {
              await byText(wrapper.findAll(".cu-navbar-dropdown-trigger"), "Componentes")!.trigger(
                "click",
              );
              await nextTick();
              expect(
                wrapper.findAll(".cu-dropdown-menu-item-icon").some((el) => el.html().includes("🔘")),
              ).toBe(true);
              await byText(wrapper.findAll(".cu-navbar-dropdown-trigger"), "Configuración")!.trigger(
                "click",
              );
              await nextTick();
              expect(
                wrapper.findAll(".cu-navbar-menu-icon").some((el) => el.html().includes("👤")),
              ).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
