<script setup lang="ts">
import { ref } from "vue";
import Table from "./components/Table.ce.vue";

// Demo data for fruits store
const tableData = ref([
  { id: 1, fruit: "Apple", stock: 100, send: 50 },
  { id: 2, fruit: "Banana", stock: 50, send: 30 },
  { id: 3, fruit: "Orange", stock: 75, send: 20 },
]);

// Table columns - Send column uses BOTH RegExp + Validator
const columns = [
  { key: "id", label: "ID", editable: false },
  { 
    key: "fruit", 
    label: "Fruit", 
    editable: true,
    validator: (value: string) => value.length >= 3,
    singleClick: true,
  },
  { 
    key: "stock", 
    label: "Stock", 
    editable: /^\d+$/, // Only numbers
    singleClick: true,
  },
  { 
    key: "send", 
    label: "Send", 
    editable: /^\d+$/, // Only numbers (RegExp)
    validator: (value: string, row: any) => {
      const num = parseInt(value, 10);
      const stock = row.stock;
      return !isNaN(num) && num >= 0 && num <= stock;
    },
    singleClick: true,
  },
];

// Reset data function
const resetData = () => {
  tableData.value = [
    { id: 1, fruit: "Apple", stock: 100, send: 50 },
    { id: 2, fruit: "Banana", stock: 50, send: 30 },
    { id: 3, fruit: "Orange", stock: 75, send: 20 },
  ];
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Fruits Store - Send Validation Demo</h1>
    <p class="text-charcoal-600 mb-6">
      Click on editable cells. The pencil icon turns 
      <span class="text-green-500 font-medium">GREEN</span> on success or 
      <span class="text-red-500 font-medium">RED</span> on validation failure.
    </p>

    <div class="bg-charcoal bg-opacity-10 rounded-cu p-4 mb-6">
      <h2 class="text-lg font-semibold mb-3">Validation Rules:</h2>
      <ul class="list-disc list-inside space-y-1 text-sm text-charcoal-700">
        <li><strong>Fruit:</strong> Must be at least 3 characters (validator function)</li>
        <li><strong>Stock:</strong> Only numbers allowed (RegExp: <code>/^\d+$/</code>)</li>
        <li><strong>Send:</strong> 
          <ul class="list-disc list-inside ml-4 mt-1">
            <li><strong>RegExp:</strong> Only numbers (<code>/^\d+$/</code>)</li>
            <li><strong>Validator:</strong> Must be <code>&lt;= Stock</code> (uses row data)</li>
          </ul>
        </li>
        <li><strong>ID:</strong> Not editable</li>
      </ul>
      <p class="mt-3 text-sm text-charcoal-600">
        <strong>Note:</strong> Send column uses <strong>BOTH</strong> RegExp + Validator together.
      </p>
    </div>

    <div class="mb-4">
      <button 
        @click="resetData"
        class="px-4 py-2 bg-primary text-white rounded-cu hover:bg-primary-600 transition-colors font-sans"
      >
        Reset Data
      </button>
    </div>

    <Table
      :data="tableData"
      :columns="columns"
      :search-enabled="true"
      search-placeholder="Search..."
      :pagination="false"
    />

    <div class="mt-8 bg-charcoal bg-opacity-10 rounded-cu p-4">
      <h2 class="text-lg font-semibold mb-3">Try These:</h2>
      <ul class="list-disc list-inside space-y-2 text-sm text-charcoal-700">
        <li>
          <strong>Valid Send:</strong> Change Apple's Send to "80" (≤ 100 stock) → 
          <span class="text-green-500 font-medium">Green pen ✓</span>
        </li>
        <li>
          <strong>Invalid Send (exceeds stock):</strong> Change Apple's Send to "150" (> 100 stock) → 
          <span class="text-red-500 font-medium">Red pen ✗</span>
        </li>
        <li>
          <strong>Invalid Send (not a number):</strong> Change Apple's Send to "fifty" → 
          <span class="text-red-500 font-medium">Red pen ✗</span> (fails RegExp)
        </li>
        <li>
          <strong>Valid Fruit:</strong> Change "Apple" to "Pear" → 
          <span class="text-green-500 font-medium">Green pen ✓</span>
        </li>
        <li>
          <strong>Invalid Fruit:</strong> Change "Apple" to "A" (too short) → 
          <span class="text-red-500 font-medium">Red pen ✗</span>
        </li>
        <li>
          <strong>Valid Stock:</strong> Change stock to "200" → 
          <span class="text-green-500 font-medium">Green pen ✓</span>
        </li>
        <li>
          <strong>Invalid Stock:</strong> Change stock to "one hundred" → 
          <span class="text-red-500 font-medium">Red pen ✗</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
