<script setup lang="ts">
import CuTable from "./components/Table.ce.vue";
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Table Demo - With Scroll</h1>

    <div class="h-96 overflow-auto border border-charcoal-200 rounded-cu">
      <CuTable
        :columns="[
          { key: 'id', label: 'ID', editable: false },
          { key: 'name', label: 'Name', editable: true },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City' },
          { key: 'country', label: 'Country' },
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
        :data="Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          phone: `+1-555-01${String(i + 1).padStart(2, '0')}`,
          address: `123 Main St, Apt ${i + 1}`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
          country: ['USA', 'Canada', 'UK', 'Australia', 'Germany'][i % 5],
          status: ['Active', 'Inactive', 'Pending'][i % 3],
        }))"
        search-enabled
        search-placeholder="Search..."
        pagination
        :items-per-page="10"
        :show-page-size="true"
        :page-size-options="[5, 10, 20, 50]"
      />
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
