import { h, nextTick } from "vue";
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Modal.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const SIZES = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const HEIGHTS = ["auto", "sm", "md", "lg", "xl", "full"] as const;

interface ModalInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

const instance = (wrapper: { vm: unknown }) => wrapper.vm as unknown as ModalInstance;

async function openModal(wrapper: { vm: unknown }) {
  instance(wrapper).open();
  await nextTick();
  await nextTick();
}

export const cuModalStories: ComponentStory = {
  component: "cu-modal",
  vue: Modal,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-font-size-lg",
    "--cu-font-size-sm",
    "--cu-font-weight-bold",
    "--cu-modal-height-auto",
    "--cu-modal-height-full",
    "--cu-modal-height-lg",
    "--cu-modal-height-md",
    "--cu-modal-height-sm",
    "--cu-modal-height-xl",
    "--cu-modal-size-auto",
    "--cu-modal-size-full",
    "--cu-modal-size-lg",
    "--cu-modal-size-md",
    "--cu-modal-size-sm",
    "--cu-modal-size-xl",
    "--cu-radius",
    "--cu-shadow-xl",
    "--cu-space-2xs",
    "--cu-space-lg",
    "--cu-space-md",
    "--cu-space-sm",
    "--modal-color"
  ],
  classes: [
    "cu-modal",
    "cu-modal-backdrop",
    "cu-modal-body",
    "cu-modal-close",
    "cu-modal-description",
    "cu-modal-footer",
    "cu-modal-footer-default",
    "cu-modal-header",
    "cu-modal-header-text",
    "cu-modal-title",
    "cu-modal-title-row"
  ],
  subComponents: [
    {
      "label": "Button",
      "path": "/playground/components/button#style"
    }
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "title",
        "type": "string",
        "default": "",
        "description": "Título del modal"
      },
      {
        "name": "description",
        "type": "string",
        "default": "",
        "description": "Descripción bajo el título"
      },
      {
        "name": "persistent",
        "type": "boolean",
        "default": "false",
        "description": "No cierra con click-afuera ni Escape"
      },
      {
        "name": "size",
        "type": "auto | sm | md | lg | xl | full",
        "default": "auto",
        "description": "auto, sm, md, lg, xl, full"
      },
      {
        "name": "height",
        "type": "auto | sm | md | lg | xl | full",
        "default": "auto",
        "description": "auto, sm, md, lg, xl, full"
      }
    ],
    "slots": [
      {
        "name": "icon",
        "description": "Icono junto al título"
      },
      {
        "name": "default",
        "description": "Contenido del modal"
      },
      {
        "name": "footer",
        "description": "Acciones del footer. Sin slot → botón \"Cerrar\" por defecto (emite cancel/accept)"
      }
    ],
    "events": [
      {
        "name": "close",
        "type": "() => void",
        "description": "El modal pide cerrarse (backdrop, Escape o botón)"
      },
      {
        "name": "opened",
        "type": "() => void",
        "description": "El modal se abrió"
      },
      {
        "name": "closed",
        "type": "() => void",
        "description": "El modal se cerró"
      },
      {
        "name": "cancel",
        "type": "() => void",
        "description": "Botón Cancelar del footer por defecto"
      },
      {
        "name": "accept",
        "type": "() => void",
        "description": "Botón Aceptar del footer por defecto"
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void"
      },
      {
        "name": "close()",
        "type": "() => void"
      },
      {
        "name": "toggle()",
        "type": "() => void"
      },
      {
        "name": "isOpen()",
        "type": "() => void"
      },
      {
        "name": "open",
        "type": "() => void",
        "description": "Abre el modal"
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Cierra el modal"
      },
      {
        "name": "toggle",
        "type": "() => void",
        "description": "Abre/cierra el modal"
      },
      {
        "name": "isOpen",
        "type": "() => boolean",
        "description": "Estado del modal"
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: {
            title: "Default Modal",
            description: "This is a default modal with neutral color.",
          },
          slots: { default: "Modal content goes here." },
        },
      ],
      vue: `  <Button color="neutral" @click="modalRef?.open()">Open Modal</Button>
  <Modal ref="modalRef" title="Default Modal" description="This is a default modal with neutral color.">
    <p>Modal content goes here.</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "cerrado: isOpen=false y el backdrop no es visible",
            run({ wrapper, expect }) {
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.find(".cu-modal-backdrop").isVisible()).toBe(false);
            },
          },
          {
            name: "open() muestra el contenido y emite opened",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              expect(instance(wrapper).isOpen()).toBe(true);
              expect(wrapper.find(".cu-modal-backdrop").isVisible()).toBe(true);
              expect(wrapper.find(".cu-modal-body").text()).toContain("Modal content goes here.");
              expect(wrapper.emitted("opened")).toBeTruthy();
            },
          },
          {
            name: "el botón X cierra y emite closed + close",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              await wrapper.find(".cu-modal-close").trigger("click");
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.emitted("closed")).toBeTruthy();
              expect(wrapper.emitted("close")).toBeTruthy();
            },
          },
          {
            name: "renderiza title, description y data-size",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-modal-title").text()).toBe("Default Modal");
              expect(wrapper.find(".cu-modal-description").text()).toBe(
                "This is a default modal with neutral color.",
              );
              expect(wrapper.find(".cu-modal").attributes("data-size")).toBe("auto");
            },
          },
        ],
      },
    },

    {
      id: "default-footer",
      title: "Default Footer",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { title: "Default Footer", description: "No footer slot provided." },
          slots: { default: "Default footer modal." },
        },
      ],
      vue: `  <Modal ref="modalRef" title="Default Footer" description="No footer slot provided.">
    <p>Default footer modal.</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "footer por defecto: Cerrar emite close",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              const cerrar = wrapper.findAll("button.cu-button").find((b) => b.text() === "Cerrar");
              expect(cerrar).toBeTruthy();
              await cerrar!.trigger("click");
              await nextTick();
              expect(instance(wrapper).isOpen()).toBe(false);
              expect(wrapper.emitted("close")).toBeTruthy();
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
        props: { color, title: `${color} Modal` },
        slots: { default: `The title uses the ${color} color token.` },
      })),
      vue: `  <Modal v-for="color in colors" :key="color" :color="color" :title="color + ' Modal'">
    <p>The title uses the color token.</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-modal").attributes("style")).toContain(
                `var(--cu-color-${color}`,
              );
            },
          },
          {
            name: "abre mostrando el title",
            async run({ wrapper, expect }, variant) {
              await openModal(wrapper);
              expect(wrapper.find(".cu-modal-title").text()).toBe(`${variant.props?.color} Modal`);
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "With Icon",
      layout: "col",
      variants: [
        {
          id: "success",
          props: { color: "success", title: "Success" },
          slots: {
            icon: () => h("span", { class: "modal-icon-test" }, "★"),
            default: "The operation completed successfully.",
            footer: () =>
              h(Button, { color: "success", variant: "solid" }, () => "OK"),
          },
        },
      ],
      vue: `  <Modal color="success" title="Success" ref="modalRef">
    <template #icon><span>★</span></template>
    <p>The operation completed successfully.</p>
    <template #footer>
      <Button color="success" variant="solid" @click="modalRef?.close()">OK</Button>
    </template>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "renderiza los slots icon y footer",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              expect(wrapper.find(".modal-icon-test").text()).toBe("★");
              const ok = wrapper.findAll("button.cu-button").find((b) => b.text() === "OK");
              expect(ok).toBeTruthy();
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "auto",
      layout: "col",
      variants: SIZES.map((size) => ({
        id: size,
        props: { size, title: `Size: ${size}` },
        slots: { default: `This modal has size ${size}.` },
      })),
      vue: `  <Modal v-for="size in sizes" :key="size" :size="size" :title="'Size: ' + size">
    <p>This modal has size.</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "aplica data-size",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-modal").attributes("data-size")).toBe(variant.props?.size);
            },
          },
        ],
      },
    },

    {
      id: "heights",
      title: "Heights",
      badge: "auto",
      layout: "col",
      variants: HEIGHTS.map((height) => ({
        id: height,
        props: { height, title: `Height: ${height}` },
        slots: { default: `This modal has height ${height}.` },
      })),
      vue: `  <Modal v-for="height in heights" :key="height" :height="height" :title="'Height: ' + height">
    <div style="min-height: 400px;"><p>This modal has height.</p></div>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "aplica data-height",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-modal").attributes("data-height")).toBe(variant.props?.height);
            },
          },
        ],
      },
    },

    {
      id: "persistent",
      title: "Persistent",
      badge: "false",
      layout: "col",
      variants: [
        {
          id: "v1",
          props: { title: "Persistent Modal", persistent: true, description: "Cannot be closed." },
          slots: { default: "Try clicking the backdrop — it won't close." },
        },
      ],
      vue: `  <Modal ref="modalRef" title="Persistent Modal" persistent description="Cannot be closed.">
    <p>Try clicking the backdrop — it won't close.</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "persistent: no hay X y muestra Aceptar/Cancelar",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              expect(wrapper.find(".cu-modal-close").exists()).toBe(false);
              const texts = wrapper.findAll("button.cu-button").map((b) => b.text());
              expect(texts).toContain("Aceptar");
              expect(texts).toContain("Cancelar");
            },
          },
          {
            name: "Aceptar emite accept y cierra",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              const aceptar = wrapper.findAll("button.cu-button").find((b) => b.text() === "Aceptar")!;
              await aceptar.trigger("click");
              await nextTick();
              expect(wrapper.emitted("accept")).toBeTruthy();
              expect(instance(wrapper).isOpen()).toBe(false);
            },
          },
          {
            name: "Cancelar emite cancel y cierra",
            async run({ wrapper, expect }) {
              await openModal(wrapper);
              const cancelar = wrapper.findAll("button.cu-button").find((b) => b.text() === "Cancelar")!;
              await cancelar.trigger("click");
              await nextTick();
              expect(wrapper.emitted("cancel")).toBeTruthy();
              expect(instance(wrapper).isOpen()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "persistent-default-footer",
      title: "Persistent Default Footer",
      layout: "col",
      variants: [
        {
          id: "danger",
          props: {
            title: "Delete Item",
            persistent: true,
            color: "danger",
            description: "This action cannot be undone.",
          },
          slots: { default: "Are you sure you want to delete this item?" },
        },
      ],
      vue: `  <Modal ref="modalRef" title="Delete Item" persistent color="danger" description="This action cannot be undone." @cancel="..." @accept="...">
    <p>Are you sure you want to delete this item?</p>
  </Modal>`,
      checks: {
        l1: [
          {
            name: "resuelve el color danger como token CSS",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-modal").attributes("style")).toContain("var(--cu-color-danger");
              expect(wrapper.find(".cu-modal").attributes("data-size")).toBe("auto");
            },
          },
        ],
      },
    },
  ],
};
