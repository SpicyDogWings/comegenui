import Textarea from "@/components/form/Textarea.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function colorVariants(extra: Record<string, unknown> = {}): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { color, placeholder: color, rows: 2, ...extra },
  }));
}

export const cuTextareaStories: ComponentStory = {
  component: "cu-textarea",
  vue: Textarea,
  tokens: [
    '--btn-bg',
    '--btn-bg-hover',
    '--btn-soft',
    '--btn-soft-hover',
    '--btn-subtle',
    '--btn-subtle-hover',
    '--btn-subtle-border',
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-font-weight-medium',
    '--cu-radius-md',
    '--cu-border-thin',
    '--cu-space-md',
    '--cu-space-lg',
  ],
  api: {
    props: [
      { name: 'v-model', type: 'string', default: '""', description: 'Valor del textarea (defineModel)' },
      { name: 'startValue', type: 'string', default: '—', description: 'Valor inicial alternativo (declarado pero sin efecto actualmente; usar v-model)' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
      { name: 'placeholder', type: 'string', default: '—', description: 'Texto de ayuda cuando está vacío' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el textarea' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura (seleccionable, no editable)' },
      { name: 'rows', type: 'number', default: '3', description: 'Cantidad de filas visibles' },
      { name: 'noResize', type: 'boolean', default: 'false', description: 'Desactiva el redimensionado manual' },
    ],
    slots: [],
    events: [
      { name: 'update:modelValue', type: 'custom', description: 'Emite el valor actualizado en detail al escribir (v-model)' },
      { name: 'input', type: 'nativo', description: 'Evento input nativo del textarea interno (compone hacia el host)' },
    ],
    exposes: [
      { name: 'get', type: '() => string', description: 'Devuelve el valor actual' },
      { name: 'set', type: '(value: string | number) => void', description: 'Setea el valor' },
      { name: 'reset', type: '() => void', description: 'Limpia el valor' },
      { name: 'focus', type: '() => void', description: 'Pone el foco en el textarea' },
    ],
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      layout: "col",
      variants: [
        { id: "soft", props: { variant: "soft", placeholder: "soft (default)", rows: 2 } },
        { id: "outlined", props: { variant: "outlined", placeholder: "outlined", rows: 2 } },
        { id: "ghost", props: { variant: "ghost", placeholder: "ghost", rows: 2 } },
        { id: "subtle", props: { variant: "subtle", placeholder: "subtle", rows: 2 } },
      ],
      vue: `  <Textarea variant="soft" placeholder="soft (default)" :rows="2" />
  <Textarea variant="outlined" placeholder="outlined" :rows="2" />
  <Textarea variant="ghost" placeholder="ghost" :rows="2" />
  <Textarea variant="subtle" placeholder="subtle" :rows="2" />`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea variant="soft" placeholder="soft (default)" rows="2"></cu-textarea>
<cu-textarea variant="outlined" placeholder="outlined" rows="2"></cu-textarea>
<cu-textarea variant="ghost" placeholder="ghost" rows="2"></cu-textarea>
<cu-textarea variant="subtle" placeholder="subtle" rows="2"></cu-textarea>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-textarea--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find("textarea.cu-textarea").classes()).toContain(`cu-textarea--${value}`);
            },
          },
          {
            name: "aplica placeholder y rows",
            run({ wrapper, expect }, variant) {
              const textarea = wrapper.find("textarea.cu-textarea");
              if (variant.props?.placeholder !== undefined) {
                expect(textarea.attributes("placeholder")).toBe(String(variant.props.placeholder));
              }
              if (variant.props?.rows !== undefined) {
                expect(textarea.attributes("rows")).toBe(String(variant.props.rows));
              }
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      layout: "col",
      variants: colorVariants(),
      vue: `  <Textarea color="primary" placeholder="primary" :rows="2" />
  <Textarea color="secondary" placeholder="secondary" :rows="2" />
  <Textarea color="neutral" placeholder="neutral" :rows="2" />
  <Textarea color="success" placeholder="success" :rows="2" />
  <Textarea color="warning" placeholder="warning" :rows="2" />
  <Textarea color="danger" placeholder="danger" :rows="2" />`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" placeholder="primary" rows="2"></cu-textarea>
<cu-textarea color="secondary" placeholder="secondary" rows="2"></cu-textarea>
<cu-textarea color="neutral" placeholder="neutral" rows="2"></cu-textarea>
<cu-textarea color="success" placeholder="success" rows="2"></cu-textarea>
<cu-textarea color="warning" placeholder="warning" rows="2"></cu-textarea>
<cu-textarea color="danger" placeholder="danger" rows="2"></cu-textarea>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.html()).toContain(`var(--cu-color-${color})`);
            },
          },
        ],
      },
    },

    {
      id: "readonly",
      title: "ReadOnly",
      badge: "false",
      variants: colorVariants({ readOnly: true, modelValue: "Este contenido es de solo lectura" }).slice(0, 1),
      vue: `  <Textarea color="primary" read-only model-value="Este contenido es de solo lectura" :rows="2" />`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" read-only model-value="Este contenido es de solo lectura" rows="2"></cu-textarea>`,
      checks: {
        l1: [
          {
            name: "readOnly: atributo readonly y valor inicial",
            run({ wrapper, expect }, variant) {
              const textarea = wrapper.find("textarea.cu-textarea");
              expect(textarea.attributes("readonly")).toBeDefined();
              expect((textarea.element as HTMLTextAreaElement).value).toBe(variant.props?.modelValue);
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      layout: "col",
      variants: [
        { id: "primary", props: { color: "primary", disabled: true, placeholder: "Disabled", rows: 2 } },
        { id: "neutral", props: { color: "neutral", disabled: true, placeholder: "Disabled (neutral)", rows: 2 } },
      ],
      vue: `  <Textarea color="primary" disabled placeholder="Disabled" :rows="2" />
  <Textarea color="neutral" disabled placeholder="Disabled (neutral)" :rows="2" />`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea color="primary" disabled placeholder="Disabled" rows="2"></cu-textarea>
<cu-textarea color="neutral" disabled placeholder="Disabled (neutral)" rows="2"></cu-textarea>`,
      checks: {
        l1: [
          {
            name: "disabled: atributo y clase",
            run({ wrapper, expect }) {
              const textarea = wrapper.find("textarea.cu-textarea");
              expect(textarea.attributes("disabled")).toBeDefined();
              expect(textarea.classes()).toContain("cu-textarea--disabled");
            },
          },
        ],
      },
    },

    {
      id: "rows",
      title: "Rows",
      badge: "3",
      layout: "col",
      variants: [
        { id: "v1", props: { placeholder: "2 rows", rows: 2 } },
        { id: "v2", props: { placeholder: "4 rows", rows: 4 } },
        { id: "v3", props: { placeholder: "6 rows, no resize", rows: 6, noResize: true } },
      ],
      vue: `  <Textarea placeholder="2 rows" :rows="2" />
  <Textarea placeholder="4 rows" :rows="4" />
  <Textarea placeholder="6 rows, no resize" :rows="6" no-resize />`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea placeholder="2 rows" rows="2"></cu-textarea>
<cu-textarea placeholder="4 rows" rows="4"></cu-textarea>
<cu-textarea placeholder="6 rows, no resize" rows="6" no-resize></cu-textarea>`,
      checks: {
        l1: [
          {
            name: "respeta rows y noResize",
            run({ wrapper, expect }, variant) {
              const textarea = wrapper.find("textarea.cu-textarea");
              expect(textarea.attributes("rows")).toBe(String(variant.props?.rows));
              if (variant.props?.noResize) {
                expect(textarea.classes()).toContain("cu-textarea--no-resize");
              }
            },
          },
        ],
      },
    },

    {
      id: "v-model",
      title: "v-model",
      layout: "col",
      variants: [
        { id: "empty", props: { placeholder: "Escribí algo...", rows: 3 } },
        { id: "with-value", props: { modelValue: "texto inicial", rows: 3 } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Textarea from '@/components/form/Textarea.vue'

const text = ref('')
<\/script>

<template>
  <Textarea v-model="text" placeholder="Escribí algo..." :rows="3" />
  <p>Value: {{ text }}</p>
</template>`,
      vanilla: `<script src="dist/CuTextarea.umd.js"><\/script>

<cu-textarea id="mi-textarea" placeholder="Escribí algo..." rows="3"></cu-textarea>
<p id="out">Value: </p>

<script>
  const ta = document.getElementById('mi-textarea');
  const out = document.getElementById('out');
  // El valor también puede setearse por propiedad: ta.modelValue = 'texto inicial'
  ta.addEventListener('update:modelValue', (e) => {
    out.textContent = 'Value: ' + e.detail;
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el valor inicial del v-model",
            run({ wrapper, expect }, variant) {
              if (variant.props?.modelValue === undefined) return;
              const textarea = wrapper.find("textarea.cu-textarea").element as HTMLTextAreaElement;
              expect(textarea.value).toBe(variant.props.modelValue);
            },
          },
          {
            name: "al escribir emite update:modelValue",
            async run({ wrapper, expect }) {
              await wrapper.find("textarea.cu-textarea").setValue("nueva descripción");
              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe("nueva descripción");
            },
          },
        ],
      },
    },
  ],
};
