// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de NavbarList.vue.
// Eventos detectados: update:modelValue, toggle-compact

import NavbarList from "@/components/navigation/NavbarList.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuNavbarListStories: ComponentStory = {
  component: "cu-navbar-list",
  vue: NavbarList,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-color-neutral-text",
    "--cu-color-primary-soft",
    "--cu-font-size-sm",
    "--cu-radius-sm",
    "--cu-space-2xs",
    "--cu-space-md",
    "--cu-space-sm",
    "--cu-space-xs"
  ],
  classes: [
    "cu-button",
    "cu-collapse",
    "cu-collapse-content",
    "cu-collapse-label",
    "cu-collapse-trigger",
    "cu-dropdown",
    "cu-navbar",
    "cu-navbar--compact",
    "cu-navbar-compact-chevron",
    "cu-navbar-compact-toggle",
    "cu-navbar-compact-trigger",
    "cu-navbar-empty",
    "cu-navbar-header",
    "cu-navbar-icon",
    "cu-navbar-item--match",
    "cu-navbar-label",
    "cu-navbar-search-input"
  ],
  api: {
    "components": [
      {
        "label": "Collapse",
        "path": "/playground/components/collapse"
      },
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
      },
      {
        "label": "Input",
        "path": "/playground/components/input"
      }
    ],
    "props": [
      {
        "name": "query",
        "type": "string",
        "description": "Texto de búsqueda (v-model:query)."
      },
      {
        "name": "items",
        "type": "Array as () => NavItem[]",
        "description": "Items del menú."
      },
      {
        "name": "search",
        "type": "boolean",
        "default": "false",
        "description": "Habilita el buscador de items."
      },
      {
        "name": "searchPlaceholder",
        "type": "string",
        "default": "Buscar...",
        "description": "Placeholder del buscador."
      },
      {
        "name": "searchMode",
        "type": "string",
        "default": "filter",
        "description": "Modo de búsqueda: filter (filtra items) o scroll (resalta y desplaza)."
      },
      {
        "name": "searchFields",
        "type": "Array as () => string[]",
        "description": "Campos sobre los que busca el filtro."
      },
      {
        "name": "compact",
        "type": "boolean",
        "default": "false",
        "description": "Modo compacto: solo iconos o la inicial."
      },
      {
        "name": "compactable",
        "type": "boolean",
        "default": "false",
        "description": "Muestra el botón para compactar y expandir."
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "default": "false",
        "description": "Inicia los submenús colapsados."
      },
      {
        "name": "trigger",
        "type": "click | hover",
        "default": "click",
        "description": "Disparador de los submenús: click o hover."
      },
      {
        "name": "activePath",
        "type": "string",
        "default": "",
        "description": "Path activo para resaltar el item correspondiente."
      },
      {
        "name": "highlightTarget",
        "type": "Object as () => NavItem | null",
        "default": "null",
        "description": "Item a resaltar por búsqueda en modo scroll."
      },
      {
        "name": "activeItem",
        "type": "Object as () => NavItem | null",
        "default": "null",
        "description": "Item activo según la ruta actual."
      }
    ],
    "events": [
      {
        "name": "update:query",
        "type": "(value) => void",
        "description": "Texto de búsqueda (v-model:query)."
      },
      {
        "name": "toggle-compact",
        "type": "() => void",
        "description": "Se solicita alternar el modo compacto."
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default" },
      ],
      vue: `  <NavbarList></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },

    {
      id: "search",
      title: "Search",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"search":false} },
        { id: "true", props: {"search":true} },
      ],
      vue: `  <NavbarList></NavbarList>
  <NavbarList search></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },

    {
      id: "compact",
      title: "Compact",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"compact":false} },
        { id: "true", props: {"compact":true} },
      ],
      vue: `  <NavbarList></NavbarList>
  <NavbarList compact></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },

    {
      id: "compactable",
      title: "Compactable",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"compactable":false} },
        { id: "true", props: {"compactable":true} },
      ],
      vue: `  <NavbarList></NavbarList>
  <NavbarList compactable></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },

    {
      id: "collapsed",
      title: "Collapsed",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"collapsed":false} },
        { id: "true", props: {"collapsed":true} },
      ],
      vue: `  <NavbarList></NavbarList>
  <NavbarList collapsed></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },

    {
      id: "trigger",
      title: "Trigger",
      badge: "click",
      badgeTitle: "Default: click",
      variants: [
        { id: "click", props: {"trigger":"click"} },
        { id: "hover", props: {"trigger":"hover"} },
      ],
      vue: `  <NavbarList trigger="click"></NavbarList>
  <NavbarList trigger="hover"></NavbarList>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, toggle-compact.
        ],
      },
    },
  ],
};
