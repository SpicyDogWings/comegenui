import CuButton from "../components/Button.ce.vue";

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
    color: "neutral",
    variant: "ghost",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Button</CuButton>",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "solid",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Primary</CuButton>",
  }),
};

// 3. Neutral
export const Neutral: Story = {
  args: {
    color: "neutral",
    variant: "solid",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Neutral</CuButton>",
  }),
};

// 4. Color states
export const ColorStates: Story = {
  render: () => ({
    components: { CuButton },
    setup: () => {
      const states = ["success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex gap-2">
        <CuButton v-for="state in states" :key="state" :color="state" variant="solid">
          {{ state }}
        </CuButton>
      </div>
    `,
  }),
};

// 5. Variant in primary
export const Variant: Story = {
  render: () => ({
    components: { CuButton },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
      return { variants };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <CuButton v-for="variant in variants" :key="variant" color="primary" :variant="variant">
          {{ variant }}
        </CuButton>
      </div>
    `,
  }),
};

// 6. All combinations
export const Combinations: Story = {
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
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
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

// 7. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    color: "primary",
    variant: "solid"
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Disabled</CuButton>",
  }),
};

// 8. Link with target
export const Link: Story = {
  args: {
    variant: "link",
    to: "https://example.com",
    target: "_blank",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: "<CuButton v-bind='args'>Link Button</CuButton>",
  }),
};

// 9. Slots with icon
export const Icon: Story = {
  args: {
    color: "primary",
    variant: "solid",
  },
  render: (args) => ({
    components: { CuButton },
    setup: () => ({ args }),
    template: `
      <CuButton v-bind='args'>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon lucide-bookmark">
          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/>
        </svg>
        Bookmark
      </CuButton>
    `,
  }),
};
