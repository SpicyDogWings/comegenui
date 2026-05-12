import Table from "../components/Table.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Table> = {
  title: "Components/Table/Simplified",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
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
  },
  args: {
    empty: "No hay datos que mostrar",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default Simple Table
export const Default: Story = {
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
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 2. With Custom Cell Rendering
export const WithCustomCells: Story = {
  render: (args) => ({
    components: { Table },
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
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #cell-status="{ value }">
          <span :style="{
            color: value === 'Active' ? '#22c55e' : value === 'Pending' ? '#f59e0b' : '#ef4444'
          }">
            {{ value }}
          </span>
        </template>
      </Table>
    `,
  }),
};

// 3. With Custom Template Slot
export const WithCustomTemplate: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
      ];
      const data = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #template="{ row, rowIndex, columns: slotColumns, getCellValue }">
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
            <!-- Custom rendering for name column -->
            <template v-if="col.key === 'name'">
              <strong>{{ getCellValue(row, col) }}</strong>
            </template>
            
            <!-- Default rendering for other columns -->
            <template v-else>
              {{ getCellValue(row, col) }}
            </template>
          </td>
        </template>
      </Table>
    `,
  }),
};

// 4. With Custom Headers
export const WithCustomHeaders: Story = {
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
          <span class="font-bold" style="color: #3b82f6">ID</span>
        </template>
        <template #header-price>
          <span class="font-bold" style="color: #10b981">Price</span>
        </template>
      </Table>
    `,
  }),
};

// 5. Empty Table with Custom Prop Message
export const EmptyTableWithProp: Story = {
  args: {
    empty: "Custom: No records found in the database",
  },
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
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 6. Empty Table with Custom Slot
export const EmptyTableWithSlot: Story = {
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
          <span style="color: #ef4444">No data available!</span>
        </template>
      </Table>
    `,
  }),
};

// 7. Auto Columns
export const AutoColumns: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const data = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
      ];
      return { args, data };
    },
    template: `
      <Table v-bind='args' :data="data" />
    `,
  }),
};

// 8. With Alignment
export const WithAlignment: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", align: "center" },
        { key: "name", label: "Name", align: "left" },
        { key: "price", label: "Price", align: "right" },
      ];
      const data = [
        { id: 1, name: "Product A", price: "$10" },
        { id: 2, name: "Product B", price: "$25" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 9. With Widths
export const WithWidths: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", width: "60px" },
        { key: "name", label: "Name", width: "200px" },
        { key: "description", label: "Description" },
      ];
      const data = [
        { id: 1, name: "Product A", description: "This is a sample product description" },
        { id: 2, name: "Product B", description: "Another sample product with a longer description" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 10. Mixed Customization
export const MixedCustomization: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID", width: "80px", align: "center" },
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
        { key: "price", label: "Price", align: "right" },
      ];
      const data = [
        { id: 1, name: "Product A", status: "Active", price: "$10.00" },
        { id: 2, name: "Product B", status: "Inactive", price: "$25.50" },
        { id: 3, name: "Product C", status: "Pending", price: "$15.25" },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #header-id>
          <span class="font-bold" style="color: #8b5cf6">ID</span>
        </template>
        <template #cell-status="{ value }">
          <span :style="{
            color: value === 'Active' ? '#10b981' : value === 'Pending' ? '#f59e0b' : '#ef4444'
          }">
            • {{ value }}
          </span>
        </template>
        <template #cell-price="{ value }">
          <strong>{{ value }}</strong>
        </template>
      </Table>
    `,
  }),
};

// 11. Template Slot with Complex Rendering
export const ComplexTemplate: Story = {
  render: (args) => ({
    components: { Table },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "progress", label: "Progress" },
      ];
      const data = [
        { id: 1, name: "Task 1", progress: 75 },
        { id: 2, name: "Task 2", progress: 30 },
        { id: 3, name: "Task 3", progress: 90 },
      ];
      return { args, columns, data };
    },
    template: `
      <Table v-bind='args' :columns="columns" :data="data">
        <template #template="{ row, rowIndex, columns: slotColumns, getCellValue }">
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
            <!-- Custom rendering for progress column -->
            <template v-if="col.key === 'progress'">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  :style="{ width: getCellValue(row, col) + '%' }"
                ></div>
              </div>
            </template>
            
            <!-- Custom rendering for name column -->
            <template v-else-if="col.key === 'name'">
              <div class="font-medium">{{ getCellValue(row, col) }}</div>
            </template>
            
            <!-- Default rendering for other columns -->
            <template v-else>
              {{ getCellValue(row, col) }}
            </template>
          </td>
        </template>
      </Table>
    `,
  }),
};