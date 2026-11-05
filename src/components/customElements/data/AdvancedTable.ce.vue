<script setup lang="ts">
import { ref, computed, getCurrentInstance, onBeforeUnmount, onMounted, useSlots, type Component, type PropType } from "vue";
import AdvancedTable from "../../data/AdvancedTable.vue";
import type { SheetOptions, SheetPayload } from "@/utils/sheet";

const instance = getCurrentInstance();

/**
 * En un custom element con shadow DOM, Vue **no** expone el light DOM como
 * `$slots`: para que los `<x slot="…">` del host se proyecten hay que renderizar
 * un outlet `<slot name="…">` real (Vue lo emite así cuando `instance.ce` está
 * seteado). Como los nombres son dinámicos (`header-{key}`, `cell-{key}`), los
 * descubrimos del host. Cuando el wrapper se monta como componente Vue (tests,
 * uso interno), no hay `instance.ce` y alcanza con `$slots`.
 */
type SlotHost = HTMLElement & { childNodes: NodeListOf<ChildNode> };
const vueSlots = useSlots();
const hostSlotNames = ref<string[]>([]);
let slotObserver: MutationObserver | null = null;

const getHostEl = () => (instance?.ce as unknown as SlotHost | undefined) ?? null;

function collectHostSlots() {
  const el = getHostEl();
  if (!el) return;
  const names = new Set<string>();
  el.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      names.add((node as Element).getAttribute("slot") || "default");
    }
  });
  hostSlotNames.value = [...names];
}

onMounted(() => {
  collectHostSlots();
  const el = getHostEl();
  if (el && typeof MutationObserver !== "undefined") {
    slotObserver = new MutationObserver(collectHostSlots);
    slotObserver.observe(el, { childList: true });
  }
});

onBeforeUnmount(() => slotObserver?.disconnect());

const forwardedSlots = computed(() => {
  const names = new Set<string>(Object.keys(vueSlots));
  for (const name of hostSlotNames.value) names.add(name);
  return [...names];
});

const isVueSlot = (name: string) => name in vueSlots;

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
  disabled?: boolean | ((row: Record<string, any>) => boolean);
  hidden?: (row: Record<string, any>) => boolean; // Oculta el botón/ítem en esa fila
  divider?: boolean; // Ítem divisor (solo en el dropdown de `actions`)
}

/** Configuración visual y de archivo del botón de exportación de la tabla. */
interface ExportButtonConfig extends SheetOptions {
  label?: string;
  color?: string;
  variant?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

/** Alcance de la exportación: todas las filas o sólo lo que se está viendo. */
type ExportScope = "all" | "visible";

/** Opciones de `getExportData`/`exportToExcel`: `scope` + las del core de archivo. */
interface ExportOptions extends SheetOptions {
  scope?: ExportScope;
}

/** Columna que participa de la exportación: la key y su label legible (si tiene). */
interface ExportColumn {
  key: string;
  label?: string;
}

/** Columnas exportables y valores crudos de las filas (sin formato de celda). */
interface ExportData {
  columns: ExportColumn[];
  rows: Record<string, any>[];
}

/** Resumen que viaja en el `detail` de `export-click`/`export-heavy`: no incluye los datos. */
interface ExportPayload extends SheetPayload {
  scope: ExportScope;
}

interface ExportBeforeDownloadPayload extends ExportPayload {
  cancel: () => void;
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
  exportable?: boolean; // Participa de `getExportData` (default: true); con `false` la columna no se exporta
}

const props = defineProps({
  /** Definición de columnas (ver «Interfaz de columna»). Se asigna como propiedad JS */
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
  /** Texto a mostrar cuando no hay datos */
  empty: {
    type: String,
    required: false,
    default: "No hay datos que mostrar",
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
  /** Muestra el botón de exportación a Excel. No descarga un archivo: emite `export-click` con el resumen de los datos (atributo HTML: `export-enabled`) */
  exportEnabled: { type: Boolean, required: false, default: false },
  /**
   * Configuración visual del botón de exportación. Defaults: `label` «Descargar Excel»,
   * `color` `success`, `variant` `solid`, `disabled` `false`. Con `label: ""` queda
   * sólo el ícono. `disabled` sólo apaga el botón: `exportToExcel()` sigue disponible.
   * Se asigna como propiedad JS
   */
  exportButton: {
    type: Object as () => ExportButtonConfig | null,
    required: false,
    default: () => ({}),
  },
  /** Filtros por columna. Se asigna como propiedad JS */
  filters: { type: Object as () => Record<string, any>, required: false, default: () => ({}) },
  /** Muestra una barra de carga animada en el tope */
  loading: { type: Boolean, required: false, default: false },
  /** Acciones de fila (botón "..." al final de cada fila). Array estático o función `(row) => acciones` para decidirlas por fila. Se asigna como propiedad JS */
  actions: {
    type: [Array, Function] as PropType<ButtonConfig[] | ((row: Record<string, any>) => ButtonConfig[])>,
    required: false,
    default: () => [],
  },
  /** Texto del header de la columna de acciones. Default vacío. Atributo HTML: `actions-label` */
  actionsLabel: { type: String, required: false, default: "" },
  /** Deshabilita filas (ver «Deshabilitar filas, columnas y celdas»). Se asigna como propiedad JS */
  rowDisabled: { type: [Boolean, Function] as PropType<boolean | ((row: Record<string, any>) => boolean)>, required: false, default: false },
  /** Filas de footer (ver «Footer (API programática)»). Se asigna como propiedad JS */
  footer: { type: Array as () => FooterRow[], required: false, default: () => [] },
  /** Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` */
  tableMaxHeight: { type: String, required: false, default: "" },
  /** Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) */
  inlineEditing: { type: Boolean, required: false, default: false },
  /** Filas más compactas */
  compact: { type: Boolean, required: false, default: false },
});

const tableRef = ref<InstanceType<typeof AdvancedTable> | null>(null);

// Eventos del host: `ceEmit` despacha CustomEvent con el payload en `e.detail`.
defineEmits(["before-download", "export-click", "export-heavy"]);

defineExpose({
  updateRow: (rowIndex: number, newData: Record<string, any>) => tableRef.value?.updateRow(rowIndex, newData),
  getData: (filterFn?: (row: Record<string, any>) => boolean) => tableRef.value?.getData(filterFn),
  getRow: (rowIndex: number) => tableRef.value?.getRow(rowIndex),
  removeRow: (rowIndex: number) => tableRef.value?.removeRow(rowIndex),
  addRow: (newRow: Record<string, any>) => tableRef.value?.addRow(newRow),
  pushData: (newData: Record<string, any>[]) => tableRef.value?.pushData(newData),
  /** Columnas exportables y **valores crudos** de las filas (sin `cell`, badges ni botones). `scope: "all"` (default) usa todas las filas de `data`; `"visible"` usa lo renderizado ahora (página y filtros/búsqueda actuales). */
  getExportData: (options?: ExportOptions) => tableRef.value?.getExportData(options),
  /** Exporta y descarga el archivo (xlsx por defecto, o csv). Emite `before-download` (cancelable con `e.detail.cancel()`), `export-click` y `export-heavy`; funciona aunque `exportEnabled` sea `false`. Devuelve el payload. */
  exportToExcel: (options?: ExportOptions) => tableRef.value?.exportToExcel(options),
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
    :export-enabled="props.exportEnabled"
    :export-button="props.exportButton"
    :filters="props.filters"
    :loading="props.loading"
    :actions="props.actions"
    :actions-label="props.actionsLabel"
    :row-disabled="props.rowDisabled"
    :footer="props.footer"
    :table-max-height="props.tableMaxHeight"
    :inline-editing="props.inlineEditing"
    :compact="props.compact"

    @before-download="ceEmit('before-download', $event)"
    @export-click="ceEmit('export-click', $event)"
    @export-heavy="ceEmit('export-heavy', $event)"
    @update:current-page="ceEmit('update:currentPage', $event)"
    @update:items-per-page="ceEmit('update:itemsPerPage', $event)"
    @update:search="ceEmit('update:search', $event)"
    @edit-start="ceEmit('edit-start', $event)"
    @edit-save="ceEmit('edit-save', $event)"
    @edit-cancel="ceEmit('edit-cancel', $event)"
    @edit-error="ceEmit('edit-error', $event)"
  >
    <!-- Slots del host: `search` (scoped: `query` y `update`), `template`,
         `cell-{key}`, `header-{key}`, `empty` y `footer`. Los nombres salen de
         `$slots` (uso como componente Vue) y/o del light DOM del host (custom
         element real). El `AdvancedTable` interno los pasa al `Table`. -->
    <template v-for="slotName in forwardedSlots" v-slot:[slotName]="slotProps">
      <slot :name="slotName" v-bind="isVueSlot(slotName) ? slotProps : undefined"></slot>
    </template>
  </AdvancedTable>
</template>

<style scoped>
</style>
