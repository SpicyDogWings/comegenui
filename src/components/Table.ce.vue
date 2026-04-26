<script setup lang="ts">
import { computed } from "vue";
import Badge from "./Badge.ce.vue";
import Button from "./Button.ce.vue";

interface BadgeConfig {
  value: string;
  color?: string;
  variant?: string;
}

interface ButtonConfig {
  label: string;
  color?: string;
  variant?: string;
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
});

const getCellValue = (
  row: Record<string, any>,
  col: Column,
): string | string[] => {
  if (typeof col.cell === "function") {
    return col.cell(row);
  }
  return row[col.key];
};

const getCellBadges = (
  row: Record<string, any>,
  col: Column,
): BadgeConfig[] => {
  if (typeof col.badges === "function") {
    return col.badges(row).filter((b) => b?.value != null);
  }
  return [];
};

const hasBadges = (col: Column): boolean => {
  return typeof col.badges === "function";
};

const getCellButtons = (
  row: Record<string, any>,
  col: Column,
): ButtonConfig[] => {
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
  <div class="overflow-x-auto w-full">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left p-3 font-sans font-medium text-primary-50 sticky top-0 bg-primary-600 z-10"
          >
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label || col.key }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="border-b-solid border-b-1 border-charcoal-200 last:border-b-none"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="p-3 font-sans text-charcoal-800"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :column="col"
              :index="rowIndex"
            >
              <template v-if="hasBadges(col)">
                <div class="flex justify-content items-center gap-1">
                  <Badge
                    v-for="(badge, idx) in getCellBadges(row, col)"
                    :key="idx"
                    :color="badge.color"
                    :variant="badge.variant"
                  >
                    {{ badge.value }}
                  </Badge>
                </div>
              </template>
              <template v-else-if="hasButtons(col)">
                <div class="flex justify-content items-center gap-1">
                  <Button
                    v-for="(btn, idx) in getCellButtons(row, col)"
                    :key="idx"
                    :color="btn.color"
                    :variant="btn.variant"
                    @click="btn.onClick?.()"
                  >
                    {{ btn.label }}
                  </Button>
                </div>
              </template>
              <template v-else>
                {{ getCellValue(row, col) }}
              </template>
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td
            :colspan="columns.length"
            class="p-6 text-center text-charcoal-500 italic"
          >
            <slot name="empty">{{ empty || "No hay datos que mostrar" }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
