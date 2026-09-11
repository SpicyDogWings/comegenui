import MonthSlider from "@/components/controls/MonthSlider.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./MonthSlider.stories.extras";

const VARIANTS = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const monthLong = new Intl.DateTimeFormat("es", { month: "long" }).format(now);
const monthShort = new Intl.DateTimeFormat("es", { month: "short" }).format(now);

export const cuMonthSliderStories: ComponentStory = {
  component: "cu-month-slider",
  vue: MonthSlider,
  tokens: [
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-space-2xs"
  ],
  classes: [
    "cu-month-slider"
  ],
  subComponents: [
    {
      "label": "MonthSliderLabel",
      "path": "/playground/components/month-slider#style"
    }
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "MonthSliderLabel",
        "path": "/playground/components/month-slider-label"
      }
    ],
    "props": [
      {
        "name": "modelValue",
        "type": "[String",
        "default": "null",
        "description": "Valor (v-model)"
      },
      {
        "name": "monthFormat",
        "type": "string",
        "default": "MMMM",
        "description": "Formato del mes (tokens MM MMM MMMM)"
      },
      {
        "name": "yearFormat",
        "type": "string",
        "default": "yyyy",
        "description": "Formato del año (tokens yy yyyy)"
      },
      {
        "name": "locale",
        "type": "string",
        "default": "es",
        "description": "Locale de los nombres"
      },
      {
        "name": "yearNavigation",
        "type": "[Boolean",
        "default": "true",
        "description": "Habilita navegación de años (‹ ‹‹)"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle",
        "default": "soft",
        "description": "solid, outlined, soft, ghost, subtle"
      },
      {
        "name": "min",
        "type": "[String",
        "default": "null",
        "description": "Mes mínimo"
      },
      {
        "name": "max",
        "type": "[String",
        "default": "null",
        "description": "Mes máximo"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "primary",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita el control"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "Al cambiar el mes (v-model)"
      },
      {
        "name": "change",
        "type": "() => void",
        "description": "Al cambiar el mes"
      }
    ],
    "exposes": [
      {
        "name": "nextMonth()",
        "type": "() => void"
      },
      {
        "name": "prevMonth()",
        "type": "() => void"
      },
      {
        "name": "nextYear()",
        "type": "() => void"
      },
      {
        "name": "prevYear()",
        "type": "() => void"
      },
      {
        "name": "goToMonth()",
        "type": "() => void"
      },
      {
        "name": "getValue()",
        "type": "() => void"
      },
      {
        "name": "setValue()",
        "type": "() => void"
      },
      {
        "name": "nextMonth",
        "type": "() => void",
        "description": "Avanza un mes"
      },
      {
        "name": "prevMonth",
        "type": "() => void",
        "description": "Retrocede un mes"
      },
      {
        "name": "nextYear",
        "type": "() => void",
        "description": "Avanza un año"
      },
      {
        "name": "prevYear",
        "type": "() => void",
        "description": "Retrocede un año"
      },
      {
        "name": "goToMonth",
        "type": "(value: string | number | Date) => void",
        "description": "Va al mes indicado"
      },
      {
        "name": "getValue",
        "type": "() => Date | null",
        "description": "Devuelve el valor actual"
      },
      {
        "name": "setValue",
        "type": "(value: string | number | Date) => void",
        "description": "Setea el valor"
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "MMMM",
      layout: "col",
      variants: [
        { id: "v1" },
        { id: "with-value", props: { modelValue: "2025-03-01" } },
      ],
      vue: `  <MonthSlider />
  <MonthSlider model-value="2025-03-01" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-month-slider con el mes actual",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-month-slider").exists()).toBe(true);
              const expected = variant.props?.modelValue ? "marzo" : monthLong;
              expect(wrapper.find(".cu-month-slider-label-month").text().toLowerCase()).toContain(expected);
            },
          },
          {
            name: "click en mes siguiente emite update:modelValue y change (Date)",
            async run({ wrapper, expect }) {
              const buttons = wrapper.findAll("button");
              const nextMonth = buttons.find((b) => b.attributes("aria-label") === "Ir al mes siguiente")!;
              await nextMonth.trigger("click");
              const updated = wrapper.emitted("update:modelValue")?.[0]?.[0];
              expect(updated).toBeInstanceOf(Date);
              expect(wrapper.emitted("change")?.[0]?.[0]).toBeInstanceOf(Date);
            },
          },
        ],
      },
    },

    {
      id: "no-year-nav",
      title: "Sin navegación de año",
      badge: "true",
      layout: "col",
      variants: [
        { id: "with-year-nav", props: { yearNavigation: true } },
        { id: "no-year-nav", props: { yearNavigation: false } },
      ],
      vue: `  <MonthSlider />
  <MonthSlider :year-navigation="false" />`,
      checks: {
        l1: [
          {
            name: "yearNavigation controla los botones de año",
            run({ wrapper, expect }, variant) {
              const buttons = wrapper.findAll("button");
              const hasYearButtons = buttons.some(
                (b) =>
                  b.attributes("aria-label") === "Ir al año anterior" ||
                  b.attributes("aria-label") === "Ir al año siguiente",
              );
              if (variant.props?.yearNavigation === false) {
                expect(hasYearButtons).toBe(false);
                expect(buttons).toHaveLength(2);
              } else {
                expect(hasYearButtons).toBe(true);
                expect(buttons).toHaveLength(4);
              }
            },
          },
        ],
      },
    },

    {
      id: "formats",
      title: "Formatos",
      badge: "MMMM",
      layout: "col",
      variants: [
        { id: "MMMM", props: { monthFormat: "MMMM", modelValue: `${CURRENT_YEAR}-03-01` } },
        { id: "MMM", props: { monthFormat: "MMM", modelValue: `${CURRENT_YEAR}-03-01` } },
        { id: "MMMM-yyyy", props: { monthFormat: "MMMM yyyy", modelValue: `${CURRENT_YEAR}-03-01` } },
        { id: "MM-yyyy", props: { monthFormat: "MM/yyyy", modelValue: `${CURRENT_YEAR}-03-01` } },
        { id: "MMM-yy", props: { monthFormat: "MMM yy", modelValue: `${CURRENT_YEAR}-03-01` } },
      ],
      vue: `  <MonthSlider month-format="MMMM" />
  <MonthSlider month-format="MMM" />
  <MonthSlider month-format="MMMM yyyy" />
  <MonthSlider month-format="MM/yyyy" />
  <MonthSlider month-format="MMM yy" />`,
      checks: {
        l1: [
          {
            name: "formatea según monthFormat",
            run({ wrapper, expect }, variant) {
              const label = wrapper.find(".cu-month-slider-label-month").text().trim();
              const format = variant.props?.monthFormat as string;
              if (format === "MMMM") expect(label.toLowerCase()).toBe("marzo");
              else if (format === "MMM") expect(label.toLowerCase()).toContain("mar");
              else if (format === "MMMM yyyy") expect(label).toBe(`marzo ${CURRENT_YEAR}`);
              else if (format === "MM/yyyy") expect(label).toBe(`03/${CURRENT_YEAR}`);
              else if (format === "MMM yy") expect(label).toMatch(/^mar \d{2}$/);
            },
          },
        ],
      },
    },

    {
      id: "other-year",
      title: "Año distinto al actual",
      layout: "col",
      variants: [
        { id: "v1", props: { modelValue: "2025-03-01" } },
        { id: "v2", props: { modelValue: "2027-11-15", monthFormat: "MMM" } },
        { id: "solid", props: { modelValue: "2025-03-01", variant: "solid" } },
      ],
      vue: `  <MonthSlider model-value="2025-03-01" />
  <MonthSlider model-value="2027-11-15" month-format="MMM" />
  <MonthSlider model-value="2025-03-01" variant="solid" />`,
      checks: {
        l1: [
          {
            name: "muestra el badge del año cuando difiere y no hay token de año",
            run({ wrapper, expect }, variant) {
              if (variant.id === "v2") {
                expect(wrapper.find(".cu-month-slider-label-year").text()).toBe("2027");
                return;
              }
              expect(wrapper.find(".cu-month-slider-label-year").text()).toBe("2025");
            },
          },
          {
            name: "aplica la clase cu-month-slider-label--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-month-slider-label").classes()).toContain(
                `cu-month-slider-label--${value}`,
              );
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variantes",
      badge: "soft",
      layout: "col",
      variants: VARIANTS.map((variant) => ({ id: variant, props: { variant } })),
      vue: `  <MonthSlider v-for="variant in ['solid', 'outlined', 'soft', 'ghost', 'subtle']" :key="variant" :variant="variant" />`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-month-slider-label--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string;
              expect(wrapper.find(".cu-month-slider-label").classes()).toContain(
                `cu-month-slider-label--${value}`,
              );
            },
          },
        ],
      },
    },

    {
      id: "min-max",
      title: "Fechas mínima y máxima",
      layout: "col",
      variants: [
        { id: "window", props: { min: "2026-01-01", max: "2026-12-01", modelValue: "2026-06-01" } },
        { id: "clamped", props: { min: "2026-05-01", modelValue: "2025-01-01" } },
        { id: "at-max", props: { min: "2026-01-01", max: "2026-12-01", modelValue: "2026-12-01" } },
      ],
      vue: `  <MonthSlider min="2026-01-01" max="2026-12-01" model-value="2026-06-01" />
  <MonthSlider min="2026-05-01" model-value="2025-01-01" />
  <MonthSlider min="2026-01-01" max="2026-12-01" model-value="2026-12-01" />`,
      checks: {
        l1: [
          {
            name: "clampea el modelo dentro de min/max",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "clamped") return;
              expect(wrapper.find(".cu-month-slider-label-month").text().toLowerCase()).toBe("mayo");
            },
          },
          {
            name: "deshabilita la navegación en los bordes",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "at-max") return;
              const buttons = wrapper.findAll("button");
              const nextMonth = buttons.find((b) => b.attributes("aria-label") === "Ir al mes siguiente")!;
              const nextYear = buttons.find((b) => b.attributes("aria-label") === "Ir al año siguiente")!;
              expect(nextMonth.attributes("disabled")).toBeDefined();
              expect(nextYear.attributes("disabled")).toBeDefined();
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colores",
      badge: "primary",
      layout: "col",
      variants: COLORS.map((color) => ({ id: color, props: { color } })),
      vue: `  <MonthSlider color="primary" />
  <MonthSlider color="secondary" />
  <MonthSlider color="neutral" />
  <MonthSlider color="success" />
  <MonthSlider color="warning" />
  <MonthSlider color="danger" />`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-month-slider").attributes("style")).toContain(
                `--ms-accent: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { disabled: true } }],
      vue: `  <MonthSlider disabled />`,
      checks: {
        l1: [
          {
            name: "disabled agrega la clase y deshabilita los botones",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider").classes()).toContain("is-disabled");
              for (const button of wrapper.findAll("button")) {
                expect(button.attributes("disabled")).toBeDefined();
              }
            },
          },
        ],
      },
    },
  ],
};
