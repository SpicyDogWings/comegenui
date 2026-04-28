<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Badge from "./Badge.ce.vue";
import Button from "./Button.ce.vue";
import Input from "./Input.ce.vue";
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
}

interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
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

watch(
  () => props.itemsPerPage,
  (val) => {
    itemsPerPage.value = val;
  },
);

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
  emit("update:itemsPerPage", size);
};

const tableColumns = computed(() => {
  if (props.columns.length > 0) {
    return props.columns;
  }
  if (props.data.length > 0 && props.data[0]) {
    return Object.keys(props.data[0]).map((key) => ({ key, label: key }));
  }
  return [];
});

const filteredData = computed(() => {
  if (!searchQuery.value || !props.searchEnabled) {
    return props.data;
  }

  const query = searchQuery.value.toLowerCase();
  const fields =
    props.searchFields.length > 0 ? props.searchFields : tableColumns.value.map((c) => c.key);

  return props.data.filter((row) => {
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

const getCellValue = (row: Record<string, any>, col: Column): string | string[] => {
  if (typeof col.cell === "function") {
    return col.cell(row);
  }
  return row[col.key];
};

const getCellBadges = (row: Record<string, any>, col: Column): BadgeConfig[] => {
  if (typeof col.badges === "function") {
    return col.badges(row).filter((b) => b?.value != null);
  }
  return [];
};

const hasBadges = (col: Column): boolean => {
  return typeof col.badges === "function";
};

const getCellButtons = (row: Record<string, any>, col: Column): ButtonConfig[] => {
  if (typeof col.buttons === "function") {
    return col.buttons(row).filter((b) => b?.label != null);
  }
  return [];
};

const hasButtons = (col: Column): boolean => {
  return typeof col.buttons === "function";
};
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
              <slot :name="`cell-${col.key}`" :row="row" :column="col" :index="rowIndex">
                <div v-if="hasBadges(col)" class="flex items-center gap-1">
                  <Badge
                    v-for="(badge, idx) in getCellBadges(row, col)"
                    :key="idx"
                    :color="badge.color"
                    :variant="badge.variant"
                  >
                    {{ badge.value }}
                  </Badge>
                </div>
                <div v-else-if="hasButtons(col)" class="flex items-center gap-1">
                  <Button
                    v-for="(btn, idx) in getCellButtons(row, col)"
                    :key="idx"
                    :color="btn.color"
                    :variant="btn.variant"
                    :to="btn.to"
                    :target="btn.target"
                    @click="btn.onClick?.()"
                  >
                    {{ btn.label }}
                  </Button>
                </div>
                <span v-else>{{ getCellValue(row, col) }}</span>
              </slot>
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
