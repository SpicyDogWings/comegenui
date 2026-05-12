import Table from "../components/Table.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The hex color of the table (e.g., #2c2c2c)",
    },
    variant: {
      control: "select",
      options: ["solid", "soft", "ghost"],
      description: "Table button variant",
    },
    columns: {
      control: "object",
      description: "Table columns configuration",
    },
    data: {
      control: "object",
      description: "Table data",
    },
    empty: {
      control: "text",
      description: "Message to show when table is empty",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    searchEnabled: {
      control: "boolean",
      description: "Whether search is enabled",
    },
    searchFields: {
      control: "object",
      description: "Fields to search in",
    },
    searchValue: {
      control: "text",
      description: "Current search value",
    },
    pagination: {
      control: "boolean",
      description: "Whether pagination is enabled",
    },
    itemsPerPage: {
      control: "number",
      description: "Items per page",
    },
    showPageSize: {
      control: "boolean",
      description: "Whether to show page size selector",
    },
    pageSizeOptions: {
      control: "object",
      description: "Available page size options",
    },
    tableMaxHeight: {
      control: "text",
      description: "Maximum height of the table",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    searchEnabled: false,
    pagination: false,
    itemsPerPage: 10,
    showPageSize: false,
    pageSizeOptions: [5, 10, 20, 50],
    empty: "No hay datos que mostrar",
    searchPlaceholder: "Buscar...",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ];
      const data = [
        { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", status: "Pending" },
        { id: 5, name: "Charlie Davis", email: "charlie@example.com", status: "Active" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 2. With Search
export const WithSearch: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    searchEnabled: true,
    searchPlaceholder: "Search users...",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
      ];
      const data = [
        { id: 1, name: "Product A", category: "Electronics" },
        { id: 2, name: "Product B", category: "Clothing" },
        { id: 3, name: "Product C", category: "Electronics" },
        { id: 4, name: "Product D", category: "Books" },
        { id: 5, name: "Product E", category: "Home" },
        { id: 6, name: "Product F", category: "Electronics" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 3. With Pagination
export const WithPagination: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 4. With Badges
export const WithBadges: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        {
          key: "status",
          label: "Status",
          badges: (row: any, index: number) => [
            {
              value: row.status,
              color: row.status === "Active" ? "#22c55e" : row.status === "Pending" ? "#f59e0b" : "#ef4444",
              variant: "soft",
            },
          ],
        },
      ];
      const data = [
        { id: 1, name: "User 1", status: "Active" },
        { id: 2, name: "User 2", status: "Inactive" },
        { id: 3, name: "User 3", status: "Pending" },
        { id: 4, name: "User 4", status: "Active" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 5. With Buttons
export const WithButtons: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        {
          key: "actions",
          label: "Actions",
          buttons: () => [
            { label: "Edit", color: "#3b82f6", variant: "ghost" },
            { label: "Delete", color: "#ef4444", variant: "ghost" },
          ],
        },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 6. With Editable
export const WithEditable: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const tableRef = ref(null);
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name", editable: true },
        { key: "age", label: "Age", editable: true },
      ];
      const data = [
        { id: 1, name: "John", age: "25" },
        { id: 2, name: "Jane", age: "30" },
        { id: 3, name: "Bob", age: "22" },
      ];
      return { args, columns, data, tableRef };
    },
    template: `
      <Table v-bind='args' ref="tableRef" :columns="columns" :data="data" />
    `,
  }),
};

// 7. With Scroll
export const WithScroll: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    pagination: true,
    itemsPerPage: 10,
    tableMaxHeight: "300px",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ];
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['Active', 'Inactive', 'Pending'][i % 3],
      }));
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 8. All Features
export const AllFeatures: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
    searchEnabled: true,
    pagination: true,
    itemsPerPage: 5,
    showPageSize: true,
    pageSizeOptions: [5, 10, 20],
    tableMaxHeight: "400px",
    searchPlaceholder: "Search all features...",
    empty: "No matching records found",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name", editable: true },
        {
          key: "status",
          label: "Status",
          badges: (row: any) => [
            {
              value: row.status,
              color: row.status === "Active" ? "#22c55e" : row.status === "Pending" ? "#f59e0b" : "#ef4444",
              variant: "soft",
            },
          ],
        },
        {
          key: "actions",
          label: "Actions",
          buttons: () => [
            { label: "View", color: "#3b82f6", variant: "ghost" },
            { label: "Edit", color: "#2c2c2c", variant: "ghost" },
          ],
          editable: false,
        },
      ];
      const data = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: ["Active", "Inactive", "Pending"][i % 3],
      }));
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 9. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { Table },
    setup: () => {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#2c2c2c"] as const;
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      return { colors, columns, data };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <div v-for="color in colors" :key="color" class="border rounded-cu p-4">
          <h3 class="font-sans font-bold mb-2">{{ color }}</h3>
          <Table :color="color" :variant="'solid'" :columns="columns" :data="data" />
        </div>
      </div>
    `,
  }),
};

// 10. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { Table },
    setup: () => {
      const variants = ["solid", "soft", "ghost"] as const;
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      return { variants, columns, data };
    },
    template: `
      <div class="flex gap-2 flex-wrap">
        <div v-for="variant in variants" :key="variant" class="border rounded-cu p-4">
          <h3 class="font-sans font-bold mb-2">{{ variant }}</h3>
          <Table :color="'#2c2c2c'" :variant="variant" :columns="columns" :data="data" />
        </div>
      </div>
    `,
  }),
};
