// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de NavbarMenu.vue.
// (sin eventos declarados)

import NavbarMenu from "@/components/navigation/NavbarMenu.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuNavbarMenuStories: ComponentStory = {
  component: "cu-navbar-menu",
  vue: NavbarMenu,
  tokens: [
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-radius-sm",
    "--cu-space-2xs",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-navbar-menu",
    "cu-navbar-menu-icon",
    "cu-navbar-menu-item",
    "cu-navbar-menu-item--disabled",
    "cu-navbar-menu-item-label"
  ],
  api: {
    "components": [
      {
        "label": "Dropdown",
        "path": "/playground/components/dropdown"
      }
    ],
    "props": [
      {
        "name": "items",
        "type": "Array as () => NavItem[]",
        "description": "Items del nivel de menú."
      },
      {
        "name": "trigger",
        "type": "click | hover",
        "default": "click",
        "description": "Disparador de los submenús: click o hover."
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
      vue: `  <NavbarMenu></NavbarMenu>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-navbar-menu",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-menu").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes).
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
      vue: `  <NavbarMenu trigger="click"></NavbarMenu>
  <NavbarMenu trigger="hover"></NavbarMenu>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-navbar-menu",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-navbar-menu").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },
  ],
};
