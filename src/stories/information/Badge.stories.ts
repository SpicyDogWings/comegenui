import { defineComponent, h } from "vue";
import Badge from "@/components/information/Badge.vue";
import type { ComponentStory } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["solid", "soft", "ghost", "subtle", "outlined"] as const;

const BadgeCombinationsPreview = defineComponent({
  name: "BadgeCombinationsPreview",
  setup() {
    return () =>
      h("table", { class: "playground-badge-table" }, [
        h("thead", [
          h("tr", [
            h("th", "variant \\ color"),
            ...COLORS.map((color) => h("th", { key: color }, color)),
          ]),
        ]),
        h(
          "tbody",
          VARIANTS.map((variant) =>
            h("tr", { key: variant }, [
              h("td", { class: "playground-badge-label" }, variant),
              ...COLORS.map((color) =>
                h("td", { key: color }, [h(Badge, { color, variant }, () => variant)]),
              ),
            ]),
          ),
        ),
      ]);
  },
});

export const cuBadgeStories: ComponentStory = {
  component: "cu-badge",
  vue: Badge,
  tokens: [
    "--badge-bg",
    "--badge-soft",
    "--badge-subtle",
    "--badge-subtle-border",
    "--badge-text",
    "--cu-border-thin",
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-font-size-xs",
    "--cu-font-weight-medium",
    "--cu-line-height-tight",
    "--cu-radius",
    "--cu-space-2xs",
    "--cu-space-sm",
    "--cu-space-xs"
  ],
  classes: [
    "cu-badge",
    "cu-badge--ghost",
    "cu-badge--outlined",
    "cu-badge--soft",
    "cu-badge--solid",
    "cu-badge--subtle"
  ],
  api: {
    "props": [
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | subtle | ghost",
        "default": "soft",
        "description": "solid, outlined, soft, ghost, subtle"
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Texto del badge"
      }
    ]
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      layout: "row",
      variants: [
        { id: "default", props: {}, slots: { default: "default" } },
        ...VARIANTS.map((variant) => ({
          id: variant,
          props: { color: "primary", variant },
          slots: { default: variant },
        })),
      ],
      vue: `<script setup>
import Badge from '@/components/information/Badge.vue'
<\/script>

<template>
  <Badge color="primary" variant="solid">solid</Badge>
  <Badge color="primary" variant="soft">soft</Badge>
  <Badge color="primary" variant="ghost">ghost</Badge>
  <Badge color="primary" variant="subtle">subtle</Badge>
  <Badge color="primary" variant="outlined">outlined</Badge>
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuBadge.umd.js"><\/script>

<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-badge--{variant} (default: soft)",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "soft";
              expect(wrapper.find("span.cu-badge").classes()).toContain(`cu-badge--${value}`);
            },
          },
          {
            name: "el span.cu-badge contiene el slot",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("span.cu-badge").text()).toContain(String(variant.slots?.default));
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
      variants: COLORS.map((color) => ({
        id: color,
        props: { color },
        slots: { default: color },
      })),
      vue: `<Badge color="primary">primary</Badge>
<Badge color="secondary">secondary</Badge>
<Badge color="neutral">neutral</Badge>
<Badge color="success">success</Badge>
<Badge color="warning">warning</Badge>
<Badge color="danger">danger</Badge>`,
      vanilla: `<cu-badge color="primary">primary</cu-badge>
<cu-badge color="secondary">secondary</cu-badge>
<cu-badge color="neutral">neutral</cu-badge>
<cu-badge color="success">success</cu-badge>
<cu-badge color="warning">warning</cu-badge>
<cu-badge color="danger">danger</cu-badge>`,
      checks: {
        l1: [
          {
            name: "resuelve --badge-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find("span.cu-badge").attributes("style")).toContain(
                `--badge-bg: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "combinations",
      title: "All Combinations",
      preview: BadgeCombinationsPreview,
      variants: VARIANTS.flatMap((variant) =>
        COLORS.map((color) => ({
          id: `${variant}-${color}`,
          props: { variant, color },
          slots: { default: variant },
        })),
      ),
      vue: `<Badge color="success" variant="solid">solid</Badge>
<Badge color="danger" variant="outlined">outlined</Badge>
<Badge color="warning" variant="subtle">subtle</Badge>`,
      vanilla: `<cu-badge color="success" variant="solid">solid</cu-badge>
<cu-badge color="danger" variant="outlined">outlined</cu-badge>
<cu-badge color="warning" variant="subtle">subtle</cu-badge>`,
      checks: {
        l1: [
          {
            name: "combina variant + color",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("span.cu-badge").classes()).toContain(
                `cu-badge--${variant.props?.variant}`,
              );
            },
          },
        ],
      },
    },
  ],
};
