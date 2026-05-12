import CuPagination from "../../components/Pagination.ce.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuPagination> = {
  title: "Custom Elements/Pagination",
  component: CuPagination,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "The color theme for pagination buttons",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle"],
      description: "The visual variant for pagination buttons",
    },
    currentPage: {
      control: "number",
      description: "The current page number",
    },
    totalPages: {
      control: "number",
      description: "The total number of pages",
    },
    totalItems: {
      control: "number",
      description: "The total number of items",
    },
    itemsPerPage: {
      control: "number",
      description: "Number of items per page",
    },
    showPageSize: {
      control: "boolean",
      description: "Whether to show page size selector",
    },
    pageSizeOptions: {
      control: "object",
      description: "Available page size options",
    },
    showFirstAndLast: {
      control: "boolean",
      description: "Whether to show first and last page buttons",
    },
  },
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    showPageSize: false,
    pageSizeOptions: [5, 10, 20, 50],
    showFirstAndLast: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    showPageSize: false,
    showFirstAndLast: false,
  },
  render: (args) => ({
    components: { CuPagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      return { args, currentPage };
    },
    template: "<CuPagination v-bind='args' v-model:currentPage='currentPage' />",
  }),
};

// 2. With Page Size
export const WithPageSize: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showPageSize: true,
    pageSizeOptions: [5, 10, 20, 50],
    showFirstAndLast: false,
  },
  render: (args) => ({
    components: { CuPagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <CuPagination 
        v-bind='args' 
        v-model:currentPage='currentPage'
        v-model:itemsPerPage='itemsPerPage'
      />
    `,
  }),
};

// 3. With Many Pages
export const WithManyPages: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 5,
    totalPages: 20,
    totalItems: 200,
    itemsPerPage: 10,
    showPageSize: false,
    showFirstAndLast: true,
  },
  render: (args) => ({
    components: { CuPagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      return { args, currentPage };
    },
    template: "<CuPagination v-bind='args' v-model:currentPage='currentPage' />",
  }),
};

// 4. With Page Size And Many Pages
export const WithPageSizeAndManyPages: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 5,
    totalPages: 20,
    totalItems: 200,
    itemsPerPage: 10,
    showPageSize: true,
    pageSizeOptions: [5, 10, 20, 50, 100],
    showFirstAndLast: true,
  },
  render: (args) => ({
    components: { CuPagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <CuPagination 
        v-bind='args' 
        v-model:currentPage='currentPage'
        v-model:itemsPerPage='itemsPerPage'
      />
    `,
  }),
};

// 5. With Custom Page Sizes
export const WithCustomPageSizes: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    currentPage: 1,
    totalPages: 15,
    totalItems: 150,
    itemsPerPage: 3,
    showPageSize: true,
    pageSizeOptions: [3, 6, 9, 12, 15],
    showFirstAndLast: true,
  },
  render: (args) => ({
    components: { CuPagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <CuPagination 
        v-bind='args' 
        v-model:currentPage='currentPage'
        v-model:itemsPerPage='itemsPerPage'
      />
    `,
  }),
};

// 6. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { CuPagination },
    setup: () => {
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      const currentPages = Array(colors.length).fill(1);
      return { colors, currentPages };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuPagination v-for="(color, idx) in colors" :key="color" :color="color" :currentPage="currentPages[idx]" :totalPages="5" :totalItems="50" />
      </div>
    `,
  }),
};

// 7. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { CuPagination },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle"] as const;
      const currentPages = Array(variants.length).fill(1);
      return { variants, currentPages };
    },
    template: `
      <div class="flex flex-col gap-4">
        <CuPagination v-for="(variant, idx) in variants" :key="variant" color="primary" :variant="variant" :currentPage="currentPages[idx]" :totalPages="5" :totalItems="50" />
      </div>
    `,
  }),
};

// 8. All Combinations
export const AllCombinations: Story = {
  render: () => ({
    components: { CuPagination },
    setup: () => {
      const variants = ["outlined", "soft", "ghost", "subtle"] as const;
      const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
      return { variants, colors };
    },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
          <h3 class="text-sm font-medium text-charcoal-700 font-sans">{{ variant }}</h3>
          <div class="flex gap-2 flex-wrap">
            <CuPagination v-for="color in colors" :key="color" :variant="variant" :color="color" :totalPages="5" :totalItems="50" />
          </div>
        </div>
      </div>
    `,
  }),
};
