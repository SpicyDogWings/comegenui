import cubadge from "../../components/Badge.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof cubadge> = {
  title: "Components/Custom/Badge",
  component: cubadge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the badge",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "subtle"],
      description: "The visual variant of the badge",
    },
  },
  args: {
    color: "neutral",
    variant: "solid",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "solid",
  },
  render: (args) => ({
    components: { cubadge },
    setup: () => ({ args }),
    template: "<cubadge v-bind='args'>Badge</cubadge>",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "solid",
  },
  render: (args) => ({
    components: { cubadge },
    setup: () => ({ args }),
    template: "<cubadge v-bind='args'>Primary</cubadge>",
  }),
};

// 3. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { cubadge },
    setup: () => {
      const states = ["success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex gap-2">
        <cubadge v-for="state in states" :key="state" :color="state" variant="solid">
          {{ state }}
        </cubadge>
      </div>
    `,
  }),
};

// 4. Variant in primary
export const VariantInPrimary: Story = {
  render: () => ({
    components: { cubadge },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "subtle"] as const;
      return { variants };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <cubadge v-for="variant in variants" :key="variant" color="primary" :variant="variant">
          {{ variant }}
        </cubadge>
      </div>
    `,
  }),
};

// 5. All combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { cubadge },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "subtle"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <cubadge v-for="color in colors" :key="color" :variant="variant" :color="color">
              {{ color }}
            </cubadge>
          </div>
        </div>
      </div>
    `,
  }),
};

// 6. With Icon
export const WithIcon: Story = {
  args: {
    color: "primary",
    variant: "solid",
  },
  render: (args) => ({
    components: { cubadge },
    setup: () => ({ args }),
    template: `
      <cubadge v-bind='args'>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        Star
      </cubadge>
    `,
  }),
};
