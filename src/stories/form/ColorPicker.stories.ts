// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de ColorPicker.vue.
// Eventos detectados: update:modelValue, change

import ColorPicker from "@/components/form/ColorPicker.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";
import { extras } from "./ColorPicker.stories.extras";

export const cuColorPickerStories: ComponentStory = {
  component: "cu-color-picker",
  vue: ColorPicker,
  tokens: [
    "--cp-subtle-border",
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-font-sans",
    "--cu-radius-md",
    "--cu-space-2xl",
    "--cu-space-5xl",
    "--cu-space-sm",
    "--cu-subtle-border"
  ],
  classes: [
    "cu-color-picker",
    "cu-color-picker--disabled",
    "cu-color-picker-input",
    "cu-color-picker-native",
    "cu-color-picker-swatch",
    "cu-color-picker-swatch-color"
  ],
  api: {
    "components": [
      {
        "label": "Input",
        "path": "/playground/components/input"
      }
    ],
    "props": [
      {
        "name": "modelValue",
        "type": "string",
        "description": "Color seleccionado en hex (v-model)"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "Color semántico para foco/bordes: primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita swatch e input hex"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "(value) => void",
        "description": "v-model: nuevo hex al cambiar"
      },
      {
        "name": "change",
        "type": "() => void",
        "description": "Hex al cambiar: siempre desde el picker nativo; desde el texto solo si matchea #rrggbb"
      }
    ],
    "exposes": [
      {
        "name": "get()",
        "type": "() => void",
        "description": "Devuelve el color actual en formato hex."
      },
      {
        "name": "set()",
        "type": "() => void",
        "description": "Setea el color actual en formato hex."
      },
      {
        "name": "reset()",
        "type": "() => void",
        "description": "Restaura el color al negro (#000000)."
      },
      {
        "name": "focus()",
        "type": "() => void",
        "description": "Enfoca el input de texto del color."
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default" },
      ],
      vue: `  <ColorPicker></ColorPicker>`,
      vanilla: `  <cu-color-picker></cu-color-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-color-picker",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-color-picker").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, change.
        ],
      },
    },

    {
      id: "color",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Default: neutral",
      variants: [
        { id: "primary", props: {"color":"primary"} },
        { id: "secondary", props: {"color":"secondary"} },
        { id: "neutral", props: {"color":"neutral"} },
        { id: "success", props: {"color":"success"} },
        { id: "warning", props: {"color":"warning"} },
        { id: "danger", props: {"color":"danger"} },
      ],
      vue: `  <ColorPicker color="primary"></ColorPicker>
  <ColorPicker color="secondary"></ColorPicker>
  <ColorPicker color="neutral"></ColorPicker>
  <ColorPicker color="success"></ColorPicker>
  <ColorPicker color="warning"></ColorPicker>
  <ColorPicker color="danger"></ColorPicker>`,
      vanilla: `  <cu-color-picker color="primary"></cu-color-picker>
  <cu-color-picker color="secondary"></cu-color-picker>
  <cu-color-picker color="neutral"></cu-color-picker>
  <cu-color-picker color="success"></cu-color-picker>
  <cu-color-picker color="warning"></cu-color-picker>
  <cu-color-picker color="danger"></cu-color-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-color-picker",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-color-picker").exists()).toBe(true);
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
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, change.
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"disabled":false} },
        { id: "true", props: {"disabled":true} },
      ],
      vue: `  <ColorPicker></ColorPicker>
  <ColorPicker disabled></ColorPicker>`,
      vanilla: `  <cu-color-picker></cu-color-picker>
  <cu-color-picker disabled></cu-color-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-color-picker",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-color-picker").exists()).toBe(true);
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
          // TODO: checks específicos (eventos, exposes) — emite: update:modelValue, change.
        ],
      },
    },
  ],
};
