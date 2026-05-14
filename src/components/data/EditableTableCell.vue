<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import Input from "../form/Input.vue";
import Textarea from "../form/Textarea.vue";

interface Column {
  key: string;
  label?: string;
  editable?: boolean | RegExp;
  validator?: (value: string, row: Record<string, any>) => boolean;
  inputType?: "input" | "textarea";
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
});

const emit = defineEmits([
  "edit-start",
  "edit-save",
  "edit-cancel",
]);

// State
const isEditing = ref(false);
const editValue = ref<string>("");
const validationState = ref<{ success: boolean; error: string | null }>({
  success: false,
  error: null,
});

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
  isEditing.value = true;
  validationState.value = { success: false, error: null };
  emit("edit-start", { row: props.row, column: props.column });
  await nextTick();
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
    validationState.value = { success: false, error: "Invalid value" };
    return;
  }

  validationState.value = { success: true, error: null };
  emit("edit-save", { 
    row: props.row, 
    column: props.column, 
    value: editValue.value 
  });
  isEditing.value = false;
};

const cancelEdit = () => {
  validationState.value = { success: false, error: null };
  emit("edit-cancel", { row: props.row, column: props.column });
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
  return props.value != null ? String(props.value) : "";
});

const validationClass = computed(() => {
  if (!validationState.value.success && validationState.value.error) {
    return "text-red-500";
  }
  if (validationState.value.success) {
    return "text-green-500";
  }
  return "";
});
</script>

<template>
  <div
    class="cursor-pointer"
    @click="column.singleClick ? startEditing() : undefined"
    @dblclick="!column.singleClick ? startEditing() : undefined"
  >
    <!-- Edit Mode -->
    <template v-if="isEditing">
      <Textarea
        v-if="column.inputType === 'textarea'"
        v-model="editValue"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        noResize
        class="w-full"
        :color="color"
        :variant="variant"
      />
      <Input
        v-else
        v-model="editValue"
        @blur="saveEdit"
        @keydown="handleKeyDown"
        class="w-full"
        :color="color"
        :variant="variant"
      />
    </template>
    
    <!-- View Mode -->
    <template v-else>
      <span
        class="flex items-center gap-2"
        :class="validationClass"
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
          class="lucide lucide-pencil"
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
