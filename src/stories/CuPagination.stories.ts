import CuPagination from "../components/Pagination.ce.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuPagination> = {
  title: "Components/Pagination",
  component: CuPagination,
  tags: ["autodocs"],
  argTypes: {
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

// 3. Many Pages
export const ManyPages: Story = {
  args: {
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

// 5. Custom Page Sizes
export const CustomPageSizes: Story = {
  args: {
    currentPage: 1,
    totalPages: 15,
    totalItems: 150,
    itemsPerPage: 10,
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
