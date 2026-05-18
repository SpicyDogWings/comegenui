<script setup lang="ts">
import { computed, ref, watch, toRef } from "vue";
import Table from "./Table.vue";
import Pagination from "../Pagination.vue";
import Input from "../form/Input.vue";
import EditableTableCell from "./EditableTableCell.vue";
import { usePagination } from "../../composables/usePagination";
import { useSearch } from "../../composables/useSearch";
import { useTableData } from "../../composables/useTableData";

interface Column {
  key: string;
  label?: string;
  width?: string;
  align?: "left" | "center" | "right";
  // Editable properties
  editable?: boolean | RegExp;
  inputType?: "input" | "textarea";
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
}

const props = defineProps({
  // Table props - pass through to Table.vue
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
    default: "No hay datos que mostrar",
  },
  
  // Pagination props
  pagination: {
    type: Boolean,
    required: false,
    default: true,
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
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  // Search props
  searchEnabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    required: false,
    default: "Buscar...",
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
  // Table max height prop
  tableMaxHeight: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits([
  "update:currentPage",
  "update:itemsPerPage",
  "update:search",
  "row-click",
  "row-dblclick",
  "cell-click",
  "edit-start",
  "edit-save",
  "edit-cancel",
]);

// Search ref
const searchQuery = ref("");

// Use table data composable
const { data: localData, updateRow, getData, getRow, removeRow, addRow, pushData } = 
  useTableData(toRef(() => props.data));

// Use search composable
const { filteredData: searchedData } = useSearch(localData, {
  searchQuery,
  searchFields: props.searchFields,
  caseSensitive: false,
});

// Use pagination composable with searched data
const pagination = usePagination(searchedData, {
  initialPage: 1,
  initialItemsPerPage: props.itemsPerPage,
  showPageSize: props.showPageSize,
  pageSizeOptions: props.pageSizeOptions,
});

// Watch for external changes to itemsPerPage prop
watch(
  () => props.itemsPerPage,
  (newVal) => {
    if (newVal !== pagination.itemsPerPage.value) {
      pagination.setItemsPerPage(newVal);
    }
  }
);

// Watch for external search value changes
watch(
  () => props.searchValue,
  (newVal) => {
    searchQuery.value = newVal;
  },
  { immediate: true }
);

// Watch for search query changes and reset pagination
watch(searchQuery, (newVal) => {
  emit("update:search", newVal);
  pagination.setCurrentPage(1); // Reset to first page when search changes
});

// Handle search updates
const handleSearchUpdate = (value: string) => {
  searchQuery.value = value;
};

// Handle pagination events
const handlePageChange = (page: number) => {
  pagination.setCurrentPage(page);
  emit("update:currentPage", page);
};

const handlePageSizeChange = (size: number) => {
  pagination.setItemsPerPage(size);
  emit("update:itemsPerPage", size);
};

// Table props to pass through
const tableProps = computed(() => ({
  columns: props.columns,
  data: pagination.displayData.value,
  empty: props.empty,
  maxHeight: props.tableMaxHeight,
  color: props.color,
  variant: props.variant,
}));

// Handle row events
const handleRowClick = (row: Record<string, any>, index: number, event: MouseEvent) => {
  emit("row-click", { row, index, event });
};

const handleRowDblClick = (row: Record<string, any>, index: number, event: MouseEvent) => {
  emit("row-dblclick", { row, index, event });
};

const handleCellClick = (row: Record<string, any>, col: Column, index: number, event: MouseEvent) => {
  emit("cell-click", { row, col, index, event });
};

// Expose data manipulation methods
defineExpose({ updateRow, getData, getRow, removeRow, addRow, pushData });
</script>

<template>
  <div class="flex flex-col overflow-hidden max-w-full">
    <!-- Search Input -->
    <div v-if="props.searchEnabled" class="p-3">
      <slot name="search" :query="searchQuery" :update="handleSearchUpdate">
        <Input
          :placeholder="props.searchPlaceholder"
          :model-value="searchQuery"
          @update:modelValue="handleSearchUpdate"
          :color="props.color"
          :variant="props.variant"
        />
      </slot>
    </div>
    
    <!-- Table Component -->
    <Table v-bind="tableProps">
      <!-- Pass through all slots from parent -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      
      <!-- Editable cells -->
      <template v-for="col in props.columns" v-slot:[`cell-${col.key}`]="{ row, value, index }">
        <EditableTableCell
          v-if="col.editable"
          :value="value"
          :row="row"
          :column="col"
          :index="index"
          :color="props.color"
          :variant="props.variant"
          @edit-start="(e) => emit('edit-start', e)"
          @edit-save="(e) => { emit('edit-save', e); updateRow(e.index, { ...row, [col.key]: e.value }); }"
          @edit-cancel="(e) => emit('edit-cancel', e)"
        />
      </template>
    </Table>

    <!-- Pagination Controls -->
    <div v-if="props.pagination && pagination.showPaginationControl.value" class="mt-4">
      <Pagination
        :color="props.color"
        :variant="props.variant"
        :current-page="pagination.currentPage.value"
        :total-pages="pagination.totalPages.value"
        :total-items="pagination.totalItems.value"
        :items-per-page="pagination.itemsPerPage.value"
        :show-page-size="props.showPageSize"
        :page-size-options="props.pageSizeOptions"
        @update:current-page="handlePageChange"
        @update:items-per-page="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
