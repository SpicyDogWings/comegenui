import Pagination from "../components/Pagination.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color for pagination buttons",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle"],
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
    color: "#2c2c2c",
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
    color: "#2c2c2c",
    variant: "soft",
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    showPageSize: false,
    showFirstAndLast: false,
  },
  render: (args) => ({
    components: { Pagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      return { args, currentPage };
    },
    template: "<Pagination v-bind='args' v-model:currentPage='currentPage' />",
  }),
};

// 2. With Page Size
export const WithPageSize: Story = {
  args: {
    color: "#2c2c2c",
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
    components: { Pagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <Pagination 
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
    color: "#2c2c2c",
    variant: "soft",
    currentPage: 5,
    totalPages: 20,
    totalItems: 200,
    itemsPerPage: 10,
    showPageSize: false,
    showFirstAndLast: true,
  },
  render: (args) => ({
    components: { Pagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      return { args, currentPage };
    },
    template: "<Pagination v-bind='args' v-model:currentPage='currentPage' />",
  }),
};

// 4. With Page Size And Many Pages
export const WithPageSizeAndManyPages: Story = {
  args: {
    color: "#2c2c2c",
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
    components: { Pagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <Pagination 
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
    color: "#2c2c2c",
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
    components: { Pagination },
    setup: () => {
      const currentPage = ref(args.currentPage);
      const itemsPerPage = ref(args.itemsPerPage);
      return { args, currentPage, itemsPerPage };
    },
    template: `
      <Pagination 
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
    components: { Pagination },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#2c2c2c"] as const;
      const currentPages = Array(colors.length).fill(1);
      return { colors, currentPages };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Pagination v-for="(color, idx) in colors" :key="color" :color="color" :currentPage="currentPages[idx]" :totalPages="5" :totalItems="50" />
      </div>
    `,
  }),
};

// 7. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Pagination },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
      const currentPages = Array(variants.length).fill(1);
      return { variants, currentPages };
    },
    template: `
      <div class="flex flex-col gap-4">
        <Pagination v-for="(variant, idx) in variants" :key="variant" color="#3b82f6" :variant="variant" :currentPage="currentPages[idx]" :totalPages="5" :totalItems="50" />
      </div>
    `,
  }),
};
