// Generado por src/plugins/khadgar/cli/generate.mjs a partir del contrato de FloatingButton.vue.
// Eventos detectados: click

import FloatingButton from "@/components/buttons/FloatingButton.vue";
import type { ComponentStory } from "@/stories/types";

export const cuFloatingButtonStories: ComponentStory = {
  component: "cu-floating-button",
  vue: FloatingButton,
  tokens: [
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-font-size-xl",
    "--cu-radius-full",
    "--cu-shadow-lg",
    "--cu-shadow-xl",
    "--cu-space-3xl",
    "--cu-space-lg",
    "--fab-bg",
    "--fab-bg-active",
    "--fab-bg-hover"
  ],
  classes: [
    "cu-floating-button",
    "cu-floating-button--disabled"
  ],
  api: {
    "props": [
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "primary",
        "description": "Color semántico del FAB: primary, secondary, neutral, success, warning, danger."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita el botón: atenúa el FAB y no emite `click`."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Contenido del FAB: ícono SVG inline"
      }
    ],
    "events": [
      {
        "name": "click",
        "type": "() => void",
        "description": "Emitido al hacer click; no se emite si está disabled"
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", attrs: {"style":"position: static"}, slots: {"default":"+"} },
      ],
      vue: `  <FloatingButton>+</FloatingButton>`,
      vanilla: `  <cu-floating-button>+</cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-floating-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-floating-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: click.
        ],
      },
    },

    {
      id: "color",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Default: primary",
      variants: [
        { id: "primary", props: {"color":"primary"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "secondary", props: {"color":"secondary"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "neutral", props: {"color":"neutral"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "success", props: {"color":"success"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "warning", props: {"color":"warning"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "danger", props: {"color":"danger"}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
      ],
      vue: `  <FloatingButton color="primary">+</FloatingButton>
  <FloatingButton color="secondary">+</FloatingButton>
  <FloatingButton color="neutral">+</FloatingButton>
  <FloatingButton color="success">+</FloatingButton>
  <FloatingButton color="warning">+</FloatingButton>
  <FloatingButton color="danger">+</FloatingButton>`,
      vanilla: `  <cu-floating-button color="primary">+</cu-floating-button>
  <cu-floating-button color="secondary">+</cu-floating-button>
  <cu-floating-button color="neutral">+</cu-floating-button>
  <cu-floating-button color="success">+</cu-floating-button>
  <cu-floating-button color="warning">+</cu-floating-button>
  <cu-floating-button color="danger">+</cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-floating-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-floating-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
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
          // TODO: checks específicos (eventos, exposes) — emite: click.
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"disabled":false}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
        { id: "true", props: {"disabled":true}, attrs: {"style":"position: static"}, slots: {"default":"+"} },
      ],
      vue: `  <FloatingButton>+</FloatingButton>
  <FloatingButton disabled>+</FloatingButton>`,
      vanilla: `  <cu-floating-button>+</cu-floating-button>
  <cu-floating-button disabled>+</cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-floating-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-floating-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "disabled: refleja el atributo en el control",
            run({ wrapper, expect }, variant) {
              const control = wrapper.find("button, input, textarea, select");
              if (variant.props?.disabled) expect(control.attributes("disabled")).toBeDefined();
              else expect(control.attributes("disabled")).toBeUndefined();
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: click.
        ],
      },
    },
  ],
};
