import Select from "../../components/form/Select.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const sampleOptions = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "img", label: "Imagen" },
  { value: "xls", label: "Excel" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Form/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the select (e.g., #3b82f6)",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle", "none"],
      description: "The visual variant of the select",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    modelValue: {
      control: "text",
      description: "The selected value (v-model)",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    placeholder: "Seleccione una opción",
    disabled: false,
    modelValue: "",
    options: sampleOptions,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    placeholder: "Seleccione una opción",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 2. Outlined
export const Outlined: Story = {
  args: {
    variant: "outlined",
    placeholder: "Outlined Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 3. Soft
export const Soft: Story = {
  args: {
    variant: "soft",
    placeholder: "Soft Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 4. Subtle
export const Subtle: Story = {
  args: {
    variant: "subtle",
    placeholder: "Subtle Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 5. None
export const None: Story = {
  args: {
    variant: "none",
    placeholder: "None Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled Select",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 7. With Value
export const WithValue: Story = {
  args: {
    modelValue: "pdf",
    placeholder: "Select with value",
    options: sampleOptions,
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: "<Select v-bind='args' class='w-64' />",
  }),
};

// 8. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Select },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#2c2c2c"] as const;
      return { colors, sampleOptions };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <Select :color="color" variant="ghost" placeholder="ghost" :options="sampleOptions" class="w-48" />
          <Select :color="color" variant="soft" placeholder="soft" :options="sampleOptions" class="w-48" />
          <Select :color="color" variant="outlined" placeholder="outlined" :options="sampleOptions" class="w-48" />
          <span class="text-sm w-20">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 9. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Select },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants, sampleOptions };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <Select color="#2c2c2c" :variant="variant" :placeholder="variant" :options="sampleOptions" class="w-64" />
          <span class="text-sm w-20">{{ variant }}</span>
        </div>
      </div>
    `,
  }),
};
