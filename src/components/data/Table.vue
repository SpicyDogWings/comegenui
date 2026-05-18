<script setup lang="ts">
import { computed } from "vue";
import { getBgClasses } from "../../utils/palette";

interface Column {
  key: string;
  label?: string;
  width?: string;
  align?: "left" | "center" | "right";
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
    default: "No hay datos que mostrar",
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
  },
});

const bgClasses = computed(() => getBgClasses(props.color, props.variant, false));

const tableColumns = computed<Column[]>(() => {
  if (props.columns.length > 0) {
    return props.columns;
  }
  if (props.data.length > 0 && props.data[0]) {
    return Object.keys(props.data[0]).map((key) => ({ key, label: key }));
  }
  return [];
});

const getCellValue = (row: Record<string, any>, col: Column): string => {
  return row[col.key] != null ? String(row[col.key]) : "";
};
</script>

<template>
  <div class="flex flex-col overflow-hidden max-w-full">
    <div class="overflow-auto rounded-cu">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="col in tableColumns"
              :key="col.key"
              class="text-left p-3 font-sans font-medium sticky top-0 z-20"
              :class="{
                'bg-opacity-10': false,
                'bg-white': false,
              }"
              :width="col.width"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.label || col.key }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in props.data"
            :key="rowIndex"
            class="border-b-1 border-b-solid border-charcoal-100 hover:bg-[var(--row-hover-bg)] transition-colors"
            :style="{ '--row-hover-bg': bgClasses.hover }"
          >
            <slot
              name="template"
              :row="row"
              :rowIndex="rowIndex"
              :columns="tableColumns"
              :getCellValue="getCellValue"
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
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :column="col"
                  :index="rowIndex"
                  :value="getCellValue(row, col)"
                >
                  {{ getCellValue(row, col) }}
                </slot>
              </td>
            </slot>
          </tr>
          <tr v-if="props.data.length === 0">
            <td
              :colspan="tableColumns.length"
              class="p-8 text-center text-charcoal-500 italic font-sans"
            >
              <slot name="empty">
                {{ empty }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
