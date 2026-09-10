import { h, nextTick } from "vue";
import type { VNodeChild } from "vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
import type { ComponentStory, L1Context } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const POSITIONS = ["top", "bottom", "left", "right"] as const;

type Position = (typeof POSITIONS)[number];

const POSITION_TEXT: Record<Position, string> = {
  top: "Arriba",
  bottom: "Abajo",
  left: "Izquierda",
  right: "Derecha",
};

const POSITION_STYLE: Record<Position, string[]> = {
  top: ["bottom: 100%", "margin-bottom: 6px", "translateX(-50%)"],
  bottom: ["top: 100%", "margin-top: 6px", "translateX(-50%)"],
  left: ["right: 100%", "margin-right: 6px", "translateY(-50%)"],
  right: ["left: 100%", "margin-left: 6px", "translateY(-50%)"],
};

const VUE_IMPORT = `<script setup>
import Tooltip from '@/components/overlay/Tooltip.vue'
import Button from '@/components/buttons/Button.vue'
<\/script>`;

const vueSnippet = (body: string) => `${VUE_IMPORT}

<template>
${body}
</template>`;

const contentSlot = (): VNodeChild => [
  h("strong", "Contenido custom"),
  h("br"),
  "Con varias líneas.",
];

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function hover(ctx: L1Context, ms = 240): Promise<void> {
  await ctx.wrapper.find(".cu-tooltip").trigger("mouseenter");
  await wait(ms);
  await nextTick();
}

export const cuTooltipStories: ComponentStory = {
  component: "cu-tooltip",
  vue: Tooltip,
  tokens: [
    '--cu-color-neutral',
    '--cu-color-neutral-text',
    '--cu-font-size-xs',
    '--cu-radius-sm',
    '--cu-shadow-md',
    '--cu-space-xs',
    '--cu-space-sm',
  ],
  api: {
    components: [
      { label: 'Popover', path: '/playground/components/popover' },
    ],
    props: [
      { name: 'text', type: 'string', default: '""', description: 'Texto del tooltip. El slot #content tiene prioridad' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'position', type: 'string', default: '"top"', description: 'bottom, top, left, right' },
      { name: 'align', type: 'string', default: '"center"', description: 'start, center, end' },
      { name: 'offset', type: 'number', default: '6', description: 'Distancia del tooltip al trigger (px)' },
      { name: 'delay', type: 'number', default: '200', description: 'Delay en ms hasta mostrar el tooltip' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'No muestra el tooltip' },
    ],
    slots: [
      { name: 'default', description: 'Trigger del tooltip (se le hace hover)' },
      { name: 'content', description: 'Contenido custom del tooltip. Si no se usa, se muestra la prop text' },
    ],
  },
  sections: [
    {
      id: "text",
      title: "Text",
      badge: 'position="top"',
      badgeTitle: "Posición por defecto",
      layout: "row",
      variants: [
        { id: "text", props: { text: "Guardar cambios" }, slots: { default: "Hover me" } },
      ],
      vue: vueSnippet(`  <Tooltip text="Guardar cambios">
    <Button>Hover me</Button>
  </Tooltip>`),
      vanilla: `<script src="CuTooltip.umd.js"><\/script>

<cu-tooltip text="Guardar cambios">
  <button>Hover me</button>
</cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-tooltip con el trigger del slot",
            run({ wrapper, expect }, variant) {
              const root = wrapper.find(".cu-tooltip");
              expect(root.exists()).toBe(true);
              expect(root.text()).toContain(String(variant.slots?.default));
            },
          },
          {
            name: "sin hover el panel no se renderiza",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: 'hover abre el panel role="tooltip" con el text',
            async run(ctx) {
              await hover(ctx);
              const panel = ctx.wrapper.find(".cu-popover-panel");
              ctx.expect(panel.exists()).toBe(true);
              ctx.expect(panel.classes()).toContain("cu-tooltip-panel");
              ctx.expect(panel.attributes("role")).toBe("tooltip");
              ctx.expect(panel.text()).toContain(String(ctx.variant.props?.text));
            },
          },
        ],
      },
    },

    {
      id: "content",
      title: "Content Slot",
      badge: "#content",
      badgeTitle: "Contenido custom del tooltip",
      layout: "row",
      variants: [
        {
          id: "custom",
          props: { text: "Fallback ignorado" },
          slots: { default: "Hover me", content: contentSlot },
        },
      ],
      vue: vueSnippet(`  <Tooltip>
    <Button>Hover me</Button>
    <template #content>
      <strong>Contenido custom</strong>
      <br />
      Con varias líneas.
    </template>
  </Tooltip>`),
      vanilla: `<cu-tooltip>
  <button>Hover me</button>
  <span slot="content">
    <strong>Contenido custom</strong><br />
    Con varias líneas.
  </span>
</cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "sin hover el panel no se renderiza",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: "hover muestra el slot #content y no el text de fallback",
            async run(ctx) {
              await hover(ctx);
              const panel = ctx.wrapper.find(".cu-popover-panel");
              ctx.expect(panel.exists()).toBe(true);
              ctx.expect(panel.find("strong").exists()).toBe(true);
              ctx.expect(panel.text()).toContain("Contenido custom");
              ctx.expect(panel.text()).toContain("Con varias líneas.");
              ctx.expect(panel.text()).not.toContain("Fallback ignorado");
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Positions",
      badge: 'position="top"',
      badgeTitle: "Posición por defecto",
      layout: "row",
      variants: POSITIONS.map((position) => ({
        id: position,
        props: { text: POSITION_TEXT[position], position },
        slots: { default: POSITION_TEXT[position] },
      })),
      vue: vueSnippet(`  <Tooltip text="Arriba" position="top"><Button>Top</Button></Tooltip>
  <Tooltip text="Abajo" position="bottom"><Button>Bottom</Button></Tooltip>
  <Tooltip text="Izquierda" position="left"><Button>Left</Button></Tooltip>
  <Tooltip text="Derecha" position="right"><Button>Right</Button></Tooltip>`),
      vanilla: `<cu-tooltip text="Arriba" position="top"><button>Top</button></cu-tooltip>
<cu-tooltip text="Abajo" position="bottom"><button>Bottom</button></cu-tooltip>
<cu-tooltip text="Izquierda" position="left"><button>Left</button></cu-tooltip>
<cu-tooltip text="Derecha" position="right"><button>Right</button></cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "sin hover el panel no se renderiza",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: "hover aplica la posición, el offset y el align center",
            async run(ctx) {
              await hover(ctx);
              const position = ctx.variant.props?.position as Position;
              const panel = ctx.wrapper.find(".cu-popover-panel");
              ctx.expect(panel.exists()).toBe(true);
              const style = panel.attributes("style") ?? "";
              for (const fragment of POSITION_STYLE[position]) {
                ctx.expect(style).toContain(fragment);
              }
            },
          },
        ],
      },
    },

    {
      id: "delay",
      title: "Delay",
      badge: "200",
      badgeTitle: "Valor por defecto",
      layout: "row",
      variants: [
        { id: "fast", props: { text: "Aparece rápido", delay: 50 }, slots: { default: "50ms" } },
        { id: "slow", props: { text: "Aparece lento", delay: 1000 }, slots: { default: "1000ms" } },
      ],
      vue: vueSnippet(`  <Tooltip text="Aparece rápido" :delay="50"><Button>50ms</Button></Tooltip>
  <Tooltip text="Aparece lento" :delay="1000"><Button>1000ms</Button></Tooltip>`),
      vanilla: `<cu-tooltip text="Aparece rápido" delay="50"><button>50ms</button></cu-tooltip>
<cu-tooltip text="Aparece lento" delay="1000"><button>1000ms</button></cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "no abre de inmediato: respeta el delay",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-tooltip").trigger("mouseenter");
              await nextTick();
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: "abre después del delay configurado",
            async run(ctx) {
              const delay = (ctx.variant.props?.delay as number) ?? 200;
              await hover(ctx, delay + 60);
              const panel = ctx.wrapper.find(".cu-popover-panel");
              ctx.expect(panel.exists()).toBe(true);
              ctx.expect(panel.text()).toContain(String(ctx.variant.props?.text));
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Valor por defecto",
      layout: "row",
      variants: COLORS.map((color) => ({
        id: color,
        props: { color, text: `${color.charAt(0).toUpperCase()}${color.slice(1)}` },
        slots: { default: `${color.charAt(0).toUpperCase()}${color.slice(1)}` },
      })),
      vue: vueSnippet(`  <Tooltip color="primary" text="Primary"><Button>Primary</Button></Tooltip>
  <Tooltip color="secondary" text="Secondary"><Button>Secondary</Button></Tooltip>
  <Tooltip color="neutral" text="Neutral"><Button>Neutral</Button></Tooltip>
  <Tooltip color="success" text="Success"><Button>Success</Button></Tooltip>
  <Tooltip color="warning" text="Warning"><Button>Warning</Button></Tooltip>
  <Tooltip color="danger" text="Danger"><Button>Danger</Button></Tooltip>`),
      vanilla: `<cu-tooltip color="primary" text="Primary"><button>Primary</button></cu-tooltip>
<cu-tooltip color="secondary" text="Secondary"><button>Secondary</button></cu-tooltip>
<cu-tooltip color="neutral" text="Neutral"><button>Neutral</button></cu-tooltip>
<cu-tooltip color="success" text="Success"><button>Success</button></cu-tooltip>
<cu-tooltip color="warning" text="Warning"><button>Warning</button></cu-tooltip>
<cu-tooltip color="danger" text="Danger"><button>Danger</button></cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "resuelve --cu-popover-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              const style = wrapper.find(".cu-tooltip").attributes("style") ?? "";
              expect(style).toContain(`--cu-popover-bg: var(--cu-color-${color})`);
            },
          },
          {
            name: "renderiza el trigger del slot",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-tooltip").text()).toContain(String(variant.slots?.default));
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
      variants: [
        { id: "enabled", props: { text: "Tooltip activo" }, slots: { default: "Hover me" } },
        {
          id: "disabled",
          props: { text: "No debería aparecer", disabled: true },
          slots: { default: "Disabled" },
        },
      ],
      vue: vueSnippet(`  <Tooltip text="Tooltip activo"><Button>Hover me</Button></Tooltip>
  <Tooltip text="No debería aparecer" disabled><Button>Disabled</Button></Tooltip>`),
      vanilla: `<cu-tooltip text="Tooltip activo"><button>Hover me</button></cu-tooltip>
<cu-tooltip text="No debería aparecer" disabled><button>Disabled</button></cu-tooltip>`,
      checks: {
        l1: [
          {
            name: "sin hover el panel está cerrado",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: "hover abre solo cuando disabled=false",
            async run(ctx) {
              const disabled = ctx.variant.props?.disabled === true;
              await hover(ctx);
              ctx.expect(ctx.wrapper.find(".cu-popover-panel").exists()).toBe(!disabled);
            },
          },
        ],
      },
    },
  ],
};
