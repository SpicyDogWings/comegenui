<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "./AdvancedTable.vue";

// Sample data
const sampleData = ref([
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
]);

// Columns definition
const columns = [
  { key: "id", label: "ID", width: "60px", align: "center" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "age", label: "Age", width: "80px", align: "center" },
  { key: "role", label: "Role" },
];

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Event handlers
const handleRowClick = (payload: any) => {
  console.log("Row clicked:", payload.row.name);
};

const handleCellClick = (payload: any) => {
  console.log("Cell clicked:", payload.col.key, "-", payload.row.name);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  console.log("Page changed to:", page);
};

const handleItemsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  console.log("Items per page changed to:", size);
};
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-charcoal-900">Advanced Table Test</h1>

    <div class="space-y-4">
      <!-- Basic AdvancedTable with pagination -->
      <div class="bg-white p-4 rounded-cu shadow-sm">
        <h2 class="text-lg font-semibold mb-3">Basic Pagination</h2>
        <AdvancedTable
          :columns="columns"
          :data="sampleData"
          :pagination="true"
          :items-per-page="itemsPerPage"
          :show-page-size="true"
          @update:current-page="handlePageChange"
          @update:items-per-page="handleItemsPerPageChange"
          @row-click="handleRowClick"
          @cell-click="handleCellClick"
        />
      </div>

      <!-- AdvancedTable with custom empty message -->
      <div class="bg-white p-4 rounded-cu shadow-sm">
        <h2 class="text-lg font-semibold mb-3">Custom Empty Message</h2>
        <AdvancedTable
          :columns="columns"
          :data="[]"
          :pagination="true"
          empty="No records found in the database"
        />
      </div>

      <!-- AdvancedTable with custom slots -->
      <div class="bg-white p-4 rounded-cu shadow-sm">
        <h2 class="text-lg font-semibold mb-3">Custom Slots</h2>
        <AdvancedTable
          :columns="columns"
          :data="sampleData.slice(0, 8)"
          :pagination="true"
          :items-per-page="3"
        >
          <template #header-name>
            <span class="text-primary-600 font-bold">Employee Name</span>
          </template>
          <template #cell-age="{ value }">
            <span class="text-green-600 font-medium">{{ value }} years</span>
          </template>
          <template #empty>
            <div class="text-center py-4">
              <p class="text-red-500 font-medium">No employee data available</p>
              <p class="text-charcoal-400 text-sm mt-1">Please check your filters or try again later</p>
            </div>
          </template>
        </AdvancedTable>
      </div>

      <!-- AdvancedTable without pagination -->
      <div class="bg-white p-4 rounded-cu shadow-sm">
        <h2 class="text-lg font-semibold mb-3">Without Pagination</h2>
        <AdvancedTable
          :columns="columns"
          :data="sampleData.slice(0, 5)"
          :pagination="false"
        />
      </div>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>