<script setup lang="ts">
import CuTable from "./components/Table.ce.vue";
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Table Demo - Search + Pagination</h1>

    <CuTable
      :columns="[
        { key: 'id', label: 'ID', editable: false },
        { key: 'name', label: 'Name', editable: true },
        { key: 'email', label: 'Email' },
        {
          key: 'status',
          label: 'Status',
          badges: (row) => [
            {
              value: row.status,
              color: row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger',
              variant: 'soft',
            },
          ],
        },
      ]"
      :data="Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['Active', 'Inactive', 'Pending'][i % 3],
      }))"
      search-enabled
      search-placeholder="Search..."
      pagination
      :items-per-page="5"
      :show-page-size="true"
      :page-size-options="[5, 10, 20]"
    />
  </div>
</template>

<style>
@unocss-placeholder;
</style>
