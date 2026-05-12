<script setup lang="ts">
import { computed, ref, reactive, watch, nextTick } from "vue";
import { useTemplateRefsList } from "@vueuse/core";
import Input from "./form/Input.vue";
import Textarea from "./form/Textarea.vue";
import Pagination from "./Pagination.vue";
import { getBgClasses, getFgClasses } from "../utils/palette";

// --- Types ---

interface Column {
  key: string;
  label?: string;
  editable?: boolean | RegExp;
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: "input" | "textarea";
  singleClick?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

// --- Props ---

const props = defineProps({
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
    default: "ghost",
    validator: (value: string) =>
      ["solid", "soft", "ghost"].includes(value),
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
  stickyHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
  hoverable: {
    type: Boolean,
    required: false,
    default: true,
  },
  bordered: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits([
  "update:search",
  "update:currentPage",
  "update:itemsPerPage",
  "row-click",
  "row-dblclick",
  "cell-click",
  "edit-start",
  "edit-save",
  "edit-cancel",
  "data-change",
]);

// --- Refs ---

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(props.itemsPerPage);
const localData = reactive<Record<string, any>[]>([]);
const editingCell = ref<{ row: Record<string, any>; colKey: string } | null>(null);
const editValue = ref<string>("");
const editValidationState = ref<{ row: Record<string, any>; colKey: string; success: boolean } | null>(null);

const inputRefs = useTemplateRefsList<InstanceType<typeof Input | typeof Textarea>>();

// --- Computed ---

const bgClass = computed(() => getBgClasses(props.color, props.variant, false));
const fgClass = computed(() => getFgClasses(props.color, props.variant, false));

const tableColumns = computed<Column[]>(() => {
  if (props.columns.length > 0) {
    return props.columns;
  }
  if (localData.length > 0 && localData[0]) {
    return Object.keys(localData[0]).map((key) => ({ key, label: key, editable: false }));
  }
  return [];
});

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
  if (!props.pagination) return filteredData.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const showPaginationControl = computed(() => props.pagination && totalPages.value > 1);

const headerStyle = computed(() => ({
  "--table-fg": fgClass.value.main,
  "--table-bg": bgClass.value.main,
  "backdrop-filter": props.variant === "soft" || props.variant === "ghost" ? "blur(8px)" : "none",
}));

// --- Methods ---

const getRowIndex = (row: Record<string, any>): number => localData.indexOf(row);

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
    emit("data-change", localData);
    return true;
  }
  return false;
};

const addRow = (newItem: Record<string, any>): boolean => {
  if (localData.length === 0) {
    localData.push({ ...newItem });
    emit("data-change", localData);
    return true;
  }
  const firstRow = localData[0];
  if (!firstRow) {
    localData.push({ ...newItem });
    emit("data-change", localData);
    return true;
  }
  const firstRowKeys = Object.keys(firstRow);
  const newItemKeys = Object.keys(newItem);
  const isValid = firstRowKeys.every((key) => newItemKeys.includes(key));
  if (isValid) {
    localData.push({ ...newItem });
    emit("data-change", localData);
    return true;
  }
  return false;
};

const pushData = (items: Record<string, any>[]): boolean => {
  if (localData.length === 0) {
    localData.push(...items.map((item) => ({ ...item })));
    emit("data-change", localData);
    return true;
  }
  const firstRow = localData[0];
  if (!firstRow) {
    localData.push(...items.map((item) => ({ ...item })));
    emit("data-change", localData);
    return true;
  }
  const firstRowKeys = Object.keys(firstRow);
  const allValid = items.every((item) => {
    const itemKeys = Object.keys(item);
    return firstRowKeys.every((key) => itemKeys.includes(key));
  });
  if (allValid) {
    localData.push(...items.map((item) => ({ ...item })));
    emit("data-change", localData);
    return true;
  }
  return false;
};

const updateRow = (index: number, newData: Record<string, any>) => {
  if (index >= 0 && index < localData.length && localData[index]) {
    Object.assign(localData[index], newData);
    emit("data-change", localData);
  }
};

const startEditing = async (row: Record<string, any>, col: Column) => {
  editingCell.value = { row, colKey: col.key };
  editValue.value = row[col.key] != null ? String(row[col.key]) : "";
  editValidationState.value = null;
  emit("edit-start", { row, col });
  await nextTick();
  const firstInput = inputRefs.value[0];
  firstInput?.focus?.();
};

const saveEdit = (row: Record<string, any>, col: Column) => {
  if (!editingCell.value) return;

  let isValid = true;

  if (col.editable instanceof RegExp && !col.editable.test(editValue.value)) {
    isValid = false;
  }
  if (isValid && col.validator && !col.validator(editValue.value, row)) {
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
  emit("edit-save", { row, col, value: editValue.value });
  cancelEdit();
};

const cancelEdit = () => {
  emit("edit-cancel", { row: editingCell.value?.row, colKey: editingCell.value?.colKey });
  editingCell.value = null;
  editValue.value = "";
};

const getCellValue = (row: Record<string, any>, col: Column): string => {
  return row[col.key] != null ? String(row[col.key]) : "";
};

const handleSearchUpdate = (value: string) => {
  searchQuery.value = value;
  currentPage.value = 1;
  emit("update:search", value);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit("update:currentPage", page);
};

const handlePageSizeChange = (size: number) => {
  itemsPerPage.value = size;
  currentPage.value = 1;
  emit("update:items-per-page", size);
};

const handleRowClick = (row: Record<string, any>, index: number, event: MouseEvent) => {
  emit("row-click", { row, index, event });
};

const handleRowDblClick = (row: Record<string, any>, index: number, event: MouseEvent) => {
  emit("row-dblclick", { row, index, event });
};

const handleCellClick = (row: Record<string, any>, col: Column, index: number, event: MouseEvent) => {
  emit("cell-click", { row, col, index, event });
};

// --- Watches ---

watch(
  () => props.itemsPerPage,
  (val) => {
    itemsPerPage.value = val;
  }
);

watch(
  () => props.searchValue,
  (val) => {
    searchQuery.value = val;
  },
  { immediate: true }
);

watch(
  () => props.data,
  (newData) => {
    localData.splice(0, localData.length, ...newData);
  },
  { immediate: true, deep: true }
);

// --- Expose ---

defineExpose({
  updateRow,
  getData,
  getRow,
  removeRow,
  addRow,
  pushData,
  localData,
  filteredData,
  displayData,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  refresh: () => {},
});
</script>

<template>
  <div class="flex flex-col overflow-hidden max-w-full">
    <!-- Search -->
    <div v-if="searchEnabled" class="p-3">
      <slot name="search" :query="searchQuery" :update="handleSearchUpdate">
        <Input
          :placeholder="searchPlaceholder"
          :model-value="searchQuery"
          @update:modelValue="handleSearchUpdate"
          :color="props.color"
          :variant="props.variant"
        />
      </slot>
    </div>

    <!-- Table Container -->
    <div
      class="overflow-auto rounded-cu"
      :style="{ maxHeight: props.tableMaxHeight }"
    >
      <table class="w-full border-collapse">
        <!-- Header -->
        <thead>
          <tr :class="{ 'border-b-1 border-solid border-charcoal-200': bordered }">
            <th
              v-for="col in tableColumns"
              :key="col.key"
              class="text-left p-3 font-sans font-medium sticky top-0 z-20 text-[var(--table-fg)] bg-[var(--table-bg)]"
              :class="{
                'bg-opacity-10': props.variant === 'soft',
                'bg-white': props.variant === 'ghost',
              }"
              :style="headerStyle"
              :width="col.width"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.label || col.key }}
              </slot>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <tr
            v-for="(row, rowIndex) in displayData"
            :key="rowIndex"
            :class="{
              'hover:bg-charcoal hover:bg-opacity-10 transition-colors': hoverable,
              'border-b-1 border-solid border-charcoal-100 last:border-b-0': !bordered,
              'border-1 border-solid border-charcoal-200': bordered,
            }"
            @click="handleRowClick(row, rowIndex, $event)"
            @dblclick="handleRowDblClick(row, rowIndex, $event)"
          >
            <td
              v-for="col in tableColumns"
              :key="col.key"
              class="p-3 font-sans text-charcoal-800"
              :class="{
                'text-left': col.align !== 'center' && col.align !== 'right',
                'text-center': col.align === 'center',
                'text-right': col.align === 'right',
              }"
              @click="(e) => handleCellClick(row, col, rowIndex, e)"
            >
              <!-- Editable Cell -->
              <div
                v-if="col.editable"
                class="cursor-pointer"
                @click="col.singleClick ? startEditing(row, col) : undefined"
                @dblclick="!col.singleClick ? startEditing(row, col) : undefined"
              >
                <template v-if="editingCell?.row === row && editingCell?.colKey === col.key">
                  <Textarea
                    v-if="col.inputType === 'textarea'"
                    v-model="editValue"
                    @blur="saveEdit(row, col)"
                    @keyup.escape="cancelEdit"
                    @keyup.enter="saveEdit(row, col)"
                    noResize
                    class="w-full"
                    :color="props.color"
                    :variant="props.variant"
                  />
                  <Input
                    v-else
                    ref="inputRefs"
                    v-model="editValue"
                    @blur="saveEdit(row, col)"
                    @keyup.escape="cancelEdit"
                    @keyup.enter="saveEdit(row, col)"
                    class="w-full"
                    :color="props.color"
                    :variant="props.variant"
                  />
                </template>
                <slot
                  v-else
                  :name="`cell-${col.key}`"
                  :row="row"
                  :column="col"
                  :index="rowIndex"
                  :value="getCellValue(row, col)"
                  :editing="editingCell?.row === row && editingCell?.colKey === col.key"
                >
                  <span
                    class="flex items-center gap-2"
                    :class="{
                      'text-red-500':
                        editValidationState?.row === row &&
                        editValidationState?.colKey === col.key &&
                        !editValidationState.success,
                      'text-green-500':
                        editValidationState?.row === row &&
                        editValidationState?.colKey === col.key &&
                        editValidationState.success,
                    }"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-pencil"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    {{ getCellValue(row, col) }}
                  </span>
                </slot>
              </div>

              <!-- Non-Editable Cell -->
              <div v-else>
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :column="col"
                  :index="rowIndex"
                  :value="getCellValue(row, col)"
                >
                  {{ getCellValue(row, col) }}
                </slot>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="displayData.length === 0">
            <td
              :colspan="tableColumns.length"
              class="p-8 text-center text-charcoal-500 italic font-sans"
            >
              <slot name="empty">
                {{ empty || "No hay datos que mostrar" }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <slot name="pagination" :pagination="showPaginationControl">
      <Pagination
        v-if="showPaginationControl"
        :color="props.color"
        :variant="props.variant"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :show-page-size="props.showPageSize"
        :page-size-options="props.pageSizeOptions"
        @update:current-page="handlePageChange"
        @update:items-per-page="handlePageSizeChange"
      />
    </slot>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
