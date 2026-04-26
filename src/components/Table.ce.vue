<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  columns: {
    type: Array as () => { key: string; label?: string }[],
    required: false,
    default: () => [],
  },
  data: {
    type: Array as () => Record<string, any>[],
    required: false,
    default: () => [],
  },
  hoverable: {
    type: Boolean,
    required: false,
    default: false,
  },
  bordered: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const tableClasses = computed(() => [
  "w-full",
  "border-collapse",
  props.bordered ? "border border-charcoal-200 rounded-cu" : "",
  props.hoverable ? "[&_tr:hover]:bg-charcoal-50" : "",
]);

const thClasses = computed(() => [
  "text-left p-3 font-medium text-charcoal-600",
  props.bordered ? "border-b border-charcoal-200" : "",
]);

const tdClasses = computed(() => [
  "p-3 text-charcoal-800",
  props.bordered ? "border-b border-charcoal-100" : "",
]);
</script>

<template>
  <div class="overflow-x-auto w-full">
    <table :class="tableClasses">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="thClasses">
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label || col.key }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="col in columns" :key="col.key" :class="tdClasses">
            <slot :name="`cell-${col.key}`" :row="row" :column="col" :index="rowIndex">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="data.length === 0" class="w-full p-6 text-center text-charcoal-500 italic">
      <slot name="empty">No data available</slot>
    </div>
  </div>
</template>

<style>
@unocss-placeholder
</style>
