<script setup lang="ts">
import { computed, ref, watch, toRef, type Component } from "vue";
import Table from "./Table.vue";
import Pagination from "../Pagination.vue";
import Input from "../form/Input.vue";
import EditableTableCell from "./EditableTableCell.vue";
import Button from "../Button.vue";
import Badge from "../Badge.vue";
import { usePagination } from "../../composables/usePagination";
import { useSearch } from "../../composables/useSearch";
import { useTableData } from "../../composables/useTableData";
import { getBgClasses, getFgClasses, getColorMap } from "../../utils/palette";
import { isValidTheme } from "../../config/theme";

// Add validation state map
const validationStates = new Map<string, { success: boolean; error: string | null }>();

const getOriginalIndex = (displayIndex: number): number => {
  const displayRow = pagination.displayData.value[displayIndex];
  return localData.value.findIndex(row => row === displayRow);
};

const getCellKey = (rowIndex: number, colKey: string): string => {
  const originalIndex = getOriginalIndex(rowIndex);
  return `${originalIndex}-${colKey}`;
};

// Helper functions for badges and buttons
const hasBadges = (col: Column): boolean => {
  return !!col.badges;
};

const hasButtons = (col: Column): boolean => {
  return !!col.buttons;
};

const hasCellFunction = (col: Column): boolean => {
  return typeof col.cell === 'function';
};

const getCellValue = (col: Column, row: Record<string, any>): string | string[] => {
  if (hasCellFunction(col)) {
    return col.cell!(row);
  }
  return row[col.key];
};

const getCellBadges = (col: Column, row: Record<string, any>): BadgeConfig[] => {
  return col.badges ? col.badges(row) : [];
};

const getCellButtons = (col: Column, row: Record<string, any>): ButtonConfig[] => {
  return col.buttons ? col.buttons(row) : [];
};

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
  width?: string;
  align?: "left" | "center" | "right";
  // Custom cell rendering
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
    default: "light",
    validator: (value: string) => isValidTheme(value),
  },
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
      ["outlined", "soft", "ghost", "subtle", "solid"].includes(value),
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

const normalizedSearchFields = computed(() => {
  const raw = props.searchFields;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") try { return JSON.parse(raw); } catch { return []; }
  return [];
});

const { filteredData: searchedData } = useSearch(localData, {
  searchQuery,
  searchFields: normalizedSearchFields,
  columns: computed(() => props.columns),
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
  data: props.pagination ? pagination.displayData.value : searchedData.value,
  empty: props.empty,
  maxHeight: props.tableMaxHeight,
  color: props.color,
  variant: props.variant,
}));

// Color classes using palette utilities
const bgClass = computed(() => getBgClasses(props.color, props.variant, false));
const fgClass = computed(() => getFgClasses(props.color, props.variant, false));

// Map table variant to input variant (Input doesn't support "solid")
const inputVariant = computed(() => {
  return props.variant === 'solid' ? 'soft' : props.variant;
});

// Map table variant to pagination variant (Pagination doesn't support "solid")
const paginationVariant = computed(() => {
  return props.variant === 'solid' ? 'soft' : props.variant;
});

// Convert color names to hex values for Button and Badge components
const getHexColor = (color: string): string => {
  const themeMap = getColorMap(props.theme as any);
  if (color && themeMap[color as keyof typeof themeMap]) {
    return themeMap[color as keyof typeof themeMap];
  }
  return color;
};

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
  <div class="flex flex-col overflow-hidden max-w-full" :style="{
    '--table-bg': bgClass.main,
    '--table-fg': fgClass.main,
    '--table-bg-hover': bgClass.hover,
    '--table-bg-active': bgClass.active,
    '--table-bd': fgClass.border,
  }">
    <!-- Search Input -->
    <div v-if="props.searchEnabled" class="p-3">
      <slot name="search" :query="searchQuery" :update="handleSearchUpdate">
        <Input
          :placeholder="props.searchPlaceholder"
          :model-value="searchQuery"
          @update:modelValue="handleSearchUpdate"
          :color="props.color"
          :variant="inputVariant"
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
        <!-- Buttons only - no cell value -->
        <div v-if="hasButtons(col)" class="flex items-center gap-2">
          <Button
            v-for="(button, buttonIndex) in getCellButtons(col, row)"
            :key="`button-${index}-${col.key}-${buttonIndex}`"
            :color="getHexColor(button.color || props.color)"
            :variant="button.variant || props.variant"
            :to="button.to"
            :target="button.target"
            :disabled="button.disabled"
            @click="(e) => {
              if (button.onClick) {
                e.stopPropagation();
                button.onClick(row);
              }
            }"
          >
            <component :is="button.icon" v-if="typeof button.icon === 'object'" class="transform translate-y-0.5" />
            <span v-else-if="button.icon" v-html="button.icon" class="transform translate-y-0.5"></span>
            <span v-if="button.label">{{ button.label }}</span>
          </Button>
        </div>
        
        <!-- Badges only - no cell value -->
        <div v-else-if="hasBadges(col)" class="flex items-center gap-2">
          <Badge
            v-for="(badge, badgeIndex) in getCellBadges(col, row)"
            :key="`badge-${index}-${col.key}-${badgeIndex}`"
            :color="getHexColor(badge.color || props.color)"
            :variant="badge.variant || props.variant"
          >
            {{ badge.value }}
          </Badge>
        </div>
        
        <!-- Editable cell -->
        <EditableTableCell
          v-else-if="col.editable"
          :value="value"
          :row="row"
          :column="col"
          :index="index"
          :color="props.color"
          :variant="inputVariant"
          :validation="validationStates.get(getCellKey(index, col.key)) || { success: false, error: null }"
          @edit-start="(e) => {
            const displayIndex = e.index;
            const originalIndex = getOriginalIndex(displayIndex);
            emit('edit-start', { ...e, index: originalIndex });
          }"
          @edit-save="(e) => {
            const displayIndex = e.index;
            const originalIndex = getOriginalIndex(displayIndex);
            const cellKey = getCellKey(displayIndex, e.column.key);
            validationStates.set(cellKey, { success: true, error: null });
            updateRow(originalIndex, { [e.column.key]: e.value });
            emit('edit-save', { ...e, index: originalIndex });
          }"
          @edit-cancel="(e) => {
            const displayIndex = e.index;
            const originalIndex = getOriginalIndex(displayIndex);
            const cellKey = getCellKey(displayIndex, e.column.key);
            validationStates.set(cellKey, { success: false, error: null });
            emit('edit-cancel', { ...e, index: originalIndex });
          }"
        />
        
        <!-- Custom cell rendering -->
        <span v-else-if="hasCellFunction(col)">{{ getCellValue(col, row) }}</span>
        <!-- Regular cell value only -->
        <span v-else>{{ value }}</span>
      </template>
    </Table>

    <!-- Pagination Controls -->
    <div v-if="props.pagination && pagination.showPaginationControl.value" class="mt-4">
      <Pagination
        :color="props.color"
        :variant="paginationVariant"
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
