import { ref } from "vue";
import CuTable from "../../../../components/Table.ce.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuTable> = {
  title: "Custom Elements/Data/Table/Advanced",
  component: CuTable,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "Table color in hex format (e.g., #2c2c2c)",
    },
    variant: {
      control: "select",
      options: ["solid", "soft", "ghost"],
      description: "Table variant (solid maps to outlined)",
    },
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
      description: "Specific fields to search in",
    },
    searchValue: {
      control: "text",
      description: "Search query (v-model)",
    },
    tableMaxHeight: {
      control: "text",
      description: "Maximum height of the table",
    },
  },
  args: {
    color: "#2c2c2c",
    variant: "ghost",
    empty: "No hay datos que mostrar",
    pagination: true,
    itemsPerPage: 5,
    showPageSize: false,
    pageSizeOptions: [5, 10, 20, 50],
    searchEnabled: false,
    searchPlaceholder: "Buscar...",
    searchFields: [],
    searchValue: "",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample data
const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 28, role: "Developer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32, role: "Designer" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 45, role: "Manager" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", age: 24, role: "Intern" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", age: 38, role: "CTO" },
  { id: 6, name: "Diana Miller", email: "diana@example.com", age: 29, role: "Developer" },
  { id: 7, name: "Ethan Davis", email: "ethan@example.com", age: 31, role: "Designer" },
  { id: 8, name: "Fiona Garcia", email: "fiona@example.com", age: 27, role: "Developer" },
  { id: 9, name: "George Martinez", email: "george@example.com", age: 42, role: "Manager" },
  { id: 10, name: "Hannah Robinson", email: "hannah@example.com", age: 26, role: "Intern" },
  { id: 11, name: "Ian Clark", email: "ian@example.com", age: 35, role: "Developer" },
  { id: 12, name: "Julia Rodriguez", email: "julia@example.com", age: 30, role: "Designer" },
];

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "role", label: "Role", sortable: true },
];

const dataManipulationColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true, editable: true },
  { key: "age", label: "Age", sortable: true, editable: true },
];

const dataManipulationData = [
  { id: 1, name: "John Doe", age: 28 },
  { id: 2, name: "Jane Smith", age: 32 },
  { id: 3, name: "Bob Johnson", age: 45 },
];

// Group 1: Basic Stories

export const BasicPagination: Story = {
  args: {
    columns,
    data: sampleData,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const WithPageSize: Story = {
  args: {
    columns,
    data: sampleData,
    showPageSize: true,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const CustomEmptyMessage: Story = {
  args: {
    columns,
    data: [],
    empty: "No records found",
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const WithoutPagination: Story = {
  args: {
    columns,
    data: sampleData,
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const ColorVariants: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 3),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <h3>Primary</h3>
          <CuTable v-bind="{ ...args, color: '#3b82f6' }" />
        </div>
        <div>
          <h3>Neutral</h3>
          <CuTable v-bind="{ ...args, color: '#2c2c2c' }" />
        </div>
        <div>
          <h3>Success</h3>
          <CuTable v-bind="{ ...args, color: '#22c55e' }" />
        </div>
        <div>
          <h3>Warning</h3>
          <CuTable v-bind="{ ...args, color: '#f59e0b' }" />
        </div>
        <div>
          <h3>Danger</h3>
          <CuTable v-bind="{ ...args, color: '#ef4444' }" />
        </div>
      </div>
    `,
  }),
};

export const SmallDataset: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 3),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const LargeDataset: Story = {
  args: {
    columns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 30),
      role: ["Developer", "Designer", "Manager", "Intern"][i % 4],
    })),
    showPageSize: true,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const WithSearch: Story = {
  args: {
    columns,
    data: sampleData,
    searchEnabled: true,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

export const WithSearchSpecificFields: Story = {
  args: {
    columns,
    data: sampleData,
    searchEnabled: true,
    searchFields: ["name", "email"],
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => ({
      args: { ...args },
    }),
    template: `<CuTable v-bind="args" />`,
  }),
};

// Group 2: Editable Stories

export const DefaultEditable: Story = {
  args: {
    columns: columns.map(col => col.key === "name" ? { ...col, editable: true } : col),
    data: sampleData.slice(0, 5),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const myData = ref([...sampleData.slice(0, 5)]);
      
      const handleSave = ({ row, column, value }) => {
        row[column.key] = value;
      };
      
      return { args, myData, handleSave };
    },
    template: `
      <CuTable 
        v-bind="args" 
        :columns="columns.map(col => col.key === 'name' ? { ...col, editable: true } : col)" 
        :data="myData" 
        @edit-save="handleSave"
      />
    `,
  }),
};

export const MixedColumns: Story = {
  args: {
    columns: [
      { key: "id", label: "ID", sortable: true },
      { key: "name", label: "Name", sortable: true, editable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "age", label: "Age", sortable: true, editable: true },
      { key: "role", label: "Role", sortable: true },
    ],
    data: sampleData.slice(0, 5),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const myData = ref([...sampleData.slice(0, 5)]);
      
      const handleSave = ({ row, column, value }) => {
        row[column.key] = value;
      };
      
      return { args, myData, handleSave };
    },
    template: `
      <CuTable 
        v-bind="args" 
        :data="myData" 
        @edit-save="handleSave"
      />
    `,
  }),
};

export const WithValidation: Story = {
  args: {
    columns: [
      { key: "id", label: "ID", sortable: true },
      { 
        key: "name", 
        label: "Name", 
        sortable: true, 
        editable: true,
        validator: (value) => {
          if (!value) return "Name is required";
          if (value.length < 3) return "Name must be at least 3 characters";
          return true;
        }
      },
      { key: "email", label: "Email", sortable: true },
      { key: "age", label: "Age", sortable: true },
      { key: "role", label: "Role", sortable: true },
    ],
    data: sampleData.slice(0, 5),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const myData = ref([...sampleData.slice(0, 5)]);
      
      const handleSave = ({ row, column, value }) => {
        row[column.key] = value;
      };
      
      return { args, myData, handleSave };
    },
    template: `
      <CuTable 
        v-bind="args" 
        :data="myData" 
        @edit-save="handleSave"
      />
    `,
  }),
};

export const TextareaType: Story = {
  args: {
    columns: [
      { key: "id", label: "ID", sortable: true },
      { 
        key: "name", 
        label: "Name", 
        sortable: true, 
        editable: true,
        inputType: "textarea"
      },
      { key: "email", label: "Email", sortable: true },
      { key: "age", label: "Age", sortable: true },
      { key: "role", label: "Role", sortable: true },
    ],
    data: sampleData.slice(0, 3),
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const myData = ref([...sampleData.slice(0, 3)]);
      
      const handleSave = ({ row, column, value }) => {
        row[column.key] = value;
      };
      
      return { args, myData, handleSave };
    },
    template: `
      <CuTable 
        v-bind="args" 
        :data="myData" 
        @edit-save="handleSave"
      />
    `,
  }),
};

// Group 3: Data Manipulation Stories

export const UpdateRow: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      
      const updateFirstRow = () => {
        if (tableRef.value) {
          tableRef.value.updateRow(0, { name: "Updated Name", age: 99 });
        }
      };
      
      return { args, tableRef, myData, updateFirstRow };
    },
    template: `
      <div>
        <button @click="updateFirstRow" style="margin-bottom: 10px;">Update First Row</button>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const GetData: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      const currentData = ref("");
      
      const getCurrentData = () => {
        if (tableRef.value) {
          const data = tableRef.value.getData();
          currentData.value = JSON.stringify(data, null, 2);
        }
      };
      
      return { args, tableRef, myData, currentData, getCurrentData };
    },
    template: `
      <div>
        <button @click="getCurrentData" style="margin-bottom: 10px;">Get Data</button>
        <pre>{{ currentData }}</pre>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const GetRow: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      const rowData = ref("");
      
      const getSecondRow = () => {
        if (tableRef.value) {
          const row = tableRef.value.getRow(1);
          rowData.value = JSON.stringify(row, null, 2);
        }
      };
      
      return { args, tableRef, myData, rowData, getSecondRow };
    },
    template: `
      <div>
        <button @click="getSecondRow" style="margin-bottom: 10px;">Get Row 2</button>
        <pre>{{ rowData }}</pre>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const RemoveRow: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      
      const removeFirstRow = () => {
        if (tableRef.value) {
          tableRef.value.removeRow(0);
        }
      };
      
      return { args, tableRef, myData, removeFirstRow };
    },
    template: `
      <div>
        <button @click="removeFirstRow" style="margin-bottom: 10px;">Remove First Row</button>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const AddRow: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      
      const addNewRow = () => {
        if (tableRef.value) {
          tableRef.value.addRow({ id: myData.value.length + 1, name: "New User", age: 25 });
        }
      };
      
      return { args, tableRef, myData, addNewRow };
    },
    template: `
      <div>
        <button @click="addNewRow" style="margin-bottom: 10px;">Add New Row</button>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const PushData: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      
      const replaceData = () => {
        if (tableRef.value) {
          tableRef.value.pushData([
            { id: 101, name: "Alice", age: 30 },
            { id: 102, name: "Bob", age: 25 },
            { id: 103, name: "Charlie", age: 35 },
          ]);
        }
      };
      
      return { args, tableRef, myData, replaceData };
    },
    template: `
      <div>
        <button @click="replaceData" style="margin-bottom: 10px;">Replace All Data</button>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};

export const AllDataManipulation: Story = {
  args: {
    columns: dataManipulationColumns,
    data: [...dataManipulationData],
    pagination: false,
  },
  render: (args) => ({
    components: { CuTable },
    setup: () => {
      const tableRef = ref(null);
      const myData = ref([...dataManipulationData]);
      const currentData = ref("");
      
      const updateRow = () => {
        if (tableRef.value) {
          tableRef.value.updateRow(0, { name: "Updated Name", age: 99 });
        }
      };
      
      const getData = () => {
        if (tableRef.value) {
          const data = tableRef.value.getData();
          currentData.value = JSON.stringify(data, null, 2);
        }
      };
      
      const removeRow = () => {
        if (tableRef.value) {
          tableRef.value.removeRow(0);
        }
      };
      
      const addRow = () => {
        if (tableRef.value) {
          tableRef.value.addRow({ id: myData.value.length + 1, name: "New User", age: 25 });
        }
      };
      
      return { args, tableRef, myData, currentData, updateRow, getData, removeRow, addRow };
    },
    template: `
      <div>
        <div style="margin-bottom: 10px; display: flex; gap: 10px;">
          <button @click="updateRow">Update Row</button>
          <button @click="getData">Get Data</button>
          <button @click="removeRow">Remove Row</button>
          <button @click="addRow">Add Row</button>
        </div>
        <pre>{{ currentData }}</pre>
        <CuTable 
          ref="tableRef" 
          v-bind="args" 
          :data="myData"
        />
      </div>
    `,
  }),
};