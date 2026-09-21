import Blockquote from "@/components/markdown/Blockquote.vue";
import type { ComponentStory } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

export const cuBlockquoteStories: ComponentStory = {
  component: "cu-blockquote",
  vue: Blockquote,
  tokens: [
    "--cu-border-thick",
    "--cu-color-danger",
    "--cu-color-neutral",
    "--cu-color-neutral-text",
    "--cu-color-primary",
    "--cu-color-secondary",
    "--cu-color-success",
    "--cu-color-warning",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-blockquote",
    "cu-blockquote--danger",
    "cu-blockquote--neutral",
    "cu-blockquote--primary",
    "cu-blockquote--secondary",
    "cu-blockquote--success",
    "cu-blockquote--warning",
    "cu-blockquote-content"
  ],
  api: {
    "props": [
      {
        "name": "color",
        "type": "string",
        "default": "primary",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "html",
        "type": "string",
        "default": "",
        "description": "Contenido HTML de la cita. Si se omite, usa el slot default"
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Contenido de la cita cuando no se pasa html"
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "primary",
      layout: "col",
      variants: [
        {
          id: "default",
          props: { html: "<p>Esta es una cita importante con estilo por defecto.</p>" },
        },
      ],
      vue: `  <Blockquote html="<p>Esta es una cita importante con estilo por defecto.</p>" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-blockquote con el html",
            run({ wrapper, expect }) {
              expect(wrapper.find("blockquote.cu-blockquote").exists()).toBe(true);
              expect(wrapper.find(".cu-blockquote-content").exists()).toBe(true);
              expect(wrapper.text()).toContain("Esta es una cita importante con estilo por defecto.");
            },
          },
          {
            name: "usa primary como color por defecto",
            run({ wrapper, expect }) {
              expect(wrapper.find("blockquote.cu-blockquote").classes()).toContain("cu-blockquote--primary");
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "primary",
      layout: "col",
      variants: COLORS.map((color) => ({
        id: color,
        props: { color, html: `<p>Cita con color ${color}.</p>` },
      })),
      vue: COLORS.map((c) => `  <Blockquote color="${c}" html="<p>Cita con color ${c}.</p>" />`).join("\n"),
      checks: {
        l1: [
          {
            name: "aplica la clase cu-blockquote--{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find("blockquote.cu-blockquote").classes()).toContain(`cu-blockquote--${color}`);
            },
          },
        ],
      },
    },

    {
      id: "con-formato",
      title: "Con formato inline",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { html: "<p>Cita con <strong>negrita</strong> y <em>cursiva</em>.</p><p>Múltiples párrafos soportados.</p>" },
        },
      ],
      vue: `  <Blockquote html="<p>Cita con <strong>negrita</strong> y <em>cursiva</em>.</p><p>Múltiples párrafos soportados.</p>" />`,
      checks: {
        l1: [
          {
            name: "renderiza el formato inline y múltiples párrafos",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-blockquote-content strong").text()).toBe("negrita");
              expect(wrapper.find(".cu-blockquote-content em").text()).toBe("cursiva");
              expect(wrapper.findAll(".cu-blockquote-content p")).toHaveLength(2);
            },
          },
        ],
      },
    },

    {
      id: "slot",
      title: "Con slot (alternativa a html)",
      layout: "col",
      variants: [
        {
          id: "default",
          props: { color: "success" },
          slots: { default: "Cita pasada por slot (alternativa a html)." },
        },
      ],
      vue: `  <Blockquote color="success">
    <p>Cita pasada por slot (alternativa a html).</p>
  </Blockquote>`,
      checks: {
        l1: [
          {
            name: "usa el slot cuando no hay html",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-blockquote-content").exists()).toBe(false);
              expect(wrapper.text()).toContain("Cita pasada por slot (alternativa a html).");
            },
          },
        ],
      },
    },
  ],
};
