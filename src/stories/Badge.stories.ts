import Badge from "../components/Badge.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the badge (e.g., #ff0000)",
    },
    hightContrast: {
      control: "boolean",
      description: "Whether to use high contrast colors",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "subtle"],
      description: "The visual variant of the badge",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "solid",
    hightContrast: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "solid",
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>Badge</Badge>",
  }),
};

// 2. Solid
export const Solid: Story = {
  args: {
    variant: "solid",
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>Solid</Badge>",
  }),
};

// 3. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>Outlined</Badge>",
  }),
};

// 4. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>Soft</Badge>",
  }),
};

// 5. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>Subtle</Badge>",
  }),
};

// 6. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Badge },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Badge v-for="color in colors" :key="color" :color="color" variant="solid">
          {{ color }}
        </Badge>
      </div>
    `,
  }),
};

// 7. High Contrast
export const HighContrast: Story = {
  args: {
    variant: "solid",
    hightContrast: true,
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: "<Badge v-bind='args'>High Contrast</Badge>",
  }),
};

// 8. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Badge },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "subtle"] as const;
      return { variants };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Badge v-for="variant in variants" :key="variant" color="#3b82f6" :variant="variant">
          {{ variant }}
        </Badge>
      </div>
    `,
  }),
};
