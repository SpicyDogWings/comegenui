import CuInput from "../components/form/Input.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuInput> = {
  title: "Components/Input",
  component: CuInput,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the input",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the input",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url", "search"],
      description: "The input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
  args: {
    color: "neutral",
    variant: "none",
    type: "text",
    placeholder: "Enter text...",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "none",
    type: "text",
    placeholder: "Enter text...",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    placeholder: "Primary Input",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};

// 3. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const states = ["success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuInput v-for="state in states" :key="state" :color="state" variant="outlined" :placeholder="state" class="w-64" />
      </div>
    `,
  }),
};

// 4. Variant in primary
export const Variant: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuInput v-for="variant in variants" :key="variant" color="primary" :variant="variant" placeholder="Primary" class="w-64" />
      </div>
    `,
  }),
};

// 5. All combinations
export const Combinations: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <CuInput v-for="color in colors" :key="color" :variant="variant" :color="color" placeholder="Input" class="w-48" />
          </div>
        </div>
      </div>
    `,
  }),
};

// 6. Types
export const Types: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const types = ["text", "password", "email", "number"] as const;
      return { types };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuInput v-for="type in types" :key="type" :type="type" :placeholder="type" class="w-64" />
      </div>
    `,
  }),
};
