import ColorPicker from "@/components/form/ColorPicker.vue";
import type { ComponentStory } from "@/stories/types";
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
  subComponents: [
    {
      "label": "Input",
      "path": "/playground/components/input#style"
    }
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
        "type": "() => void"
      },
      {
        "name": "set()",
        "type": "() => void"
      },
      {
        "name": "reset()",
        "type": "() => void"
      },
      {
        "name": "focus()",
        "type": "() => void"
      },
      {
        "name": "get",
        "type": "() => string",
        "description": "Devuelve el hex actual"
      },
      {
        "name": "set",
        "type": "(value: string) => void",
        "description": "Setea el color programáticamente"
      },
      {
        "name": "reset",
        "type": "() => void",
        "description": "Vuelve al valor por defecto (#000000)"
      },
      {
        "name": "focus",
        "type": "() => void",
        "description": "Enfoca el input hex"
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [{ id: "default" }],
      vue: `  <ColorPicker />`,
      vanilla: `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker></cu-color-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza swatch, input color e input de texto",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-color-picker-swatch").exists()).toBe(true);
              expect(wrapper.find("input[type='color']").exists()).toBe(true);
              expect(wrapper.find("input.cu-color-picker-input").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "v-model",
      title: "v-model",
      badge: "#000000",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [{ id: "with-value", props: { modelValue: "#3b82f6" } }],
      vue: `<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/form/ColorPicker.vue'

const color = ref('#3b82f6')
<\/script>

<template>
  <ColorPicker v-model="color" />
  <p>Seleccionado: {{ color }}</p>
</template>`,
      vanilla: `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker id="cp" model-value="#3b82f6"></cu-color-picker>
<p id="cp-out">Seleccionado: #3b82f6</p>

<script>
  customElements.whenDefined('cu-color-picker').then(() => {
    const picker = document.getElementById('cp');
    picker.addEventListener('change', (e) => {
      document.getElementById('cp-out').textContent = 'Seleccionado: ' + e.detail;
    });
    // picker.modelValue = '#00ff00'; // setear programáticamente
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el valor inicial en el input de texto",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-color-picker-input").element as HTMLInputElement;
              expect(input.value).toBe(String(variant.props?.modelValue));
            },
          },
          {
            name: "al tipear un hex válido emite change + update:modelValue",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-color-picker-input").setValue("#ff0000");

              const change = wrapper.emitted("change") as unknown[][] | undefined;
              expect(change).toBeTruthy();
              expect(change![0]![0]).toBe("#ff0000");

              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe("#ff0000");
            },
          },
          {
            name: "no emite change con un hex inválido",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-color-picker-input").setValue("#zzz");
              expect(wrapper.emitted("change")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      variants: [
        { id: "primary", props: { color: "primary", disabled: true } },
        { id: "danger", props: { color: "danger", disabled: true, modelValue: "#ef4444" } },
      ],
      vue: `  <ColorPicker color="primary" disabled />`,
      vanilla: `<script src="dist/CuColorPicker.umd.js"><\/script>

<cu-color-picker color="primary" disabled></cu-color-picker>`,
      checks: {
        l1: [
          {
            name: "disabled: clase y ambos inputs deshabilitados",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-color-picker").classes()).toContain("cu-color-picker--disabled");
              expect(wrapper.find("input[type='color']").attributes("disabled")).toBeDefined();
              expect(wrapper.find("input.cu-color-picker-input").attributes("disabled")).toBeDefined();
            },
          },
        ],
      },
    },
  ],
};
