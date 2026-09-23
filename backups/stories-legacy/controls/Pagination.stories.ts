import Pagination from "@/components/controls/Pagination.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const BASE = { totalPages: 8, currentPage: 3, totalItems: 80, itemsPerPage: 10 };

// Stub de Select: evita montar el dropdown real (teleport) y permite operar el <select>.
const SelectStub = {
  name: "SelectStub",
  props: ["modelValue", "options"],
  emits: ["select"],
  template: `<select :value="modelValue" @change="$emit('select', { value: $event.target.value })"><option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option></select>`,
};

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { ...BASE, color },
  }));
}

function buttonByText(wrapper: { findAll: (selector: string) => any[] }, text: string) {
  return wrapper.findAll("button").find((button) => button.text().includes(text));
}

export const cuPaginationStories: ComponentStory = {
  component: "cu-pagination",
  vue: Pagination,
  tokens: [
    "--cu-color-neutral-text",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-space-3xl",
    "--cu-space-md",
    "--cu-space-sm",
    "--cu-space-xs"
  ],
  classes: [
    "cu-pagination",
    "cu-pagination-controls",
    "cu-pagination-ellipsis",
    "cu-pagination-info",
    "cu-pagination-label",
    "cu-pagination-page-size",
    "cu-pagination-pages"
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Select",
        "path": "/playground/components/select"
      }
    ],
    "props": [
      {
        "name": "color",
        "type": "string",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "outlined | soft | ghost | subtle | none",
        "default": "soft",
        "description": "outlined, soft, ghost, subtle, none"
      },
      {
        "name": "currentPage",
        "type": "number",
        "default": "1",
        "description": "Página actual (v-model:current-page)"
      },
      {
        "name": "totalPages",
        "type": "number",
        "default": "1",
        "description": "Total de páginas"
      },
      {
        "name": "totalItems",
        "type": "number",
        "default": "0",
        "description": "Total de items (texto \\\\\\\\\\\\\\\"X–Y de Z\\\\\\\\\\\\\\\")"
      },
      {
        "name": "itemsPerPage",
        "type": "number",
        "default": "10",
        "description": "Items por página (v-model:items-per-page)"
      },
      {
        "name": "showPageSize",
        "type": "boolean",
        "default": "false",
        "description": "Muestra el select de items por página"
      },
      {
        "name": "pageSizeOptions",
        "type": "number[]",
        "default": "[5, 10, 20, 50]",
        "description": "Opciones del select de items por página"
      },
      {
        "name": "showFirstAndLast",
        "type": "boolean",
        "default": "false",
        "description": "Fija la primera y la última página en la lista"
      }
    ],
    "events": [
      {
        "name": "update:currentPage",
        "type": "() => void",
        "description": "Cambia la página (v-model:current-page)"
      },
      {
        "name": "update:itemsPerPage",
        "type": "() => void",
        "description": "Cambia items por página (v-model:items-per-page)"
      }
    ]
  },
  global: () => ({ stubs: { Select: SelectStub } }),
  sections: [
    {
      id: "basic",
      title: "Basic",
      variants: [
        { id: "middle", props: { ...BASE } },
        { id: "first", props: { ...BASE, currentPage: 1 } },
        { id: "last", props: { ...BASE, currentPage: 8 } },
        { id: "single", props: { ...BASE, totalPages: 1, currentPage: 1, totalItems: 5 } },
      ],
      vue: `  <Pagination :total-pages="8" :current-page="3" :total-items="80" :items-per-page="10" />`,
      vanilla: `<script src="dist/CuPagination.umd.js"><\/script>

<cu-pagination total-pages="8" current-page="3" total-items="80" items-per-page="10"></cu-pagination>`,
      checks: {
        l1: [
          {
            name: "render smoke: info y botones Anterior/Siguiente/páginas",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "middle") return;
              expect(wrapper.find(".cu-pagination").exists()).toBe(true);
              expect(wrapper.find(".cu-pagination-info").text()).toBe("Mostrando 21 - 30 de 80");
              expect(buttonByText(wrapper, "Anterior")).toBeDefined();
              expect(buttonByText(wrapper, "Siguiente")).toBeDefined();
              expect(buttonByText(wrapper, "3")).toBeDefined();
            },
          },
          {
            name: "click en Siguiente emite update:currentPage + 1",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "middle") return;
              await buttonByText(wrapper, "Siguiente")!.trigger("click");
              const emitted = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(emitted![0]![0]).toBe(4);
            },
          },
          {
            name: "click en Anterior emite update:currentPage - 1",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "middle") return;
              await buttonByText(wrapper, "Anterior")!.trigger("click");
              const emitted = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(emitted![0]![0]).toBe(2);
            },
          },
          {
            name: "click en una página concreta emite esa página",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "middle") return;
              await buttonByText(wrapper, "2")!.trigger("click");
              const emitted = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(emitted![0]![0]).toBe(2);
            },
          },
          {
            name: "Anterior deshabilitado en la primera página y no emite",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "first") return;
              const previous = buttonByText(wrapper, "Anterior")!;
              expect((previous.element as HTMLButtonElement).disabled).toBe(true);
              await previous.trigger("click");
              expect(wrapper.emitted("update:currentPage")).toBeUndefined();
            },
          },
          {
            name: "Siguiente deshabilitado en la última página y no emite",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "last") return;
              const next = buttonByText(wrapper, "Siguiente")!;
              expect((next.element as HTMLButtonElement).disabled).toBe(true);
              await next.trigger("click");
              expect(wrapper.emitted("update:currentPage")).toBeUndefined();
            },
          },
          {
            name: "totalPages 1 sin showPageSize no renderiza nada",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "single") return;
              expect(wrapper.find(".cu-pagination").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Color por defecto",
      variants: colorVariants(),
      vue: `  <Pagination :total-pages="8" :current-page="3" :total-items="80" :items-per-page="10" color="primary" />`,
      vanilla: `<script src="dist/CuPagination.umd.js"><\/script>

<cu-pagination total-pages="8" current-page="3" total-items="80" items-per-page="10" color="primary"></cu-pagination>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              expect(wrapper.html()).toContain(`var(--cu-color-${variant.props?.color}`);
            },
          },
        ],
      },
    },

    {
      id: "page-size",
      title: "Page Size",
      badge: "false",
      badgeTitle: "showPageSize por defecto",
      variants: [{ id: "show", props: { ...BASE, showPageSize: true } }],
      vue: `  <Pagination :total-pages="8" :current-page="3" :total-items="80" :items-per-page="10" show-page-size />`,
      vanilla: `<script src="dist/CuPagination.umd.js"><\/script>

<cu-pagination total-pages="8" current-page="3" total-items="80" items-per-page="10" show-page-size></cu-pagination>`,
      checks: {
        l1: [
          {
            name: "showPageSize: al cambiar el tamaño emite itemsPerPage y resetea a página 1",
            async run({ wrapper, expect }) {
              expect(wrapper.find(".cu-pagination-page-size").exists()).toBe(true);
              const select = wrapper.find("select");
              expect(select.exists()).toBe(true);
              await select.setValue("20");

              const items = wrapper.emitted("update:itemsPerPage") as unknown[][] | undefined;
              expect(items![0]![0]).toBe(20);
              const page = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(page![0]![0]).toBe(1);
            },
          },
        ],
      },
    },

    {
      id: "first-last",
      title: "With First & Last Buttons",
      badge: "false",
      badgeTitle: "showFirstAndLast por defecto",
      variants: [{ id: "show", props: { ...BASE, showFirstAndLast: true } }],
      vue: `  <Pagination :total-pages="8" :current-page="3" :total-items="80" :items-per-page="10" show-first-and-last />`,
      vanilla: `<script src="dist/CuPagination.umd.js"><\/script>

<cu-pagination total-pages="8" current-page="3" total-items="80" items-per-page="10" show-first-and-last></cu-pagination>`,
      checks: {
        l1: [
          {
            name: "muestra siempre la primera y la última página",
            run({ wrapper, expect }) {
              expect(buttonByText(wrapper, "1")).toBeDefined();
              expect(buttonByText(wrapper, "8")).toBeDefined();
            },
          },
          {
            name: "click en la primera página emite update:currentPage 1",
            async run({ wrapper, expect }) {
              await buttonByText(wrapper, "1")!.trigger("click");
              const emitted = wrapper.emitted("update:currentPage") as unknown[][] | undefined;
              expect(emitted![0]![0]).toBe(1);
            },
          },
        ],
      },
    },
  ],
};
