import YearSlider from "@/components/controls/YearSlider.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./YearSlider.stories.extras";

const CURRENT_YEAR = new Date().getFullYear();

const VARIANTS = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

export const cuYearSliderStories: ComponentStory = {
  component: "cu-year-slider",
  vue: YearSlider,
  tokens: [
    '--ms-accent',
    '--ms-accent-hover',
    '--ms-accent-text',
    '--ms-soft',
    '--ms-soft-hover',
    '--ms-subtle',
    '--ms-subtle-border',
    '--ms-subtle-hover',
    '--ms-ghost-hover',
    '--ms-surface',
    '--cu-font-sans',
    '--cu-space-2xs',
  ],
  subComponents: [
    { label: 'MonthSliderLabel', path: '/playground/components/year-slider#style' }
  ],
  api: {
    components: [
      { label: 'MonthSliderLabel', path: '/playground/components/year-slider' }
    ],
    props: [
      { name: 'modelValue', type: 'number | string | null', default: 'null', description: 'Año (v-model)' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
      { name: 'min', type: 'number | string | null', default: 'null', description: 'Año mínimo' },
      { name: 'max', type: 'number | string | null', default: 'null', description: 'Año máximo' },
      { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el control' },
    ],
    slots: [],
    events: [
      { name: 'update:modelValue', type: '(value: number) => void', description: 'Al cambiar el año (v-model)' },
      { name: 'change', type: '(value: number) => void', description: 'Al cambiar el año' },
    ],
    exposes: [
      { name: 'nextYear', type: '() => void', description: 'Avanza un año' },
      { name: 'prevYear', type: '() => void', description: 'Retrocede un año' },
      { name: 'goToYear', type: '(value: number | string) => void', description: 'Va al año indicado' },
      { name: 'getValue', type: '() => number | null', description: 'Devuelve el año actual' },
      { name: 'setValue', type: '(value: number | string) => void', description: 'Setea el año' },
    ],
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "soft",
      layout: "col",
      variants: [
        { id: "v1" },
        { id: "with-value", props: { modelValue: 2019 } },
      ],
      vue: `  <YearSlider />
  <YearSlider :model-value="2019" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-year-slider con el año actual",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-year-slider").exists()).toBe(true);
              const expected = variant.props?.modelValue ?? CURRENT_YEAR;
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe(String(expected));
            },
          },
          {
            name: "click en next emite update:modelValue y change",
            async run({ wrapper, expect }, variant) {
              const buttons = wrapper.findAll("button");
              const initial = Number(variant.props?.modelValue ?? CURRENT_YEAR);
              await buttons[buttons.length - 1]!.trigger("click");
              expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toBe(initial + 1);
              expect(wrapper.emitted("change")?.[0]?.[0]).toBe(initial + 1);
            },
          },
        ],
      },
    },

    {
      id: "min-max",
      title: "Límites",
      layout: "col",
      variants: [
        { id: "window", props: { min: 2020, max: 2030, modelValue: 2025 } },
        { id: "at-min", props: { min: 2020, max: 2030, modelValue: 2020 } },
        { id: "at-max", props: { min: 2020, max: 2030, modelValue: 2030 } },
        { id: "dates", props: { min: "2020-01-01", max: "2030-01-01", modelValue: "2024-06-01" } },
      ],
      vue: `  <YearSlider :min="2020" :max="2030" :model-value="2025" />
  <YearSlider :min="2020" :max="2030" :model-value="2020" />
  <YearSlider :min="2020" :max="2030" :model-value="2030" />
  <YearSlider min="2020-01-01" max="2030-01-01" model-value="2024-06-01" />`,
      checks: {
        l1: [
          {
            name: "deshabilita prev/next según min/max",
            run({ wrapper, expect }, variant) {
              const buttons = wrapper.findAll("button");
              const prev = buttons[0]!;
              const next = buttons[buttons.length - 1]!;
              const atMin = variant.id === "at-min";
              const atMax = variant.id === "at-max";
              if (atMin) expect(prev.attributes("disabled")).toBeDefined();
              if (atMax) expect(next.attributes("disabled")).toBeDefined();
              if (variant.id === "window") {
                expect(prev.attributes("disabled")).toBeUndefined();
                expect(next.attributes("disabled")).toBeUndefined();
              }
            },
          },
          {
            name: "acepta fechas y números de 4 dígitos como límites/año",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "dates") return;
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe("2024");
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
      vue: `  <YearSlider v-for="variant in ['solid', 'outlined', 'soft', 'ghost', 'subtle']" :key="variant" :variant="variant" />`,
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
      id: "colors",
      title: "Colores",
      badge: "primary",
      layout: "col",
      variants: COLORS.map((color) => ({ id: color, props: { color } })),
      vue: `  <YearSlider color="primary" />
  <YearSlider color="secondary" />
  <YearSlider color="neutral" />
  <YearSlider color="success" />
  <YearSlider color="warning" />
  <YearSlider color="danger" />`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-year-slider").attributes("style")).toContain(
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
      vue: `  <YearSlider disabled />`,
      checks: {
        l1: [
          {
            name: "disabled agrega la clase y deshabilita los botones",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-year-slider").classes()).toContain("is-disabled");
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
