import TableNative from "../components/TableNative.vue";
import Badge from "../components/Badge.vue";
import Button from "../components/Button.vue";
import Input from "../components/form/Input.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof TableNative> = {
  title: "Native/TableNative",
  component: TableNative,
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
      description: "Table columns configuration (key, label, editable, etc.)",
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
    stickyHeader: {
      control: "boolean",
      description: "Whether header sticks to top on scroll",
    },
    hoverable: {
      control: "boolean",
      description: "Whether rows are hoverable",
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
    stickyHeader: true,
    hoverable: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default - Simple data display
export const Default: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { TableNative },
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
      ];
      return { args, columns, data };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 2. With Custom Cell Slots - Badges
export const WithBadges: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { TableNative, Badge },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
      ];
      const data = [
        { id: 1, name: "User 1", status: "Active" },
        { id: 2, name: "User 2", status: "Inactive" },
        { id: 3, name: "User 3", status: "Pending" },
      ];
      const getStatusColor = (status: string) => {
        if (status === "Active") return "#22c55e";
        if (status === "Pending") return "#f59e0b";
        return "#ef4444";
      };
      return { args, columns, data, getStatusColor };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data">
        <template #cell-status="{ value }">
          <Badge :color="getStatusColor(value)" variant="soft">
            {{ value }}
          </Badge>
        </template>
      </TableNative>
    `,
  }),
};

// 3. With Custom Cell Slots - Buttons
export const WithButtons: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { TableNative, Button },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "actions", label: "Actions" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ];
      const handleEdit = (row: any) => console.log("Edit:", row);
      const handleDelete = (row: any) => console.log("Delete:", row);
      return { args, columns, data, handleEdit, handleDelete };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data">
        <template #cell-actions="{ row }">
          <div class="flex gap-1">
            <Button color="#3b82f6" variant="ghost" @click="handleEdit(row)">Edit</Button>
            <Button color="#ef4444" variant="ghost" @click="handleDelete(row)">Delete</Button>
          </div>
        </template>
      </TableNative>
    `,
  }),
};

// 4. With Custom Header Slots
export const WithCustomHeaders: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
  },
  render: (args) => ({
    components: { TableNative },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "price", label: "Price" },
      ];
      const data = [
        { id: 1, name: "Product A", price: "$10" },
        { id: 2, name: "Product B", price: "$25" },
      ];
      return { args, columns, data };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data">
        <template #header-id>
          <span class="font-bold text-blue-500">ID</span>
        </template>
        <template #header-price>
          <span class="font-bold text-green-500">Price</span>
        </template>
      </TableNative>
    `,
  }),
};

// 5. With Search
export const WithSearch: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    searchEnabled: true,
    searchPlaceholder: "Search users...",
  },
  render: (args) => ({
    components: { TableNative },
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
      ];
      return { args, columns, data };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 6. With Pagination
export const WithPagination: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { TableNative },
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
      <TableNative v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 7. With Editable Cells
export const WithEditable: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { TableNative },
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
      <TableNative v-bind='args' ref="tableRef" :columns="columns" :data="data" />
    `,
  }),
};

// 8. Custom Empty State
export const WithCustomEmpty: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
  },
  render: (args) => ({
    components: { TableNative, Button },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data: any[] = [];
      const handleRefresh = () => console.log("Refresh clicked");
      return { args, columns, data, handleRefresh };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data">
        <template #empty>
          <div class="p-8 text-center">
            <p class="text-charcoal-500 mb-4">No users found</p>
            <Button color="#3b82f6" @click="handleRefresh">Refresh Data</Button>
          </div>
        </template>
      </TableNative>
    `,
  }),
};

// 9. Custom Search Slot
export const WithCustomSearch: Story = {
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    searchEnabled: true,
  },
  render: (args) => ({
    components: { TableNative, Input },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      const searchQuery = ref("");
      const handleSearch = (value: string) => {
        searchQuery.value = value;
      };
      return { args, columns, data, searchQuery, handleSearch };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data" :search-value="searchQuery" @update:search="handleSearch">
        <template #search="{ query, update }">
          <div class="p-3">
            <Input
              placeholder="Custom search..."
              :model-value="query"
              @update:modelValue="update"
              color="#3b82f6"
              variant="soft"
            />
          </div>
        </template>
      </TableNative>
    `,
  }),
};

// 10. All Features Combined
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
  },
  render: (args) => ({
    components: { TableNative, Badge, Button },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name", editable: true },
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" },
      ];
      const data = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: ["Active", "Inactive", "Pending"][i % 3],
      }));
      const getStatusColor = (status: string) => {
        if (status === "Active") return "#22c55e";
        if (status === "Pending") return "#f59e0b";
        return "#ef4444";
      };
      const handleEdit = (row: any) => console.log("Edit:", row);
      const handleDelete = (row: any) => console.log("Delete:", row);
      return { args, columns, data, getStatusColor, handleEdit, handleDelete };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data">
        <template #cell-status="{ value }">
          <Badge :color="getStatusColor(value)" variant="soft">
            {{ value }}
          </Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex gap-1">
            <Button color="#3b82f6" variant="ghost" size="sm" @click="handleEdit(row)">Edit</Button>
            <Button color="#ef4444" variant="ghost" size="sm" @click="handleDelete(row)">Delete</Button>
          </div>
        </template>
      </TableNative>
    `,
  }),
};

// 11. Color Showcase
export const ColorShowcase: Story = {
  render: () => ({
    components: { TableNative },
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
          <TableNative :color="color" variant="solid" :columns="columns" :data="data" />
        </div>
      </div>
    `,
  }),
};

// 12. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { TableNative },
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
          <TableNative color="#2c2c2c" :variant="variant" :columns="columns" :data="data" />
        </div>
      </div>
    `,
  }),
};

// 13. With Column Alignment
export const WithAlignment: Story = {
  args: {
    color: "#2c2c2c",
    variant: "soft",
  },
  render: (args) => ({
    components: { TableNative },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", align: "center" },
        { key: "name", label: "Name", align: "left" },
        { key: "price", label: "Price", align: "right" },
      ];
      const data = [
        { id: 1, name: "Product A", price: "$10.00" },
        { id: 2, name: "Product B", price: "$25.00" },
      ];
      return { args, columns, data };
    },
    template: `
      <TableNative v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};
