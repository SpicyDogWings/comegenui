<script setup lang="ts">
import { ref, computed, getCurrentInstance, type Component } from "vue";
import Table from "./data/AdvancedTable.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label?: string;
  icon?: string | Component;
  onClick?: (row: Record<string, any>) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}

interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
  // Editable properties
  editable?: boolean | RegExp;
  inputType?: "input" | "textarea" | "select";
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
  // Badge and Button properties
  badges?: (row: Record<string, any>) => BadgeConfig[];
  buttons?: (row: Record<string, any>) => ButtonConfig[];
}

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
    validator: isValidTheme,
  },
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
  filters: { type: Object as () => Record<string, any>, required: false, default: () => ({}) },
  loading: { type: Boolean, required: false, default: false },
});

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const tableRef = ref<InstanceType<typeof Table> | null>(null);
const instance = getCurrentInstance();

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

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
    :theme="effectiveTheme"
    :color="hexColor"
    :variant="props.variant"
    :search-enabled="props.searchEnabled"
    :search-placeholder="props.searchPlaceholder"
    :search-fields="props.searchFields"
    :search-value="props.searchValue"
    :filters="props.filters"
    :loading="props.loading"
    @update:current-page="ceEmit('update:currentPage', $event)"
    @update:items-per-page="ceEmit('update:itemsPerPage', $event)"
    @update:search="ceEmit('update:search', $event)"
    @edit-start="ceEmit('edit-start', $event)"
    @edit-save="ceEmit('edit-save', $event)"
    @edit-cancel="ceEmit('edit-cancel', $event)"
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
