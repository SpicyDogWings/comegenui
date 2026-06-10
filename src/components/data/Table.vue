<script setup lang="ts">
import { computed } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { transparentize } from "color2k";
import Button from "../Button.vue";

interface Column {
  key: string;
  label?: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean | "string" | "number" | "boolean";
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
  sortBy: {
    type: String,
    required: false,
    default: "",
  },
  sortDir: {
    type: String as () => "" | "asc" | "desc",
    required: false,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "sort-change", key: string): void;
}>();

const bgClasses = computed(() => getBgClasses(props.color, props.variant, false));
const fgClasses = computed(() => getFgClasses(props.color, props.variant, false));

// For solid variant, use a softer hover effect for rows
const rowHoverBg = computed(() => {
  if (props.variant === 'solid') {
    // Use a semi-transparent version of the color for softer hover
    return transparentize(props.color, 0.9);
  }
  return bgClasses.value.hover;
});

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
              class="text-left p-3 font-sans font-medium sticky top-0 z-20 select-none"
              :width="col.width"
              :style="{
                'background-color': props.variant === 'solid' ? bgClasses.main : (props.variant === 'soft' ? 'transparent' : 'var(--table-bg)'),
                'color': props.variant === 'solid' ? 'white' : 'var(--table-fg)',
                'border-color': 'var(--table-bd)',
              }"
            >
              <slot :name="`header-${col.key}`" :column="col" :color="props.color" :variant="props.variant">
                <span class="inline-flex items-center gap-1">
                  <Button
                    v-if="col.sortable"
                    :color="fgClasses.main"
                    variant="ghost"
                    class="!p-0 !w-6 !h-6 !min-w-0"
                    @click.stop="emit('sort-change', col.key)"
                  >
                    <template v-if="props.sortBy === col.key && props.sortDir === 'asc'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6L12 2L16 6"/><path d="M12 2V22"/></svg>
                    </template>
                    <template v-else-if="props.sortBy === col.key && props.sortDir === 'desc'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18L12 22L16 18"/><path d="M12 2V22"/></svg>
                    </template>
                    <template v-else>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/></svg>
                    </template>
                  </Button>
                  {{ col.label || col.key }}
                </span>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in props.data"
            :key="rowIndex"
            class="border-b-1 border-b-solid border-charcoal-100 hover:bg-[var(--row-hover-bg)] transition-colors"
            :style="{ '--row-hover-bg': rowHoverBg }"
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
