import CuTable from "../../components/Table.ce.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuTable> = {
  title: "Custom Elements/Table",
  component: CuTable,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
      description: "Table button color name",
    },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle"],
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
    color: "neutral",
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
  render: () => ({
    components: { CuTable },
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
      return { columns, data };
    },
    template: `
      <CuTable :columns="columns" :data="data" />
    `,
  }),
};

// 2. With search
export const WithSearch: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
    searchEnabled: true,
    searchPlaceholder: "Search users...",
  },
  render: (args) => ({
    components: { CuTable },
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
      <CuTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 3. With pagination
export const WithPagination: Story = {
  args: {
    color: "neutral",
    variant: "soft",
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { CuTable },
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
      <CuTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 4. With badges
export const WithBadges: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
  },
  render: () => ({
    components: { CuTable },
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
              color: row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger",
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
      return { columns, data };
    },
    template: `
      <CuTable :color="args.color" :variant="args.variant" :columns="columns" :data="data" />
    `,
  }),
};

// 5. With buttons
export const WithButtons: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
  },
  render: () => ({
    components: { CuTable },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        {
          key: "actions",
          label: "Actions",
          buttons: () => [
            { label: "Edit", color: "primary", variant: "ghost" },
            { label: "Delete", color: "danger", variant: "ghost" },
          ],
        },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ];
      return { columns, data };
    },
    template: `
      <CuTable :color="args.color" :variant="args.variant" :columns="columns" :data="data" />
    `,
  }),
};

// 6. With Editable
export const WithEditable: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
  },
  render: () => ({
    components: { CuTable },
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
      return { columns, data, tableRef };
    },
    template: `
      <CuTable ref="tableRef" :color="args.color" :variant="args.variant" :columns="columns" :data="data" />
    `,
  }),
};

// 7. With Scroll
export const WithScroll: Story = {
  args: {
    color: "neutral",
    variant: "ghost",
    pagination: true,
    itemsPerPage: 10,
    tableMaxHeight: "300px",
  },
  render: (args) => ({
    components: { CuTable },
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
      <CuTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 8. All features
export const AllFeatures: Story = {
  args: {
    color: "neutral",
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
    components: { CuTable },
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
              color: row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger",
              variant: "soft",
            },
          ],
        },
        {
          key: "actions",
          label: "Actions",
          buttons: () => [
            { label: "View", color: "primary", variant: "ghost" },
            { label: "Edit", color: "neutral", variant: "ghost" },
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
      <CuTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 9. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { CuTable },
    setup: () => {
      const colors = [
        { name: "Primary", value: "primary" },
        { name: "Neutral", value: "neutral" },
        { name: "Success", value: "success" },
        { name: "Warning", value: "warning" },
        { name: "Danger", value: "danger" },
      ];
      const columns = [
        { key: "name", label: "Color" },
        { key: "value", label: "Color Name" },
      ];
      return { colors, columns };
    },
    template: `
      <div class="space-y-4">
        <div v-for="color in colors" :key="color.value" class="border rounded-cu p-4">
          <h3 class="font-sans font-bold mb-2">{{ color.name }}</h3>
          <CuTable :color="color.value" :variant="'soft'" :columns="columns" :data="[color]" />
        </div>
      </div>
    `,
  }),
};

// 10. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { CuTable },
    setup: () => {
      const variants = ["solid", "outlined", "soft", "ghost", "subtle"];
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
      <div class="space-y-4">
        <div v-for="variant in variants" :key="variant" class="border rounded-cu p-4">
          <h3 class="font-sans font-bold mb-2">{{ variant }}</h3>
          <CuTable :color="'neutral'" :variant="variant" :columns="columns" :data="data" />
        </div>
      </div>
    `,
  }),
};
