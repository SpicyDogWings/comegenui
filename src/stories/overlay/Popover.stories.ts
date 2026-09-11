import { h, nextTick } from "vue";
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory, SlotContent } from "@/stories/types";
import { extras } from "./Popover.stories.extras";

const toggleSlot = (({ toggle }: { toggle: () => void }) =>
  h(Button, { color: "neutral", onClick: toggle }, () => "Abrir")) as unknown as SlotContent;

export const cuPopoverStories: ComponentStory = {
  component: "cu-popover",
  vue: Popover,
  tokens: [
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-popover-bg",
    "--cu-popover-max-width",
    "--cu-popover-min-width",
    "--cu-popover-width",
    "--cu-radius-md",
    "--cu-shadow-xl",
    "--cu-space-sm"
  ],
  classes: [
    "cu-popover",
    "cu-popover-panel"
  ],
  api: {
    "props": [
      {
        "name": "position",
        "type": "bottom | top | left | right",
        "default": "bottom",
        "description": "bottom, top, left, right"
      },
      {
        "name": "align",
        "type": "start | center | end",
        "default": "start",
        "description": "start, center, end"
      },
      {
        "name": "offset",
        "type": "number",
        "default": "4",
        "description": "Distancia del panel al trigger (px)"
      },
      {
        "name": "fixed",
        "type": "boolean",
        "default": "false",
        "description": "Panel en position:fixed con coordenadas de viewport (sigue al trigger en scroll)"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "No abre ni hace toggle"
      },
      {
        "name": "hoverDelay",
        "type": "number",
        "default": "200",
        "description": "Delay del hover en ms"
      },
      {
        "name": "panelClass",
        "type": "[String",
        "default": "",
        "description": "Clase(s) extra del panel"
      },
      {
        "name": "panelWidth",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "Ancho del panel (CSS). Vacío = width:100% del trigger"
      },
      {
        "name": "hover",
        "type": "boolean",
        "default": "false",
        "description": "Abre con mouseenter, cierra con mouseleave"
      },
      {
        "name": "role",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "role del panel (menu, tooltip, dialog…)"
      }
    ],
    "slots": [
      {
        "name": "toggle",
        "description": "Trigger. Scoped: { toggle, isOpen }. Si no se usa, renderiza el panel sin trigger propio"
      },
      {
        "name": "default",
        "description": "Contenido del panel"
      }
    ],
    "events": [
      {
        "name": "open",
        "type": "() => void",
        "description": "Se abrió el panel"
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Se cerró el panel"
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void",
        "description": "Abre el panel"
      },
      {
        "name": "close()",
        "type": "() => void",
        "description": "Cierra el panel"
      },
      {
        "name": "toggle()",
        "type": "() => void",
        "description": "Alterna abierto/cerrado"
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Estado actual"
      }
    ]
  },
  extras,
  sections: [
    {
      id: "basic",
      title: "Basic",
      badge: 'position="bottom"',
      layout: "col",
      variants: [
        {
          id: "v1",
          slots: { toggle: toggleSlot, default: "Contenido del panel." },
        },
      ],
      vue: `  <Popover>
    <template #toggle="{ toggle }">
      <Button @click="toggle">Abrir</Button>
    </template>
    <p>Contenido del panel.</p>
  </Popover>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-popover sin panel al inicio",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-popover").exists()).toBe(true);
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
          {
            name: "el toggle abre el panel con el contenido",
            async run({ wrapper, expect }) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(true);
              expect(wrapper.find(".cu-popover-panel").text()).toContain("Contenido del panel.");
              expect(wrapper.emitted("open")).toBeTruthy();
            },
          },
          {
            name: "Escape cierra el panel",
            async run({ wrapper, expect }) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              await nextTick();
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
              expect(wrapper.emitted("close")).toBeTruthy();
            },
          },
        ],
      },
    },

    {
      id: "custom-toggle",
      title: "Custom Toggle",
      badge: "#toggle",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { align: "end" },
          slots: { toggle: toggleSlot, default: "Panel alineado al end." },
        },
      ],
      vue: `  <Popover align="end">
    <template #toggle="{ toggle, isOpen }">
      <Input placeholder="Escribí para ver el panel" @focus="toggle" />
    </template>
    <p>Panel abierto desde el focus del input.</p>
  </Popover>`,
      checks: {
        l1: [
          {
            name: "align=end alinea el panel a la derecha (right: 0)",
            async run({ wrapper, expect }) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              const style = wrapper.find(".cu-popover-panel").attributes("style") ?? "";
              expect(style).toContain("right: 0");
            },
          },
          {
            name: "el slot #toggle recibe toggle() e isOpen",
            run({ wrapper, expect }) {
              // El toggle es un Button propio; el slot recibe las funciones.
              expect(wrapper.find("button").exists()).toBe(true);
              expect(wrapper.find("button").text()).toBe("Abrir");
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Positions",
      badge: 'position="bottom"',
      layout: "col",
      variants: [
        { id: "top", props: { position: "top", align: "center", offset: 8 }, slots: { toggle: toggleSlot, default: "Top" } },
        { id: "left", props: { position: "left", offset: 8 }, slots: { toggle: toggleSlot, default: "Left" } },
        { id: "right", props: { position: "right", offset: 8 }, slots: { toggle: toggleSlot, default: "Right" } },
        { id: "bottom-end", props: { position: "bottom", align: "end", offset: 8 }, slots: { toggle: toggleSlot, default: "Bottom end" } },
      ],
      vue: `  <Popover position="top" align="center">
    <template #toggle="{ toggle }"><Button @click="toggle">Top</Button></template>
    <p>Panel arriba centrado.</p>
  </Popover>
  <Popover position="left">
    <template #toggle="{ toggle }"><Button @click="toggle">Left</Button></template>
    <p>Panel a la izquierda.</p>
  </Popover>
  <Popover position="right">
    <template #toggle="{ toggle }"><Button @click="toggle">Right</Button></template>
    <p>Panel a la derecha.</p>
  </Popover>`,
      checks: {
        l1: [
          {
            name: "posiciona el panel según position/align",
            async run({ wrapper, expect }, variant) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              const style = wrapper.find(".cu-popover-panel").attributes("style") ?? "";
              const position = variant.props?.position as string;
              if (position === "top") {
                expect(style).toContain("bottom: 100%");
                expect(style).toContain("margin-bottom: 8px");
              } else if (position === "left") {
                expect(style).toContain("right: 100%");
                expect(style).toContain("margin-right: 8px");
              } else if (position === "right") {
                expect(style).toContain("left: 100%");
                expect(style).toContain("margin-left: 8px");
              } else {
                expect(style).toContain("top: 100%");
                expect(style).toContain("right: 0");
              }
            },
          },
        ],
      },
    },

    {
      id: "fixed",
      title: "Fixed",
      badge: "false",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { fixed: true, position: "top", align: "center", offset: 8 },
          slots: { toggle: toggleSlot, default: "Fixed" },
        },
      ],
      vue: `  <Popover fixed position="top" align="center">
    <template #toggle="{ toggle }"><Button @click="toggle">Fixed</Button></template>
    <p>Panel en fixed: sigue al trigger al scrollear.</p>
  </Popover>`,
      checks: {
        l1: [
          {
            name: "fixed posiciona el panel con position: fixed",
            async run({ wrapper, expect }) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              const style = wrapper.find(".cu-popover-panel").attributes("style") ?? "";
              expect(style).toContain("position: fixed");
              expect(style).toContain("z-index: 10000");
            },
          },
        ],
      },
    },

    {
      id: "hover",
      title: "Hover",
      badge: "false",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { hover: true, hoverDelay: 0, offset: 6, role: "tooltip" },
          slots: { toggle: toggleSlot, default: "Tooltip rápido." },
        },
      ],
      vue: `  <!-- hover: abre con mouseenter, cierra con mouseleave -->
  <Popover hover :offset="6" role="tooltip">
    <template #toggle><Button>Hover me</Button></template>
    <p>Tooltip rápido.</p>
  </Popover>`,
      checks: {
        l1: [
          {
            name: "hover abre el panel con mouseenter",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-popover").trigger("mouseenter");
              await nextTick();
              const panel = wrapper.find(".cu-popover-panel");
              expect(panel.exists()).toBe(true);
              expect(panel.attributes("role")).toBe("tooltip");
              expect(panel.text()).toContain("Tooltip rápido.");
            },
          },
        ],
      },
    },
  ],
};
