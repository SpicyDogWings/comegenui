<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import * as XLSX from "xlsx";
import { isColor, isSize, isVariantFull, type Color, type VariantFull } from "@/utils/validators";
import Button from "./Button.vue";
import LucideSheet from "../icons/LucideSheet.vue";
import {
  downloadSheet,
  getSheetPayload,
  type SheetBeforeDownloadPayload,
  type SheetColumn,
  type SheetFormat,
  type SheetOptions,
  type SheetPayload,
} from "@/utils/sheet";

const props = defineProps({
  /** Filas a exportar (valores crudos). */
  data: { type: Array as PropType<Record<string, any>[]>, required: false, default: () => [] },
  /** Columnas a exportar; `exportable: false` las deja fuera. Se asigna como propiedad JS. */
  columns: { type: Array as PropType<SheetColumn[]>, required: false, default: () => [] },
  /** Nombre del archivo sin extensión. Default: `export-YYYY-MM-DD`. */
  filename: { type: String, required: false },
  /** Formato de salida: `xlsx` (default) o `csv`. */
  format: { type: String as PropType<SheetFormat>, required: false, default: "xlsx" },
  /** Nombre de la hoja en XLSX. Default: `Datos`. */
  sheetName: { type: String, required: false },
  /** Separador de CSV. Default: `,`. */
  delimiter: { type: String, required: false },
  /** Opciones de escritura de SheetJS. Se asigna como propiedad JS. */
  config: { type: Object as PropType<XLSX.WritingOptions>, required: false },
  /** Celdas (filas × columnas) desde las que la exportación se considera `heavy`. Default: `10 000`. */
  heavyThreshold: { type: Number, required: false },
  /** Texto visible. Default según formato: «Descargar Excel» / «Descargar CSV». Con `""` queda sólo el ícono. */
  label: { type: String, required: false },
  /** Color semántico del botón. Default: `success`. */
  color: {
    type: String as PropType<Color>,
    required: false,
    default: "success",
    validator: isColor,
  },
  /** Variante visual del botón. Default: `solid`. */
  variant: {
    type: String as PropType<VariantFull>,
    required: false,
    default: "solid",
    validator: isVariantFull,
  },
  /** Tamaño del botón: `sm`, `md`, `lg`. */
  size: {
    type: String as PropType<"sm" | "md" | "lg">,
    required: false,
    default: "md",
    validator: isSize,
  },
  /** Deshabilita el botón (no dispara ni descarga). */
  disabled: { type: Boolean, required: false, default: false },
  /** Si es `true`, el click sólo emite `trigger`; la descarga la decide el consumidor. */
  manual: { type: Boolean, required: false, default: false },
});

const emit = defineEmits<{
  /** Click en modo `manual`; incluye el resumen de lo que se descargaría. */
  trigger: [payload: SheetPayload];
  /** Antes de generar el archivo; llamá `cancel()` de forma sincrónica para evitarlo. */
  "before-download": [payload: SheetBeforeDownloadPayload];
  /** Archivo generado y descarga disparada. */
  download: [payload: SheetPayload];
  /** La exportación superó `heavyThreshold` (10 000 celdas por defecto). */
  heavy: [payload: SheetPayload];
  /** No se pudo generar o descargar el archivo. */
  error: [error: unknown];
}>();

// `setData`/`setOptions` pisan las props sin mutarlas: el consumidor puede
// seguir usando el componente como control declarativo o programático.
const dataOverride = ref<Record<string, any>[] | null>(null);
const columnsOverride = ref<SheetColumn[] | null>(null);
const optionsOverride = ref<SheetOptions>({});

const rows = computed(() => dataOverride.value ?? props.data);
const columns = computed(() => columnsOverride.value ?? props.columns);
const options = computed<SheetOptions>(() => ({
  filename: props.filename,
  format: props.format,
  sheetName: props.sheetName,
  delimiter: props.delimiter,
  config: props.config,
  heavyThreshold: props.heavyThreshold,
  ...optionsOverride.value,
}));

const format = computed<SheetFormat>(() => options.value.format ?? "xlsx");
const defaultLabel = computed(() =>
  format.value === "csv" ? "Descargar CSV" : "Descargar Excel",
);
const labelText = computed(() => props.label === undefined ? defaultLabel.value : props.label);
// `label: ""` es intencional: sólo ícono, con el nombre accesible por defecto.
const iconOnly = computed(() => props.label === "");
const accessibleLabel = computed(() => (iconOnly.value ? defaultLabel.value : undefined));

/** Resumen actual: filas, columnas, celdas, formato y nombre del archivo. */
function getPayload(): SheetPayload {
  return getSheetPayload(rows.value, columns.value, options.value);
}

/** Genera el archivo y dispara la descarga. Devuelve el payload o `null` si se canceló. */
function download(): SheetPayload | null {
  try {
    const result = downloadSheet(rows.value, columns.value, options.value, (payload) => {
      let cancelled = false;
      emit("before-download", {
        ...payload,
        cancel: () => {
          cancelled = true;
        },
      });
      if (payload.heavy) emit("heavy", payload);
      return !cancelled;
    });
    if (result) emit("download", result);
    return result;
  } catch (error) {
    emit("error", error);
    return null;
  }
}

function handleClick() {
  if (props.disabled) return;
  if (props.manual) {
    emit("trigger", getPayload());
    return;
  }
  download();
}

/** Reemplaza las filas y, opcionalmente, las columnas. */
function setData(nextRows: Record<string, any>[], nextColumns?: SheetColumn[]) {
  dataOverride.value = nextRows;
  if (nextColumns) columnsOverride.value = nextColumns;
}

/** Fusiona opciones de exportación (`filename`, `format`, `sheetName`, `delimiter`, `config`, `heavyThreshold`). */
function setOptions(nextOptions: SheetOptions) {
  optionsOverride.value = { ...optionsOverride.value, ...nextOptions };
}

defineExpose({ setData, setOptions, download, getPayload });
</script>

<template>
  <Button
    class="cu-export-button"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :icon-only="iconOnly"
    :aria-label="accessibleLabel"
    @click="handleClick"
  >
    <LucideSheet aria-hidden="true" focusable="false" class="cu-export-button-icon" />
    <span v-if="!iconOnly" class="cu-export-button-text">{{ labelText }}</span>
  </Button>
</template>
