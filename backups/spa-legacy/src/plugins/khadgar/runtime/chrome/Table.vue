<script setup lang="ts">
export interface TableColumn {
  key: string;
  label: string;
}

defineProps<{
  columns: TableColumn[];
  data: Record<string, unknown>[];
  empty?: string;
  variant?: string;
  compact?: boolean;
}>();
</script>

<template>
  <table class="khadgar-table" :class="[`khadgar-table--${variant ?? 'default'}`, { 'khadgar-table--compact': compact }]">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!data.length">
        <td :colspan="columns.length" class="khadgar-table__empty">{{ empty ?? "Sin datos" }}</td>
      </tr>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="column in columns" :key="column.key">
          <slot :name="`cell-${column.key}`" :row="row">{{ row[column.key] }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.khadgar-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--cu-font-size-sm);
}

.khadgar-table th,
.khadgar-table td {
  padding: var(--cu-space-sm) var(--cu-space-md);
  text-align: left;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.khadgar-table th {
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}

.khadgar-table td {
  color: var(--cu-color-neutral);
}

.khadgar-table--compact th,
.khadgar-table--compact td {
  padding: var(--cu-space-xs) var(--cu-space-sm);
}

.khadgar-table__empty {
  opacity: 0.6;
  text-align: center;
}
</style>