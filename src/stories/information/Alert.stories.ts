import { defineComponent, h, nextTick, ref } from "vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["solid", "soft", "ghost", "subtle", "outlined"] as const;

const AlertTogglePreview = defineComponent({
  name: "AlertTogglePreview",
  setup() {
    const show = ref(true);
    return () =>
      h("div", { class: "playground-col" }, [
        h(
          Button,
          { onClick: () => (show.value = !show.value) },
          () => `Toggle Alert (${show.value ? "visible" : "hidden"})`,
        ),
        h(
          Alert,
          {
            title: "Toggleable",
            color: "success",
            close: true,
            show: show.value,
            "onUpdate:show": (value: boolean) => (show.value = value),
          },
          () => "This alert is controlled via v-model:show.",
        ),
      ]);
  },
});

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { title: color.charAt(0).toUpperCase() + color.slice(1), color },
    slots: { default: `${color} alert` },
  }));
}

export const cuAlertStories: ComponentStory = {
  component: "cu-alert",
  vue: Alert,
  tokens: [
    '--alert-bg',
    '--alert-text',
    '--alert-soft',
    '--alert-subtle',
    '--alert-subtle-border',
    '--alert-ghost-hover',
    '--alert-ghost-active',
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-font-size-lg',
    '--cu-font-weight-bold',
    '--cu-radius',
    '--cu-radius-sm',
    '--cu-border-thin',
    '--cu-space-2xs',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-space-lg',
    '--cu-color-surface',
  ],
  subComponents: [
    { label: 'Button', path: '/playground/components/button#style' },
  ],
  api: {
    components: [
      { label: 'Button', path: '/playground/components/button' },
    ],
    props: [
      { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
      { name: 'title', type: 'string', default: '—', description: 'Título del alert' },
      { name: 'close', type: 'boolean', default: 'false', description: 'Muestra el botón X para cerrar' },
      { name: 'show', type: 'boolean', default: 'true', description: 'Visibilidad (v-model:show)' },
    ],
    slots: [
      { name: 'default', description: 'Contenido del alert' },
      { name: 'icon', description: 'Icono junto al título' },
    ],
    events: [
      { name: 'close', type: '() => void', description: 'Se cerró el alert' },
      { name: 'open', type: '() => void', description: 'Se abrió el alert' },
      { name: 'update:show', type: '(value: boolean) => void', description: 'Cambió la visibilidad (v-model:show)' },
    ],
    exposes: [
      { name: 'open()', type: '() => void', description: 'Abre el alert' },
      { name: 'close()', type: '() => void', description: 'Cierra el alert' },
      { name: 'toggle()', type: '() => void', description: 'Alterna abierto/cerrado' },
      { name: 'isOpen()', type: '() => boolean', description: 'Estado actual' },
    ],
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      layout: "col",
      variants: [
        { id: "default", props: { title: "Default" }, slots: { default: "Mensaje de alerta" } },
        ...VARIANTS.map((variant) => ({
          id: variant,
          props: { title: variant.charAt(0).toUpperCase() + variant.slice(1), color: "primary", variant },
          slots: { default: `This is a ${variant} alert.` },
        })),
      ],
      vue: `<script setup>
import Alert from '@/components/information/Alert.vue'
<\/script>

<template>
  <Alert title="Solid" color="primary" variant="solid">This is a solid alert.</Alert>
  <Alert title="Soft" color="primary" variant="soft">This is a soft alert.</Alert>
  <Alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</Alert>
  <Alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</Alert>
  <Alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</Alert>
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Solid" color="primary" variant="solid">This is a solid alert.</cu-alert>
<cu-alert title="Soft" color="primary" variant="soft">This is a soft alert.</cu-alert>
<cu-alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</cu-alert>
<cu-alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</cu-alert>
<cu-alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</cu-alert>`,
      checks: {
        l1: [
          {
            name: "aplica cu-alert--{variant} (default: soft)",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "soft";
              expect(wrapper.find(".cu-alert").classes()).toContain(`cu-alert--${value}`);
            },
          },
          {
            name: "renderiza role=alert y el contenido del slot",
            run({ wrapper, expect }, variant) {
              const alert = wrapper.find(".cu-alert");
              expect(alert.attributes("role")).toBe("alert");
              expect(alert.text()).toContain(String(variant.slots?.default));
            },
          },
          {
            name: "renderiza el título en el header (o nada si no hay)",
            run({ wrapper, expect }, variant) {
              const title = variant.props?.title as string | undefined;
              const titleText = wrapper.find(".cu-alert-title-text");
              if (title) {
                expect(titleText.exists()).toBe(true);
                expect(titleText.text()).toBe(title);
              } else {
                expect(titleText.exists()).toBe(false);
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
      badgeTitle: "Color por defecto",
      layout: "col",
      variants: colorVariants(),
      vue: `<Alert title="Primary" color="primary">Primary alert</Alert>
<Alert title="Secondary" color="secondary">Secondary alert</Alert>
<Alert title="Neutral" color="neutral">Neutral alert</Alert>
<Alert title="Success" color="success">Success alert</Alert>
<Alert title="Warning" color="warning">Warning alert</Alert>
<Alert title="Danger" color="danger">Danger alert</Alert>`,
      vanilla: `<cu-alert title="Primary" color="primary">Primary alert</cu-alert>
<cu-alert title="Secondary" color="secondary">Secondary alert</cu-alert>
<cu-alert title="Neutral" color="neutral">Neutral alert</cu-alert>
<cu-alert title="Success" color="success">Success alert</cu-alert>
<cu-alert title="Warning" color="warning">Warning alert</cu-alert>
<cu-alert title="Danger" color="danger">Danger alert</cu-alert>`,
      checks: {
        l1: [
          {
            name: "resuelve --alert-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-alert").attributes("style")).toContain(
                `--alert-bg: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "close",
      title: "With Close",
      variants: [
        {
          id: "closeable",
          props: { title: "Closeable", color: "primary", close: true },
          slots: { default: "Click the X to close this alert." },
        },
      ],
      vue: `<script setup>
import Alert from '@/components/information/Alert.vue'
<\/script>

<template>
  <Alert title="Closeable" color="primary" close>
    Click the X to close this alert.
  </Alert>
</template>`,
      vanilla: `<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Closeable" color="primary" close>
  Click the X to close this alert.
</cu-alert>`,
      checks: {
        l1: [
          {
            name: "el botón de cierre emite close y oculta la alerta",
            async run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-alert-close");
              expect(button.exists()).toBe(true);
              await button.trigger("click");
              expect(wrapper.emitted("close")).toBeTruthy();
              expect(wrapper.find(".cu-alert").attributes("style")).toContain("display: none");
            },
          },
          {
            name: "al cerrar emite update:show=false",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-alert-close").trigger("click");
              const emitted = wrapper.emitted("update:show") as unknown[][] | undefined;
              expect(emitted).toBeTruthy();
              expect(emitted![0]![0]).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "toggle",
      title: "v-model:show",
      layout: "col",
      preview: AlertTogglePreview,
      variants: [
        {
          id: "visible",
          props: { title: "Toggleable", color: "success", close: true, show: true },
          slots: { default: "This alert is controlled via v-model:show." },
        },
        {
          id: "hidden",
          props: { title: "Toggleable", color: "success", close: true, show: false },
          slots: { default: "This alert is controlled via v-model:show." },
        },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Alert from '@/components/information/Alert.vue'

const show = ref(true)
<\/script>

<template>
  <Button @click="show = !show">Toggle</Button>
  <Alert v-model:show="show" title="Toggleable" color="success" close>
    This alert is controlled via v-model:show.
  </Alert>
</template>`,
      vanilla: `<script src="CuAlert.umd.js"><\/script>

<cu-alert id="my-alert" title="Toggleable" color="success" close>
  This alert is controlled via v-model:show.
</cu-alert>

<script>
  const alert = document.getElementById('my-alert')
  alert.addEventListener('update:show', (e) => console.log('show:', e.detail))
  alert.show = false // prop nativa del Custom Element<\/script>`,
      checks: {
        l1: [
          {
            name: "show=false oculta la alerta vía v-show",
            run({ wrapper, expect }, variant) {
              if (variant.props?.show === false) {
                expect(wrapper.find(".cu-alert").attributes("style")).toContain("display: none");
              } else {
                expect(wrapper.find(".cu-alert").attributes("style")).not.toContain("display: none");
              }
            },
          },
          {
            name: "expone open/close/toggle/isOpen",
            async run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as {
                isOpen: () => boolean;
                open: () => void;
                close: () => void;
                toggle: () => void;
              };
              const initial = vm.isOpen();
              vm.toggle();
              await nextTick();
              expect(vm.isOpen()).toBe(!initial);
              vm.close();
              await nextTick();
              expect(vm.isOpen()).toBe(false);
              vm.open();
              await nextTick();
              expect(vm.isOpen()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "With Icon",
      variants: [
        {
          id: "with-icon",
          props: { title: "Info", color: "primary", variant: "soft" },
          slots: {
            icon: () =>
              h(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: 20,
                  height: 20,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": 2,
                },
                [h("circle", { cx: 12, cy: 12, r: 10 })],
              ),
            default: "This alert has an icon in the title.",
          },
        },
      ],
      vue: `<Alert title="Info" color="primary" variant="soft">
  <template #icon>
    <svg ...>...</svg>
  </template>
  This alert has an icon in the title.
</Alert>`,
      vanilla: `<script src="CuAlert.umd.js"><\/script>

<cu-alert title="Info" color="primary" variant="soft">
  <svg slot="icon" ...>...</svg>
  This alert has an icon in the title.
</cu-alert>`,
      checks: {
        l1: [
          {
            name: "renderiza el icono y el header",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-alert-header").exists()).toBe(true);
              expect(wrapper.find(".cu-alert-title svg").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "notitle",
      title: "Without Title",
      variants: [
        {
          id: "no-title",
          props: { color: "primary", variant: "soft" },
          slots: { default: "This alert has no title — no empty header should render." },
        },
      ],
      vue: `<script setup>
import Alert from '@/components/information/Alert.vue'
<\/script>

<template>
  <Alert color="primary" variant="soft">
    This alert has no title — no empty header should render.
  </Alert>
</template>`,
      vanilla: `<script src="CuAlert.umd.js"><\/script>

<cu-alert color="primary" variant="soft">
  This alert has no title — no empty header should render.
</cu-alert>`,
      checks: {
        l1: [
          {
            name: "no renderiza un header vacío",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-alert-header").exists()).toBe(false);
            },
          },
        ],
      },
    },
  ],
};
