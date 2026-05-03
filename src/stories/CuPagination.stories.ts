import CuPagination from "../components/Pagination.ce.vue";
import "./Pagination.css";

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
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showPageSize: false,
    pageSizeOptions: [5, 10, 20, 50],
    showFirstAndLast: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
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

export const WithPageSize: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showPageSize: true,
    pageSizeOptions: [5, 10, 20, 50],
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

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
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
