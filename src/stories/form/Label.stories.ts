import Label from "../../components/Label.vue";
import Input from "../../components/form/Input.vue";
import Textarea from "../../components/form/Textarea.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Label> = {
  title: "Components/Form/Label",
  component: Label,
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
      control: "color",
      description: "The hex color of the label text (e.g., #3b82f6)",
    },
    hightContrast: {
      control: "boolean",
      description: "Whether to use high contrast",
    },
  },
  args: {
    for: "",
    label: "Label",
    color: "#2c2c2c",
    hightContrast: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    label: "Username",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <Input placeholder="Enter username" class="w-64" color="#2c2c2c" variant="none" />
      </Label>
    `,
  }),
};

// 2. With For Focus
export const WithForFocus: Story = {
  args: {
    label: "Email",
    for: "email-input",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <Input id="email-input" placeholder="Enter email" class="w-64" color="#2c2c2c" variant="none" />
      </Label>
    `,
  }),
};

// 3. Without For (no focus)
export const WithoutFor: Story = {
  args: {
    label: "No Focus",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <Input placeholder="Click label - no focus" class="w-64" color="#2c2c2c" variant="none" />
      </Label>
    `,
  }),
};

// 4. With Wrapper
export const WithWrapper: Story = {
  args: {
    label: "Search",
    for: "search-input",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">🔍</span>
          <Input id="search-input" placeholder="Search..." class="w-64 pl-10" color="#2c2c2c" variant="outlined" />
        </div>
      </Label>
    `,
  }),
};

// 5. With Wrapped Border
export const WithWrappedBorder: Story = {
  args: {
    label: "Name",
    for: "name-input",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <div class="border border-charcoal-200 rounded-cu p-1">
          <Input id="name-input" placeholder="Enter name" class="w-64" color="#2c2c2c" variant="none" />
        </div>
      </Label>
    `,
  }),
};

// 6. With Native Input
export const WithNativeInput: Story = {
  args: {
    label: "Native Input",
    for: "native-input",
  },
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <input
          id="native-input"
          type="text"
          placeholder="Native input"
          class="w-64 py-2 px-3 rounded-cu border border-charcoal-200 font-sans focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </Label>
    `,
  }),
};

// 7. Multiple Labels with Focus
export const MultipleLabels: Story = {
  render: () => ({
    components: { Label, Input },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <Label label="First Name" for="first-name">
          <Input id="first-name" placeholder="John" class="w-full" color="#2c2c2c" variant="none" />
        </Label>
        <Label label="Last Name" for="last-name">
          <Input id="last-name" placeholder="Doe" class="w-full" color="#2c2c2c" variant="none" />
        </Label>
        <Label label="Email" for="email-multi">
          <Input id="email-multi" placeholder="john@example.com" type="email" class="w-full" color="#2c2c2c" variant="none" />
        </Label>
      </div>
    `,
  }),
};

// 8. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Label, Input },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="(color, i) in colors" :key="color" class="flex items-center gap-4">
          <Label :label="'Color ' + (i + 1)" :for="'color-input-' + i" :color="color">
            <Input :id="'color-input-' + i" placeholder="Input" class="w-64" :color="color" variant="none" />
          </Label>
        </div>
      </div>
    `,
  }),
};

// 9. With Flex Container
export const WithFlexContainer: Story = {
  args: {
    label: "Zip Code:",
    for: "zip-input",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args" class="flex items-center gap-3">
        <Input id="zip-input" placeholder="00000" class="flex-1" color="#2c2c2c" variant="outlined" />
      </Label>
    `,
  }),
};

// 10. With Wrapper and Multiple Inputs (focus first)
export const WithWrapperMultipleInputs: Story = {
  args: {
    label: "Date Range",
    for: "date-from",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <div class="flex gap-2">
          <Input id="date-from" placeholder="From" type="date" class="flex-1" color="#2c2c2c" variant="outlined" />
          <span class="self-center text-charcoal-400 font-sans">to</span>
          <Input placeholder="To" type="date" class="flex-1" color="#2c2c2c" variant="outlined" />
        </div>
      </Label>
    `,
  }),
};

// 11. Form Example
export const FormExample: Story = {
  render: () => ({
    components: { Label, Input },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <Label label="First Name *" for="form-first">
          <Input id="form-first" placeholder="John" class="w-full" color="#3b82f6" variant="outlined" />
        </Label>
        <Label label="Last Name *" for="form-last">
          <Input id="form-last" placeholder="Doe" class="w-full" color="#3b82f6" variant="outlined" />
        </Label>
        <Label label="Email *" for="form-email">
          <Input id="form-email" placeholder="john@example.com" type="email" class="w-full" color="#22c55e" variant="soft" />
        </Label>
        <Label label="Phone" for="form-phone">
          <Input id="form-phone" placeholder="+52 123 456 7890" type="tel" class="w-full" color="#2c2c2c" variant="ghost" />
        </Label>
      </div>
    `,
  }),
};

// 12. No Label Text (slot only)
export const NoLabelText: Story = {
  args: {
    label: "",
    for: "slot-only-input",
  },
  render: (args) => ({
    components: { Label, Input },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <Input id="slot-only-input" placeholder="Label text is hidden" class="w-64" color="#2c2c2c" variant="none" />
      </Label>
    `,
  }),
};

// 13. With Textarea
export const WithTextarea: Story = {
  args: {
    label: "Descripción",
    for: "textarea-desc",
  },
  render: (args) => ({
    components: { Label, Textarea },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <Textarea id="textarea-desc" placeholder="Escribe una descripción..." rows="4" class="w-64" color="#2c2c2c" variant="none" />
      </Label>
    `,
  }),
};

// 14. With Textarea Wrapped
export const WithTextareaWrapped: Story = {
  args: {
    label: "Comentarios",
    for: "textarea-coments",
  },
  render: (args) => ({
    components: { Label, Textarea },
    setup: () => ({ args }),
    template: `
      <Label v-bind="args">
        <div class="border border-charcoal-200 rounded-cu p-1">
          <Textarea id="textarea-coments" placeholder="Comentarios..." rows="3" class="w-64" color="#2c2c2c" variant="none" />
        </div>
      </Label>
    `,
  }),
};
