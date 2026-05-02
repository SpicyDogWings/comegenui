<script setup lang="ts">
import { ref } from "vue";
import Table from "./components/Table.ce.vue";

// Demo data for the table
const tableData = ref([
  { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
  { id: 2, name: "Jane Smith", age: 34, email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", age: 45, email: "bob@example.com" },
]);

// Table columns with different validation rules
const columns = [
  { key: "id", label: "ID", editable: false },
  { 
    key: "name", 
    label: "Name", 
    editable: true,
    // Custom validator: name must be at least 3 characters
    validator: (value: string) => value.length >= 3,
    singleClick: true,
  },
  { 
    key: "age", 
    label: "Age", 
    editable: /^\d+$/, // RegExp: only numbers allowed
    singleClick: true,
  },
  { 
    key: "email", 
    label: "Email", 
    editable: true,
    // Custom validator: basic email format check
    validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    singleClick: true,
  },
];

// Reset data function
const resetData = () => {
  tableData.value = [
    { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
    { id: 2, name: "Jane Smith", age: 34, email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", age: 45, email: "bob@example.com" },
  ];
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Table Edit Validation Demo</h1>
    <p class="text-charcoal-600 mb-6">
      Click on editable cells to edit. The pencil icon will turn <span class="text-green-500 font-medium">GREEN</span> on success 
      or <span class="text-red-500 font-medium">RED</span> on validation failure.
    </p>

    <div class="bg-charcoal-50 rounded-cu p-4 mb-6">
      <h2 class="text-lg font-semibold mb-3">Validation Rules:</h2>
      <ul class="list-disc list-inside space-y-1 text-sm text-charcoal-700">
        <li><strong>Name:</strong> Must be at least 3 characters (custom validator)</li>
        <li><strong>Age:</strong> Must be a number only (RegExp validator: <code>/^\d+$/</code>)</li>
        <li><strong>Email:</strong> Must be a valid email format (custom validator)</li>
        <li><strong>ID:</strong> Not editable</li>
      </ul>
    </div>

    <div class="mb-4">
      <button 
        @click="resetData"
        class="px-4 py-2 bg-primary-500 text-white rounded-cu hover:bg-primary-600 transition-colors font-sans"
      >
        Reset Data
      </button>
    </div>

    <Table
      :data="tableData"
      :columns="columns"
      :search-enabled="true"
      search-placeholder="Search..."
      :pagination="true"
      :items-per-page="5"
    />

    <div class="mt-8 bg-charcoal-50 rounded-cu p-4">
      <h2 class="text-lg font-semibold mb-3">Try These:</h2>
      <ul class="list-disc list-inside space-y-2 text-sm text-charcoal-700">
        <li><strong>Valid edit:</strong> Change "John Doe" to "John Smith" → <span class="text-green-500 font-medium">Green pen ✓</span></li>
        <li><strong>Invalid name:</strong> Change "John Doe" to "Jo" (too short) → <span class="text-red-500 font-medium">Red pen ✗</span></li>
        <li><strong>Invalid age:</strong> Change "28" to "twenty" (not a number) → <span class="text-red-500 font-medium">Red pen ✗</span></li>
        <li><strong>Invalid email:</strong> Change "john@example.com" to "invalid-email" → <span class="text-red-500 font-medium">Red pen ✗</span></li>
        <li><strong>Valid email:</strong> Change "john@example.com" to "john@test.org" → <span class="text-green-500 font-medium">Green pen ✓</span></li>
      </ul>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
