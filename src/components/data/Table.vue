<script setup lang="ts">
import { computed } from "vue";

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
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const tableStyles = computed(() => {
  const base: Record<string, string> = {
    '--table-fg': `var(--cu-color-${props.color}-text)`,
    '--table-bg-hover': `var(--cu-color-${props.color}-ghost-hover)`,
    '--table-bd': `var(--cu-color-${props.color}-subtle-border)`,
    '--table-bg-solid': `var(--cu-color-${props.color})`,
  };

  if (props.variant === 'ghost' || props.variant === 'outlined') {
    base['--table-bg'] = 'transparent';
  } else {
    base['--table-bg'] = `var(--cu-color-${props.color}-soft)`;
  }

  return base;
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
  <div class="cu-table" :style="tableStyles">
    <div v-if="loading" class="cu-table-loader">
      <div class="cu-table-loader-bar" />
    </div>
    <div class="cu-table-scroll">
      <table class="cu-table-element">
        <thead>
          <tr>
            <th
              v-for="col in tableColumns"
              :key="col.key"
              class="cu-table-th"
              :class="{
                'cu-table-th--solid': variant === 'solid',
                'cu-table-th--ghost': variant === 'ghost',
                'cu-table-th--outlined': variant === 'outlined',
              }"
              :style="{ width: col.width }"
            >
              <slot :name="`header-${col.key}`" :column="col" :color="props.color" :variant="props.variant">
                <span class="cu-table-th-content">
                  {{ col.label || col.key }}
                </span>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody :class="{ 'cu-table-loading': props.loading }">
          <tr
            v-for="(row, rowIndex) in props.data"
            :key="rowIndex"
            class="cu-table-row"
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
                class="cu-table-td"
                :class="{
                  'cu-table-td--left': col.align !== 'center' && col.align !== 'right',
                  'cu-table-td--center': col.align === 'center',
                  'cu-table-td--right': col.align === 'right',
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
            <td :colspan="tableColumns.length" class="cu-table-empty">
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

<style scoped>
.cu-table {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.cu-table-scroll {
  overflow: auto;
  border-radius: var(--cu-radius-md);
}

.cu-table-element {
  width: 100%;
  border-collapse: collapse;
}

.cu-table-th {
  text-align: left;
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  font-weight: var(--cu-font-weight-medium);
  position: sticky;
  top: 0;
  z-index: 20;
  user-select: none;
  background-color: var(--table-bg);
  color: var(--table-fg);
  border-bottom: 1px solid var(--table-bd);
}

.cu-table-th--solid {
  background-color: var(--table-bg-solid);
  color: var(--cu-color-surface);
}

.cu-table-th--ghost {
  background-color: transparent;
}

.cu-table-th--ghost:hover {
  background-color: var(--table-bg-hover);
}

.cu-table-th--outlined {
  background-color: transparent;
  border-bottom: 2px solid var(--table-bd);
}

.cu-table-th-content {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
}

.cu-table-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background-color 150ms ease;
}

.cu-table-row:hover {
  background-color: var(--table-bg-hover);
}

.cu-table-row:last-child {
  border-bottom: none;
}

.cu-table-loading {
  opacity: 0.4;
  pointer-events: none;
}

.cu-table-td {
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral-text);
}

.cu-table-td--left { text-align: left; }
.cu-table-td--center { text-align: center; }
.cu-table-td--right { text-align: right; }

.cu-table-empty {
  padding: var(--cu-space-xl);
  text-align: center;
  color: var(--cu-color-neutral-text);
  opacity: 0.5;
  font-style: italic;
  font-family: var(--cu-font-sans);
}

.cu-table-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  overflow: hidden;
  height: 3px;
}

.cu-table-loader-bar {
  position: absolute;
  top: 0;
  height: 100%;
  width: 60%;
  background: linear-gradient(90deg, transparent 0%, var(--loader-color) 50%, transparent 100%);
  animation: cu-loader 3s ease-in-out infinite;
}

@keyframes cu-loader {
  0% { left: -100%; }
  50% { left: 0%; }
  100% { left: 100%; }
}
</style>
