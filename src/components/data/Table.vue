<script setup lang="ts">
import { computed, type PropType } from "vue";

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
  maxHeight: {
    type: String,
    required: false,
    default: "",
  },
  rowDisabled: {
    type: [Boolean, Function] as PropType<boolean | ((row: Record<string, any>) => boolean)>,
    required: false,
    default: false,
  },
});

const tableStyles = computed(() => ({
  '--table-fg': `var(--cu-color-${props.color}-text)`,
  '--table-bg-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--table-bd': `var(--cu-color-${props.color}-subtle-border)`,
  '--table-bg-solid': `var(--cu-color-${props.color})`,
  '--loader-color': `var(--cu-color-${props.color})`,
  ...(props.maxHeight ? { maxHeight: props.maxHeight } : {}),
}));

const thStyle = computed(() => {
  const base: Record<string, string> = {
    'width': '',
    'background-color': `var(--cu-color-${props.color}-soft)`,
    'color': `var(--cu-color-${props.color}-text)`,
    'border-bottom': `1px solid rgba(0, 0, 0, 0.08)`,
  };

  if (props.maxHeight) {
    base['backdrop-filter'] = 'blur(8px)';
  }

  if (props.variant === 'solid') {
    base['background-color'] = `var(--cu-color-${props.color})`;
    base['color'] = 'var(--cu-color-surface)';
    base['border-bottom'] = 'none';
    base['backdrop-filter'] = 'none';
  } else if (props.variant === 'ghost' || props.variant === 'outlined') {
    base['background-color'] = 'transparent';
    if (props.variant === 'outlined') {
      base['border-bottom'] = `2px solid var(--cu-color-${props.color}-subtle-border)`;
    }
  }

  return base;
});

const thStyleFn = (col: Column) => {
  return { ...thStyle.value, width: col.width || '' };
};

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

const isRowDisabled = (row: Record<string, any>): boolean => {
  const rd = props.rowDisabled;
  return typeof rd === "function" ? rd(row) : !!rd;
};
</script>

<template>
  <div class="cu-table" :class="{ 'cu-table--outlined': variant === 'outlined' }" :style="tableStyles">
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
              :style="thStyleFn(col)"
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
            :class="{ 'cu-table-row--disabled': isRowDisabled(row) }"
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
  overflow: hidden;
}

.cu-table-scroll {
  overflow: auto;
  border-radius: var(--cu-radius-md);
  flex: 1;
}

.cu-table-element {
  width: 100%;
  border-collapse: collapse;
}

.cu-table--outlined .cu-table-scroll {
  border: var(--cu-border-medium) solid var(--table-bd);
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
}

.cu-table .cu-table-th-content {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  color: inherit;
}

.cu-table-row {
  border-bottom: var(--cu-border-thin) solid rgba(0, 0, 0, 0.08);
  transition: background-color 150ms ease;
}

.cu-table--outlined .cu-table-row {
  border-bottom-color: var(--table-bd);
}

.cu-table-row:hover {
  background-color: var(--table-bg-hover);
}

.cu-table-row--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.cu-table-row--disabled:hover {
  background-color: transparent;
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
