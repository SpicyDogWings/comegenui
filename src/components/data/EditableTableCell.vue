<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";

import Input from "../form/Input.vue";
import Textarea from "../form/Textarea.vue";
import Select from "../form/Select.vue";

interface SelectOption {
  value: string;
  label: string;
}

interface Column {
  key: string;
  label?: string;
  editable?: boolean | RegExp;
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: "input" | "textarea" | "select";
  selectOptions?: SelectOption[] | ((row: Record<string, any>) => SelectOption[]);
  singleClick?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
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
    default: "#2c2c2c",
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
  }
});

const emit = defineEmits([
  "edit-start",
  "edit-save",
  "edit-cancel",
]);

// State
const isEditing = ref(false);
const saving = ref(false);
const editValue = ref<string>("");
const inputRef = ref<InstanceType<typeof Input | typeof Textarea | typeof Select> | null>(null);

// Initialize edit value
watch(
  () => props.value,
  (newVal) => {
    editValue.value = newVal != null ? String(newVal) : "";
  },
  { immediate: true }
);

// Methods
const startEditing = async () => {
  if (saving.value) return;
  isEditing.value = true;
  emit("edit-start", { row: props.row, column: props.column, index: props.index });
  await nextTick();
  // NEW: Autofocus
  inputRef.value?.focus?.();
};

const saveEdit = () => {
  let isValid = true;
  const value = editValue.value;

  // Validate against regex if editable is a RegExp
  if (props.column.editable instanceof RegExp && !props.column.editable.test(value)) {
    isValid = false;
  }

  // Validate using custom validator if provided
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
  isEditing.value = false;
  nextTick(() => { saving.value = false; });
};

const cancelEdit = () => {
  emit("edit-cancel", { row: props.row, column: props.column, index: props.index });
  isEditing.value = false;
};

// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEdit();
  }
};

// Computed
const displayValue = computed(() => {
  if (props.column.inputType === 'select') {
    const options = resolvedOptions.value;
    const option = options.find(o => o.value === props.value);
    return option ? option.label : String(props.value);
  }
  return props.value != null ? String(props.value) : "";
});

const validationClass = computed(() => {
  if (!props.validation.success && props.validation.error) {
    return "text-red-500";
  }
  if (props.validation.success) {
    return "text-green-500";
  }
  return "";
});

const resolvedOptions = computed(() => {
  if (typeof props.column.selectOptions === "function") {
    return props.column.selectOptions(props.row);
  }
  return props.column.selectOptions || [];
});
</script>

<template>
  <div
    class="cursor-pointer"
    @click="column.singleClick !== false && startEditing()"
    @dblclick="column.singleClick === false && startEditing()"
  >
    <!-- Edit Mode -->
    <template v-if="isEditing">
      <Textarea
        v-if="column.inputType === 'textarea'"
        ref="inputRef"
        v-model="editValue"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        noResize
        class="w-full"
        :color="props.validation.error ? '#ff0000' : color"
        :variant="variant"
      />
      <Select
        v-else-if="column.inputType === 'select'"
        ref="inputRef"
        :model-value="editValue"
        :options="resolvedOptions"
        @update:model-value="(val) => { editValue = val; saveEdit(); }"
        class="w-full"
        :color="props.validation.error ? '#ff0000' : color"
        :variant="variant"
      />
      <Input
        v-else
        ref="inputRef"
        v-model="editValue"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        class="w-full"
        :color="props.validation.error ? '#ff0000' : color"
        :variant="variant"
      />
    </template>
    
    <!-- View Mode -->
    <template v-else>
      <span class="flex items-center gap-2">
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
          class="lucide lucide-pencil"
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

<style>
@unocss-placeholder;
</style>
