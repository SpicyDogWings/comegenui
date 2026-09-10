// Generado por src/plugins/story-playground/cli/generate.mjs a partir de las props de CopyButton.vue.
// (sin eventos declarados)

import CopyButton from "@/components/buttons/CopyButton.vue";
import type { ComponentStory } from "@/stories/types";

export const cuCopyButtonStories: ComponentStory = {
  component: "cu-copy-button",
  vue: CopyButton,
  tokens: [
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-radius',
    '--cu-space-sm',
    '--cu-color-surface',
    '--cu-border-thin',
  ],
  subComponents: [
    { label: 'Button', path: '/playground/components/button#style' },
  ],
  api: {
    components: [
      { label: 'Button', path: '/playground/components/button' },
    ],
    props: [
      { name: 'text', type: 'string', default: '—', description: 'Contenido a copiar (obligatorio)' },
      { name: 'label', type: 'string', default: '""', description: 'Texto siempre visible junto al icono; vacío = icon-only (aria: "Copiar")' },
      { name: 'copiedLabel', type: 'string', default: '"Copiado"', description: 'Texto animado + aria-label durante el estado copied (2s)' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico del Button interno' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'Variante del Button interno' },
    ],
    events: [
      { name: 'click', type: 'nativo', description: 'Click nativo del Button interno; dispara la copia al portapapeles' },
    ],
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
      id: "text",
      title: "Text",
      variants: [
        { id: "with-value", props: {"text":"CopyButton"} },
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
        { id: "primary", props: {"text":"CopyButton","color":"primary"} },
        { id: "secondary", props: {"text":"CopyButton","color":"secondary"} },
        { id: "neutral", props: {"text":"CopyButton","color":"neutral"} },
        { id: "success", props: {"text":"CopyButton","color":"success"} },
        { id: "warning", props: {"text":"CopyButton","color":"warning"} },
        { id: "danger", props: {"text":"CopyButton","color":"danger"} },
      ],
      vue: `  <CopyButton text="CopyButton" color="primary"></CopyButton>
  <CopyButton text="CopyButton" color="secondary"></CopyButton>
  <CopyButton text="CopyButton" color="neutral"></CopyButton>
  <CopyButton text="CopyButton" color="success"></CopyButton>
  <CopyButton text="CopyButton" color="warning"></CopyButton>
  <CopyButton text="CopyButton" color="danger"></CopyButton>`,
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
        { id: "solid", props: {"text":"CopyButton","variant":"solid"} },
        { id: "outlined", props: {"text":"CopyButton","variant":"outlined"} },
        { id: "soft", props: {"text":"CopyButton","variant":"soft"} },
        { id: "ghost", props: {"text":"CopyButton","variant":"ghost"} },
        { id: "subtle", props: {"text":"CopyButton","variant":"subtle"} },
        { id: "link", props: {"text":"CopyButton","variant":"link"} },
        { id: "none", props: {"text":"CopyButton","variant":"none"} },
      ],
      vue: `  <CopyButton text="CopyButton" variant="solid"></CopyButton>
  <CopyButton text="CopyButton" variant="outlined"></CopyButton>
  <CopyButton text="CopyButton" variant="soft"></CopyButton>
  <CopyButton text="CopyButton" variant="ghost"></CopyButton>
  <CopyButton text="CopyButton" variant="subtle"></CopyButton>
  <CopyButton text="CopyButton" variant="link"></CopyButton>
  <CopyButton text="CopyButton" variant="none"></CopyButton>`,
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
