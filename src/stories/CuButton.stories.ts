import CuButton from "../components/Button.ce.vue";
import "./Button.css";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuButton> = {
  title: "Components/Button",
  component: CuButton,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the button",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle", "link"],
      description: "The visual variant of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
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
  },
  args: {
    color: "primary",
    variant: "solid",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    variant: "solid",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Button</CuButton>",
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { CuButton },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <CuButton v-for="color in colors" :key="color" :variant="variant" :color="color">
              {{ color }}
            </CuButton>
          </div>
        </div>
      </div>
    `,
  }),
};

export const AllColors: Story = {
  render: () => ({
    components: { CuButton },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { colors };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <CuButton v-for="color in colors" :key="color" :color="color" variant="solid">
          {{ color }}
        </CuButton>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Disabled</CuButton>",
  }),
};

export const Link: Story = {
  args: {
    variant: "link",
    to: "#",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Link Button</CuButton>",
  }),
};
