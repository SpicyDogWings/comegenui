<script setup lang="ts">
import { ref, getCurrentInstance, type Component, type PropType } from "vue";
import AdvancedTable from "../../data/AdvancedTable.vue";

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const root = el?.getRootNode() as ShadowRoot | Document | null;
  const host = root && 'host' in root ? (root as ShadowRoot).host : el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

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

interface FooterCell {
  value: string;
  colspan?: number;
  align?: "left" | "center" | "right";
}

interface FooterRow {
  cells: FooterCell[];
}

interface Column {
  key: string;
  label?: string;
  cell?: (row: Record<string, any>) => string | string[];
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";
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
  /** Definición de columnas (ver [Interfaz de columna](#interfaz-de-columna)). Se asigna como propiedad JS */
  columns: {
    type: Array as () => Column[],
    required: false,
    default: () => [],
  },
  /** Filas de la tabla. Se asigna como propiedad JS */
  data: {
    type: Array as () => Record<string, any>[],
    required: false,
    default: () => [],
  },
  /** Texto a mostrar cuando no hay datos. Si se omite, usa `"No hay datos que mostrar"` */
  empty: {
    type: String,
    required: false,
    default: "",
  },
  /** Habilita paginación interna */
  pagination: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Tamaño de página (atributo HTML: `items-per-page`) */
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  /** Muestra selector de items por página (atributo HTML: `show-page-size`) */
  showPageSize: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS */
  pageSizeOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [5, 10, 20, 50],
  },
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
  },
  /** Habilita barra de búsqueda (atributo HTML: `search-enabled`) */
  searchEnabled: { type: Boolean, required: false, default: false },
  /** Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) */
  searchPlaceholder: { type: String, required: false, default: "Buscar..." },
  /** Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas */
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  /** Valor controlado del buscador (atributo HTML: `search-value`) */
  searchValue: { type: String, required: false, default: "" },
  /** Filtros por columna. Se asigna como propiedad JS */
  filters: { type: Object as () => Record<string, any>, required: false, default: () => ({}) },
  /** Muestra una barra de carga animada en el tope */
  loading: { type: Boolean, required: false, default: false },
  /** Acciones de fila (botón "..." al final de cada fila). Se asigna como propiedad JS */
  actions: { type: Array, required: false, default: () => [] },
  /** Deshabilita filas (ver [Deshabilitar filas, columnas y celdas](#deshabilitar-filas-columnas-y-celdas)). Se asigna como propiedad JS */
  rowDisabled: { type: [Boolean, Function] as PropType<boolean | ((row: Record<string, any>) => boolean)>, required: false, default: false },
  /** Filas de footer (ver [Footer (API programática)](#footer-api-programática)). Se asigna como propiedad JS */
  footer: { type: Array as () => FooterRow[], required: false, default: () => [] },
  /** Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` */
  tableMaxHeight: { type: String, required: false, default: "" },
  /** Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) */
  inlineEditing: { type: Boolean, required: false, default: false },
  /** Filas más compactas */
  compact: { type: Boolean, required: false, default: false },
});

const tableRef = ref<InstanceType<typeof AdvancedTable> | null>(null);

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
  <AdvancedTable
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
    :footer="props.footer"
    :table-max-height="props.tableMaxHeight"
    :inline-editing="props.inlineEditing"
    :compact="props.compact"

    @update:current-page="ceEmit('update:currentPage', $event)"
    @update:items-per-page="ceEmit('update:itemsPerPage', $event)"
    @update:search="ceEmit('update:search', $event)"
    @row-click="ceEmit('row-click', $event)"
    @row-dblclick="ceEmit('row-dblclick', $event)"
    @cell-click="ceEmit('cell-click', $event)"
    @edit-start="ceEmit('edit-start', $event)"
    @edit-save="ceEmit('edit-save', $event)"
    @edit-cancel="ceEmit('edit-cancel', $event)"
    @edit-error="ceEmit('edit-error', $event)"
  >
    <!-- Todos los slots del host se reenvían tal cual: `search` (scoped: `query`
         y `update`), `template`, `cell-{key}`, `header-{key}`, `empty` y `footer`.
         El `AdvancedTable` interno los pasa al `Table` que renderiza las filas. -->
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </AdvancedTable>
</template>

<style scoped>
</style>
