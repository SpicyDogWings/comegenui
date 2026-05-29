import CuSelect from "../../../components/form/Select.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const sampleOptions = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "img", label: "Imagen" },
  { value: "xls", label: "Excel" },
];

const meta: Meta<typeof CuSelect> = {
  title: "Custom Elements/Form/Select",
  component: CuSelect,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the select",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the select",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
  },
  args: {
    color: "neutral",
    variant: "ghost",
    placeholder: "Seleccione una opción",
    disabled: false,
    options: sampleOptions,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
    placeholder: "Seleccione una opción",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { CuSelect },
    setup: () => ({ args }),
    template: "<CuSelect v-bind='args' class='w-64' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    placeholder: "Primary Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { CuSelect },
    setup: () => ({ args }),
    template: "<CuSelect v-bind='args' class='w-64' />",
  }),
};

// 3. Color States
export const ColorStates: Story = {
  render: () => ({
    components: { CuSelect },
    setup: () => {
      const states = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { states, sampleOptions };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <CuSelect v-for="state in states" :key="state" :color="state" variant="ghost" :placeholder="state" :options="sampleOptions" class="w-48" />
      </div>
    `,
  }),
};

// 4. Variant In Primary
export const VariantInPrimary: Story = {
  render: () => ({
    components: { CuSelect },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants, sampleOptions };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuSelect v-for="variant in variants" :key="variant" color="primary" :variant="variant" :placeholder="variant" :options="sampleOptions" class="w-64" />
      </div>
    `,
  }),
};

// 5. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuSelect },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors, sampleOptions };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-4 flex-wrap">
            <CuSelect v-for="color in colors" :key="color" :variant="variant" :color="color" :placeholder="color" :options="sampleOptions" class="w-48" />
          </div>
        </div>
      </div>
    `,
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { CuSelect },
    setup: () => ({ args }),
    template: "<CuSelect v-bind='args' class='w-64' />",
  }),
};
