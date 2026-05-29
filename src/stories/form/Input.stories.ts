import Input from "../../components/form/Input.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Input> = {
  title: "Components/Form/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the input (e.g., #3b82f6)",
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
    modelValue: {
      control: "text",
      description: "The input value (v-model)",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    type: "text",
    placeholder: "Enter text...",
    disabled: false,
    readOnly: false,
    modelValue: "",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    placeholder: "Default Input",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 2. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
    placeholder: "Outlined Input",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 3. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
    placeholder: "Soft Input",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 4. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
    placeholder: "Subtle Input",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 5. None
export const None: Story = {
  args: {
    variant: "none",
    placeholder: "None Input",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 6. Password
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 7. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled Input",
    modelValue: "Cannot edit",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 8. ReadOnly
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: "Read-only Input",
    modelValue: "Read only text",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 9. With Value
export const WithValue: Story = {
  args: {
    modelValue: "Pre-filled text",
    placeholder: "Input with value",
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: "<Input v-bind='args' class='w-64' />",
  }),
};

// 10. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Input },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <Input :color="color" variant="ghost" placeholder="ghost" class="w-48" />
          <Input :color="color" variant="soft" placeholder="soft" class="w-48" />
          <Input :color="color" variant="outlined" placeholder="outlined" class="w-48" />
          <span class="text-sm w-20">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 11. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Input },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <Input color="#2c2c2c" :variant="variant" :placeholder="variant" class="w-64" />
          <span class="text-sm w-20">{{ variant }}</span>
        </div>
      </div>
    `,
  }),
};

// 12. Type Showcase
export const TypeShowcase: Story = {
  render: () => ({
    components: { Input },
    setup: () => {
      const types = ["text", "password", "email", "number"] as const;
      return { types };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Input v-for="type in types" :key="type" :type="type" :placeholder="type" class="w-64" />
      </div>
    `,
  }),
};
