import CuTextarea from "../components/form/Textarea.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuTextarea> = {
  title: "Custom Elements/Textarea",
  component: CuTextarea,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme of the textarea",
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
    color: "neutral",
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
    color: "neutral",
    variant: "none",
    placeholder: "Default CuTextarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 2. Primary
export const Primary: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    placeholder: "Primary Textarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 3. Success
export const Success: Story = {
  args: {
    color: "success",
    variant: "soft",
    placeholder: "Success Textarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 4. Warning
export const Warning: Story = {
  args: {
    color: "warning",
    variant: "ghost",
    placeholder: "Warning Textarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 5. Danger
export const Danger: Story = {
  args: {
    color: "danger",
    variant: "subtle",
    placeholder: "Danger Textarea",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 6. Disabled
export const Disabled: Story = {
  args: {
    color: "primary",
    variant: "outlined",
    disabled: true,
    placeholder: "Disabled CuTextarea",
    modelValue: "Cannot edit",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 7. ReadOnly
export const ReadOnly: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    readOnly: true,
    placeholder: "Read-only CuTextarea",
    modelValue: "Read only text",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 8. With Rows
export const WithRows: Story = {
  args: {
    rows: 5,
    placeholder: "CuTextarea with 5 rows",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 9. No Resize
export const NoResize: Story = {
  args: {
    noResize: true,
    placeholder: "Cannot resize",
  },
  render: (args) => ({
    components: { CuTextarea },
    setup: () => ({ args }),
    template: "<CuTextarea v-bind='args' class='w-64' />",
  }),
};

// 10. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { CuTextarea },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex items-center gap-4">
          <CuTextarea :color="color" variant="ghost" :placeholder="color" class="w-48" :rows="2" />
          <CuTextarea :color="color" variant="soft" :placeholder="color" class="w-48" :rows="2" />
          <CuTextarea :color="color" variant="outlined" :placeholder="color" class="w-48" :rows="2" />
          <span class="text-sm w-16">{{ color }}</span>
        </div>
      </div>
    `,
  }),
};

// 11. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { CuTextarea },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <CuTextarea color="primary" :variant="variant" :placeholder="variant" class="w-64" :rows="2" />
          <span class="text-sm w-20">{{ variant }}</span>
        </div>
      </div>
    `,
  }),
};

// 12. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuTextarea },
    setup: () => {
      const variants = ["ghost", "outlined", "soft", "subtle", "none"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <CuTextarea v-for="color in colors" :key="color" :variant="variant" :color="color" :placeholder="color" class="w-40" :rows="2" />
          </div>
        </div>
      </div>
    `,
  }),
};
