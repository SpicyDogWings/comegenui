<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTableData } from "../composables/useTableData";

// Test data
const testData = ref([
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 30 },
  { id: 3, name: "Bob", age: 35 },
]);

// Use the composable
const { data, updateRow, getData, getRow, removeRow, addRow, pushData } = useTableData(testData);

// Test results
const testResults = ref<string[]>([]);

const runTests = () => {
  testResults.value = [];
  
  // Test 1: Initialization
  if (data.value.length === 3 && data.value[0].name === "John") {
    testResults.value.push("✅ Initialization: PASSED");
  } else {
    testResults.value.push("❌ Initialization: FAILED");
  }
  
  // Test 2: Update row
  updateRow(0, { name: "Updated John" });
  if (data.value[0].name === "Updated John") {
    testResults.value.push("✅ Update row: PASSED");
  } else {
    testResults.value.push("❌ Update row: FAILED");
  }
  
  // Test 3: Get data
  const allData = getData();
  if (allData.length === 3) {
    testResults.value.push("✅ Get data: PASSED");
  } else {
    testResults.value.push("❌ Get data: FAILED");
  }
  
  // Test 4: Get data with filter
  const filteredData = getData((item) => item.id === 1);
  if (filteredData.length === 1 && filteredData[0].name === "Updated John") {
    testResults.value.push("✅ Get data with filter: PASSED");
  } else {
    testResults.value.push("❌ Get data with filter: FAILED");
  }
  
  // Test 5: Get row
  const row = getRow(1);
  if (row && row.name === "Jane") {
    testResults.value.push("✅ Get row: PASSED");
  } else {
    testResults.value.push("❌ Get row: FAILED");
  }
  
  // Test 6: Remove row
  const removeResult = removeRow(0);
  if (removeResult && data.value.length === 2 && data.value[0].name === "Jane") {
    testResults.value.push("✅ Remove row: PASSED");
  } else {
    testResults.value.push("❌ Remove row: FAILED");
  }
  
  // Test 7: Add row
  const addResult = addRow({ id: 4, name: "Alice", age: 28 });
  if (addResult && data.value.length === 3 && data.value[2].name === "Alice") {
    testResults.value.push("✅ Add row: PASSED");
  } else {
    testResults.value.push("❌ Add row: FAILED");
  }
  
  // Test 8: Add row with invalid schema (should fail)
  const invalidAddResult = addRow({ id: 5 }); // Missing 'name' and 'age'
  if (!invalidAddResult && data.value.length === 3) {
    testResults.value.push("✅ Add row with invalid schema: PASSED (correctly rejected)");
  } else {
    testResults.value.push("❌ Add row with invalid schema: FAILED (should have been rejected)");
  }
  
  // Test 9: Push data
  const pushResult = pushData([
    { id: 5, name: "Charlie", age: 40 },
    { id: 6, name: "Diana", age: 29 },
  ]);
  if (pushResult && data.value.length === 5) {
    testResults.value.push("✅ Push data: PASSED");
  } else {
    testResults.value.push("❌ Push data: FAILED");
  }
  
  // Test 10: Push data with invalid schema (should fail)
  const invalidPushResult = pushData([
    { id: 7, name: "Eve" }, // Missing 'age'
  ]);
  if (!invalidPushResult && data.value.length === 5) {
    testResults.value.push("✅ Push data with invalid schema: PASSED (correctly rejected)");
  } else {
    testResults.value.push("❌ Push data with invalid schema: FAILED (should have been rejected)");
  }
  
  // Test 11: Sync with external data changes
  testData.value.push({ id: 8, name: "Frank", age: 45 });
  if (data.value.length === 6 && data.value[5].name === "Frank") {
    testResults.value.push("✅ Sync with external data changes: PASSED");
  } else {
    testResults.value.push("❌ Sync with external data changes: FAILED");
  }
};

onMounted(runTests);
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">useTableData Composable Test</h1>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Test Results:</h2>
      <ul class="space-y-2">
        <li v-for="(result, index) in testResults" :key="index" :class="{
          'text-green-600': result.includes('✅'),
          'text-red-600': result.includes('❌')
        }">
          {{ result }}
        </li>
      </ul>
    </div>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Current Data:</h2>
      <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">{{ data }}</pre>
    </div>
    
    <div>
      <h2 class="text-xl font-semibold mb-4">Test Summary:</h2>
      <p class="font-medium">
        Total tests: {{ testResults.length }}<br>
        Passed: {{ testResults.filter(r => r.includes('✅')).length }}<br>
        Failed: {{ testResults.filter(r => r.includes('❌')).length }}
      </p>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
