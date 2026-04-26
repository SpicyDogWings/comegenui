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
  empty: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<template>
  <div class="overflow-x-auto w-full">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left p-3 font-sans font-medium text-primary-50 sticky top-0 bg-primary-600 z-10"
          >
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label || col.key }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="border-b-solid border-b-1 border-charcoal-200 last:border-b-none">
          <td
            v-for="col in columns"
            :key="col.key"
            class="p-3 font-sans text-charcoal-800"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :column="col"
              :index="rowIndex"
            >
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="p-6 text-center text-charcoal-500 italic">
            <slot name="empty">{{ empty || "No hay datos que mostrar" }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
