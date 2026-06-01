import CuSwitch from "../../../components/form/Switch.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuSwitch> = {
  title: "Custom Elements/Form/Switch",
  component: CuSwitch,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the switch",
    },
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "The size of the switch",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
  },
  args: {
    color: "neutral",
    size: "md",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
  },
  render: (args) => ({
    components: { CuSwitch },
    setup: () => ({ args }),
    template: "<CuSwitch v-bind='args' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    modelValue: true,
  },
  render: (args) => ({
    components: { CuSwitch },
    setup: () => ({ args }),
    template: "<CuSwitch v-bind='args' />",
  }),
};

// 3. Size SM
export const SizeSM: Story = {
  args: {
    size: "sm",
    color: "primary",
  },
  render: (args) => ({
    components: { CuSwitch },
    setup: () => ({ args }),
    template: "<CuSwitch v-bind='args' />",
  }),
};

// 4. Sizes Comparison
export const SizesComparison: Story = {
  render: () => ({
    components: { CuSwitch },
    setup: () => ({}),
    template: `
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <CuSwitch size="sm" color="primary" />
          <CuSwitch size="sm" color="primary" :modelValue="true" />
          <span class="text-sm text-charcoal-600">SM</span>
        </div>
        <div class="flex items-center gap-3">
          <CuSwitch size="md" color="primary" />
          <CuSwitch size="md" color="primary" :modelValue="true" />
          <span class="text-sm text-charcoal-600">MD</span>
        </div>
      </div>
    `,
  }),
};

// 5. Color States
export const ColorStates: Story = {
  render: () => ({
    components: { CuSwitch },
    setup: () => {
      const states = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex gap-4 items-center">
        <div v-for="state in states" :key="state" class="flex flex-col items-center gap-2">
          <CuSwitch :color="state" size="sm" />
          <CuSwitch :color="state" size="sm" :modelValue="true" />
          <CuSwitch :color="state" size="md" />
          <CuSwitch :color="state" size="md" :modelValue="true" />
          <span class="text-xs text-charcoal-600">{{ state }}</span>
        </div>
      </div>
    `,
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { CuSwitch },
    setup: () => ({ args }),
    template: "<CuSwitch v-bind='args' />",
  }),
};
