<script setup lang="ts">
import { ref, computed, watch, defineModel } from "vue";
import Dropdown from "../Dropdown.vue";
import Input from "./Input.vue";
import Button from "../buttons/Button.vue";

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  readOnly: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  type: { type: String, required: false, default: "text" },
  minChars: { type: Number, required: false, default: 0 },
  items: { type: Array as () => AutocompleteItem[], required: false, default: () => [] },
  position: {
    type: String,
    required: false,
    default: "bottom",
    validator: (value: string) => ["bottom", "top"].includes(value),
  },
  align: {
    type: String,
    required: false,
    default: "start",
    validator: (value: string) => ["start", "center", "end"].includes(value),
  },
  placement: { type: String, required: false, default: "" },
  fixed: { type: Boolean, required: false, default: false },
});

const emit = defineEmits(["select", "blur"]);
const searchValue = defineModel<string>({ default: "" });

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const searchText = ref(searchValue.value);
const selectedItem = ref<AutocompleteItem | null>(null);

watch(() => searchValue.value, (val) => {
  searchText.value = val;
}, { immediate: true });

const filteredItems = computed(() => {
  const q = searchText.value.toLowerCase().trim();
  if (!q) return props.items;
  return props.items.filter((item) =>
    item.label.toLowerCase().includes(q) ||
    (item.value && item.value.toLowerCase().includes(q)),
  );
});

function onFocus() {
  if (props.disabled || props.minChars > 0) return;
  if (filteredItems.value.length > 0) {
    dropdownRef.value?.open();
  }
}

function onInput(val: string) {
  searchText.value = val;

  if (searchText.value.length < props.minChars || filteredItems.value.length === 0) {
    dropdownRef.value?.close();
    return;
  }

  dropdownRef.value?.open();
}

function onItemClick(item: AutocompleteItem) {
  const val = item.value || item.label;
  searchText.value = val;
  searchValue.value = val;
  selectedItem.value = item;
  emit("select", item);
  dropdownRef.value?.close();
}

function onFocusOut(e: FocusEvent) {
  if (!rootRef.value?.contains(e.relatedTarget as Node)) {
    emit("blur");
  }
}

function get() { return searchValue.value; }
function set(val: string) {
  searchValue.value = val;
  searchText.value = val;
  if (inputRef.value) inputRef.value.set(val);
}
function reset() { searchValue.value = ""; searchText.value = ""; }
function focus() { inputRef.value?.focus(); }

defineExpose({
  get, set, reset, focus,
  get isOpen() { return dropdownRef.value?.isOpen || false },
  get selectedItem() { return selectedItem.value },
});
</script>

<template>
  <div ref="rootRef" tabindex="-1" @focusout="onFocusOut">
    <Dropdown
    ref="dropdownRef"
    :color="color"
    :disabled="disabled"
    :position="position"
    :align="align"
    :placement="placement"
    :fixed="fixed"
    :offset="4"
    style="width:100%"
  >
    <template #toggle>
      <Input
        ref="inputRef"
        :model-value="searchText"
        :placeholder="placeholder"
        :disabled="disabled"
        :read-only="readOnly"
        :color="color"
        :variant="variant"
        :type="type"
        style="width:100%"
        @update:model-value="onInput"
        @focus="onFocus"
      />
    </template>
    <template #default>
      <div v-if="filteredItems.length > 0" class="cu-autocomplete-options">
        <Button
          v-for="(item, i) in filteredItems"
          :key="i"
          color="neutral"
          variant="ghost"
          :disabled="item.disabled"
          class="cu-autocomplete-option"
          :class="{ 'cu-autocomplete-option--disabled': item.disabled }"
          @click="item.disabled ? undefined : onItemClick(item)"
        >
          <span v-if="item.icon" v-html="item.icon" class="cu-autocomplete-icon"></span>
          <span v-if="item.label">{{ item.label }}</span>
        </Button>
      </div>
    </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-autocomplete {
  width: 100%;
  outline: none;
}

.cu-autocomplete-options {
  max-height: 240px;
  overflow-y: auto;
}

.cu-autocomplete-option {
  width: 100%;
  justify-content: flex-start;
}

.cu-autocomplete-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cu-autocomplete-icon {
  transform: translateY(2px);
  opacity: 0.6;
}
</style>
