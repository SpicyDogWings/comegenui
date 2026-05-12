import Table from "../components/Table.vue";
import Badge from "../components/Badge.vue";
import Button from "../components/Button.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Table> = {
  title: "Components/Table/New",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "Table color",
    },
    variant: {
      control: { type: "select", options: ["solid", "soft", "ghost"] },
      description: "Table variant",
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
    stickyHeader: {
      control: "boolean",
      description: "Whether header should stick to top",
    },
    hoverable: {
      control: "boolean",
      description: "Whether rows should be hoverable",
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

// 1. Default with new template slot
export const DefaultWithTemplate: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name", editable: true },
        { key: "email", label: "Email", editable: true },
        { key: "status", label: "Status", editable: false },
      ];
      const data = [
        { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 2. With search enabled
export const WithSearch: Story = {
  args: {
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

// 3. With pagination
export const WithPagination: Story = {
  args: {
    pagination: true,
    itemsPerPage: 3,
    showPageSize: true,
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
      ];
      const data = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 4. With editable cells
export const WithEditable: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false },
        { key: "name", label: "Name", editable: true },
        { key: "age", label: "Age", editable: true },
        { key: "status", label: "Status", editable: true },
      ];
      const data = [
        { id: 1, name: "John", age: "25", status: "Active" },
        { id: 2, name: "Jane", age: "30", status: "Inactive" },
        { id: 3, name: "Bob", age: "22", status: "Pending" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 5. Custom template slot usage
export const CustomTemplateSlot: Story = {
  render: (args) => ({
    components: { Table, Badge },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" },
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
      <Table v-bind='args' :columns="columns" :data="data">
        <template #template="{ row, rowIndex, columns: slotColumns, getCellValue, editingCell, editValue, startEditing, saveEdit, cancelEdit }">
          <td
            v-for="col in slotColumns"
            :key="col.key"
            class="p-3 font-sans text-charcoal-800 border-b border-b-solid border-charcoal-100"
            :class="{
              'text-left': col.align !== 'center' && col.align !== 'right',
              'text-center': col.align === 'center',
              'text-right': col.align === 'right',
            }"
          >
            <!-- Custom rendering for status column -->
            <template v-if="col.key === 'status'">
              <Badge :color="getStatusColor(getCellValue(row, col))" variant="soft">
                {{ getCellValue(row, col) }}
              </Badge>
            </template>
            
            <!-- Custom rendering for actions column -->
            <template v-else-if="col.key === 'actions'">
              <div class="flex gap-2">
                <Button color="#3b82f6" variant="ghost" size="sm">Edit</Button>
                <Button color="#ef4444" variant="ghost" size="sm">Delete</Button>
              </div>
            </template>
            
            <!-- Default rendering for other columns -->
            <template v-else>
              <div v-if="col.editable && editingCell?.row === row && editingCell?.colKey === col.key">
                <input
                  v-model="editValue"
                  @blur="() => saveEdit(row, col)"
                  @keyup.escape="cancelEdit"
                  @keyup.enter="() => saveEdit(row, col)"
                  class="w-full p-1 border rounded"
                />
              </div>
              <div v-else @click="col.editable ? () => startEditing(row, col) : undefined" class="cursor-pointer">
                {{ getCellValue(row, col) }}
              </div>
            </template>
          </td>
        </template>
      </Table>
    `,
  }),
};

// 6. All features combined
export const AllFeatures: Story = {
  args: {
    color: "#1e40af",
    variant: "soft",
    searchEnabled: true,
    pagination: true,
    itemsPerPage: 5,
    showPageSize: true,
    tableMaxHeight: "400px",
    searchPlaceholder: "Search all features...",
    empty: "No matching records found",
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", editable: false, width: "80px" },
        { key: "name", label: "Name", editable: true },
        { key: "email", label: "Email", editable: true },
        { key: "status", label: "Status", editable: false },
        { key: "age", label: "Age", editable: true, align: "right" },
      ];
      const data = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ["Active", "Inactive", "Pending"][i % 3],
        age: Math.floor(20 + Math.random() * 30),
      }));
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 7. Custom cell slots (backward compatibility)
export const CustomCellSlots: Story = {
  render: (args) => ({
    components: { Table, Badge },
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
      <Table v-bind='args' :columns="columns" :data="data">
        <template #cell-status="{ value }">
          <Badge :color="getStatusColor(value)" variant="soft">
            {{ value }}
          </Badge>
        </template>
      </Table>
    `,
  }),
};

// 8. Custom header slots
export const CustomHeaderSlots: Story = {
  render: (args) => ({
    components: { Table },
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
      <Table v-bind='args' :columns="columns" :data="data">
        <template #header-id>
          <span class="font-bold text-blue-500">ID</span>
        </template>
        <template #header-price>
          <span class="font-bold text-green-500">Price</span>
        </template>
      </Table>
    `,
  }),
};

// 9. Custom empty slot
export const CustomEmptySlot: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data: any[] = [];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #empty>
          <span class="text-red-500">No data available!</span>
        </template>
      </Table>
    `,
  }),
};

// 10. Custom search slot
export const CustomSearchSlot: Story = {
  args: {
    searchEnabled: true,
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #search="{ query, update }">
          <div class="p-3 border rounded">
            <input
              :value="query"
              @input="(e) => update((e.target as HTMLInputElement).value)"
              placeholder="Custom search..."
              class="w-full p-2 border rounded"
            />
          </div>
        </template>
      </Table>
    `,
  }),
};

// 11. Custom pagination slot
export const CustomPaginationSlot: Story = {
  args: {
    pagination: true,
    itemsPerPage: 2,
  },
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
      ];
      const data = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
        { id: 5, name: "Item 5" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #pagination="{ pagination }">
          <div v-if="pagination" class="p-3 border-t mt-2">
            <span class="text-sm text-gray-600">Custom pagination control</span>
          </div>
        </template>
      </Table>
    `,
  }),
};