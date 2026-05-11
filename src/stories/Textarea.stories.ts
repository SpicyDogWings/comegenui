import Textarea from "../components/form/Textarea.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Textarea> = {
  title: "Components/Form/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the textarea (e.g., #3b82f6)",
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
    rows: {
      control: "number",
      description: "Number of rows",
    },
    noResize: {
      control: "boolean",
      description: "Disable resize",
    },
    modelValue: {
      control: "text",
      description: "The textarea value (v-model)",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "none",
    placeholder: "Enter text...",
    disabled: false,
    readOnly: false,
    rows: 3,
    noResize: false,
    modelValue: "",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "none",
    placeholder: "Default Textarea",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 2. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
    placeholder: "Outlined Textarea",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 3. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
    placeholder: "Soft Textarea",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 4. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
    placeholder: "Subtle Textarea",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 5. Ghost
export const Ghost: Story = {
  args: {
    variant: "ghost",
    placeholder: "Ghost Textarea",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled Textarea",
    modelValue: "Cannot edit",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 7. ReadOnly
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: "Read-only Textarea",
    modelValue: "Read only text",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 8. With Rows
export const WithRows: Story = {
  args: {
    rows: 5,
    placeholder: "Textarea with 5 rows",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 9. No Resize
export const NoResize: Story = {
  args: {
    noResize: true,
    placeholder: "Cannot resize",
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: "<Textarea v-bind='args' class='w-64' />",
  }),
};

// 10. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Textarea },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <Textarea :color="color" variant="ghost" placeholder="ghost" class="w-48" :rows="2" />
          <Textarea :color="color" variant="soft" placeholder="soft" class="w-48" :rows="2" />
          <Textarea :color="color" variant="outlined" placeholder="outlined" class="w-48" :rows="2" />
          <span class="text-sm w-16">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 11. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Textarea },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <Textarea color="#2c2c2c" :variant="variant" :placeholder="variant" class="w-64" :rows="2" />
          <span class="text-sm w-20">{{ variant }}</span>
        </div>
      </div>
    `,
  }),
};
