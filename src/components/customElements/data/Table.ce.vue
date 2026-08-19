<script setup lang="ts">
import { ref, type Component, type PropType } from "vue";
import Table from "../../data/AdvancedTable.vue";

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
  cell?: (row: Record<string, any>) => string | string[];
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  inputType?: "input" | "textarea" | "select" | "switch";
  selectOptions?: { value: string; label: string }[] | ((row: Record<string, any>) => { value: string; label: string }[]);
  validator?: (value: string, row: Record<string, any>) => boolean;
  singleClick?: boolean;
  editorAlign?: "start" | "center" | "end"; // Alineación del editor en la celda (para celdas que no ocupan todo el ancho, ej. switch)
  switch?: {
    size?: "sm" | "md";
    color?: string;
  };
  badges?: (row: Record<string, any>) => BadgeConfig[];
  buttons?: (row: Record<string, any>) => ButtonConfig[];
  disabled?: boolean | ((row: Record<string, any>) => boolean); // Columna deshabilitada (opcional por fila)
  cellDisabled?: (row: Record<string, any>) => boolean; // Celda deshabilitada (intersección fila × columna)
}

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
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
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
  },
  searchEnabled: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: "Buscar..." },
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  searchValue: { type: String, required: false, default: "" },
  filters: { type: Object as () => Record<string, any>, required: false, default: () => ({}) },
  loading: { type: Boolean, required: false, default: false },
  actions: { type: Array, required: false, default: () => [] },
  rowDisabled: { type: [Boolean, Function] as PropType<boolean | ((row: Record<string, any>) => boolean)>, required: false, default: false },

});

const tableRef = ref<InstanceType<typeof Table> | null>(null);

defineExpose({
  updateRow: (rowIndex: number, newData: Record<string, any>) => tableRef.value?.updateRow(rowIndex, newData),
  getData: () => tableRef.value?.getData(),
  getRow: (rowIndex: number) => tableRef.value?.getRow(rowIndex),
  removeRow: (rowIndex: number) => tableRef.value?.removeRow(rowIndex),
  addRow: (newRow: Record<string, any>) => tableRef.value?.addRow(newRow),
  pushData: (newData: Record<string, any>[]) => tableRef.value?.pushData(newData),
});
</script>

<template>
  <Table
    ref="tableRef"
    :columns="props.columns"
    :data="props.data"
    :empty="props.empty"
    :pagination="props.pagination"
    :items-per-page="props.itemsPerPage"
    :show-page-size="props.showPageSize"
    :page-size-options="props.pageSizeOptions"
    :color="props.color"
    :variant="props.variant"
    :search-enabled="props.searchEnabled"
    :search-placeholder="props.searchPlaceholder"
    :search-fields="props.searchFields"
    :search-value="props.searchValue"
    :filters="props.filters"
    :loading="props.loading"
    :actions="props.actions"
    :row-disabled="props.rowDisabled"

    @update:current-page="$emit('update:currentPage', $event)"
    @update:items-per-page="$emit('update:itemsPerPage', $event)"
    @update:search="$emit('update:search', $event)"
    @edit-start="$emit('edit-start', $event)"
    @edit-save="$emit('edit-save', $event)"
    @edit-cancel="$emit('edit-cancel', $event)"
  >
    <!-- Header slots -->
    <template #header="{ column }">
      <slot name="header" :column="column" :color="props.color" :variant="props.variant">
        <slot :name="`header-${column.key}`" :column="column" :color="props.color" :variant="props.variant">
          {{ column.label || column.key }}
        </slot>
      </slot>
    </template>

    <!-- Empty slot -->
    <template #empty>
      <slot name="empty">{{ props.empty || "No hay datos que mostrar" }}</slot>
    </template>
  </Table>
</template>

<style scoped>
</style>
