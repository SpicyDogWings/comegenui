import AdvancedTable from "../../../../components/data/AdvancedTable.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof AdvancedTable> = {
  title: "Components/Data/Table/Advanced",
  component: AdvancedTable,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: "object",
      description: "Array of column definitions",
    },
    data: {
      control: "object",
      description: "Array of data objects",
    },
    empty: {
      control: "text",
      description: "Message to display when no data is available",
    },
    pagination: {
      control: "boolean",
      description: "Enable pagination",
    },
    itemsPerPage: {
      control: "number",
      description: "Number of items per page",
    },
    showPageSize: {
      control: "boolean",
      description: "Show page size selector",
    },
    pageSizeOptions: {
      control: "object",
      description: "Available page size options",
    },
    color: {
      control: "color",
      description: "Table color",
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost", "subtle"],
      description: "Table variant",
    },
    searchEnabled: {
      control: "boolean",
      description: "Enable search functionality",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    searchFields: {
      control: "object",
      description: "Specific fields to search in (empty for all fields)",
    },
    searchValue: {
      control: "text",
      description: "Search query (v-model)",
    },
  },
   args: {
    empty: "No hay datos que mostrar",
    pagination: true,
    itemsPerPage: 5,
    showPageSize: false,
    pageSizeOptions: [5, 10, 20, 50],
    color: "#2c2c2c",
    variant: "soft",
    searchEnabled: false,
    searchPlaceholder: "Buscar...",
    searchFields: [],
    searchValue: "",
   },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 28, role: "Developer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32, role: "Designer" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 45, role: "Manager" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", age: 27, role: "QA Engineer" },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", age: 31, role: "DevOps" },
  { id: 6, name: "Diana Prince", email: "diana@example.com", age: 29, role: "Product Manager" },
  { id: 7, name: "Clark Kent", email: "clark@example.com", age: 35, role: "CTO" },
  { id: 8, name: "Bruce Wayne", email: "bruce@example.com", age: 40, role: "CEO" },
  { id: 9, name: "Peter Parker", email: "peter@example.com", age: 23, role: "Intern" },
  { id: 10, name: "Tony Stark", email: "tony@example.com", age: 48, role: "Engineer" },
  { id: 11, name: "Natasha Romanoff", email: "natasha@example.com", age: 34, role: "Security" },
  { id: 12, name: "Steve Rogers", email: "steve@example.com", age: 38, role: "Director" },
];

const columns = [
  { key: "id", label: "ID", width: "60px", align: "center" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "age", label: "Age", width: "80px", align: "center" },
  { key: "role", label: "Role" },
];

// 1. Basic Pagination
export const BasicPagination: Story = {
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 2. With Page Size Selector
export const WithPageSize: Story = {
  args: {
    showPageSize: true,
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 3. Custom Empty Message
export const CustomEmptyMessage: Story = {
  args: {
    empty: "No records found in the database",
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: [] }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 4. Custom Slots
export const CustomSlots: Story = {
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData.slice(0, 8) }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" :items-per-page="3">
        <template #header-name>
          <span class="text-primary-600 font-bold">Employee Name</span>
        </template>
        <template #cell-age="{ value }">
          <span class="text-green-600 font-medium">{{ value }} years</span>
        </template>
        <template #empty>
          <div class="text-center py-4">
            <p class="text-red-500 font-medium">No employee data available</p>
            <p class="text-charcoal-400 text-sm mt-1">Please check your filters</p>
          </div>
        </template>
      </AdvancedTable>
    `,
  }),
};

// 5. Without Pagination
export const WithoutPagination: Story = {
  args: {
    pagination: false,
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData.slice(0, 5) }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 6. Different Color Variants
export const ColorVariants: Story = {
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData.slice(0, 6) }),
    template: `
      <div class="space-y-6">
        <div>
          <h3 class="font-semibold mb-2">Soft Variant (default)</h3>
          <AdvancedTable v-bind='{...args, variant: "soft"}' :columns="columns" :data="data" :items-per-page="3" />
        </div>
        <div>
          <h3 class="font-semibold mb-2">Outlined Variant</h3>
          <AdvancedTable v-bind='{...args, variant: "outlined"}' :columns="columns" :data="data" :items-per-page="3" />
        </div>
        <div>
          <h3 class="font-semibold mb-2">Ghost Variant</h3>
          <AdvancedTable v-bind='{...args, variant: "ghost"}' :columns="columns" :data="data" :items-per-page="3" />
        </div>
      </div>
    `,
  }),
};

// 7. Small Dataset (No Pagination)
export const SmallDataset: Story = {
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData.slice(0, 3) }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 8. Large Dataset
export const LargeDataset: Story = {
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => {
      // Create larger dataset
      const largeData = [];
      for (let i = 1; i <= 50; i++) {
        largeData.push({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          age: 20 + (i % 30),
          role: ["Developer", "Designer", "Manager", "QA", "DevOps"][i % 5],
        });
      }
      return { args, columns, data: largeData };
    },
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" :items-per-page="10" :show-page-size="true" />
    `,
  }),
};

// 9. With Search Functionality
export const WithSearch: Story = {
  args: {
    searchEnabled: true,
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 10. With Search and Specific Fields
export const WithSearchSpecificFields: Story = {
  args: {
    searchEnabled: true,
    searchFields: ["name", "email"],
    searchPlaceholder: "Search in name or email...",
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data" />
    `,
  }),
};

// 11. With Custom Search Slot
export const WithCustomSearch: Story = {
  args: {
    searchEnabled: true,
    pagination: true,
    itemsPerPage: 5,
  },
  render: (args) => ({
    components: { AdvancedTable },
    setup: () => ({ args, columns, data: sampleData }),
    template: `
      <AdvancedTable v-bind='args' :columns="columns" :data="data">
        <template #search="{ query, update }">
          <div class="p-3 bg-primary-50 rounded-cu">
            <Input
              placeholder="Custom search..."
              :model-value="query"
              @update:modelValue="update"
              color="#2563eb"
              variant="soft"
            />
          </div>
        </template>
      </AdvancedTable>
    `,
  }),
};
