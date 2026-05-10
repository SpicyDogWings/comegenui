import Button from "../components/Button.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the button (e.g., #ff0000)",
    },
    hightContrast: {
      control: "boolean",
      description: "Whether to use high contrast colors",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle", "link"],
      description: "The visual variant of the button",
    },
    to: {
      control: "text",
      description: "URL for link behavior (turns button into an <a> tag)",
    },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
      description: "Target for link behavior",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    hightContrast: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Button</Button>",
  }),
};

// 2. Solid
export const Solid: Story = {
  args: {
    variant: "solid",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Solid</Button>",
  }),
};

// 3. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Outlined</Button>",
  }),
};

// 4. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Soft</Button>",
  }),
};

// 5. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Subtle</Button>",
  }),
};

// 6. Ghost
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Ghost</Button>",
  }),
};

// 7. Link
export const Link: Story = {
  args: {
    variant: "link",
    to: "https://example.com",
    target: "_blank",
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>Link Button</Button>",
  }),
};

// 8. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Button },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Button v-for="color in colors" :key="color" :color="color" variant="solid">
          {{ color }}
        </Button>
      </div>
    `,
  }),
};

// 9. High Contrast
export const HighContrast: Story = {
  args: {
    variant: "solid",
    hightContrast: true,
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: "<Button v-bind='args'>High Contrast</Button>",
  }),
};

// 10. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Button },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
      return { variants };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Button v-for="variant in variants" :key="variant" color="#3b82f6" :variant="variant">
          {{ variant }}
        </Button>
      </div>
    `,
  }),
};

// 11. All Variants Disabled
export const AllVariantsDisabled: Story = {
  render: () => ({
    components: { Button },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
      return { variants };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Button v-for="variant in variants" :key="variant" color="#3b82f6" :variant="variant" :to="variant === 'link' ? '#' : undefined" disabled>
          {{ variant }} (disabled)
        </Button>
      </div>
    `,
  }),
};
