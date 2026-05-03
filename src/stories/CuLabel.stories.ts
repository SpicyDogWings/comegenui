import CuLabel from "../components/Label.ce.vue";
import CuInput from "../components/form/Input.ce.vue";
import CuButton from "../components/Button.ce.vue";

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

// 4. WithMultipleInputs
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

// 5. WithIcon
export const WithIcon: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Search with Icon</span>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">🔍</span>
          <CuInput placeholder="Search..." class="w-64 pl-10" color="primary" variant="outlined" />
        </div>
      </CuLabel>
    `,
  }),
};

// 6. WithAllInputTypes
export const WithAllInputTypes: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const types = [
        { type: "text", placeholder: "Text input", label: "Text" },
        { type: "email", placeholder: "email@example.com", label: "Email" },
        { type: "password", placeholder: "••••••••", label: "Password" },
        { type: "number", placeholder: "123", label: "Number" },
        { type: "tel", placeholder: "+1 234 567 890", label: "Tel" },
        { type: "url", placeholder: "https://example.com", label: "URL" },
      ] as const;
      return { types };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuLabel v-for="t in types" :key="t.type" class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">{{ t.label }}</span>
          <CuInput :type="t.type" :placeholder="t.placeholder" class="w-64" color="neutral" variant="none" />
        </CuLabel>
      </div>
    `,
  }),
};

// 7. WithNativeInput
export const WithNativeInput: Story = {
  render: () => ({
    components: { CuLabel },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Native HTML Input</span>
        <input 
          type="text" 
          placeholder="Native input still works" 
          class="w-64 py-2 px-3 rounded-cu border border-charcoal-200 font-sans focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </CuLabel>
    `,
  }),
};

// 8. WithAllVariants
export const WithAllVariants: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      return { variants };
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <CuLabel v-for="variant in variants" :key="variant" class="flex flex-col gap-2 w-48">
          <span class="font-sans text-charcoal-800 text-sm">{{ variant }}</span>
          <CuInput :variant="variant" placeholder="Input" class="w-full" color="primary" />
        </CuLabel>
      </div>
    `,
  }),
};

// 9. WithAllColors
export const WithAllColors: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { colors };
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <CuLabel v-for="color in colors" :key="color" class="flex flex-col gap-2 w-48">
          <span class="font-sans text-charcoal-800 text-sm">{{ color }}</span>
          <CuInput :color="color" placeholder="Input" class="w-full" variant="outlined" />
        </CuLabel>
      </div>
    `,
  }),
};

// 10. WithColorVariantsMatrix
export const WithColorVariantsMatrix: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
      return { colors, variants };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
          <h3 class="font-sans text-charcoal-800 font-medium">{{ color }}</h3>
          <div class="flex flex-wrap gap-2">
            <CuLabel v-for="variant in variants" :key="variant" class="flex flex-col gap-1 w-36">
              <span class="font-sans text-charcoal-600 text-xs">{{ variant }}</span>
              <CuInput :color="color" :variant="variant" placeholder="" class="w-full" />
            </CuLabel>
          </div>
        </div>
      </div>
    `,
  }),
};

// 11. WithFlexContainer
export const WithFlexContainer: Story = {
  render: () => ({
    components: { CuLabel, CuInput, CuButton },
    setup: () => ({}),
    template: `
      <CuLabel class="flex items-center gap-3">
        <span class="font-sans text-charcoal-800 whitespace-nowrap">Zip Code:</span>
        <CuInput placeholder="00000" class="flex-1" color="primary" variant="outlined" />
        <CuButton color="primary" variant="solid">Search</CuButton>
      </CuLabel>
    `,
  }),
};

// 12. WithMultipleInputsFirstFocus
export const WithMultipleInputsFirstFocus: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Date Range (click focuses first input)</span>
        <div class="flex gap-2">
          <CuInput placeholder="From" type="date" class="flex-1" color="neutral" variant="outlined" />
          <span class="self-center text-charcoal-400 font-sans">to</span>
          <CuInput placeholder="To" type="date" class="flex-1" color="neutral" variant="outlined" />
        </div>
      </CuLabel>
    `,
  }),
};

// 13. FormExample
export const FormExample: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">First Name *</span>
          <CuInput placeholder="John" class="w-full" color="primary" variant="outlined" />
        </CuLabel>
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">Last Name *</span>
          <CuInput placeholder="Doe" class="w-full" color="primary" variant="outlined" />
        </CuLabel>
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">Email *</span>
          <CuInput placeholder="juan@example.com" type="email" class="w-full" color="success" variant="soft" />
        </CuLabel>
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">Phone</span>
          <CuInput placeholder="+52 123 456 7890" type="tel" class="w-full" color="neutral" variant="ghost" />
        </CuLabel>
        <CuLabel class="flex flex-col gap-2">
          <span class="font-sans text-charcoal-800">Password</span>
          <CuInput placeholder="••••••••" type="password" class="w-full" color="warning" variant="subtle" />
        </CuLabel>
      </div>
    `,
  }),
};

// 14. WithWrapperBorder
export const WithWrapperBorder: Story = {
  render: () => ({
    components: { CuLabel, CuInput },
    setup: () => ({}),
    template: `
      <CuLabel class="flex flex-col gap-2">
        <span class="font-sans text-charcoal-800">Field with Wrapper</span>
        <div class="border border-charcoal-200 rounded-cu p-1">
          <CuInput placeholder="Inside a bordered div" class="w-64" color="neutral" variant="none" />
        </div>
      </CuLabel>
    `,
  }),
};
