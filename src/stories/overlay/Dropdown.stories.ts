import { h, nextTick } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory, SlotContent } from "@/stories/types";
import { extras } from "./Dropdown.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["solid", "soft", "ghost", "outlined", "subtle"] as const;

interface DropdownInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  get: () => string;
  set: (value: string) => void;
  reset: () => void;
  isOpen: () => boolean;
}

const instance = (wrapper: { vm: unknown }) => wrapper.vm as unknown as DropdownInstance;

const item = () => h(Button, { variant: "ghost" }, () => "Action");

async function openDropdown(wrapper: { find: (s: string) => { trigger: (e: string) => Promise<void> } }) {
  await wrapper.find("button").trigger("click");
  await nextTick();
}

export const cuDropdownStories: ComponentStory = {
  component: "cu-dropdown",
  vue: Dropdown,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-popover-min-width",
    "--cu-popover-width",
    "--cu-radius-sm",
    "--cu-space-2xs",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-dropdown",
    "cu-dropdown--nested",
    "cu-dropdown-menu-divider",
    "cu-dropdown-menu-item",
    "cu-dropdown-menu-item--disabled",
    "cu-dropdown-menu-item-chevron",
    "cu-dropdown-menu-item-icon",
    "cu-dropdown-menu-item-label",
    "cu-dropdown-panel--loading",
    "cu-dropdown-panel--nested",
    "cu-popover"
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Loader",
        "path": "/playground/components/loader"
      },
      {
        "label": "Popover",
        "path": "/playground/components/popover"
      }
    ],
    "props": [
      {
        "name": "modelValue",
        "type": "string",
        "description": "Valor seleccionado (v-model)."
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle | link | none",
        "default": "ghost",
        "description": "solid, outlined, soft, ghost, subtle, link, none"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita el trigger"
      },
      {
        "name": "label",
        "type": "string",
        "default": "",
        "description": "Texto del trigger (si no hay slot #toggle)"
      },
      {
        "name": "icon",
        "type": "string",
        "default": "",
        "description": "Ícono del trigger (SVG/HTML)."
      },
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
        "description": "Separación del panel (px)"
      },
      {
        "name": "fixed",
        "type": "boolean",
        "default": "false",
        "description": "Panel position: fixed (viewport, via getBoundingClientRect)"
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "description": "Estado de carga del trigger"
      },
      {
        "name": "cooldown",
        "type": "boolean",
        "default": "false",
        "description": "Cooldown tras cerrar el panel"
      },
      {
        "name": "cooldownKey",
        "type": "number",
        "default": "0",
        "description": "Key para reiniciar el cooldown"
      },
      {
        "name": "delay",
        "type": "number",
        "default": "2000",
        "description": "Duración del cooldown (ms)"
      },
      {
        "name": "panelWidth",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "Ancho del panel (CSS, ej: \\\\\\\\\\\\\\\"280px\\\\\\\\\\\\\\\"). Vacío = 100% del trigger"
      }
    ],
    "slots": [
      {
        "name": "toggle",
        "description": "Trigger custom (scoped: toggle, isOpen)"
      },
      {
        "name": "default",
        "description": "Contenido del panel (cualquier cosa: items, form, calendario…)"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "(value) => void",
        "description": "Valor seleccionado (v-model)."
      },
      {
        "name": "open",
        "type": "() => void",
        "description": "Abre el panel."
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Cierra el panel."
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void",
        "description": "Abre el panel."
      },
      {
        "name": "close()",
        "type": "() => void",
        "description": "Cierra el panel."
      },
      {
        "name": "toggle()",
        "type": "() => void",
        "description": "Alterna la visibilidad del panel."
      },
      {
        "name": "get()",
        "type": "() => void",
        "description": "Devuelve el valor seleccionado."
      },
      {
        "name": "set()",
        "type": "() => void",
        "description": "Setea el valor seleccionado."
      },
      {
        "name": "reset()",
        "type": "() => void",
        "description": "Limpia el valor seleccionado."
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Devuelve true si el panel está abierto."
      }
    ],
    "interfaceCode": `export interface DropdownMenuItem {
    label?: string;
    to?: string;
    href?: string;
    icon?: string;
    disabled?: boolean;
    divider?: boolean;
    onClick?: () => void;
  }`
  },
  extras,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "ghost",
      layout: "col",
      variants: [
        { id: "default", slots: { default: item } },
        ...VARIANTS.map((variant) => ({
          id: variant,
          props: { label: variant, variant },
          slots: { default: item },
        })),
      ],
      vue: `  <Dropdown>
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Solid" variant="solid">
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Soft" variant="soft">
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Ghost" variant="ghost">
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Outlined" variant="outlined">
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Subtle" variant="subtle">
    <Button variant="ghost">Action</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "render smoke: toggle por defecto y panel cerrado",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "default") return;
              expect(wrapper.find(".cu-dropdown").exists()).toBe(true);
              expect(wrapper.find("button").text()).toContain("Dropdown");
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              expect(wrapper.find('[role="menu"]').exists()).toBe(false);
              expect(instance(wrapper).isOpen()).toBe(false);
            },
          },
          {
            name: "muestra el label en el toggle",
            run({ wrapper, expect }, variant) {
              const label = (variant.props?.label as string) ?? "Dropdown";
              expect(wrapper.find("button").text()).toContain(label);
            },
          },
          {
            name: "aplica la variante al toggle",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-button").classes()).toContain(`cu-button--${value}`);
            },
          },
          {
            name: "click en el toggle abre el panel con el item y emite open",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "default") return;
              await openDropdown(wrapper);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              expect(wrapper.find('[role="menu"]').exists()).toBe(true);
              expect(instance(wrapper).isOpen()).toBe(true);
              expect(wrapper.emitted("open")).toBeTruthy();
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      layout: "col",
      variants: COLORS.map((color) => ({
        id: color,
        props: { color, label: color },
        slots: { default: item },
      })),
      vue: `  <Dropdown color="primary" label="Primary">
    <Button variant="ghost">Action</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }) {
              expect(wrapper.html()).toContain("var(--cu-color-");
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Posiciones — todas las combinaciones",
      badge: "bottom + start",
      layout: "col",
      variants: [
        { id: "bottom-start", props: { label: "Default" }, slots: { default: item } },
        { id: "bottom-center", props: { label: "Bottom center", position: "bottom", align: "center" }, slots: { default: item } },
        { id: "bottom-end", props: { label: "Bottom end", position: "bottom", align: "end" }, slots: { default: item } },
        { id: "top-start", props: { label: "Top start", position: "top", align: "start" }, slots: { default: item } },
        { id: "top-center", props: { label: "Top center", position: "top", align: "center" }, slots: { default: item } },
        { id: "top-end", props: { label: "Top end", position: "top", align: "end" }, slots: { default: item } },
        { id: "right-start", props: { label: "Right start", position: "right", align: "start" }, slots: { default: item } },
        { id: "right-center", props: { label: "Right center", position: "right", align: "center" }, slots: { default: item } },
        { id: "right-end", props: { label: "Right end", position: "right", align: "end" }, slots: { default: item } },
        { id: "left-start", props: { label: "Left start", position: "left", align: "start" }, slots: { default: item } },
        { id: "left-center", props: { label: "Left center", position: "left", align: "center" }, slots: { default: item } },
        { id: "left-end", props: { label: "Left end", position: "left", align: "end" }, slots: { default: item } },
      ],
      vue: `  <!-- position: bottom | top | left | right — align: start | center | end -->
  <Dropdown label="Default">
    <Button variant="ghost">Action</Button>
  </Dropdown>
  <Dropdown label="Bottom + start" position="bottom" align="start">
    <Button variant="ghost">Action</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "posiciona el panel según position/align",
            async run({ wrapper, expect }, variant) {
              await openDropdown(wrapper);
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              const position = (variant.props?.position as string) ?? "bottom";
              const align = (variant.props?.align as string) ?? "start";
              if (position === "bottom") expect(style).toContain("top: 100%");
              else if (position === "top") expect(style).toContain("bottom: 100%");
              else if (position === "right") expect(style).toContain("left: 100%");
              else if (position === "left") expect(style).toContain("right: 100%");
              if (position === "bottom" || position === "top") {
                if (align === "start") expect(style).toContain("left: 0");
                else if (align === "end") expect(style).toContain("right: 0");
                else expect(style).toContain("translateX(-50%)");
              } else {
                if (align === "start") expect(style).toContain("top: 0");
                else if (align === "end") expect(style).toContain("bottom: 0");
                else expect(style).toContain("translateY(-50%)");
              }
            },
          },
        ],
      },
    },

    {
      id: "container",
      title: "Dropdown como contenedor",
      layout: "col",
      variants: [
        {
          id: "form",
          props: { label: "Form en el panel", panelWidth: "240px" },
          slots: { default: () => h("div", { class: "container-slot" }, "Crear acceso") },
        },
      ],
      vue: `  <Dropdown label="Form en el panel" panel-width="240px">
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <strong>Crear acceso</strong>
      <Button variant="soft" color="primary">Crear</Button>
    </div>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "renderiza contenido arbitrario en el panel",
            async run({ wrapper, expect }) {
              await openDropdown(wrapper);
              const panel = wrapper.find(".cu-dropdown-panel");
              expect(panel.find(".container-slot").text()).toContain("Crear acceso");
              expect(panel.attributes("style")).toContain("width: 240px");
            },
          },
        ],
      },
    },

    {
      id: "custom-toggle",
      title: "Custom toggle (slot #toggle)",
      layout: "col",
      variants: [
        {
          id: "v1",
          slots: {
            toggle: (({ toggle }: { toggle: () => void }) =>
              h(Button, { variant: "outlined", color: "primary", onClick: toggle, id: "custom-toggle" }, () => "Menú")) as unknown as SlotContent,
            default: item,
          },
        },
      ],
      vue: `<Dropdown>
    <template #toggle="{ toggle, isOpen }">
      <Button variant="outlined" color="primary" @click="toggle">
        <span>☰ Menú</span>
        <span>{{ isOpen ? '▲' : '▼' }}</span>
      </Button>
    </template>
    <Button variant="ghost">Perfil</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "el slot #toggle recibe toggle() y controla el panel",
            async run({ wrapper, expect }) {
              await wrapper.find("#custom-toggle").trigger("click");
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "fixed",
      title: "Fixed Position",
      badge: "false",
      layout: "col",
      variants: [
        { id: "bottom-start", props: { label: "Bottom fixed", fixed: true }, slots: { default: item } },
        { id: "top-center", props: { label: "Top fixed", position: "top", align: "center", fixed: true }, slots: { default: item } },
        { id: "left-center", props: { label: "Left fixed", position: "left", align: "center", fixed: true }, slots: { default: item } },
      ],
      vue: `  <Dropdown label="Bottom fixed" fixed>
    <Button variant="ghost">Action</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "fixed posiciona el panel con position: fixed",
            async run({ wrapper, expect }) {
              const el = wrapper.find(".cu-dropdown").element as HTMLElement;
              el.getBoundingClientRect = () =>
                ({ left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220, x: 400, y: 200, toJSON: () => ({}) }) as DOMRect;
              await openDropdown(wrapper);
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              expect(style).toContain("position: fixed");
            },
          },
          {
            name: "fixed + top/center: panel debajo del trigger y centrado",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "top-center") return;
              const el = wrapper.find(".cu-dropdown").element as HTMLElement;
              el.getBoundingClientRect = () =>
                ({ left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220, x: 400, y: 200, toJSON: () => ({}) }) as DOMRect;
              await openDropdown(wrapper);
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              expect(style).toContain("bottom: 572px");
              expect(style).not.toContain("top: 196px");
              expect(style).toContain("left: 420px");
              expect(style).toContain("translateX(-50%)");
            },
          },
          {
            name: "fixed: al scrollear re-posiciona el panel",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "bottom-start") return;
              const el = wrapper.find(".cu-dropdown").element as HTMLElement;
              let rect = { left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220 } as DOMRect;
              el.getBoundingClientRect = () => rect;
              await openDropdown(wrapper);
              expect(wrapper.find(".cu-dropdown-panel").attributes("style") ?? "").toContain("top: 224px");
              rect = { left: 400, width: 40, top: 150, height: 20, right: 440, bottom: 170 } as DOMRect;
              document.dispatchEvent(new Event("scroll"));
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").attributes("style") ?? "").toContain("top: 174px");
            },
          },
        ],
      },
    },

    {
      id: "events",
      title: "Eventos y v-model",
      layout: "col",
      variants: [
        { id: "v1", props: { label: "Eventos", modelValue: "inicial" }, slots: { default: item } },
      ],
      vue: `<Dropdown label="Eventos" @open="..." @close="...">
    <Button variant="ghost">Action</Button>
  </Dropdown>`,
      checks: {
        l1: [
          {
            name: "segundo click cierra el panel y emite close",
            async run({ wrapper, expect }) {
              await openDropdown(wrapper);
              await wrapper.find("button").trigger("click");
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.emitted("close")).toBeTruthy();
            },
          },
          {
            name: "Escape cierra el panel abierto y emite close",
            async run({ wrapper, expect }) {
              await openDropdown(wrapper);
              expect(instance(wrapper).isOpen()).toBe(true);
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              expect(wrapper.emitted("close")).toBeTruthy();
            },
          },
          {
            name: "v-model: get/set sobre selectedValue emite update:modelValue",
            run({ wrapper, expect }) {
              expect(instance(wrapper).get()).toBe("inicial");
              instance(wrapper).set("nuevo");
              const em = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(em?.[0]?.[0]).toBe("nuevo");
            },
          },
          {
            name: "click-outside + toggle() externo en el MISMO click: no reabre",
            async run({ wrapper, expect }) {
              await openDropdown(wrapper);
              const external = document.createElement("button");
              external.addEventListener("click", () => instance(wrapper).toggle());
              document.body.appendChild(external);
              external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(false);
              external.remove();
            },
          },
          {
            name: "toggle() externo con panel cerrado SÍ abre",
            async run({ wrapper, expect }) {
              const external = document.createElement("button");
              external.addEventListener("click", () => instance(wrapper).toggle());
              document.body.appendChild(external);
              external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(true);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              external.remove();
            },
          },
          {
            name: "click dentro del panel no lo cierra y los items se renderizan",
            async run({ wrapper, expect }) {
              await openDropdown(wrapper);
              const panelButton = wrapper.find(".cu-dropdown-panel button");
              expect(panelButton.exists()).toBe(true);
              await panelButton.trigger("click");
              expect(instance(wrapper).isOpen()).toBe(true);
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
        { id: "v1", props: { label: "Disabled", disabled: true }, slots: { default: item } },
      ],
      vue: `  <Dropdown label="Disabled" disabled />`,
      checks: {
        l1: [
          {
            name: "disabled: el click no abre el panel ni emite open",
            async run({ wrapper, expect }) {
              await wrapper.find("button").trigger("click");
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              expect(wrapper.emitted("open")).toBeUndefined();
            },
          },
        ],
      },
    },
  ],
};
