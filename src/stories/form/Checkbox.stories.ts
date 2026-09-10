import Checkbox from "@/components/form/Checkbox.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { color, label: color },
  }));
}

export const cuCheckboxStories: ComponentStory = {
  component: "cu-checkbox",
  vue: Checkbox,
  tokens: [
    '--cb-bg',
    '--cb-ghost-hover',
    '--cb-soft',
    '--cb-text',
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-font-size-xs',
    '--cu-radius-sm',
    '--cu-border-color',
    '--cu-border-medium',
    '--cu-space-xs',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-space-lg',
  ],
  api: {
    props: [
      { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado del checkbox (v-model)' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
      { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del checkbox: sm, md' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y atenúa el componente' },
      { name: 'label', type: 'string', default: '—', description: 'Texto mostrado a la derecha del checkbox' },
    ],
    slots: [],
    events: [
      { name: 'update:modelValue', type: 'custom', description: 'Se emite al cambiar (v-model). detail: boolean' },
      { name: 'change', type: 'custom', description: 'Cambio de estado. detail: Event nativo del input, o { target: { checked } } al usar set()/reset()' },
      { name: 'click', type: 'nativo', description: 'Click sobre el label (alterna el estado)' },
      { name: 'focus', type: 'nativo', description: 'El input interno recibe foco' },
      { name: 'blur', type: 'nativo', description: 'El input interno pierde el foco' },
    ],
    exposes: [
      { name: 'get', type: '() => boolean', description: 'Devuelve el estado actual (checked)' },
      { name: 'set', type: '(value: boolean) => void', description: 'Setea el estado y emite change' },
      { name: 'reset', type: '() => void', description: 'Restaura el estado a false y emite change' },
      { name: 'focus', type: '() => void', description: 'Pone el foco en el input interno' },
    ],
  },
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "false",
      layout: "col",
      variants: [
        { id: "unchecked", props: { label: "Accept terms" } },
        { id: "checked", props: { label: "Pre-checked", modelValue: true } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/form/Checkbox.vue'

const checked1 = ref(false)
const checked2 = ref(true)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <Checkbox v-model="checked1" label="Accept terms" />
    <Checkbox v-model="checked2" label="Pre-checked" />
  </div>
</template>`,
      vanilla: `<script src="dist/CuCheckbox.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;align-items:center;gap:8px">
    <cu-checkbox id="cb-terms" label="Accept terms"></cu-checkbox>
    <span id="cb-terms-label">unchecked</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <cu-checkbox id="cb-news" label="Pre-checked" model-value="true"></cu-checkbox>
    <span id="cb-news-label">checked</span>
  </div>
</div>

<script>
  function bindCheckbox(id) {
    const cb = document.getElementById(id);
    const label = document.getElementById(id + '-label');
    cb.addEventListener('change', (e) => {
      const checked = e.detail?.target?.checked ?? e.detail;
      label.textContent = checked ? 'checked' : 'unchecked';
    });
  }
  bindCheckbox('cb-terms');
  bindCheckbox('cb-news');
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza input[type=checkbox] y el label",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
              const label = variant.props?.label as string | undefined;
              if (label) expect(wrapper.find(".cu-checkbox-label").text()).toBe(label);
            },
          },
          {
            name: "modelValue=true arranca tildado con icono",
            run({ wrapper, expect }, variant) {
              if (!variant.props?.modelValue) return;
              expect(wrapper.find(".cu-checkbox-box").classes()).toContain("cu-checkbox-box--checked");
              expect(wrapper.find("svg.cu-checkbox-icon").exists()).toBe(true);
            },
          },
          {
            name: "al tildar emite change + update:modelValue",
            async run({ wrapper, expect }, variant) {
              const initial = Boolean(variant.props?.modelValue);
              const target = !initial;
              await wrapper.find("input[type='checkbox']").setValue(target);

              const change = wrapper.emitted("change") as unknown[][] | undefined;
              expect(change).toBeTruthy();
              expect((change![0]![0] as { target: { checked: boolean } }).target.checked).toBe(target);

              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe(target);
              expect(wrapper.find(".cu-checkbox-box").classes().includes("cu-checkbox-box--checked")).toBe(target);
            },
          },
        ],
      },
    },

    {
      id: "labels",
      title: "Labels",
      variants: [
        { id: "with-label", props: { label: "Con label" } },
        { id: "without-label" },
      ],
      vue: `  <Checkbox label="Con label" />
  <Checkbox />`,
      vanilla: `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox label="Con label"></cu-checkbox>
<cu-checkbox></cu-checkbox>`,
      checks: {
        l1: [
          {
            name: "renderiza el label solo cuando hay texto",
            run({ wrapper, expect }, variant) {
              const label = wrapper.find(".cu-checkbox-label");
              if (variant.props?.label) {
                expect(label.exists()).toBe(true);
                expect(label.text()).toBe(variant.props.label);
              } else {
                expect(label.exists()).toBe(false);
              }
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      variants: [
        { id: "md", props: { size: "md", label: "md (default)" } },
        { id: "sm", props: { size: "sm", label: "sm" } },
      ],
      vue: `  <Checkbox size="md" label="md (default)" />
  <Checkbox size="sm" label="sm" />`,
      vanilla: `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox size="md" label="md (default)"></cu-checkbox>
<cu-checkbox size="sm" label="sm"></cu-checkbox>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-checkbox--{size}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-checkbox").classes()).toContain(`cu-checkbox--${variant.props?.size}`);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Color por defecto",
      variants: colorVariants(),
      vue: `  <Checkbox color="primary" label="primary" />
  <Checkbox color="secondary" label="secondary" />
  <Checkbox color="neutral" label="neutral" />
  <Checkbox color="success" label="success" />
  <Checkbox color="warning" label="warning" />
  <Checkbox color="danger" label="danger" />`,
      vanilla: `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox color="primary" label="primary"></cu-checkbox>
<cu-checkbox color="secondary" label="secondary"></cu-checkbox>
<cu-checkbox color="neutral" label="neutral"></cu-checkbox>
<cu-checkbox color="success" label="success"></cu-checkbox>
<cu-checkbox color="warning" label="warning"></cu-checkbox>
<cu-checkbox color="danger" label="danger"></cu-checkbox>`,
      checks: {
        l1: [
          {
            name: "resuelve --cb-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.html()).toContain(`var(--cu-color-${color})`);
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
        { id: "disabled", props: { disabled: true, label: "Disabled unchecked" } },
        { id: "disabled-checked", props: { modelValue: true, disabled: true, label: "Disabled checked" } },
      ],
      vue: `  <Checkbox disabled label="Disabled unchecked" />
  <Checkbox :model-value="true" disabled label="Disabled checked" />`,
      vanilla: `<script src="dist/CuCheckbox.umd.js"><\/script>

<cu-checkbox disabled label="Disabled unchecked"></cu-checkbox>
<cu-checkbox model-value="true" disabled label="Disabled checked"></cu-checkbox>`,
      checks: {
        l1: [
          {
            name: "aplica cu-checkbox--disabled y deshabilita el input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-checkbox").classes()).toContain("cu-checkbox--disabled");
              expect(wrapper.find("input[type='checkbox']").attributes("disabled")).toBeDefined();
            },
          },
        ],
      },
    },
  ],
};
