// Generado por src/plugins/story-playground/cli/generate.mjs a partir de las props de FloatingButton.vue.
// Refinado a mano: el plugin no puede inferir el slot SVG ni el workaround `position: static`
// del preview (el FAB es position: fixed), ni los checks específicos (token --fab-bg, click, disabled).
import { h } from "vue";
import FloatingButton from "@/components/buttons/FloatingButton.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function iconSlot(paths: string[]): () => ReturnType<typeof h> {
  return () =>
    h(
      "svg",
      {
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      },
      paths.map((d) => h("path", { d })),
    );
}

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { color },
    attrs: { style: "position: static" },
    slots: { default: iconSlot(["M12 5v14", "M5 12h14"]) },
  }));
}

export const cuFloatingButtonStories: ComponentStory = {
  component: "cu-floating-button",
  vue: FloatingButton,
  tokens: [
    '--fab-bg',
    '--fab-bg-hover',
    '--fab-bg-active',
    '--cu-radius-full',
    '--cu-shadow-lg',
    '--cu-shadow-xl',
    '--cu-space-lg',
    '--cu-space-3xl',
  ],
  api: {
    props: [
      { name: 'color', type: 'string', default: '"primary"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Estado deshabilitado' },
    ],
    slots: [
      { name: 'default', type: 'slot', description: 'Contenido del FAB: ícono SVG inline' },
    ],
    events: [
      { name: 'click', type: 'custom', description: 'Emitido al hacer click; no se emite si está disabled' },
    ],
  },
  sections: [
    {
      id: "colors",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Color por defecto",
      variants: [
        { id: "default", attrs: { style: "position: static" }, slots: { default: iconSlot(["M12 5v14", "M5 12h14"]) } },
        ...colorVariants(),
      ],
      vue: `  <FloatingButton color="primary" style="position:static" />
  <FloatingButton color="secondary" style="position:static" />
  <FloatingButton color="neutral" style="position:static" />
  <FloatingButton color="success" style="position:static" />
  <FloatingButton color="warning" style="position:static" />
  <FloatingButton color="danger" style="position:static" />`,
      vanilla: `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static"></cu-floating-button>
<cu-floating-button color="secondary" style="position:static"></cu-floating-button>
<cu-floating-button color="neutral" style="position:static"></cu-floating-button>
<cu-floating-button color="success" style="position:static"></cu-floating-button>
<cu-floating-button color="warning" style="position:static"></cu-floating-button>
<cu-floating-button color="danger" style="position:static"></cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "color por defecto primary (--fab-bg)",
            run({ wrapper, expect }, variant) {
              if (variant.props?.color || variant.id !== "default") return;
              expect(wrapper.find("button.cu-floating-button").attributes("style")).toContain(
                "var(--cu-color-primary)",
              );
            },
          },
          {
            name: "resuelve --fab-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
          {
            name: "emite click al hacer clic",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-floating-button").trigger("click");
              expect(wrapper.emitted("click")).toBeTruthy();
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
        { id: "enabled", props: { color: "primary" }, attrs: { style: "position: static" }, slots: { default: iconSlot(["M12 5v14", "M5 12h14"]) } },
        { id: "disabled", props: { color: "primary", disabled: true }, attrs: { style: "position: static" }, slots: { default: iconSlot(["M12 5v14", "M5 12h14"]) } },
      ],
      vue: `  <FloatingButton color="primary" style="position:static" />
  <FloatingButton color="primary" style="position:static" disabled />`,
      vanilla: `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static"></cu-floating-button>
<cu-floating-button color="primary" style="position:static" disabled></cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "disabled: atributo, clase y NO emite click",
            async run({ wrapper, expect }, variant) {
              if (!variant.props?.disabled) return;
              const button = wrapper.find("button.cu-floating-button");
              expect(button.attributes("disabled")).toBeDefined();
              expect(button.classes()).toContain("cu-floating-button--disabled");
              await button.trigger("click");
              expect(wrapper.emitted("click")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "slot",
      title: "Slot",
      badge: "default",
      variants: [
        {
          id: "plus",
          props: { color: "primary" },
          attrs: { style: "position: static" },
          slots: { default: iconSlot(["M12 5v14", "M5 12h14"]) },
        },
        {
          id: "arrow",
          props: { color: "secondary" },
          attrs: { style: "position: static" },
          slots: { default: iconSlot(["M5 12h14", "m12 5 7 7-7 7"]) },
        },
      ],
      vue: `  <FloatingButton color="primary" style="position:static">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  </FloatingButton>
  <FloatingButton color="secondary" style="position:static">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  </FloatingButton>`,
      vanilla: `<script src="dist/CuFloatingButton.umd.js"><\/script>

<cu-floating-button color="primary" style="position:static">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
</cu-floating-button>
<cu-floating-button color="secondary" style="position:static">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
</cu-floating-button>`,
      checks: {
        l1: [
          {
            name: "renderiza el slot (svg) dentro del botón",
            run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-floating-button");
              expect(button.find("svg").exists()).toBe(true);
              expect(button.find("path").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
