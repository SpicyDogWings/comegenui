<script setup lang="ts">
import { computed, ref, reactive, watch, nextTick } from "vue";
import Badge from "./Badge.ce.vue";
import Button from "./Button.ce.vue";
import Input from "./Input.ce.vue";
import Textarea from "./Textarea.ce.vue";
import Pagination from "./Pagination.ce.vue";

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
});

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(props.itemsPerPage);
const emit = defineEmits(["update:search", "update:currentPage", "update:itemsPerPage"]);
const localData = reactive<Record<string, any>[]>([]);
const editableInput = ref<InstanceType<typeof Input> | InstanceType<typeof Textarea> | null>(null);

const editingCell = ref<{row: Record<string, any>, colKey: string} | null>(null);
const editValue = ref<string>('');
const editValidationState = ref<{row: Record<string, any>, colKey: string, success: boolean} | null>(null);
const startEditing = async (row: Record<string, any>, col: Column) => {
    editingCell.value = { row, colKey: col.key };
    editValue.value = row[col.key] != null ? String(row[col.key]) : "";
    editValidationState.value = null;
    await nextTick();
    // 1. Verificamos si es un array (comportamiento de v-for)
    const inputEl = Array.isArray(editableInput.value)
    ? editableInput.value[0]
    : editableInput.value;
    // 2. Ejecutamos el focus
    inputEl?.focus?.();
};
const saveEdit = (row: Record<string, any>, col: Column) => {
  if (!editingCell.value) return;
  
  let isValid = true;
  
  // Validate with RegExp if editable is a RegExp
  if (col.editable instanceof RegExp && !col.editable.test(editValue.value)) {
    isValid = false;
  }
  // Validate with custom validator function if present
  else if (col.validator && !col.validator(editValue.value, row)) {
    isValid = false;
  }
  
  if (!isValid) {
    editValidationState.value = { row, colKey: col.key, success: false };
    cancelEdit();
    return;
  }
  
  const index = getRowIndex(row);
  updateRow(index, { [col.key]: editValue.value });
  editValidationState.value = { row, colKey: col.key, success: true };
  cancelEdit();
};
const cancelEdit = () => {
  editingCell.value = null;
  editValue.value = '';
};

const getRowIndex = (row: Record<string, any>): number => {
  return localData.indexOf(row);
};
const updateRow = (index: number, newData: Record<string, any>) => {
  if (index >= 0 && index < localData.length && localData[index]) {
    Object.assign(localData[index], newData);
  }
};
const getData = (filterFn?: (item: Record<string, any>) => boolean): Record<string, any>[] => {
  let data = localData.map((item) => ({ ...item }));
  if (filterFn) {
    data = data.filter(filterFn);
  }
  return data;
};
const getRow = (index: number): Record<string, any> | undefined => {
  if (index >= 0 && index < localData.length) {
    return { ...localData[index] };
  }
  return undefined;
};
const removeRow = (index: number): boolean => {
  if (index >= 0 && index < localData.length) {
    localData.splice(index, 1);
    return true;
  }
  return false;
};
const addRow = (newItem: Record<string, any>): boolean => {
  if (localData.length === 0) {
    localData.push({ ...newItem });
    return true;
  }
  const firstRow = localData[0];
  if (!firstRow) {
    localData.push({ ...newItem });
    return true;
  }
  const firstRowKeys = Object.keys(firstRow);
  const newItemKeys = Object.keys(newItem);
  const isValid = firstRowKeys.every((key) => newItemKeys.includes(key));
  if (isValid) {
    localData.push({ ...newItem });
    return true;
  }
  return false;
};
const pushData = (items: Record<string, any>[]): boolean => {
  if (localData.length === 0) {
    localData.push(...items.map((item) => ({ ...item })));
    return true;
  }
  const firstRow = localData[0];
  if (!firstRow) {
    localData.push(...items.map((item) => ({ ...item })));
    return true;
  }
  const firstRowKeys = Object.keys(firstRow);
  const allValid = items.every((item) => {
    const itemKeys = Object.keys(item);
    return firstRowKeys.every((key) => itemKeys.includes(key));
  });
  if (allValid) {
    localData.push(...items.map((item) => ({ ...item })));
    return true;
  }
  return false;
};

const tableColumns = computed<Column[]>(() => {
  if (props.columns.length > 0) {
    return props.columns;
  }
  if (localData.length > 0 && localData[0]) {
    return Object.keys(localData[0]).map((key) => ({ key, label: key, editable: false }));
  }
  return [];
});
const handleSearchUpdate = (value: string) => {
  searchQuery.value = value;
  currentPage.value = 1;
  emit("update:search", value);
};
const filteredData = computed(() => {
  if (!searchQuery.value || !props.searchEnabled) {
    return localData;
  }
  const query = searchQuery.value.toLowerCase();
  const fields =
    props.searchFields.length > 0 ? props.searchFields : tableColumns.value.map((c) => c.key);
  return localData.filter((row) => {
    return fields.some((key) => {
      const value = row[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === "number") {
        return String(value).includes(query);
      }
      return false;
    });
  });
});

const displayData = computed(() => {
  if (!props.pagination || searchQuery.value) return filteredData.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});
const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
const showPaginationControl = computed(() => {
  return props.pagination && !searchQuery.value;
});
const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit("update:currentPage", page);
};
const handlePageSizeChange = (size: number) => {
  itemsPerPage.value = size;
  currentPage.value = 1;
  emit("update:itemsPerPage", size);
};

const getCellValue = (row: Record<string, any>, col: Column): string | string[] => {
  if (typeof col.cell === "function") {
    return col.cell(row);
  }
  return row[col.key];
};
const getCellBadges = (row: Record<string, any>, col: Column, index: number): BadgeConfig[] => {
  if (typeof col.badges === "function") {
    return col.badges(row, index).filter((b) => b?.value != null);
  }
  return [];
};
const hasBadges = (col: Column): boolean => {
  return typeof col.badges === "function";
};
const getCellButtons = (row: Record<string, any>, col: Column, index: number): ButtonConfig[] => {
  if (typeof col.buttons === "function") {
    return col.buttons(row, index).filter((b) => b?.label != null);
  }
  return [];
};
const hasButtons = (col: Column): boolean => {
  return typeof col.buttons === "function";
};

watch(
  () => props.itemsPerPage,
  (val) => {
    itemsPerPage.value = val;
  },
);
watch(
  () => editValidationState.value,
  (newState) => {
    if (newState) {
      setTimeout(() => {
        editValidationState.value = null;
      }, 2000);
    }
  },
);
watch(
  () => props.searchValue,
  (val) => {
    searchQuery.value = val;
  },
  { immediate: true },
);
watch(
  () => props.data,
  (newData) => {
    localData.splice(0, localData.length, ...newData);
  },
  { immediate: true, deep: true },
);

defineExpose({ updateRow, getData, getRow, removeRow, addRow, pushData });
</script>

<template>
  <div class="flex flex-col overflow-hidden">
    <div v-if="searchEnabled" class="p-3">
      <Input
        :placeholder="searchPlaceholder"
        :model-value="searchQuery"
        @update:modelValue="handleSearchUpdate"
        color="neutral"
      />
    </div>
    <div class="overflow-auto rounded-cu">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="col in tableColumns"
              :key="col.key"
              class="text-left p-3 font-sans font-medium text-primary-50 sticky top-0 bg-primary-600 z-20"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.label || col.key }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in displayData"
            :key="rowIndex"
            class="hover:bg-charcoal-50 transition-colors border-charcoal-100 border-b-1 border-b-solid last:border-b-0"
          >
            <td v-for="col in tableColumns" :key="col.key" class="p-3 font-sans text-charcoal-800">
              <div
                v-if="col.editable"
                class="cursor-pointer"
                @click="col.singleClick ? startEditing(row, col) : undefined"
                @dblclick="!col.singleClick ? startEditing(row, col) : undefined"
              >
                <template v-if="editingCell?.row === row && editingCell?.colKey === col.key">
                  <component
                    :is="col.inputType === 'textarea' ? Textarea : Input"
                    ref="editableInput"
                    v-model="editValue"
                    @blur="saveEdit(row, col)"
                    @keyup.escape="cancelEdit"
                    @keyup.enter="saveEdit(row, col)"
                    noResize
                    class="w-full"
                  />
                </template>
                <slot v-else :name="`cell-${col.key}`" :row="row" :column="col" :index="getRowIndex(row)">
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil" :class="{
      'text-red-500': editValidationState?.row === row && editValidationState?.colKey === col.key && !editValidationState.success,
      'text-green-500': editValidationState?.row === row && editValidationState?.colKey === col.key && editValidationState.success
    }"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                    {{ getCellValue(row, col) }}
                  </span>
                </slot>
              </div>
              <div v-else>
                <slot :name="`cell-${col.key}`" :row="row" :column="col" :index="getRowIndex(row)">
                  <div v-if="hasBadges(col)" class="flex items-center gap-1">
                    <Badge
                      v-for="(badge, idx) in getCellBadges(row, col, getRowIndex(row))"
                      :key="idx"
                      :color="badge.color"
                      :variant="badge.variant"
                    >
                      {{ badge.value }}
                    </Badge>
                  </div>
                  <div v-else-if="hasButtons(col)" class="flex items-center gap-1">
                    <Button
                      v-for="(btn, idx) in getCellButtons(row, col, getRowIndex(row))"
                      :key="idx"
                      :color="btn.color"
                      :variant="btn.variant"
                      :to="btn.to"
                      :target="btn.target"
                      @click="btn.onClick?.()"
                    >
                      <span class="flex items-center justify-center gap-2" v-if="btn.html" v-html="btn.label" />
                      <span v-else>{{ btn.label }}</span>
                    </Button>
                  </div>
                  <span v-else>{{ getCellValue(row, col) }}</span>
                </slot>
              </div>
            </td>
          </tr>
          <tr v-if="displayData.length === 0">
            <td
              :colspan="tableColumns.length"
              class="p-8 text-center text-charcoal-500 italic font-sans"
            >
              <slot name="empty">{{ empty || "No hay datos que mostrar" }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      v-if="showPaginationControl"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :show-page-size="props.showPageSize"
      :page-size-options="props.pageSizeOptions"
      @update:current-page="handlePageChange"
      @update:items-per-page="handlePageSizeChange"
    />
  </div>
</template>

<style>
@unocss-placeholder;
</style>
