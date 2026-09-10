// Generado por tools/migrate.mjs — revisar y completar los TODO.
//
// Tests viejos a mapear:
//   - renderiza un input con clase cu-input
//   - aplica placeholder, type y variant
//   - disabled y readOnly se reflejan en el input
//   - muestra el valor inicial del v-model
//   - al escribir emite update:modelValue
//
// Secciones que quedan en la página (no van a la story): programmatic, api
import Input from "@/components/form/Input.vue";
import type { ComponentStory } from "@/stories/types";

export const cuInputStories: ComponentStory = {
  component: "cu-input",
  vue: Input,
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
      { name: 'modelValue', type: 'string', default: '""', description: 'Valor del input (v-model)' },
      { name: 'startValue', type: 'string', default: '—', description: 'Declarado en el componente pero actualmente sin efecto' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico del foco: primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'Estilo visual: outlined, soft, ghost, subtle' },
      { name: 'type', type: 'string', default: '"text"', description: 'Tipo del input: text, password, email, number, tel, url, search' },
      { name: 'placeholder', type: 'string', default: '—', description: 'Texto de ayuda cuando el input está vacío' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el input' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Muestra el valor pero no permite editarlo' },
    ],
    slots: [],
    events: [
      { name: 'update:modelValue', type: 'custom', description: 'Se emite al escribir (v-model). detail: string' },
      { name: 'input', type: 'nativo', description: 'El usuario escribe; el componente usa este evento para actualizar el modelo' },
      { name: 'change', type: 'nativo', description: 'El valor se confirma (blur o Enter)' },
      { name: 'focus', type: 'nativo', description: 'El input recibe foco' },
      { name: 'blur', type: 'nativo', description: 'El input pierde el foco' },
      { name: 'keydown', type: 'nativo', description: 'Tecla presionada con foco en el input' },
      { name: 'keyup', type: 'nativo', description: 'Tecla soltada con foco en el input' },
    ],
    exposes: [
      { name: 'get', type: '() => string', description: 'Devuelve el valor actual' },
      { name: 'set', type: '(value: string | number) => void', description: 'Setea el valor (convertido a string)' },
      { name: 'reset', type: '() => void', description: 'Vacía el campo' },
      { name: 'focus', type: '() => void', description: 'Pone el foco en el input' },
    ],
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      layout: "col",
      variants: [
        { id: "soft", props: {"variant":"soft","placeholder":"soft (default)"} },
        { id: "outlined", props: {"variant":"outlined","placeholder":"outlined"} },
        { id: "ghost", props: {"variant":"ghost","placeholder":"ghost"} },
        { id: "subtle", props: {"variant":"subtle","placeholder":"subtle"} },
      ],
      vue: `  <Input variant="soft" placeholder="soft (default)" />
  <Input variant="outlined" placeholder="outlined" />
  <Input variant="ghost" placeholder="ghost" />
  <Input variant="subtle" placeholder="subtle" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input variant="soft" placeholder="soft (default)"></cu-input>
<cu-input variant="outlined" placeholder="outlined"></cu-input>
<cu-input variant="ghost" placeholder="ghost"></cu-input>
<cu-input variant="subtle" placeholder="subtle"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-input--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-input").classes()).toContain(`cu-input--${value}`);
            },
          },
          {
            name: "aplica placeholder, type y variant",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-input");
              if (variant.props?.placeholder !== undefined) {
                expect(input.attributes("placeholder")).toBe(String(variant.props.placeholder));
              }
              expect(input.attributes("type")).toBe(
                variant.props?.type !== undefined ? String(variant.props.type) : "text",
              );
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
      variants: [
        { id: "primary", props: {"color":"primary","placeholder":"primary"} },
        { id: "secondary", props: {"color":"secondary","placeholder":"secondary"} },
        { id: "neutral", props: {"color":"neutral","placeholder":"neutral"} },
        { id: "success", props: {"color":"success","placeholder":"success"} },
        { id: "warning", props: {"color":"warning","placeholder":"warning"} },
        { id: "danger", props: {"color":"danger","placeholder":"danger"} },
      ],
      vue: `  <Input color="primary" placeholder="primary" />
  <Input color="secondary" placeholder="secondary" />
  <Input color="neutral" placeholder="neutral" />
  <Input color="success" placeholder="success" />
  <Input color="warning" placeholder="warning" />
  <Input color="danger" placeholder="danger" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input color="primary" placeholder="primary"></cu-input>
<cu-input color="secondary" placeholder="secondary"></cu-input>
<cu-input color="neutral" placeholder="neutral"></cu-input>
<cu-input color="success" placeholder="success"></cu-input>
<cu-input color="warning" placeholder="warning"></cu-input>
<cu-input color="danger" placeholder="danger"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              const html = wrapper.html();
              expect(html).toContain(`var(--cu-color-${color})`);
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
        { id: "primary", props: {"color":"primary","disabled":true,"placeholder":"Disabled"} },
        { id: "neutral", props: {"color":"neutral","disabled":true,"placeholder":"Disabled"} },
      ],
      vue: `  <Input color="primary" disabled placeholder="Disabled" />
  <Input color="neutral" disabled placeholder="Disabled" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input color="primary" disabled placeholder="Disabled"></cu-input>
<cu-input color="neutral" disabled placeholder="Disabled"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              const html = wrapper.html();
              expect(html).toContain(`var(--cu-color-${color})`);
            },
          },
          {
            name: "disabled: atributo y clase",
            run({ wrapper, expect }) {
              const input = wrapper.find("input.cu-input");
              expect(input.attributes("disabled")).toBeDefined();
              expect(input.classes()).toContain("cu-input--disabled");
            },
          },
        ],
      },
    },

    {
      id: "types",
      title: "Types",
      badge: "text",
      layout: "col",
      variants: [
        { id: "v1", props: {"type":"text","placeholder":"Text"} },
        { id: "v2", props: {"type":"password","placeholder":"Password"} },
        { id: "v3", props: {"type":"email","placeholder":"Email"} },
        { id: "v4", props: {"type":"number","placeholder":"Number"} },
      ],
      vue: `  <Input type="text" placeholder="Text" />
  <Input type="password" placeholder="Password" />
  <Input type="email" placeholder="Email" />
  <Input type="number" placeholder="Number" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input type="text" placeholder="Text"></cu-input>
<cu-input type="password" placeholder="Password"></cu-input>
<cu-input type="email" placeholder="Email"></cu-input>
<cu-input type="number" placeholder="Number"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "aplica el type del prop",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("input.cu-input").attributes("type")).toBe(String(variant.props?.type));
            },
          },
        ],
      },
    },

    {
      id: "values",
      title: "With Values",
      layout: "col",
      variants: [
        { id: "v1", props: {"modelValue":"Default input"} },
        { id: "outlined", props: {"variant":"outlined","modelValue":"Outlined input"} },
        { id: "ghost", props: {"variant":"ghost","modelValue":"Ghost input"} },
      ],
      vue: `  <Input model-value="Default input" />
  <Input variant="outlined" model-value="Outlined input" />
  <Input variant="ghost" model-value="Ghost input" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input model-value="Default input"></cu-input>
<cu-input variant="outlined" model-value="Outlined input"></cu-input>
<cu-input variant="ghost" model-value="Ghost input"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-input--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-input").classes()).toContain(`cu-input--${value}`);
            },
          },
          {
            name: "muestra el valor inicial del v-model",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-input").element as HTMLInputElement;
              expect(input.value).toBe(String(variant.props?.modelValue));
            },
          },
        ],
      },
    },

    {
      id: "v-model",
      title: "v-model",
      layout: "col",
      // TODO: revisar demo (v-model)
      variants: [
        { id: "v1", props: {"placeholder":"Escribí tu nombre"}, attrs: {"style":"max-width:280px"} },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Input from '@/components/form/Input.vue'

const nombre = ref('')
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Input v-model="nombre" placeholder="Escribí tu nombre" style="max-width:280px" />
    <span>Hola, {{ nombre || 'extraño' }}</span>
  </div>
</template>`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-input id="mi-nombre" placeholder="Escribí tu nombre" style="max-width:280px"></cu-input>
  <span id="saludo">Hola, extraño</span>
</div>

<script>
  const nombre = document.getElementById('mi-nombre');
  nombre.addEventListener('update:modelValue', (e) => {
    document.getElementById('saludo').textContent = 'Hola, ' + (e.detail || 'extraño');
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "al escribir emite update:modelValue",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-input").setValue("nuevo texto");
              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe("nuevo texto");
            },
          },
        ],
      },
    },

    {
      id: "readonly",
      title: "Read Only",
      badge: "false",
      layout: "col",
      variants: [
        { id: "v1", props: {"readOnly":true,"modelValue":"Solo lectura"} },
        { id: "outlined", props: {"readOnly":true,"variant":"outlined","modelValue":"Outlined read-only"} },
      ],
      vue: `  <Input read-only model-value="Solo lectura" />
  <Input read-only variant="outlined" model-value="Outlined read-only" />`,
      vanilla: `<script src="dist/CuInput.umd.js"><\/script>

<cu-input read-only model-value="Solo lectura"></cu-input>
<cu-input read-only variant="outlined" model-value="Outlined read-only"></cu-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-input").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-input--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-input").classes()).toContain(`cu-input--${value}`);
            },
          },
          {
            name: "readOnly: atributo y valor inicial",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-input");
              expect(input.attributes("readonly")).toBeDefined();
              expect((input.element as HTMLInputElement).value).toBe(String(variant.props?.modelValue));
            },
          },
        ],
      },
    },
  ],
};
