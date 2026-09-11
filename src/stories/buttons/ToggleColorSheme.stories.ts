// Generado por src/plugins/cu-playground/cli/generate.mjs a partir de las props de ToggleColorSheme.vue.
// (sin eventos declarados)

import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
import type { ComponentStory } from "@/stories/types";
import { setup, global } from "./ToggleColorSheme.stories.runtime";

export const cuToggleColorShemeStories: ComponentStory = {
  component: "cu-toggle-color-sheme",
  vue: ToggleColorSheme,
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle | link | none",
        "default": "ghost"
      },
      {
        "name": "size",
        "type": "number",
        "default": "20"
      }
    ]
  },
  setup,
  global,
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default" },
      ],
      vue: `  <ToggleColorSheme></ToggleColorSheme>`,
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

    {
      id: "variant",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Default: ghost",
      variants: [
        { id: "solid", props: {"variant":"solid"} },
        { id: "outlined", props: {"variant":"outlined"} },
        { id: "soft", props: {"variant":"soft"} },
        { id: "ghost", props: {"variant":"ghost"} },
        { id: "subtle", props: {"variant":"subtle"} },
        { id: "link", props: {"variant":"link"} },
        { id: "none", props: {"variant":"none"} },
      ],
      vue: `  <ToggleColorSheme variant="solid"></ToggleColorSheme>
  <ToggleColorSheme variant="outlined"></ToggleColorSheme>
  <ToggleColorSheme variant="soft"></ToggleColorSheme>
  <ToggleColorSheme variant="ghost"></ToggleColorSheme>
  <ToggleColorSheme variant="subtle"></ToggleColorSheme>
  <ToggleColorSheme variant="link"></ToggleColorSheme>
  <ToggleColorSheme variant="none"></ToggleColorSheme>`,
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
