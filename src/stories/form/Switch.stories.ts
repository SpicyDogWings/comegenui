import Switch from "../../components/form/Switch.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Switch> = {
  title: "Components/Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the switch (e.g., #3b82f6)",
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
    modelValue: {
      control: "boolean",
      description: "The checked state (v-model)",
    },
    checked: {
      control: "boolean",
      description: "The checked state (alternative to modelValue)",
    },
  },
  args: {
    color: "#2c2c2c",
    size: "md",
    disabled: false,
    modelValue: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 2. Checked
export const Checked: Story = {
  args: {
    modelValue: true,
    color: "#2c2c2c",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 3. Size SM
export const SizeSM: Story = {
  args: {
    size: "sm",
    color: "#3b82f6",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 4. Size SM Checked
export const SizeSMChecked: Story = {
  args: {
    size: "sm",
    modelValue: true,
    color: "#3b82f6",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 5. Sizes Comparison
export const SizesComparison: Story = {
  render: () => ({
    components: { Switch },
    setup: () => ({}),
    template: `
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <Switch size="sm" color="#3b82f6" />
          <Switch size="sm" color="#3b82f6" :modelValue="true" />
          <span class="text-sm text-charcoal-600">SM</span>
        </div>
        <div class="flex items-center gap-3">
          <Switch size="md" color="#3b82f6" />
          <Switch size="md" color="#3b82f6" :modelValue="true" />
          <span class="text-sm text-charcoal-600">MD</span>
        </div>
      </div>
    `,
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    color: "#2c2c2c",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 7. Disabled Checked
export const DisabledChecked: Story = {
  args: {
    modelValue: true,
    disabled: true,
    color: "#2c2c2c",
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: "<Switch v-bind='args' />",
  }),
};

// 8. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Switch },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <Switch :color="color" size="sm" />
          <Switch :color="color" size="sm" :modelValue="true" />
          <Switch :color="color" size="md" />
          <Switch :color="color" size="md" :modelValue="true" />
          <span class="text-sm w-20">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 9. With Label
export const WithLabel: Story = {
  render: () => ({
    components: { Switch },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <Switch id="switch-sm" size="sm" color="#3b82f6" />
          <label for="switch-sm" class="text-sm text-charcoal-800 font-sans cursor-pointer">Notificaciones (SM)</label>
        </div>
        <div class="flex items-center gap-3">
          <Switch id="switch-md" size="md" color="#3b82f6" />
          <label for="switch-md" class="text-sm text-charcoal-800 font-sans cursor-pointer">Notificaciones (MD)</label>
        </div>
      </div>
    `,
  }),
};
