<script setup lang="ts">
import { ref, computed, nextTick, watch, type PropType } from "vue";

import Input from "../form/Input.vue";
import Textarea from "../form/Textarea.vue";
import Select from "../form/Select.vue";
import Autocomplete from "../form/Autocomplete.vue";
import DatePicker from "../form/DatePicker.vue";
import Switch from "../form/Switch.vue";

interface AutocompleteItem {
  label: string;
  value?: string;
  icon?: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

interface Column {
  key: string;
  label?: string;
  editable?: boolean | RegExp | ((row: Record<string, any>) => boolean);
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: "input" | "textarea" | "select" | "autocomplete" | "date" | "switch";
  singleClick?: boolean;
  inlineEdit?: boolean; // Estado por columna: renderiza el editor directo
  width?: string;
  align?: "left" | "center" | "right";
  editorAlign?: "start" | "center" | "end"; // Alineación del editor en la celda (para celdas que no ocupan todo el ancho, ej. switch)

  color?: string;
  variant?: string;

  date?: {
    format?: string;
    min?: string | number | Date;
    max?: string | number | Date;
    yearNavigation?: boolean;
    disabledWeekdays?: number[] | string;
    disabledDates?: (string | Date)[] | string;
    color?: string;
    variant?: string;
    position?: string;
    align?: string;
    fixed?: boolean;
  };

  select?: {
    options: SelectOption[];
    color?: string;
    variant?: string;
    position?: string;
    align?: string;
    placeholderWrap?: boolean;
  };
  autocomplete?: {
    items: AutocompleteItem[];
    minChars?: number;
    color?: string;
    variant?: string;
  };
  textarea?: {
    rows?: number;
    noResize?: boolean;
    color?: string;
    variant?: string;
  };
  input?: {
    type?: string;
    startValue?: string;
    color?: string;
    variant?: string;
  };
  switch?: {
    size?: "sm" | "md";
    color?: string;
  };

  selectOptions?: SelectOption[] | ((row: Record<string, any>) => SelectOption[]);
  autocompleteItems?: AutocompleteItem[] | ((row: Record<string, any>) => AutocompleteItem[]);
}

const props = defineProps({
  /** Valor actual de la celda. */
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    required: true,
  },
  /** Fila completa a la que pertenece la celda. */
  row: {
    type: Object as () => Record<string, any>,
    required: true,
  },
  /** Configuración de la columna: editor, validación y alineación. */
  column: {
    type: Object as () => Column,
    required: true,
  },
  /** Índice de la fila en los datos. */
  index: {
    type: Number,
    required: true,
  },
  /** Color semántico del editor. */
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  /** Variante visual del editor. */
  variant: {
    type: String,
    required: false,
    default: "ghost",
  },
  /** Estado de validación: success y mensaje de error. */
  validation: {
    type: Object as () => { success: boolean; error: string | null },
    required: true,
    default: () => ({ success: false, error: null })
  },
  /** Muestra el editor directo en toda la tabla, sin lápiz. */
  inlineEdit: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Deshabilita la edición de la celda. */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const emit = defineEmits([
  /** Se inicia la edición de la celda. */
  "edit-start",
  /** Se guarda el nuevo valor de la celda. */
  "edit-save",
  /** Se cancela la edición de la celda. */
  "edit-cancel",
  /** El valor no pasa la validación de la columna. */
  "edit-error",
]);

// Dos modos:
// - Por defecto (lápiz): se muestra el valor con un lápiz; click para editar.
// - Estado inline: el editor (input/select/textarea) se renderiza directo.
//   Se activa POR COLUMNA (`column.inlineEdit: true`, forma principal) o
//   globalmente desde la tabla (`inlineEditing` → prop `inlineEdit` de la
//   celda, por compatibilidad). El estado de la columna tiene prioridad.
const inlineEdit = computed(() => props.inlineEdit === true);
const columnInlineEdit = computed(() => props.column.inlineEdit === true);
const isEditing = ref(false);
const showEditor = computed(() =>
  props.column.inputType === "switch"
    ? true
    : props.disabled
      ? false
      : (columnInlineEdit.value || inlineEdit.value || isEditing.value)
);
const saving = ref(false);
const editValue = ref<string>("");
const inputRef = ref<{ focus?: () => void } | null>(null);

watch(
  () => props.value,
  (newVal) => {
    editValue.value = newVal != null ? String(newVal) : "";
  },
  { immediate: true }
);

const startEditing = async () => {
  if (props.disabled) return;
  if (showEditor.value || saving.value || !canEdit.value) return;
  isEditing.value = true;
  emit("edit-start", { row: props.row, column: props.column, index: props.index });
  await nextTick();
  inputRef.value?.focus?.();
};

const saveEdit = () => {
  if (saving.value) return;
  let isValid = true;
  const value = editValue.value;

  if (props.column.editable instanceof RegExp && !props.column.editable.test(value)) {
    isValid = false;
  }

  if (isValid && props.column.validator && !props.column.validator(value, props.row)) {
    isValid = false;
  }

  if (!isValid) {
    emit("edit-error", {
      row: props.row,
      column: props.column,
      value,
      index: props.index,
    });
    return;
  }

  saving.value = true;
  emit("edit-save", { 
    row: props.row, 
    column: props.column, 
    value: editValue.value,
    index: props.index
  });
  if (!inlineEdit.value) {
    isEditing.value = false;
  }
  nextTick(() => { saving.value = false; });
};

const cancelEdit = () => {
  emit("edit-cancel", { row: props.row, column: props.column, index: props.index });
  if (inlineEdit.value) {
    // Estado inline: revertir el valor y seguir mostrando el editor
    editValue.value = props.value != null ? String(props.value) : "";
  } else {
    isEditing.value = false;
  }
};

// Fecha elegida en el <cu-date-picker> → se guarda como "YYYY-MM-DD"
const onDateChange = (d: Date | null) => {
  if (!d) return;
  editValue.value = toDateValue(d);
  saveEdit();
};

// Switch: valor booleano, guarda directo (sin edición intermedia)
const switchValue = computed(() => props.value === true || props.value === "true");

const onSwitchChange = (val: boolean) => {
  if (saving.value) return;
  saving.value = true;
  emit("edit-save", {
    row: props.row,
    column: props.column,
    value: val,
    index: props.index,
  });
  nextTick(() => { saving.value = false; });
};

// El panel del picker se cerró (click afuera / Escape) sin elegir: en modo
// lápiz salimos del editor; en inline el editor queda (puede reabrir).
const onDateClose = () => {
  if (!inlineEdit.value && isEditing.value) {
    isEditing.value = false;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && props.column.inputType !== "textarea") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEdit();
  }
};

const displayValue = computed(() => {
  if (props.column.inputType === 'select') {
    const options = resolvedOptions.value;
    const option = options.find(o => o.value === props.value);
    return option ? option.label : String(props.value);
  }
  if (props.column.inputType === 'autocomplete') {
    const items = resolvedAutocompleteItems.value;
    const item = items.find(i => (i.value || i.label) === props.value);
    return item ? item.label : String(props.value);
  }
  if (props.column.inputType === 'date') {
    return formatDateValue(String(props.value), props.column.date?.format || 'dd/MM/yyyy');
  }
  return props.value != null ? String(props.value) : "";
});

// ── Fechas (inputType 'date') ──
// El valor se guarda como string "YYYY-MM-DD"; en modo vista se formatea con los
// mismos tokens del <cu-date-picker> (yyyy yy MMMM MMM MM dd).
function toDateValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateValue(value: string | number, format: string): string {
  const s = String(value ?? "").trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  const date = new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, Number(m[3] ?? 1));
  if (Number.isNaN(date.getTime())) return s;
  const pad = (n: number) => String(n).padStart(2, "0");
  const monthName = (long: boolean) =>
    new Intl.DateTimeFormat("es", { month: long ? "long" : "short" }).format(date);
  const tokens: Record<string, () => string> = {
    yyyy: () => String(date.getFullYear()),
    yy: () => String(date.getFullYear()).slice(-2),
    MMMM: () => monthName(true),
    MMM: () => monthName(false),
    MM: () => pad(date.getMonth() + 1),
    dd: () => pad(date.getDate()),
  };
  return format.replace(/yyyy|MMMM|MMM|yy|MM|dd/g, (t) => tokens[t]?.() ?? t);
}

const validationClass = computed(() => {
  if (!props.validation.success && props.validation.error) {
    return "cu-editable-cell--error";
  }
  if (props.validation.success) {
    return "cu-editable-cell--success";
  }
  return "";
});

const resolvedOptions = computed(() => {
  const col = props.column;
  const opts = col.select?.options;
  if (typeof opts === "function") return opts(props.row);
  if (opts) return opts;
  if (typeof col.selectOptions === "function") return col.selectOptions(props.row);
  return col.selectOptions || [];
});

const resolvedAutocompleteItems = computed(() => {
  const col = props.column;
  const items = col.autocomplete?.items;
  if (typeof items === "function") return items(props.row);
  if (items) return items;
  if (typeof col.autocompleteItems === "function") return col.autocompleteItems(props.row);
  return col.autocompleteItems || [];
});

function resolveProp<T>(val: T | ((row: Record<string, any>) => T) | undefined, row: Record<string, any>): T | undefined {
  return typeof val === "function" ? (val as any)(row) : val;
}

const elementColor = computed(() => {
  const col = props.column;
  if (props.validation.error) return "danger";
  const c = resolveProp(
    col.inputType === "select" ? col.select?.color
      : col.inputType === "autocomplete" ? col.autocomplete?.color
      : col.inputType === "textarea" ? col.textarea?.color
      : col.inputType === "input" ? col.input?.color
      : col.inputType === "date" ? col.date?.color
      : col.inputType === "switch" ? col.switch?.color
      : undefined,
    props.row
  );
  if (c) return c;
  if (col.color) return col.color;
  return props.color;
});

const elementVariant = computed(() => {
  const col = props.column;
  const v = resolveProp(
    col.inputType === "select" ? col.select?.variant
      : col.inputType === "autocomplete" ? col.autocomplete?.variant
      : col.inputType === "textarea" ? col.textarea?.variant
      : col.inputType === "input" ? col.input?.variant
      : col.inputType === "date" ? col.date?.variant
      : undefined,
    props.row
  );
  if (v) return v;
  if (col.variant) return col.variant;
  return props.variant;
});

// Alineación del editor dentro de la celda. Prioridad:
// editorAlign explícito > (switch por defecto centrado) > align de la columna > start
const editorAlignStyle = computed(() => {
  const col = props.column;
  const align =
    col.editorAlign ??
    (col.inputType === "switch" ? "center" : null) ??
    col.align ??
    "start";
  const textAlign: "start" | "center" | "end" =
    align === "end" || align === "right" ? "end" : align === "center" ? "center" : "start";
  return { textAlign };
});

const canEdit = computed(() => {
  if (props.disabled) return false;
  if (typeof props.column.editable === "function") return props.column.editable(props.row);
  return true;
});
</script>

<template>
  <div
    class="cu-editable-cell"
    :class="{ 'cu-editable-cell--disabled': props.disabled }"
    :style="editorAlignStyle"
    @click="column.singleClick !== false && canEdit && startEditing()"
    @dblclick="column.singleClick === false && canEdit && startEditing()"
  >
    <template v-if="showEditor">
      <Textarea
        v-if="column.inputType === 'textarea'"
        ref="inputRef"
        v-model="editValue"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        :no-resize="column.textarea?.noResize !== false"
        :rows="column.textarea?.rows ?? 3"
        :disabled="props.disabled"
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
      <Select
        v-else-if="column.inputType === 'select'"
        ref="inputRef"
        :model-value="editValue"
        :options="resolvedOptions"
        :position="column.select?.position"
        :align="column.select?.align"
        :placeholder-wrap="column.select?.placeholderWrap"
        fixed
        @update:model-value="(val) => { editValue = val; saveEdit(); }"
        @select="(opt) => { editValue = opt.value; saveEdit(); }"
        @blur="saveEdit"
        :disabled="props.disabled"
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
      <Autocomplete
        v-else-if="column.inputType === 'autocomplete'"
        ref="inputRef"
        v-model="editValue"
        :items="resolvedAutocompleteItems"
        :min-chars="column.autocomplete?.minChars ?? 0"
        :disabled="props.disabled"
        fixed
        @blur="saveEdit"
        @select="(item) => { if (item.value) editValue = item.value; saveEdit(); }"
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
      <DatePicker
        v-else-if="column.inputType === 'date'"
        ref="inputRef"
        :model-value="editValue"
        :format="column.date?.format"
        :min="column.date?.min"
        :max="column.date?.max"
        :year-navigation="column.date?.yearNavigation"
        :disabled-weekdays="column.date?.disabledWeekdays"
        :disabled-dates="column.date?.disabledDates"
        :color="(elementColor as any)"
        :variant="(elementVariant as any)"
        :position="column.date?.position"
        :align="column.date?.align"
        :fixed="column.date?.fixed ?? true"
        :disabled="props.disabled"
        @change="onDateChange"
        @close="onDateClose"
        class="cu-editable-cell-input"
      />
      <Switch
        v-else-if="column.inputType === 'switch'"
        :model-value="switchValue"
        :color="elementColor"
        :size="column.switch?.size || 'md'"
        :disabled="props.disabled"
        @change="onSwitchChange"
        class="cu-editable-cell-switch"
      />
      <Input
        v-else
        ref="inputRef"
        v-model="editValue"
        :type="column.input?.type || 'text'"
        :start-value="column.input?.startValue"
        :disabled="props.disabled"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
    </template>

    <template v-else>
      <span
        class="cu-editable-cell-view"
        :class="{ 'cu-editable-cell-view--disabled': !canEdit }"
        title="Click to edit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="cu-editable-cell-icon"
          :class="validationClass"
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          <path d="m15 5 4 4" />
        </svg>
        {{ displayValue }}
      </span>
    </template>
  </div>
</template>

<style scoped>
.cu-editable-cell {
  cursor: pointer;
}

.cu-editable-cell--disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.cu-editable-cell-input {
  width: 100%;
}

/* Sin width: el switch conserva su tamaño natural (cu-switch--md/--sm) y NO se
   estira a la celda. El centrado/alineación lo hace text-align del contenedor
   (editorAlignStyle). fit-content NO se usa: colapsa el track a 0px porque el
   thumb está position:absolute (sin contenido in-flow) y el switch queda en blanco. */

.cu-editable-cell-view {
  display: flex;
  align-items: flex-start;
  gap: var(--cu-space-sm);
  white-space: pre-line;
}

.cu-editable-cell-view--disabled {
  opacity: 0.4;
}

.cu-editable-cell-icon {
  flex-shrink: 0;
}

.cu-editable-cell--success {
  color: var(--cu-color-success);
}

.cu-editable-cell--error {
  color: var(--cu-color-danger);
}
</style>
