<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, type PropType } from "vue";
import FileInput from "./FileInput.vue";
import Button from "../buttons/Button.vue";
import Collapse from "../overlay/Collapse.vue";
import {
  parseFile,
  validateRows,
  downloadTemplate,
  type CellColumn,
  type CellError,
} from "../../utils/cellsImporter";

const props = defineProps({
  columns: {
    type: Array as PropType<CellColumn[]>,
    required: true,
    default: () => [],
  },
  formats: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [".xlsx", ".csv"],
  },
  delimiter: {
    type: String,
    required: false,
    default: ",",
  },
  hasHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
  strict: {
    type: Boolean,
    required: false,
    default: false,
  },
  sheet: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 0,
  },
  template: {
    type: Object as PropType<{ enabled?: boolean; type?: "xlsx" | "csv"; filename?: string }>,
    required: false,
    default: () => ({ enabled: false, type: "csv", filename: "template" }),
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "outlined",
  },
  placeholder: {
    type: String,
    required: false,
    default: "Seleccionar archivo",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxSize: {
    type: Number,
    required: false,
  },
});

const emit = defineEmits<{
  parse: [payload: { rows: Record<string, unknown>[]; headers: string[]; fileName: string }]
  error: [errors: CellError[]]
  change: [file: File | null]
}>();

const file = ref<File | null>(null);
const rows = ref<Record<string, unknown>[]>([]);
const headers = ref<string[]>([]);
const errors = ref<CellError[]>([]);
const warnings = ref<string[]>([]);
const status = ref<'idle' | 'parsing' | 'ready' | 'error'>('idle');

const fileInputRef = useTemplateRef<InstanceType<typeof FileInput>>("fileInput");

const accept = computed(() => props.formats.join(","));

const summary = computed(() => ({
  ok: rows.value.length - errorRowCount.value,
  withErrors: errorRowCount.value,
  total: rows.value.length,
}));

const errorRowCount = computed(() => new Set(errors.value.map((e) => e.row)).size);

function clearResult() {
  rows.value = [];
  headers.value = [];
  errors.value = [];
  warnings.value = [];
  status.value = 'idle';
}

async function handleFileChange() {
  const current = file.value;
  if (!current) {
    clearResult();
    emit('change', null);
    return;
  }

  status.value = 'parsing';
  try {
    const { rows: parsedRows, headers: parsedHeaders, warnings: parsedWarnings } = await parseFile(
      current,
      props.columns,
      { hasHeader: props.hasHeader, strict: props.strict, delimiter: props.delimiter, sheet: props.sheet },
    );
    rows.value = parsedRows;
    headers.value = parsedHeaders;
    warnings.value = parsedWarnings;
    errors.value = validateRows(parsedRows, props.columns);
    status.value = 'ready';
    emit('parse', { rows: parsedRows, headers: parsedHeaders, fileName: current.name });
    emit('error', errors.value);
  } catch (e) {
    status.value = 'error';
    errors.value = [];
    rows.value = [];
    const message = e instanceof Error ? e.message : 'No se pudo leer el archivo';
    warnings.value = [message];
  }
  emit('change', current);
}

watch(file, handleFileChange);

function onFileInputUpdate(v: File | null) {
  file.value = v;
}

function removeFile() {
  fileInputRef.value?.reset();
  file.value = null;
  clearResult();
  emit('change', null);
}

const getRows = () => rows.value;
const getHeaders = () => headers.value;
const getErrors = () => errors.value;
const getFile = () => file.value;
const validate = () => {
  errors.value = validateRows(rows.value, props.columns);
  emit('error', errors.value);
  return errors.value;
};
const downloadTemplateFile = () => {
  if (props.columns.length === 0) return;
  downloadTemplate(props.columns, props.template);
};
const reset = () => removeFile();
const set = (f: File | null) => { fileInputRef.value?.set(f); file.value = f; };
const trigger = () => fileInputRef.value?.trigger();
const focus = () => fileInputRef.value?.focus();

defineExpose({
  getRows,
  getHeaders,
  getErrors,
  getFile,
  validate,
  downloadTemplate: downloadTemplateFile,
  reset,
  set,
  trigger,
  focus,
});

const statusText = computed(() => {
  switch (status.value) {
    case 'parsing': return 'Leyendo archivo…'
    case 'error': return 'No se pudo leer el archivo'
    case 'ready': return 'Archivo leído'
    default: return ''
  }
});
</script>

<template>
  <div class="cu-cells-importer" :style="{ '--ci-accent': `var(--cu-color-${props.color})` }">
    <div class="cu-cells-importer-input">
      <FileInput
        ref="fileInput"
        :modelValue="file"
        :color="props.color"
        :variant="props.variant"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readOnly="props.readOnly"
        :accept="accept"
        :maxSize="props.maxSize"
        @update:modelValue="onFileInputUpdate"
      />
    </div>

    <div class="cu-cells-importer-toolbar">
      <Button
        v-if="props.template.enabled && props.columns.length > 0"
        :color="props.color"
        variant="soft"
        size="sm"
        @click="downloadTemplateFile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
        Descargar plantilla
      </Button>

      <span v-if="statusText" class="cu-cells-importer-status" :class="`cu-cells-importer-status--${status}`">{{ statusText }}</span>
    </div>

    <div v-if="rows.length > 0" class="cu-cells-importer-summary">
      <span class="cu-cells-importer-summary-ok">{{ summary.ok }} filas OK</span>
      <template v-if="summary.withErrors > 0">
        <span class="cu-cells-importer-summary-bad">· {{ summary.withErrors }} con errores</span>
      </template>
      <Button
        v-if="file"
        :color="props.color"
        variant="ghost"
        size="sm"
        @click="removeFile"
      >
        Quitar archivo
      </Button>
    </div>

    <div v-if="warnings.length > 0" class="cu-cells-importer-feedback">
      <Collapse :label="`Advertencias (${warnings.length})`" color="warning">
        <p v-for="(w, i) in warnings" :key="`w${i}`" class="cu-cells-importer-warning">{{ w }}</p>
      </Collapse>
    </div>

    <div v-if="errors.length > 0" class="cu-cells-importer-feedback">
      <Collapse :label="`Errores de validación (${errors.length})`" color="danger" :default-open="true">
        <ul class="cu-cells-importer-errors-list">
          <li v-for="(e, i) in errors" :key="i" class="cu-cells-importer-error">
            <strong>Fila {{ e.row + 1 }} · {{ e.columnLabel }}:</strong>
            {{ e.message }}
          </li>
        </ul>
      </Collapse>
    </div>
  </div>
</template>

<style>
.cu-cells-importer {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral-text);
}

.cu-cells-importer-toolbar {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-cells-importer-status {
  font-size: var(--cu-font-size-xs);
  opacity: 0.6;
}

.cu-cells-importer-status--parsing { color: var(--ci-accent); }
.cu-cells-importer-status--error { color: var(--cu-color-danger); }

.cu-cells-importer-summary {
  display: flex;
  align-items: center;
  gap: var(--cu-space-2xs);
  font-size: var(--cu-font-size-sm);
}

.cu-cells-importer-summary-ok { color: var(--cu-color-success); }
.cu-cells-importer-summary-bad { color: var(--cu-color-danger); }

.cu-cells-importer-warning {
  margin: 0;
  padding: var(--cu-space-2xs) var(--cu-space-sm);
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-warning);
  background-color: var(--cu-color-warning-soft);
  border-radius: var(--cu-radius);
}

.cu-cells-importer-errors-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
}

.cu-cells-importer-error {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-danger);
}
</style>