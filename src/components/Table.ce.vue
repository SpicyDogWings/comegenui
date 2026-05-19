<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "./data/AdvancedTable.vue";
import { colorMap } from "../utils/palette";

interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label: string;
  onClick?: (row: Record<string, any>) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
}

interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
  // Editable properties
  editable?: boolean | RegExp;
  inputType?: "input" | "textarea";
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
  // Badge and Button properties
  badges?: (row: Record<string, any>) => BadgeConfig[];
  buttons?: (row: Record<string, any>) => ButtonConfig[];
}

const props = defineProps({
  columns: {
    type: Array as () => Column[],
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
  pagination: {
    type: Boolean,
    required: false,
    default: false,
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  showPageSize: {
    type: Boolean,
    required: false,
    default: false,
  },
  pageSizeOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [5, 10, 20, 50],
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link"].includes(value),
  },
  searchEnabled: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: "Buscar..." },
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  searchValue: { type: String, required: false, default: "" },
});

const emit = defineEmits([
  "update:currentPage", 
  "update:itemsPerPage",
  "update:search",
  "edit-start",
  "edit-save", 
  "edit-cancel"
]);

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);

const tableRef = ref<InstanceType<typeof Table> | null>(null);

// Expose data manipulation methods from AdvancedTable
defineExpose({
  updateRow: (rowIndex: number, newData: Record<string, any>) => tableRef.value?.updateRow(rowIndex, newData),
  getData: () => tableRef.value?.getData(),
  getRow: (rowIndex: number) => tableRef.value?.getRow(rowIndex),
  removeRow: (rowIndex: number) => tableRef.value?.removeRow(rowIndex),
  addRow: (newRow: Record<string, any>) => tableRef.value?.addRow(newRow),
  pushData: (newData: Record<string, any>[]) => tableRef.value?.pushData(newData),
});
</script>

<template>
  <Table
    ref="tableRef"
    :columns="props.columns"
    :data="props.data"
    :empty="props.empty"
    :pagination="props.pagination"
    :items-per-page="props.itemsPerPage"
    :show-page-size="props.showPageSize"
    :page-size-options="props.pageSizeOptions"
    :color="hexColor"
    :variant="props.variant"
    :search-enabled="props.searchEnabled"
    :search-placeholder="props.searchPlaceholder"
    :search-fields="props.searchFields"
    :search-value="props.searchValue"
    @update:current-page="emit('update:currentPage', $event)"
    @update:items-per-page="emit('update:itemsPerPage', $event)"
    @update:search="emit('update:search', $event)"
    @edit-start="emit('edit-start', $event)"
    @edit-save="emit('edit-save', $event)"
    @edit-cancel="emit('edit-cancel', $event)"
  >
    <!-- Header slots -->
    <template #header="{ column }">
      <slot name="header" :column="column" :color="props.color" :variant="props.variant">
        <slot :name="`header-${column.key}`" :column="column" :color="props.color" :variant="props.variant">
          {{ column.label || column.key }}
        </slot>
      </slot>
    </template>



    <!-- Empty slot -->
    <template #empty>
      <slot name="empty">{{ props.empty || "No hay datos que mostrar" }}</slot>
    </template>
  </Table>
</template>

<style>
@unocss-placeholder;
</style>
