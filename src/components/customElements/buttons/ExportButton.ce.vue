<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import * as XLSX from "xlsx";
import ExportButton from "../../buttons/ExportButton.vue";
import type {
  SheetBeforeDownloadPayload,
  SheetColumn,
  SheetFormat,
  SheetOptions,
  SheetPayload,
} from "@/utils/sheet";

const props = defineProps({
  /** Filas a exportar (valores crudos). Se asigna como propiedad JS. */
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
  /** Celdas (filas × columnas) desde las que la exportación se considera `heavy`. Default: 10 000. */
  heavyThreshold: { type: Number, required: false },
  /** Texto visible. Default según formato; con `""` queda sólo el ícono. */
  label: { type: String, required: false },
  /** Color semántico del botón. Default: `success`. */
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, required: false, default: "success" },
  /** Variante visual del botón. Default: `solid`. */
  variant: { type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>, required: false, default: "solid" },
  /** Tamaño del botón: `sm`, `md`, `lg`. */
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, required: false, default: "md" },
  /** Deshabilita el botón (no dispara ni descarga). */
  disabled: { type: Boolean, required: false, default: false },
  /** Si es `true`, el click sólo emite `trigger`; la descarga la decide el consumidor. */
  manual: { type: Boolean, required: false, default: false },
});

const exportRef = ref<InstanceType<typeof ExportButton> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const root = el?.getRootNode();
  const host = (root instanceof ShadowRoot ? root.host : null) || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

/** Reemplaza las filas y, opcionalmente, las columnas. */
function setData(rows: Record<string, any>[], columns?: SheetColumn[]) {
  exportRef.value?.setData(rows, columns);
}
/** Fusiona opciones de exportación. */
function setOptions(options: SheetOptions) {
  exportRef.value?.setOptions(options);
}
/** Genera el archivo y dispara la descarga; devuelve el payload o `null` si se canceló. */
function download(): SheetPayload | null {
  return exportRef.value?.download() ?? null;
}
/** Resumen actual de la exportación, sin descargar. */
function getPayload(): SheetPayload | null {
  return exportRef.value?.getPayload() ?? null;
}

defineExpose({ setData, setOptions, download, getPayload });
</script>

<template>
  <ExportButton
    ref="exportRef"
    :data="props.data"
    :columns="props.columns"
    :filename="props.filename"
    :format="props.format"
    :sheet-name="props.sheetName"
    :delimiter="props.delimiter"
    :config="props.config"
    :heavy-threshold="props.heavyThreshold"
    :label="props.label"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :manual="props.manual"
    @trigger="ceEmit('trigger', $event as SheetPayload)"
    @before-download="ceEmit('before-download', $event as SheetBeforeDownloadPayload)"
    @download="ceEmit('download', $event as SheetPayload)"
    @heavy="ceEmit('heavy', $event as SheetPayload)"
    @error="ceEmit('error', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
