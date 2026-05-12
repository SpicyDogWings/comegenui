<script setup lang="ts">
import { ref } from 'vue';
import Table from './Table.vue';

// Test data
const columns = [
  { key: 'id', label: 'ID', editable: false },
  { key: 'name', label: 'Name', editable: true },
  { key: 'email', label: 'Email', editable: true },
  { key: 'status', label: 'Status', editable: false },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
];

const tableRef = ref(null);

const handleRowClick = (payload: any) => {
  console.log('Row clicked:', payload);
};

const handleCellClick = (payload: any) => {
  console.log('Cell clicked:', payload);
};

const handleEditStart = (payload: any) => {
  console.log('Edit started:', payload);
};

const handleEditSave = (payload: any) => {
  console.log('Edit saved:', payload);
};

const handleEditCancel = (payload: any) => {
  console.log('Edit cancelled:', payload);
};

const handleDataChange = (newData: any) => {
  console.log('Data changed:', newData);
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Table Component Test</h1>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Basic Table</h2>
      <Table
        ref="tableRef"
        :columns="columns"
        :data="data"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
        @edit-start="handleEditStart"
        @edit-save="handleEditSave"
        @edit-cancel="handleEditCancel"
        @data-change="handleDataChange"
      />
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Table with Search</h2>
      <Table
        :columns="columns"
        :data="data"
        searchEnabled
        searchPlaceholder="Search users..."
      />
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Table with Pagination</h2>
      <Table
        :columns="columns"
        :data="data"
        pagination
        itemsPerPage="2"
        showPageSize
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
  </div>
</template>