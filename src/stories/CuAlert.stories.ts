import CuAlert from "../components/Alert.ce.vue";
import "./Alert.css";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuAlert> = {
  title: "Components/Alert",
  component: CuAlert,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the alert",
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
    color: "primary",
    variant: "soft",
    title: "Alert Title",
    close: false,
    show: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    variant: "soft",
    title: "Primary Alert",
  },
  render: (args) => ({
    components: { CuAlert },
    setup: () => ({ args }),
    template: "<CuAlert v-bind='args'>This is a primary alert message.</CuAlert>",
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { CuAlert },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <CuAlert v-for="color in colors" :key="color" :variant="variant" :color="color" class="w-48">
              {{ color }}
            </CuAlert>
          </div>
        </div>
      </div>
    `,
  }),
};

export const WithClose: Story = {
  args: {
    close: true,
    title: "Dismissible Alert",
  },
  render: (args) => ({
    components: { CuAlert },
    setup: () => ({ args }),
    template: "<CuAlert v-bind='args'>Click close to dismiss.</CuAlert>",
  }),
};
