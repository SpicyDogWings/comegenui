import CuLabel from "../components/Label.ce.vue";
import CuInput from "../components/form/Input.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuLabel> = {
  title: "Components/Label",
  component: CuLabel,
  tags: ["autodocs"],
  argTypes: {
    default: {
      control: "text",
      description: "The label text content",
    },
  },
  args: {
    default: "Label",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  render: (args) => ({
    components: { CuLabel, CuInput },
    setup: () => ({ args }),
    template: `
      <CuLabel v-bind="args" class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Username</span>
        <CuInput placeholder="Enter username" class="w-64" color="neutral" variant="none" />
      </CuLabel>
    `,
  }),
};

// 2. WithInput
export const WithInput: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Email Address</span>
        <CuInput placeholder="Enter your email" type="email" class="w-64" color="neutral" variant="none" />
      </CuLabel>
    `,
  }),
};

// 3. WithNestedWrapper
export const WithNestedWrapper: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Search</span>
        <div class="relative">
          <CuInput placeholder="Search..." class="w-64" color="primary" variant="outlined" />
        </div>
      </CuLabel>
    `,
  }),
};

// 4. MultipleInputs
export const WithMultipleInputs: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4">
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">First Name</span>
          <CuInput placeholder="John" class="w-64" color="neutral" variant="none" />
        </CuLabel>
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">Last Name</span>
          <CuInput placeholder="Doe" class="w-64" color="neutral" variant="none" />
        </CuLabel>
      </div>
    `,
  }),
};
