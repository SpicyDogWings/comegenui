// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de ThemeDropdown.vue.
// (sin eventos declarados)

import ThemeDropdown from "@/components/theme/ThemeDropdown.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";
import { setup, global } from "./ThemeDropdown.stories.runtime";

export const cuThemeDropdownStories: ComponentStory = {
  component: "cu-theme-dropdown",
  vue: ThemeDropdown,
  setup,
  global,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-color-primary",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-font-weight-semibold",
    "--cu-radius-sm",
    "--cu-space-md",
    "--cu-space-sm",
    "--cu-space-xs"
  ],
  api: {
    "components": [
      {
        "label": "Dropdown",
        "path": "/playground/components/dropdown"
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
    "slots": [
      {
        "name": "toggle"
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
      vue: `  <ThemeDropdown></ThemeDropdown>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },
  ],
};
