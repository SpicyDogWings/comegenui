import CuTextarea from "../components/form/Textarea.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuTextarea> = {
  title: "Components/Textarea",
  component: CuTextarea,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the textarea",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the textarea",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the textarea is read-only",
    },
  },
  args: {
    color: "neutral",
    variant: "none",
    placeholder: "Enter text...",
    disabled: false,
    readOnly: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "none",
    placeholder: "Enter text...",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64 h-24' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    placeholder: "Primary Textarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64 h-24' />",
  }),
};

// 3. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { CuTextarea },
    setup: () => {
      const states = ["success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuTextarea v-for="state in states" :key="state" :color="state" variant="outlined" :placeholder="state" class="w-64 h-24" />
      </div>
    `,
  }),
};

// 4. Variant In Primary
export const VariantInPrimary: Story = {
  render: () => ({
    components: { CuTextarea },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuTextarea v-for="variant in variants" :key="variant" color="primary" :variant="variant" placeholder="Primary" class="w-64 h-24" />
      </div>
    `,
  }),
};

// 5. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuTextarea },
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
            <CuTextarea v-for="color in colors" :key="color" :variant="variant" :color="color" placeholder="Textarea" class="w-48 h-24" />
          </div>
        </div>
      </div>
    `,
  }),
};
