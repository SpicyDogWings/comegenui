import Checkbox from "../components/form/Checkbox.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the checkbox (e.g., #3b82f6)",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the checkbox",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "The label text for the checkbox",
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
    variant: "ghost",
    disabled: false,
    label: "Checkbox",
    modelValue: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "none",
    label: "Default Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 2. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
    label: "Outlined Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 3. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
    label: "Soft Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 4. Ghost
export const Ghost: Story = {
  args: {
    variant: "ghost",
    label: "Ghost Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 5. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
    label: "Subtle Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 6. None
export const None: Story = {
  args: {
    variant: "none",
    label: "None Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 7. Checked
export const Checked: Story = {
  args: {
    modelValue: true,
    label: "Checked Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 8. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 9. Disabled Checked
export const DisabledChecked: Story = {
  args: {
    modelValue: true,
    disabled: true,
    label: "Disabled Checked Checkbox",
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' />",
  }),
};

// 10. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <Checkbox :color="color" variant="ghost" />
          <Checkbox :color="color" variant="ghost" :modelValue="true" />
          <Checkbox :color="color" variant="soft" />
          <Checkbox :color="color" variant="soft" :modelValue="true" />
          <span class="text-sm w-20">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 11. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <Checkbox color="#2c2c2c" :variant="variant" />
          <Checkbox color="#2c2c2c" :variant="variant" :modelValue="true" />
          <span class="text-sm w-20">{{ variant }}</span>
        </div>
      </div>
    `,
  }),
};

// 12. Without Label
export const WithoutLabel: Story = {
  args: {
    label: "",
    variant: "none"
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: "<Checkbox v-bind='args' :modelValue='true' />",
  }),
};
