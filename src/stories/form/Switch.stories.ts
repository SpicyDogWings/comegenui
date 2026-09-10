import Switch from "@/components/form/Switch.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { color, label: color },
    slots: { default: color },
  }));
}

export const cuSwitchStories: ComponentStory = {
  component: "cu-switch",
  vue: Switch,
  tokens: [
    '--switch-bg',
    '--switch-ghost-hover',
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-font-size-xs',
    '--cu-radius-full',
    '--cu-shadow-sm',
    '--cu-space-2xs',
    '--cu-space-xs',
    '--cu-space-sm',
    '--cu-space-lg',
    '--cu-space-xl',
    '--cu-space-2xl',
    '--cu-space-3xl',
  ],
  api: {
    props: [
      { name: 'modelValue', type: 'boolean', default: 'false', description: 'Estado del switch (v-model)' },
      { name: 'label', type: 'string', default: '""', description: 'Texto del label (usa el componente Label); también acepta slot default. El click sobre el label alterna el switch' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
      { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del switch: sm, md' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la interacción y atenúa el componente' },
    ],
    slots: [
      { name: 'default', description: 'Texto del label (alternativa al prop label)' },
    ],
    events: [
      { name: 'update:modelValue', type: 'custom', description: 'Se emite al alternar (v-model). detail: boolean' },
      { name: 'change', type: 'custom', description: 'Se emite al alternar. detail: boolean (nuevo estado)' },
      { name: 'click', type: 'nativo', description: 'Click sobre el switch (alterna el estado)' },
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
        { id: "v1", props: { label: "Notificaciones" } },
        { id: "v2", props: { label: "Modo oscuro" } },
        { id: "on", props: { label: "Encendido", modelValue: true } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Switch from '@/components/form/Switch.vue'

const notifications = ref(false)
const darkMode = ref(true)
<\/script>

<template>
  <Switch v-model="notifications" label="Notificaciones" />
  <Switch v-model="darkMode" label="Modo oscuro" />
</template>`,
      vanilla: `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch label="Notificaciones"></cu-switch>
<cu-switch label="Modo oscuro" model-value="true"></cu-switch>`,
      checks: {
        l1: [
          {
            name: "renderiza rol switch y aria-checked según modelValue",
            run({ wrapper, expect }, variant) {
              const track = wrapper.find(".cu-switch-track");
              expect(track.attributes("role")).toBe("switch");
              expect(track.attributes("aria-checked")).toBe(variant.props?.modelValue ? "true" : "false");
            },
          },
          {
            name: "modelValue=true arranca encendido",
            run({ wrapper, expect }, variant) {
              if (!variant.props?.modelValue) return;
              expect(wrapper.find(".cu-switch-track").classes()).toContain("cu-switch--checked");
            },
          },
          {
            name: "al alternar emite change + update:modelValue",
            async run({ wrapper, expect }, variant) {
              const initial = Boolean(variant.props?.modelValue);
              const target = !initial;
              await wrapper.find("input[type='checkbox']").setValue(target);

              const change = wrapper.emitted("change") as unknown[][] | undefined;
              expect(change).toBeTruthy();
              expect(change![0]![0]).toBe(target);

              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe(target);
              expect(wrapper.find(".cu-switch-track").attributes("aria-checked")).toBe(String(target));
            },
          },
        ],
      },
    },

    {
      id: "with-label",
      title: "With Label",
      layout: "col",
      variants: [
        { id: "v1", props: { label: "Notificaciones" } },
        { id: "success", props: { color: "success" }, slots: { default: "Modo oscuro automático" } },
      ],
      vue: `  <Switch v-model="notifications" label="Notificaciones" />
  <Switch v-model="darkMode" color="success">
    Modo oscuro automático
  </Switch>`,
      vanilla: `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch id="switch-label-1" label="Notificaciones"></cu-switch>
<cu-switch id="switch-label-2" color="success">Modo oscuro automático</cu-switch>

<script>
  customElements.whenDefined('cu-switch').then(() => {
    const one = document.getElementById('switch-label-1');
    const two = document.getElementById('switch-label-2');
    one.addEventListener('change', (e) => { one.modelValue = e.detail; });
    two.addEventListener('change', (e) => { two.modelValue = e.detail; });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el label (prop o slot)",
            run({ wrapper, expect }, variant) {
              const label = (variant.props?.label as string | undefined) ?? variant.slots?.default;
              if (typeof label !== "string" || !label) return;
              expect(wrapper.find(".cu-switch-label").text()).toContain(label);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color})`);
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
      vue: `  <Switch size="md" label="md (default)" />
  <Switch size="sm" label="sm" />`,
      vanilla: `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch size="md" label="md (default)"></cu-switch>
<cu-switch size="sm" label="sm"></cu-switch>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-switch--{size}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-switch").classes()).toContain(`cu-switch--${variant.props?.size}`);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      variants: colorVariants(),
      vue: `  <Switch color="primary" label="primary" />
  <Switch color="secondary" label="secondary" />
  <Switch color="neutral" label="neutral" />
  <Switch color="success" label="success" />
  <Switch color="warning" label="warning" />
  <Switch color="danger" label="danger" />`,
      vanilla: `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch color="primary" label="primary"></cu-switch>
<cu-switch color="secondary" label="secondary"></cu-switch>
<cu-switch color="neutral" label="neutral"></cu-switch>
<cu-switch color="success" label="success"></cu-switch>
<cu-switch color="warning" label="warning"></cu-switch>
<cu-switch color="danger" label="danger"></cu-switch>`,
      checks: {
        l1: [
          {
            name: "resuelve --switch-bg al token --cu-color-{color}",
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
        { id: "v1", props: { disabled: true, label: "Disabled unchecked" } },
        { id: "v2", props: { modelValue: true, disabled: true, label: "Disabled checked" } },
      ],
      vue: `  <Switch disabled label="Disabled unchecked" />
  <Switch :model-value="true" disabled label="Disabled checked" />`,
      vanilla: `<script src="dist/CuSwitch.umd.js"><\/script>

<cu-switch disabled label="Disabled unchecked"></cu-switch>
<cu-switch model-value="true" disabled label="Disabled checked"></cu-switch>`,
      checks: {
        l1: [
          {
            name: "aplica cu-switch--disabled y deshabilita el input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-switch").classes()).toContain("cu-switch--disabled");
              expect(wrapper.find("input[type='checkbox']").attributes("disabled")).toBeDefined();
            },
          },
          {
            name: "no alterna al hacer click",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-switch").trigger("click");
              expect(wrapper.emitted("change")).toBeUndefined();
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
        ],
      },
    },
  ],
};
