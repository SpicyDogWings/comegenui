import Table from "../components/Table.vue";
import Badge from "../components/Badge.vue";
import Button from "../components/Button.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
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

// 1. Default
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

// 2. With Badges
export const WithBadges: Story = {
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

// 3. With Buttons
export const WithButtons: Story = {
  render: (args) => ({
    components: { Table, Button },
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
      <Table v-bind='args' :columns="columns" :data="data">
        <template #cell-actions="{ row }">
          <div class="flex gap-1">
            <Button color="#3b82f6" variant="ghost" @click="handleEdit(row)">Edit</Button>
            <Button color="#ef4444" variant="ghost" @click="handleDelete(row)">Delete</Button>
          </div>
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
          <span class="font-bold text-blue-500">ID</span>
        </template>
        <template #header-price>
          <span class="font-bold text-green-500">Price</span>
        </template>
      </Table>
    `,
  }),
};

// 5. With Alignment
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

// 6. With Custom Empty
export const WithCustomEmpty: Story = {
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
