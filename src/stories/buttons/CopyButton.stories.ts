// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de CopyButton.vue.
// (sin eventos declarados)

import CopyButton from "@/components/buttons/CopyButton.vue";
import type { ComponentStory } from "@/stories/types";

export const cuCopyButtonStories: ComponentStory = {
  component: "cu-copy-button",
  vue: CopyButton,
  classes: [
    "cu-copy-button-icon",
    "cu-copy-button-text",
    "cu-copy-fade-enter-active",
    "cu-copy-fade-enter-from",
    "cu-copy-fade-leave-active",
    "cu-copy-fade-leave-to"
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
        "name": "text",
        "type": "string"
      },
      {
        "name": "label",
        "type": "string",
        "default": ""
      },
      {
        "name": "copiedLabel",
        "type": "string",
        "default": "Copiado"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle | link | none",
        "default": "soft"
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", props: {"text":"CopyButton"} },
      ],
      vue: `  <CopyButton text="CopyButton"></CopyButton>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-copy-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-copy-button").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "label",
      title: "Label",
      variants: [
        { id: "with-value", props: {"text":"CopyButton","label":"CopyButton"} },
        { id: "empty", props: {"text":"CopyButton"} },
      ],
      vue: `  <CopyButton text="CopyButton" label="CopyButton"></CopyButton>
  <CopyButton text="CopyButton"></CopyButton>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-copy-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-copy-button").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "color",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Default: neutral",
      variants: [
        { id: "primary", props: {"text":"CopyButton","color":"primary","label":"Copiar"} },
        { id: "secondary", props: {"text":"CopyButton","color":"secondary","label":"Copiar"} },
        { id: "neutral", props: {"text":"CopyButton","color":"neutral","label":"Copiar"} },
        { id: "success", props: {"text":"CopyButton","color":"success","label":"Copiar"} },
        { id: "warning", props: {"text":"CopyButton","color":"warning","label":"Copiar"} },
        { id: "danger", props: {"text":"CopyButton","color":"danger","label":"Copiar"} },
      ],
      vue: `  <CopyButton text="CopyButton" color="primary" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" color="secondary" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" color="neutral" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" color="success" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" color="warning" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" color="danger" label="Copiar"></CopyButton>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-copy-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-copy-button").exists()).toBe(true);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "variant",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Default: soft",
      variants: [
        { id: "solid", props: {"text":"CopyButton","variant":"solid","label":"Copiar"} },
        { id: "outlined", props: {"text":"CopyButton","variant":"outlined","label":"Copiar"} },
        { id: "soft", props: {"text":"CopyButton","variant":"soft","label":"Copiar"} },
        { id: "ghost", props: {"text":"CopyButton","variant":"ghost","label":"Copiar"} },
        { id: "subtle", props: {"text":"CopyButton","variant":"subtle","label":"Copiar"} },
        { id: "link", props: {"text":"CopyButton","variant":"link","label":"Copiar"} },
        { id: "none", props: {"text":"CopyButton","variant":"none","label":"Copiar"} },
      ],
      vue: `  <CopyButton text="CopyButton" variant="solid" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="outlined" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="soft" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="ghost" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="subtle" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="link" label="Copiar"></CopyButton>
  <CopyButton text="CopyButton" variant="none" label="Copiar"></CopyButton>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-copy-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-copy-button").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },
  ],
};
