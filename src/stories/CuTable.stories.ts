import CuTable from "../components/Table.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuTable> = {
  title: "Components/Table",
  component: CuTable,
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
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    searchEnabled: {
      control: "boolean",
      description: "Whether search is enabled",
    },
    paginationEnabled: {
      control: "boolean",
      description: "Whether pagination is enabled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
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
      ];
      return { columns, data };
    },
    template: `
      <CuTable :columns="columns" :data="data" />
    `,
  }),
};

export const WithSearch: Story = {
  render: () => ({
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
      ];
      return { columns, data };
    },
    template: `
      <CuTable :columns="columns" :data="data" search-enabled search-placeholder="Search products..." />
    `,
  }),
};

export const WithPagination: Story = {
  render: () => ({
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
      return { columns, data };
    },
    template: `
      <CuTable :columns="columns" :data="data" pagination-enabled />
    `,
  }),
};

export const WithButtons: Story = {
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
      <CuTable :columns="columns" :data="data" />
    `,
  }),
};

export const WithBadges: Story = {
  render: () => ({
    components: { CuTable },
    setup: () => {
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        {
          key: "status",
          label: "Status",
          badges: (row) => [
            {
              value: row.status,
              color: row.status === "Active" ? "success" : "danger",
              variant: "soft",
            },
          ],
        },
      ];
      const data = [
        { id: 1, name: "User 1", status: "Active" },
        { id: 2, name: "User 2", status: "Inactive" },
        { id: 3, name: "User 3", status: "Active" },
      ];
      return { columns, data };
    },
    template: `
      <CuTable :columns="columns" :data="data" />
    `,
  }),
};
