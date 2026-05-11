import Alert from "../components/Alert.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the alert (e.g., #ff0000)",
    },
    hightContrast: {
      control: "boolean",
      description: "Whether to use high contrast colors",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle"],
      description: "The visual variant of the alert",
    },
    title: {
      control: "text",
      description: "The title of the alert",
    },
    close: {
      control: "boolean",
      description: "Whether the alert has a close button",
    },
    show: {
      control: "boolean",
      description: "Whether the alert is visible",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "soft",
    title: "Alert Title",
    close: false,
    show: true,
    hightContrast: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
    title: "Alert Title",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a default alert message.</Alert>",
  }),
};

// 2. Solid
export const Solid: Story = {
  args: {
    variant: "solid",
    title: "Solid Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a solid alert message.</Alert>",
  }),
};

// 3. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
    title: "Outlined Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is an outlined alert message.</Alert>",
  }),
};

// 4. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
    title: "Soft Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a soft alert message.</Alert>",
  }),
};

// 5. Ghost
export const Ghost: Story = {
  args: {
    variant: "ghost",
    title: "Ghost Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a ghost alert message.</Alert>",
  }),
};

// 6. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
    title: "Subtle Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a subtle alert message.</Alert>",
  }),
};

// 7. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Alert },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Alert v-for="color in colors" :key="color" :color="color" variant="soft" class="w-64">
          Alert with color {{ color }}
        </Alert>
      </div>
    `,
  }),
};

// 8. High Contrast
export const HighContrast: Story = {
  args: {
    variant: "solid",
    hightContrast: true,
    title: "High Contrast Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>This is a high contrast alert.</Alert>",
  }),
};

// 9. With Close
export const WithClose: Story = {
  args: {
    close: true,
    title: "Dismissible Alert",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: "<Alert v-bind='args'>Click close to dismiss.</Alert>",
  }),
};

// 10. With Icon
export const WithIcon: Story = {
  args: {
    color: "#3b82f6",
    variant: "soft",
    title: "Alert with Icon",
  },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind='args'>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </template>
        This is an alert with an icon.
      </Alert>
    `,
  }),
};

// 11. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Alert },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Alert v-for="variant in variants" :key="variant" color="#3b82f6" :variant="variant" :title="variant" class="w-64">
          Alert with {{ variant }} variant
        </Alert>
      </div>
    `,
  }),
};
