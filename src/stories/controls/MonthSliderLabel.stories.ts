// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de MonthSliderLabel.vue.
// Eventos detectados: navigate

import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuMonthSliderLabelStories: ComponentStory = {
  component: "cu-month-slider-label",
  vue: MonthSliderLabel,
  tokens: [
    "--cu-border-none",
    "--cu-border-thin",
    "--cu-font-sans",
    "--cu-font-size-md",
    "--cu-font-weight-semibold",
    "--cu-radius",
    "--cu-space-2xs",
    "--cu-space-lg",
    "--cu-space-md",
    "--cu-space-xs",
    "--drag-offset",
    "--ms-accent",
    "--ms-accent-hover",
    "--ms-ghost-hover",
    "--ms-soft",
    "--ms-soft-hover",
    "--ms-subtle",
    "--ms-subtle-border",
    "--ms-subtle-hover",
    "--ms-surface"
  ],
  classes: [
    "cu-badge",
    "cu-badge--subtle",
    "cu-month-slider-label",
    "cu-month-slider-label--ghost",
    "cu-month-slider-label--outlined",
    "cu-month-slider-label--soft",
    "cu-month-slider-label--solid",
    "cu-month-slider-label--subtle",
    "cu-month-slider-label-month",
    "cu-month-slider-label-year"
  ],
  api: {
    "components": [
      {
        "label": "Badge",
        "path": "/playground/components/badge"
      }
    ],
    "props": [
      {
        "name": "label",
        "type": "string",
        "description": "Texto principal del label (mes o año)."
      },
      {
        "name": "year",
        "type": "string",
        "default": "",
        "description": "Texto del año mostrado como badge al lado del label."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita la interacción del label."
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "primary",
        "description": "Color semántico del label."
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle",
        "default": "soft",
        "description": "Variante visual del label."
      },
      {
        "name": "canNavigateNext",
        "type": "boolean",
        "default": "true",
        "description": "Indica si se puede navegar al paso siguiente."
      }
    ],
    "events": [
      {
        "name": "navigate",
        "type": "() => void",
        "description": "Emite la dirección de navegación (positiva = paso siguiente)."
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", props: {"label":"MonthSliderLabel"} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel"></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },

    {
      id: "label",
      title: "Label",
      variants: [
        { id: "with-value", props: {"label":"MonthSliderLabel"} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel"></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"label":"MonthSliderLabel","disabled":false} },
        { id: "true", props: {"label":"MonthSliderLabel","disabled":true} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" disabled></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },

    {
      id: "color",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Default: primary",
      variants: [
        { id: "primary", props: {"label":"MonthSliderLabel","color":"primary","year":"2026"} },
        { id: "secondary", props: {"label":"MonthSliderLabel","color":"secondary","year":"2026"} },
        { id: "neutral", props: {"label":"MonthSliderLabel","color":"neutral","year":"2026"} },
        { id: "success", props: {"label":"MonthSliderLabel","color":"success","year":"2026"} },
        { id: "warning", props: {"label":"MonthSliderLabel","color":"warning","year":"2026"} },
        { id: "danger", props: {"label":"MonthSliderLabel","color":"danger","year":"2026"} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel" color="primary" year="2026"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" color="secondary" year="2026"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" color="neutral" year="2026"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" color="success" year="2026"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" color="warning" year="2026"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" color="danger" year="2026"></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
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
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },

    {
      id: "variant",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Default: soft",
      variants: [
        { id: "solid", props: {"label":"MonthSliderLabel","variant":"solid"} },
        { id: "outlined", props: {"label":"MonthSliderLabel","variant":"outlined"} },
        { id: "soft", props: {"label":"MonthSliderLabel","variant":"soft"} },
        { id: "ghost", props: {"label":"MonthSliderLabel","variant":"ghost"} },
        { id: "subtle", props: {"label":"MonthSliderLabel","variant":"subtle"} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel" variant="solid"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" variant="outlined"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" variant="soft"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" variant="ghost"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" variant="subtle"></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-month-slider-label--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.["variant"] as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-month-slider-label").classes()).toContain(`cu-month-slider-label--${value}`);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },

    {
      id: "can-navigate-next",
      title: "CanNavigateNext",
      badge: "true",
      badgeTitle: "Default: true",
      variants: [
        { id: "false", props: {"label":"MonthSliderLabel","canNavigateNext":false} },
        { id: "true", props: {"label":"MonthSliderLabel","canNavigateNext":true} },
      ],
      vue: `  <MonthSliderLabel label="MonthSliderLabel"></MonthSliderLabel>
  <MonthSliderLabel label="MonthSliderLabel" can-navigate-next></MonthSliderLabel>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider-label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label").exists()).toBe(true);
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: navigate.
        ],
      },
    },
  ],
};
