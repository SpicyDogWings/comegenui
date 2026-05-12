<script setup lang="ts">
import { ref } from 'vue';
import Table from './data/Table.vue';

// Test data
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
];

const emptyData: any[] = [];

const handleCellClick = (payload: any) => {
  console.log('Cell clicked:', payload);
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Simplified Table Component Test</h1>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Basic Table</h2>
      <Table
        :columns="columns"
        :data="data"
      />
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Table with Custom Cell Rendering</h2>
      <Table :columns="columns" :data="data">
        <template #cell-status="{ value }">
          <span :class="{
            'text-green-500': value === 'Active',
            'text-red-500': value === 'Inactive',
            'text-yellow-500': value === 'Pending'
          }">
            {{ value }}
          </span>
        </template>
      </Table>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Table with Custom Template Slot</h2>
      <Table :columns="columns" :data="data">
        <template #template="{ row, rowIndex, columns: slotColumns, getCellValue }">
          <td
            v-for="col in slotColumns"
            :key="col.key"
            class="p-3 font-sans text-charcoal-800 border"
          >
            <div v-if="col.key === 'name'" class="font-bold">
              {{ getCellValue(row, col) }}
            </div>
            <div v-else>
              {{ getCellValue(row, col) }}
            </div>
          </td>
        </template>
      </Table>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Table with Custom Headers</h2>
      <Table :columns="columns" :data="data">
        <template #header-id>
          <span class="font-bold text-blue-500">ID</span>
        </template>
        <template #header-status>
          <span class="font-bold text-green-500">Status</span>
        </template>
      </Table>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Empty Table</h2>
      <Table :columns="columns" :data="emptyData">
        <template #empty>
          <span class="text-red-500">No data available!</span>
        </template>
      </Table>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Auto Columns (no columns prop)</h2>
      <Table :data="data" />
    </div>
  </div>
</template>