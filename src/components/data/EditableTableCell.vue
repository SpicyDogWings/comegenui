<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";

import Input from "../form/Input.vue";
import Textarea from "../form/Textarea.vue";
import Select from "../form/Select.vue";
import Autocomplete from "../form/Autocomplete.vue";

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
  inputType?: "input" | "textarea" | "select" | "autocomplete";
  singleClick?: boolean;
  width?: string;
  align?: "left" | "center" | "right";

  color?: string;
  variant?: string;

  select?: {
    options: SelectOption[];
    color?: string;
    variant?: string;
    placement?: string;
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

  selectOptions?: SelectOption[] | ((row: Record<string, any>) => SelectOption[]);
  autocompleteItems?: AutocompleteItem[] | ((row: Record<string, any>) => AutocompleteItem[]);
}

const props = defineProps({
  value: {
    type: [String, Number] as () => string | number,
    required: true,
  },
  row: {
    type: Object as () => Record<string, any>,
    required: true,
  },
  column: {
    type: Object as () => Column,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
  },
  validation: {
    type: Object as () => { success: boolean; error: string | null },
    required: true,
    default: () => ({ success: false, error: null })
  },
  inlineEdit: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const emit = defineEmits([
  "edit-start",
  "edit-save",
  "edit-cancel",
]);

// Dos modos:
// - Por defecto (lápiz): se muestra el valor con un lápiz; click para editar.
// - Estado inline (prop reactiva `inlineEdit`): el editor (input/select/
//   textarea) se renderiza directamente. No es una propiedad estática de la
//   columna: el padre (o la tabla vía `inlineEditing`) decide cuándo activarlo.
const inlineEdit = computed(() => props.inlineEdit === true);
const isEditing = ref(false);
const showEditor = computed(() => inlineEdit.value || isEditing.value);
const saving = ref(false);
const editValue = ref<string>("");
const inputRef = ref<InstanceType<typeof Input | typeof Textarea | typeof Select | typeof Autocomplete> | null>(null);

watch(
  () => props.value,
  (newVal) => {
    editValue.value = newVal != null ? String(newVal) : "";
  },
  { immediate: true }
);

const startEditing = async () => {
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
  return props.value != null ? String(props.value) : "";
});

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
      : undefined,
    props.row
  );
  if (v) return v;
  if (col.variant) return col.variant;
  return props.variant;
});

const canEdit = computed(() => {
  if (typeof props.column.editable === "function") return props.column.editable(props.row);
  return true;
});
</script>

<template>
  <div
    class="cu-editable-cell"
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
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
      <Select
        v-else-if="column.inputType === 'select'"
        ref="inputRef"
        :model-value="editValue"
        :options="resolvedOptions"
        :placement="column.select?.placement"
        :placeholder-wrap="column.select?.placeholderWrap"
        fixed
        @update:model-value="(val) => { editValue = val; saveEdit(); }"
        @select="(opt) => { editValue = opt.value; saveEdit(); }"
        @blur="saveEdit"
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
        fixed
        @blur="saveEdit"
        @select="(item) => { if (item.value) editValue = item.value; saveEdit(); }"
        class="cu-editable-cell-input"
        :color="elementColor"
        :variant="elementVariant"
      />
      <Input
        v-else
        ref="inputRef"
        v-model="editValue"
        :type="column.input?.type || 'text'"
        :start-value="column.input?.startValue"
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

.cu-editable-cell-input {
  width: 100%;
}

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
