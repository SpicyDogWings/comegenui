<script setup lang="ts">
import { computed, ref } from "vue";
import Table from "./Table.vue";
import { colorMap } from "../utils/palette";

interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label: string;
  color?: string;
  variant?: string;
  to?: string;
  target?: string;
  onClick?: () => void;
  html?: boolean;
}

interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
  badges?: (row: Record<string, any>, index: number) => BadgeConfig[];
  buttons?: (row: Record<string, any>, index: number) => ButtonConfig[];
  editable?: boolean | RegExp;
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: 'input' | 'textarea';
  singleClick?: boolean;
}

const props = defineProps({
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
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
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
  searchPlaceholder: {
    type: String,
    required: false,
    default: "Buscar...",
  },
  searchEnabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  searchFields: {
    type: Array as () => string[],
    required: false,
    default: () => [],
  },
  searchValue: {
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
  tableMaxHeight: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:search", "update:currentPage", "update:itemsPerPage"]);

const hexColor = computed(() => colorMap[props.color as keyof typeof colorMap] || props.color);

function updateRow(index: number, newData: Record<string, any>) {
  return tableRef.value?.updateRow(index, newData);
}

function getData(filterFn?: (item: Record<string, any>) => boolean) {
  return tableRef.value?.getData(filterFn);
}

function getRow(index: number) {
  return tableRef.value?.getRow(index);
}

function removeRow(index: number) {
  return tableRef.value?.removeRow(index);
}

function addRow(newItem: Record<string, any>) {
  return tableRef.value?.addRow(newItem);
}

function pushData(items: Record<string, any>[]) {
  return tableRef.value?.pushData(items);
}

const tableRef = ref<InstanceType<typeof Table> | null>(null);

defineExpose({ updateRow, getData, getRow, removeRow, addRow, pushData });
</script>

<template>
  <Table
    ref="tableRef"
    :color="hexColor"
    :variant="props.variant"
    :columns="props.columns"
    :data="props.data"
    :empty="props.empty"
    :search-placeholder="props.searchPlaceholder"
    :search-enabled="props.searchEnabled"
    :search-fields="props.searchFields"
    :search-value="props.searchValue"
    :pagination="props.pagination"
    :items-per-page="props.itemsPerPage"
    :show-page-size="props.showPageSize"
    :page-size-options="props.pageSizeOptions"
    :table-max-height="props.tableMaxHeight"
    @update:search="emit('update:search', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:items-per-page="emit('update:itemsPerPage', $event)"
  >
    <template v-for="(_, name) in $slots" :key="name" v-slot:[name]>
      <slot :name="name" />
    </template>
  </Table>
</template>

<style>
@unocss-placeholder;
</style>
