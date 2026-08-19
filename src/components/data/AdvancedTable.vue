<script setup lang="ts">
import { computed, ref, watch, toRef, type Component, type PropType } from "vue";
import Table from "./Table.vue";
import Pagination from "../controls/Pagination.vue";
import Input from "../form/Input.vue";
import EditableTableCell from "./EditableTableCell.vue";
import Button from "../buttons/Button.vue";
import Badge from "../information/Badge.vue";
import DropdownMenu from "../controls/DropdownMenu.vue";
import { usePagination } from "../../composables/usePagination";
import { useSearch } from "../../composables/useSearch";
import { useTableData } from "../../composables/useTableData";

const validationStates = ref<Record<string, { success: boolean; error: string | null }>>({});

const getOriginalIndex = (displayIndex: number): number => {
  const displayRow = pagination.displayData.value[displayIndex];
  return localData.value.findIndex(row => row === displayRow);
};

const getCellKey = (rowIndex: number, colKey: string): string => {
  const originalIndex = getOriginalIndex(rowIndex);
  return `${originalIndex}-${colKey}`;
};

const hasBadges = (col: Column): boolean => !!col.badges;
const hasButtons = (col: Column): boolean => !!col.buttons;
const hasCellFunction = (col: Column): boolean => typeof col.cell === 'function';

const getCellValue = (col: Column, row: Record<string, any>): string | string[] => {
  if (hasCellFunction(col)) return col.cell!(row);
  return row[col.key];
};

const getCellBadges = (col: Column, row: Record<string, any>): BadgeConfig[] => {
  return col.badges ? col.badges(row) : [];
};

const getCellButtons = (col: Column, row: Record<string, any>): ButtonConfig[] => {
  return col.buttons ? col.buttons(row) : [];
};

// Disabled: fila > columna > celda (prioridad).
const isRowDisabled = (row: Record<string, any>): boolean => {
  const rd = props.rowDisabled;
  return typeof rd === "function" ? rd(row) : !!rd;
};

const isCellDisabled = (col: Column, row: Record<string, any>): boolean => {
  if (isRowDisabled(row)) return true;
  if (typeof col.disabled === "function" ? col.disabled(row) : !!col.disabled) return true;
  if (typeof col.cellDisabled === "function" && col.cellDisabled(row)) return true;
  return false;
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

interface AutocompleteItem {
  label: string;
  value?: string;
  icon?: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

interface Column {
  key: string;
  label?: string;
  width?: string;
  align?: "left" | "center" | "right";
  editorAlign?: "start" | "center" | "end"; // Alineación del editor en la celda (para celdas que no ocupan todo el ancho, ej. switch)
  cell?: (row: Record<string, any>) => string | string[];
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";
  color?: string;
  variant?: string;
  // Las sub-key de date/select/autocomplete/textarea/input se pasan tal cual a
  // EditableTableCell, que las forwardea al editor correspondiente.
  date?: {
    format?: string;
    min?: string | number | Date;
    max?: string | number | Date;
    yearNavigation?: boolean;
    disabledWeekdays?: number[] | string;
    disabledDates?: (string | Date)[] | string;
    color?: string;
    variant?: string;
    placement?: string;
    position?: string; // "bottom" | "top" | "left" | "right" — posición del panel del calendario
    align?: string; // "start" | "center" | "end"
    fixed?: boolean;
  };
  select?: {
    options: SelectOption[];
    color?: string;
    variant?: string;
    position?: string;
    align?: string;
    placeholderWrap?: boolean;
  };
  autocomplete?: {
    items: AutocompleteItem[];
    minChars?: number;
    color?: string;
    variant?: string;
  };
  textarea?: {
    rows?: number;
    noResize?: boolean;
    color?: string;
    variant?: string;
  };
  input?: {
    type?: string;
    startValue?: string;
    color?: string;
    variant?: string;
  };
  switch?: {
    size?: "sm" | "md";
    color?: string;
  };
  selectOptions?: SelectOption[] | ((row: Record<string, any>) => SelectOption[]);
  autocompleteItems?: AutocompleteItem[] | ((row: Record<string, any>) => AutocompleteItem[]);
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
  inlineEdit?: boolean; // Estado por columna: renderiza el editor directo
  sortable?: boolean | "string" | "number" | "boolean";
  badges?: (row: Record<string, any>) => BadgeConfig[];
  buttons?: (row: Record<string, any>) => ButtonConfig[];
  disabled?: boolean | ((row: Record<string, any>) => boolean); // Columna deshabilitada (opcional por fila)
  cellDisabled?: (row: Record<string, any>) => boolean; // Celda deshabilitada (intersección fila × columna)
}

const props = defineProps({
  theme: { type: String, required: false, default: "light" },
  columns: { type: Array as () => Column[], required: false, default: () => [] },
  data: { type: Array as () => Record<string, any>[], required: false, default: () => [] },
  empty: { type: String, required: false, default: "No hay datos que mostrar" },
  pagination: { type: Boolean, required: false, default: true },
  itemsPerPage: { type: Number, required: false, default: 10 },
  showPageSize: { type: Boolean, required: false, default: false },
  pageSizeOptions: { type: Array as () => number[], required: false, default: () => [5, 10, 20, 50] },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
  },
  searchEnabled: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: "Buscar..." },
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  searchValue: { type: String, required: false, default: "" },
  tableMaxHeight: { type: String, required: false, default: "" },
  filters: { type: Object as () => Record<string, any>, required: false, default: () => ({}) },
  loading: { type: Boolean, required: false, default: false },
  actions: { type: Array as () => ButtonConfig[], required: false, default: () => [] },
  // Estado reactivo: cuando es true, todas las columnas editables renderizan
  // el editor (input/select/textarea) directamente, sin lápiz.
  inlineEditing: { type: Boolean, required: false, default: false },
  rowDisabled: {
    type: [Boolean, Function] as PropType<boolean | ((row: Record<string, any>) => boolean)>,
    required: false,
    default: false,
  },
});

const emit = defineEmits([
  "update:currentPage", "update:itemsPerPage", "update:search",
  "row-click", "row-dblclick", "cell-click",
  "edit-start", "edit-save", "edit-cancel", "edit-error",
]);

const searchQuery = ref("");

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

const filteredData = computed(() => {
  const data = searchedData.value;
  const filters = props.filters;
  if (!filters || Object.keys(filters).length === 0) return data;
  return data.filter((row) =>
    Object.entries(filters).every(([key, filter]) => {
      const val = row[key];
      if (typeof filter === "function") return filter(val, row);
      if (Array.isArray(filter)) return filter.includes(val);
      return val === filter;
    })
  );
});

const sortBy = ref("");
const sortDir = ref<"" | "asc" | "desc">("");

function handleSort(key: string) {
  if (sortBy.value !== key) {
    sortBy.value = key;
    sortDir.value = "asc";
  } else if (sortDir.value === "asc") {
    sortDir.value = "desc";
  } else {
    sortBy.value = "";
    sortDir.value = "";
  }
}

function detectSortType(col: Column): "string" | "number" | "boolean" {
  if (col.sortable === "string" || col.sortable === "number" || col.sortable === "boolean") return col.sortable;
  const first = filteredData.value[0];
  if (first) {
    const val = first[col.key];
    if (typeof val === "number") return "number";
    if (typeof val === "boolean") return "boolean";
  }
  return "string";
}

const sortedData = computed(() => {
  const data = filteredData.value;
  if (!sortBy.value || !sortDir.value) return data;
  const col = props.columns.find((c) => c.key === sortBy.value);
  if (!col?.sortable) return data;
  const type = detectSortType(col);
  const sorted = [...data].sort((a, b) => {
    const va = a[sortBy.value];
    const vb = b[sortBy.value];
    let cmp = 0;
    if (type === "number") cmp = (Number(va) || 0) - (Number(vb) || 0);
    else if (type === "boolean") cmp = (va === vb) ? 0 : va ? -1 : 1;
    else cmp = String(va ?? "").localeCompare(String(vb ?? ""), "es");
    return sortDir.value === "desc" ? -cmp : cmp;
  });
  return sorted;
});

watch([sortBy, sortDir], () => pagination.setCurrentPage(1));

const pagination = usePagination(sortedData, {
  initialPage: 1,
  initialItemsPerPage: props.itemsPerPage,
  showPageSize: props.showPageSize,
  pageSizeOptions: props.pageSizeOptions,
});

watch(() => props.itemsPerPage, (newVal) => {
  if (newVal !== pagination.itemsPerPage.value) {
    pagination.setItemsPerPage(newVal);
  }
});

watch(() => props.searchValue, (newVal) => { searchQuery.value = newVal; }, { immediate: true });
watch(searchQuery, (newVal) => { emit("update:search", newVal); pagination.setCurrentPage(1); });

const handleSearchUpdate = (value: string) => { searchQuery.value = value; };
const handlePageChange = (page: number) => { pagination.setCurrentPage(page); emit("update:currentPage", page); };
const handlePageSizeChange = (size: number) => { pagination.setItemsPerPage(size); emit("update:itemsPerPage", size); };

const augmentedColumns = computed(() =>
  props.actions?.length
    ? [...props.columns, { key: '__actions__', label: '', width: '1%', align: 'center' as const, sortable: false }]
    : props.columns
);

const tableProps = computed(() => ({
  columns: augmentedColumns.value,
  data: props.pagination ? pagination.displayData.value : sortedData.value,
  empty: props.empty,
  color: props.color,
  variant: props.variant,
  loading: props.loading,
  rowDisabled: props.rowDisabled,
}));

const tableStyles = computed(() => ({
  '--table-bg': `var(--cu-color-${props.color}-soft)`,
  '--table-fg': `var(--cu-color-${props.color}-text)`,
  '--table-bg-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--table-bd': `var(--cu-color-${props.color}-subtle-border)`,
}));

const inputVariant = computed(() => props.variant === 'solid' ? 'soft' : props.variant);
const paginationVariant = computed(() => props.variant === 'solid' ? 'soft' : props.variant);

defineExpose({ updateRow, getData, getRow, removeRow, addRow, pushData });
</script>

<template>
  <div class="cu-advanced-table" :style="tableStyles">
    <div v-if="props.searchEnabled" class="cu-advanced-table-search">
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

    <Table v-bind="tableProps">
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>

      <template v-for="col in augmentedColumns" v-slot:[`header-${col.key}`]="{ column }">
        <span class="cu-table-th-content">
          <Button
            v-if="column.sortable"
            :color="props.color"
            variant="ghost"
            @click.stop="handleSort(column.key)"
          >
            <template v-if="sortBy === column.key && sortDir === 'asc'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6L12 2L16 6"/><path d="M12 2V22"/></svg>
            </template>
            <template v-else-if="sortBy === column.key && sortDir === 'desc'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18L12 22L16 18"/><path d="M12 2V22"/></svg>
            </template>
            <template v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/></svg>
            </template>
          </Button>
          {{ column.label || column.key }}
        </span>
      </template>

      <template v-for="col in augmentedColumns" v-slot:[`cell-${col.key}`]="{ row, value, index }">
        <div v-if="hasButtons(col)" class="cu-advanced-table-cell-buttons">
          <Button
            v-for="(button, buttonIndex) in getCellButtons(col, row)"
            :key="`button-${index}-${col.key}-${buttonIndex}`"
            :color="button.color || props.color"
            :variant="button.variant || props.variant"
            :to="button.to"
            :target="button.target"
            :disabled="isCellDisabled(col, row) || button.disabled"
            @click="(e: MouseEvent) => { if (button.onClick && !isCellDisabled(col, row)) { e.stopPropagation(); button.onClick(row); } }"
          >
            <component :is="button.icon" v-if="typeof button.icon === 'object'" class="cu-advanced-table-icon" />
            <span v-else-if="button.icon" v-html="button.icon" class="cu-advanced-table-icon"></span>
            <span v-if="button.label">{{ button.label }}</span>
          </Button>
        </div>

        <div v-else-if="hasBadges(col)" class="cu-advanced-table-cell-badges">
          <Badge
            v-for="(badge, badgeIndex) in getCellBadges(col, row)"
            :key="`badge-${index}-${col.key}-${badgeIndex}`"
            :color="badge.color || props.color"
            :variant="badge.variant || props.variant"
          >
            {{ badge.value }}
          </Badge>
        </div>

        <EditableTableCell
          v-else-if="col.editable"
          :value="value"
          :row="row"
          :column="col"
          :inline-edit="inlineEditing"
          :disabled="isCellDisabled(col, row)"
          :index="index"
          :color="props.color"
          :variant="inputVariant"
          :validation="validationStates[getCellKey(index, col.key)] || { success: false, error: null }"
          @edit-start="(e: any) => { const displayIndex = e.index; const originalIndex = getOriginalIndex(displayIndex); const cellKey = getCellKey(displayIndex, e.column.key); validationStates[cellKey] = { success: false, error: null }; emit('edit-start', { ...e, index: originalIndex }); }"
          @edit-save="(e: any) => { const displayIndex = e.index; const originalIndex = getOriginalIndex(displayIndex); const cellKey = getCellKey(displayIndex, e.column.key); validationStates[cellKey] = { success: true, error: null }; updateRow(originalIndex, { [e.column.key]: e.value }); emit('edit-save', { ...e, index: originalIndex }); }"
          @edit-cancel="(e: any) => { const displayIndex = e.index; const originalIndex = getOriginalIndex(displayIndex); const cellKey = getCellKey(displayIndex, e.column.key); validationStates[cellKey] = { success: false, error: null }; emit('edit-cancel', { ...e, index: originalIndex }); }"
          @edit-error="(e: any) => { const displayIndex = e.index; const originalIndex = getOriginalIndex(displayIndex); const cellKey = getCellKey(displayIndex, e.column.key); validationStates[cellKey] = { success: false, error: 'Formato inválido' }; emit('edit-error', { ...e, index: originalIndex }); }"
        />

        <span v-else-if="hasCellFunction(col)">{{ getCellValue(col, row) }}</span>

        <div v-else-if="col.key === '__actions__' && props.actions?.length" class="cu-advanced-table-actions">
          <DropdownMenu
            :color="props.color"
            variant="ghost"
            position="bottom"
            align="end"
            fixed
            :items="props.actions.map(a => ({ ...a, disabled: isRowDisabled(row) || a.disabled, color: a.color || undefined, onClick: () => { if (!isRowDisabled(row)) a.onClick?.(row); } }))"
            @click.stop
          >
            <template #toggle="{ toggle }">
              <Button
                color="neutral"
                variant="ghost"
                :disabled="isRowDisabled(row)"
                @click="toggle"
                class="cu-advanced-table-actions-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="19" r="1.5"/>
                </svg>
              </Button>
            </template>
          </DropdownMenu>
        </div>

        <span v-else>{{ value }}</span>
      </template>
    </Table>

    <div v-if="props.pagination && pagination.showPaginationControl.value" class="cu-advanced-table-pagination">
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

<style scoped>
.cu-advanced-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
}

.cu-advanced-table-search {
  padding: var(--cu-space-md);
}

.cu-advanced-table-cell-buttons {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-advanced-table-cell-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--cu-space-sm);
}

.cu-advanced-table-icon {
  transform: translateY(2px);
}

.cu-advanced-table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cu-advanced-table-actions-btn {
  padding: 2px 6px;
  min-width: 0;
  height: 28px;
  box-sizing: border-box;
}

.cu-advanced-table-pagination {
  margin-top: var(--cu-space-lg);
}
</style>
