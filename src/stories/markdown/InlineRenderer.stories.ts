// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de InlineRenderer.vue.
// (sin eventos declarados)

import InlineRenderer from "@/components/markdown/InlineRenderer.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuInlineRendererStories: ComponentStory = {
  component: "cu-inline-renderer",
  vue: InlineRenderer,
  tokens: [
    "--cu-border-thin",
    "--cu-color-neutral-soft",
    "--cu-color-neutral-text",
    "--cu-font-mono",
    "--cu-font-size-xs",
    "--cu-font-weight-medium",
    "--cu-line-height-tight",
    "--cu-radius",
    "--cu-space-2xs",
    "--cu-space-sm"
  ],
  classes: [
    "cu-md-code-inline",
    "cu-md-inline"
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "tokens",
        "type": "Array as () => any[]"
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
      vue: `  <InlineRenderer></InlineRenderer>`,
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
