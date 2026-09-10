import { defineComponent, h, ref } from "vue";
import type { VNodeChild } from "vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory, Variant } from "@/stories/types";

// ── Helpers de demo ──────────────────────────────────────────────────────────

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const ICON_SVG = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

function iconSlot(paths: string[], label: string): () => VNodeChild {
  return () => [
    h(
      "svg",
      ICON_SVG,
      paths.map((d) => h("path", { d })),
    ),
    ` ${label}`,
  ];
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function colorVariants(extra: Record<string, unknown> = {}): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { color, ...extra },
    slots: { default: capitalize(color) },
  }));
}

const vueSnippet = (body: string) => `<script setup>
import Button from '@/components/buttons/Button.vue'
<\/script>

<template>
${body}
</template>`;

const UMD_SCRIPT = `<script src="dist/CuButton.umd.js"><\/script>`;

// ── Preview interactivo de la sección Loading ────────────────────────────────

const ButtonLoadingPreview = defineComponent({
  name: "ButtonLoadingPreview",
  setup() {
    const loading = ref([false, false, false]);

    function toggle(index: number) {
      loading.value[index] = true;
      setTimeout(() => {
        loading.value[index] = false;
      }, 1500);
    }

    return () => [
      h(
        Button,
        { color: "primary", loading: loading.value[0], onClick: () => toggle(0) },
        () => (loading.value[0] ? "Loading..." : "Click to Load"),
      ),
      h(
        Button,
        { color: "secondary", variant: "soft", loading: loading.value[1], onClick: () => toggle(1) },
        () => (loading.value[1] ? "Saving..." : "Save"),
      ),
      h(
        Button,
        { color: "danger", variant: "solid", loading: loading.value[2], onClick: () => toggle(2) },
        () => (loading.value[2] ? "Deleting..." : "Delete"),
      ),
      h(Button, { color: "primary", loading: true }, () => "Always Loading"),
      h(Button, { color: "primary", loading: true, disabled: true }, () => "Disabled + Loading"),
    ];
  },
});

// ── Story ────────────────────────────────────────────────────────────────────

export const cuButtonStories: ComponentStory = {
  component: "cu-button",
  vue: Button,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Variante por defecto",
      layout: "row",
      vue: vueSnippet(`  <Button color="primary" variant="solid">Solid</Button>
  <Button color="primary" variant="soft">Soft</Button>
  <Button color="primary" variant="ghost">Ghost</Button>
  <Button color="primary" variant="subtle">Subtle</Button>
  <Button color="primary" variant="outlined">Outlined</Button>
  <Button color="primary" variant="link">Link</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" variant="solid">Solid</cu-button>
<cu-button color="primary" variant="soft">Soft</cu-button>
<cu-button color="primary" variant="ghost">Ghost</cu-button>
<cu-button color="primary" variant="subtle">Subtle</cu-button>
<cu-button color="primary" variant="outlined">Outlined</cu-button>
<cu-button color="primary" variant="link">Link</cu-button>`,
      variants: [
        { id: "solid", props: { color: "primary", variant: "solid" }, slots: { default: "Solid" } },
        { id: "soft", props: { color: "primary", variant: "soft" }, slots: { default: "Soft" } },
        { id: "ghost", props: { color: "primary", variant: "ghost" }, slots: { default: "Ghost" } },
        { id: "subtle", props: { color: "primary", variant: "subtle" }, slots: { default: "Subtle" } },
        { id: "outlined", props: { color: "primary", variant: "outlined" }, slots: { default: "Outlined" } },
        { id: "link", props: { color: "primary", variant: "link" }, slots: { default: "Link" } },
      ],
      checks: {
        l1: [
          {
            name: "aplica la clase cu-button--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string;
              expect(wrapper.find("button.cu-button").classes()).toContain(`cu-button--${value}`);
            },
          },
          {
            name: "type por defecto es button",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button").attributes("type")).toBe("button");
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const label = variant.slots?.default;
              const text = typeof label === "string" ? label : variant.id;
              expect(wrapper.find("button.cu-button").text()).toContain(text);
            },
          },
          {
            name: "emite click",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-button").trigger("click");
              expect(wrapper.emitted("click")).toBeTruthy();
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
      layout: "row",
      vue: vueSnippet(`  <Button color="primary">Primary</Button>
  <Button color="secondary">Secondary</Button>
  <Button color="neutral">Neutral</Button>
  <Button color="success">Success</Button>
  <Button color="warning">Warning</Button>
  <Button color="danger">Danger</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary">Primary</cu-button>
<cu-button color="secondary">Secondary</cu-button>
<cu-button color="neutral">Neutral</cu-button>
<cu-button color="success">Success</cu-button>
<cu-button color="warning">Warning</cu-button>
<cu-button color="danger">Danger</cu-button>`,
      variants: colorVariants(),
      checks: {
        l1: [
          {
            name: "resuelve --btn-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              const style = wrapper.find("button.cu-button").attributes("style") ?? "";
              expect(style).toContain(`--btn-bg: var(--cu-color-${color})`);
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Valor por defecto",
      layout: "row",
      vue: vueSnippet(`  <Button color="primary" disabled>Primary</Button>
  <Button color="secondary" disabled>Secondary</Button>
  <Button color="neutral" disabled>Neutral</Button>
  <Button color="success" disabled>Success</Button>
  <Button color="warning" disabled>Warning</Button>
  <Button color="danger" disabled>Danger</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" disabled>Primary</cu-button>
<cu-button color="secondary" disabled>Secondary</cu-button>
<cu-button color="neutral" disabled>Neutral</cu-button>
<cu-button color="success" disabled>Success</cu-button>
<cu-button color="warning" disabled>Warning</cu-button>
<cu-button color="danger" disabled>Danger</cu-button>`,
      variants: colorVariants({ disabled: true }),
      checks: {
        l1: [
          {
            name: "aplica disabled y la clase cu-button--disabled",
            run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-button");
              expect(button.attributes("disabled")).toBeDefined();
              expect(button.classes()).toContain("cu-button--disabled");
            },
          },
          {
            name: "no emite click estando deshabilitado",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-button").trigger("click");
              expect(wrapper.emitted("click")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      layout: "row",
      vue: vueSnippet(`  <Button color="primary" size="sm">Small</Button>
  <Button color="primary" size="md">Medium</Button>
  <Button color="primary" size="lg">Large</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" size="sm">Small</cu-button>
<cu-button color="primary" size="md">Medium</cu-button>
<cu-button color="primary" size="lg">Large</cu-button>`,
      variants: [
        { id: "sm", props: { color: "primary", size: "sm" }, slots: { default: "Small" } },
        { id: "md", props: { color: "primary", size: "md" }, slots: { default: "Medium" } },
        { id: "lg", props: { color: "primary", size: "lg" }, slots: { default: "Large" } },
      ],
      checks: {
        l1: [
          {
            name: "aplica la clase cu-button--{size}",
            run({ wrapper, expect }, variant) {
              const size = variant.props?.size as string;
              expect(wrapper.find("button.cu-button").classes()).toContain(`cu-button--${size}`);
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "With Icon",
      layout: "row",
      vue: vueSnippet(`  <Button color="primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    Next
  </Button>
  <Button color="secondary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
    Back
  </Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  Next
</cu-button>
<cu-button color="secondary">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
  Back
</cu-button>`,
      variants: [
        {
          id: "next",
          props: { color: "primary" },
          slots: { default: iconSlot(["M5 12h14", "m12 5 7 7-7 7"], "Next") },
        },
        {
          id: "back",
          props: { color: "secondary" },
          slots: { default: iconSlot(["M19 12H5", "m12 19-7-7 7-7"], "Back") },
        },
        {
          id: "delete",
          props: { color: "danger" },
          slots: {
            default: iconSlot(
              ["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"],
              "Delete",
            ),
          },
        },
      ],
      checks: {
        l1: [
          {
            name: "renderiza el icono (svg) dentro del slot",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button svg").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el label junto al icono",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button").text().trim().length).toBeGreaterThan(0);
            },
          },
        ],
      },
    },

    {
      id: "loading",
      title: "Loading",
      badge: "false",
      badgeTitle: "Valor por defecto",
      layout: "row",
      preview: ButtonLoadingPreview,
      vue: `<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'

const loading = ref(false)

async function guardar() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 2000))
  loading.value = false
}
<\/script>

<template>
  <Button color="primary" :loading="loading" @click="guardar">
    {{ loading ? 'Loading...' : 'Click to Load' }}
  </Button>
</template>`,
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" variant="solid" id="guardar">Guardar</cu-button>

<script>
  const btn = document.getElementById('guardar');
  btn.addEventListener('click', async () => {
    btn.loading = true;
    await new Promise((r) => setTimeout(r, 2000));
    btn.loading = false;
  });
<\/script>`,
      variants: [
        { id: "loading", props: { color: "primary", loading: true }, slots: { default: "Loading..." } },
        { id: "always-loading", props: { color: "primary", loading: true }, slots: { default: "Always Loading" } },
        {
          id: "disabled-loading",
          props: { color: "primary", loading: true, disabled: true },
          slots: { default: "Disabled + Loading" },
        },
      ],
      checks: {
        l1: [
          {
            name: "muestra el spinner",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button-spinner").exists()).toBe(true);
            },
          },
          {
            name: "deshabilita el botón",
            run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-button");
              expect(button.attributes("disabled")).toBeDefined();
              expect(button.classes()).toContain("cu-button--disabled");
            },
          },
        ],
      },
    },

    {
      id: "links",
      title: "As Link",
      badge: "_self",
      badgeTitle: "Target por defecto",
      layout: "row",
      vue: vueSnippet(`  <Button color="primary" to="https://google.com" target="_blank">External Link</Button>
  <Button color="secondary" to="/playground/components/button">Internal Link</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" to="https://google.com" target="_blank">External Link</cu-button>
<cu-button color="secondary" to="/playground/components/button">Internal Link</cu-button>`,
      variants: [
        {
          id: "external",
          props: { color: "primary", to: "https://google.com", target: "_blank" },
          slots: { default: "External Link" },
        },
        {
          id: "internal",
          props: { color: "secondary", to: "/playground/components/button" },
          slots: { default: "Internal Link" },
        },
      ],
      checks: {
        l1: [
          {
            name: "renderiza wrapper <a> con href/target",
            run({ wrapper, expect }, variant) {
              const link = wrapper.find("a.cu-button-link");
              expect(link.exists()).toBe(true);
              expect(link.attributes("href")).toBe(variant.props?.to);
              expect(link.attributes("target")).toBe((variant.props?.target as string) ?? "_self");
            },
          },
          {
            name: "mantiene el <button> interno",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "fullwidth",
      title: "Full Width",
      layout: "col",
      vue: vueSnippet(`  <Button color="primary" variant="solid" style="width:100%">Full Width Solid</Button>
  <Button color="success" variant="soft" style="width:100%">Full Width Soft</Button>
  <Button color="warning" variant="outlined" style="width:100%">Full Width Outlined</Button>
  <Button color="danger" variant="subtle" style="width:100%">Full Width Subtle</Button>`),
      vanilla: `${UMD_SCRIPT}

<cu-button color="primary" variant="solid" style="width:100%">Full Width Solid</cu-button>
<cu-button color="success" variant="soft" style="width:100%">Full Width Soft</cu-button>
<cu-button color="warning" variant="outlined" style="width:100%">Full Width Outlined</cu-button>
<cu-button color="danger" variant="subtle" style="width:100%">Full Width Subtle</cu-button>`,
      variants: [
        {
          id: "solid",
          props: { color: "primary", variant: "solid" },
          attrs: { style: "width:100%" },
          slots: { default: "Full Width Solid" },
        },
        {
          id: "soft",
          props: { color: "success", variant: "soft" },
          attrs: { style: "width:100%" },
          slots: { default: "Full Width Soft" },
        },
        {
          id: "outlined",
          props: { color: "warning", variant: "outlined" },
          attrs: { style: "width:100%" },
          slots: { default: "Full Width Outlined" },
        },
        {
          id: "subtle",
          props: { color: "danger", variant: "subtle" },
          attrs: { style: "width:100%" },
          slots: { default: "Full Width Subtle" },
        },
      ],
      checks: {
        l1: [
          {
            name: "respeta el style width:100% del host",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button").attributes("style")).toContain("width: 100%");
            },
          },
        ],
      },
    },
  ],
};
