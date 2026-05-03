import CuBadge from "../components/Badge.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuBadge> = {
  title: "Components/Badge",
  component: CuBadge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the badge",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle"],
      description: "The visual variant of the badge",
    },
  },
  args: {
    color: "primary",
    variant: "ghost",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    variant: "ghost",
  },
  render: (args) => ({
    components: { CuBadge },
    setup: () => ({ args }),
    template: "<CuBadge v-bind='args'>Badge</CuBadge>",
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { CuBadge },
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
            <CuBadge v-for="color in colors" :key="color" :variant="variant" :color="color">
              {{ color }}
            </CuBadge>
          </div>
        </div>
      </div>
    `,
  }),
};
