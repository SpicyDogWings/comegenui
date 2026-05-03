import CuCheckbox from "../components/form/Checkbox.ce.vue";
import "./Checkbox.css";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuCheckbox> = {
  title: "Components/Checkbox",
  component: CuCheckbox,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the checkbox",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the checkbox",
    },
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "The label text",
    },
  },
  args: {
    color: "primary",
    variant: "outlined",
    checked: false,
    disabled: false,
    label: "Checkbox",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    checked: true,
    label: "Primary Checkbox",
  },
  render: (args) => ({
    components: { CuCheckbox },
    setup: () => ({ args }),
    template: "<CuCheckbox v-bind='args' />",
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { CuCheckbox },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700">{{ variant }}</h3>
          <div class="flex gap-4 flex-wrap">
            <CuCheckbox v-for="color in colors" :key="color" :variant="variant" :color="color" :checked="true" :label="color" />
          </div>
        </div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
    label: "Disabled Checkbox",
  },
  render: (args) => ({
    components: { CuCheckbox },
    setup: () => ({ args }),
    template: "<CuCheckbox v-bind='args' />",
  }),
};
