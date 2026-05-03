import CuCheckbox from "../components/form/Checkbox.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuCheckbox> = {
  title: "Components/Checkbox",
  component: CuCheckbox,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the checkbox",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the checkbox",
    },
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "The label text",
    },
  },
  args: {
    color: "primary",
    variant: "outlined",
    checked: false,
    disabled: false,
    label: "Checkbox",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "primary",
    variant: "none",
    checked: false,
    label: "Checkbox",
  },
  render: (args) => ({
    components: { CuCheckbox },
    setup: () => ({ args }),
    template: "<CuCheckbox v-bind='args' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    checked: true,
    label: "Primary Checkbox",
  },
  render: (args) => ({
    components: { CuCheckbox },
    setup: () => ({ args }),
    template: "<CuCheckbox v-bind='args' />",
  }),
};

// 3. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { CuCheckbox },
    setup: () => {
      const states = ["success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <CuCheckbox v-for="state in states" :key="state" :color="state" variant="outlined" :checked="true" :label="state" />
      </div>
    `,
  }),
};

// 4. Variant In Primary
export const VariantInPrimary: Story = {
  render: () => ({
    components: { CuCheckbox },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuCheckbox v-for="variant in variants" :key="variant" color="primary" :variant="variant" :checked="true" :label="variant" />
      </div>
    `,
  }),
};

// 5. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuCheckbox },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-4 flex-wrap">
            <CuCheckbox v-for="color in colors" :key="color" :variant="variant" :color="color" :checked="true" :label="color" />
          </div>
        </div>
      </div>
    `,
  }),
};

// 6. With Disabled
export const WithDisabled: Story = {
  args: {
    disabled: true,
    checked: true,
    label: "Disabled Checkbox",
  },
  render: (args) => ({
    components: { CuCheckbox },
    setup: () => ({ args }),
    template: "<CuCheckbox v-bind='args' />",
  }),
};
