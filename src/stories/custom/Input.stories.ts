import CuInput from "../../components/form/Input.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuInput> = {
  title: "Custom Elements/Input",
  component: CuInput,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the input",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the input",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url", "search"],
      description: "The input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the input is read-only",
    },
  },
  args: {
    color: "neutral",
    variant: "ghost",
    type: "text",
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
    variant: "ghost",
    type: "text",
    placeholder: "Default Input",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "soft",
    placeholder: "Primary Input",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};

// 3. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const states = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <CuInput v-for="state in states" :key="state" :color="state" variant="ghost" :placeholder="state" class="w-48" />
      </div>
    `,
  }),
};

// 4. Variant In Primary
export const VariantInPrimary: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuInput v-for="variant in variants" :key="variant" color="primary" :variant="variant" :placeholder="variant" class="w-64" />
      </div>
    `,
  }),
};

// 5. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-4 flex-wrap">
            <CuInput v-for="color in colors" :key="color" :variant="variant" :color="color" :placeholder="color" class="w-48" />
          </div>
        </div>
      </div>
    `,
  }),
};

// 6. With Types
export const WithTypes: Story = {
  render: () => ({
    components: { CuInput },
    setup: () => {
      const types = ["text", "password", "email", "number"] as const;
      return { types };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuInput v-for="type in types" :key="type" :type="type" :placeholder="type" class="w-64" />
      </div>
    `,
  }),
};

// 7. With Disabled
export const WithDisabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled Input",
    modelValue: "Cannot edit",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};

// 8. With ReadOnly
export const WithReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: "Read-only Input",
    modelValue: "Read only text",
  },
  render: (args) => ({
    components: { CuInput },
    setup: () => ({ args }),
    template: "<CuInput v-bind='args' class='w-64' />",
  }),
};
