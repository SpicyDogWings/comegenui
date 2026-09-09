<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import CellsImporter from "../../form/CellsImporter.vue";
import { initTokens } from "@/plugins/cu-tokens/css";
import type { CellColumn, CellError } from "@/utils/cellsImporter";

initTokens();

const props = defineProps({
  columns: { type: Array as PropType<CellColumn[]>, required: true, default: () => [] },
  formats: { type: Array as PropType<string[]>, default: () => [".xlsx", ".csv"] },
  delimiter: { type: String, default: "," },
  hasHeader: { type: Boolean, default: true },
  strict: { type: Boolean, default: false },
  sheet: { type: [String, Number] as PropType<string | number>, default: 0 },
  template: { type: Object as PropType<{ enabled?: boolean; type?: "xlsx" | "csv"; filename?: string }>, default: () => ({ enabled: false, type: "csv", filename: "template" }) },
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, default: "neutral" },
  variant: { type: String, default: "outlined" },
  placeholder: { type: String, default: "Seleccionar archivo" },
  disabled: Boolean,
  readOnly: Boolean,
  maxSize: Number,
});

const importerRef = ref<InstanceType<typeof CellsImporter> | null>(null);

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function getRows() { return importerRef.value?.getRows() ?? []; }
function getHeaders() { return importerRef.value?.getHeaders() ?? []; }
function getErrors() { return importerRef.value?.getErrors() ?? []; }
function getFile() { return importerRef.value?.getFile() ?? null; }
function validate() { return importerRef.value?.validate() ?? []; }
function downloadTemplate() { importerRef.value?.downloadTemplate(); }
function reset() { importerRef.value?.reset(); }
function set(val: File | null) { importerRef.value?.set(val); }
function trigger() { importerRef.value?.trigger(); }
function focus() { importerRef.value?.focus(); }

defineExpose({ getRows, getHeaders, getErrors, getFile, validate, downloadTemplate, reset, set, trigger, focus });
</script>

<template>
  <CellsImporter
    ref="importerRef"
    :columns="props.columns"
    :formats="props.formats"
    :delimiter="props.delimiter"
    :hasHeader="props.hasHeader"
    :strict="props.strict"
    :sheet="props.sheet"
    :template="props.template"
    :color="props.color"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readOnly="props.readOnly"
    :maxSize="props.maxSize"
    @parse="ceEmit('parse', $event)"
    @error="ceEmit('error', $event as CellError[])"
    @change="ceEmit('change', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>