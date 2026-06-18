import CuLabel from "../../../components/form/Label.ce.vue";
import CuInput from "../../../components/form/Input.ce.vue";
import CuTextarea from "../../../components/form/Textarea.ce.vue";
import CuCheckbox from "../../../components/form/Checkbox.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuLabel> = {
  title: "Custom Elements/Form/Label",
  component: CuLabel,
  tags: ["autodocs"],
  argTypes: {
    for: {
      control: "text",
      description: "ID of the target input to focus on click",
    },
    label: {
      control: "text",
      description: "The label text",
    },
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the label text",
    },
    hightContrast: {
      control: "boolean",
      description: "Whether to use high contrast",
    },
  },
  args: {
    for: "",
    label: "Label",
    color: "neutral",
    hightContrast: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    label: "Username",
    for: "ce-username",
  },
  render: (args) => ({
    components: { CuLabel, CuInput },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <CuInput id="ce-username" placeholder="Enter username" class="w-64" color="neutral" variant="none" />
      </CuLabel>
    `,
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    label: "Email",
    color: "primary",
    for: "ce-email",
  },
  render: (args) => ({
    components: { CuLabel, CuInput },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <CuInput id="ce-email" placeholder="Enter email" class="w-64" color="primary" variant="outlined" />
      </CuLabel>
    `,
  }),
};

// 3. Without For (no focus)
export const WithoutFor: Story = {
  args: {
    label: "No Focus",
    color: "neutral",
  },
  render: (args) => ({
    components: { CuLabel, CuInput },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <CuInput placeholder="Click label - no focus" class="w-64" color="neutral" variant="none" />
      </CuLabel>
    `,
  }),
};

// 4. With Wrapper
export const WithWrapper: Story = {
  args: {
    label: "Search",
    color: "primary",
    for: "ce-search",
  },
  render: (args) => ({
    components: { CuLabel, CuInput },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">🔍</span>
          <CuInput id="ce-search" placeholder="Search..." class="w-64 pl-10" color="primary" variant="outlined" />
        </div>
      </CuLabel>
    `,
  }),
};

// 5. Color States
export const ColorStates: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const states = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { states };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuLabel v-for="state in states" :key="state" :label="state" :for="'ce-color-' + state" :color="state">
          <CuInput :id="'ce-color-' + state" :placeholder="state" class="w-64" :color="state" variant="outlined" />
        </CuLabel>
      </div>
    `,
  }),
};

// 6. With Textarea
export const WithTextarea: Story = {
  args: {
    label: "Descripción",
    color: "primary",
    for: "ce-textarea",
  },
  render: (args) => ({
    components: { CuLabel, CuTextarea },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <CuTextarea id="ce-textarea" placeholder="Escribe una descripción..." rows="4" class="w-64" color="primary" variant="outlined" />
      </CuLabel>
    `,
  }),
};

// 7. With Checkbox
export const WithCheckbox: Story = {
  args: {
    label: "Acepto los términos",
    color: "primary",
    for: "ce-checkbox",
  },
  render: (args) => ({
    components: { CuLabel, CuCheckbox },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args">
        <CuCheckbox id="ce-checkbox" color="primary" variant="soft" />
      </CuLabel>
    `,
  }),
};

// 8. All Colors
export const AllColors: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <CuLabel :label="color" :for="'ce-all-' + color" :color="color" class="w-24">
            <CuInput :id="'ce-all-' + color" placeholder="Input" class="w-48" :color="color" variant="outlined" />
          </CuLabel>
        </div>
      </div>
    `,
  }),
};

// 9. Form Example
export const FormExample: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <CuLabel label="First Name *" for="ce-form-first" color="primary">
          <CuInput id="ce-form-first" placeholder="John" class="w-full" color="primary" variant="outlined" />
        </CuLabel>
        <CuLabel label="Last Name *" for="ce-form-last" color="primary">
          <CuInput id="ce-form-last" placeholder="Doe" class="w-full" color="primary" variant="outlined" />
        </CuLabel>
        <CuLabel label="Email *" for="ce-form-email" color="success">
          <CuInput id="ce-form-email" placeholder="john@example.com" type="email" class="w-full" color="success" variant="soft" />
        </CuLabel>
        <CuLabel label="Phone" for="ce-form-phone" color="neutral">
          <CuInput id="ce-form-phone" placeholder="+52 123 456 7890" type="tel" class="w-full" color="neutral" variant="ghost" />
        </CuLabel>
      </div>
    `,
  }),
};
