<script setup lang="ts">
import { ref, computed, watch, defineModel, type PropType } from 'vue';
import { isAlign, isColor, isFieldVariant, isPosition } from '@/utils/validators'
import Dropdown from "../overlay/Dropdown.vue";
import Input from "./Input.vue";
import Button from "../buttons/Button.vue";
import { useSearch } from "@/composables/useSearch";

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  disabled: { type: Boolean, required: false, default: false },
  readOnly: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isFieldVariant,
  },
  type: { type: String, required: false, default: "text" },
  minChars: { type: Number, required: false, default: 0 },
  items: { type: Array as () => AutocompleteItem[], required: false, default: () => [] },
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: "bottom",
    validator: isPosition,
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "start",
    validator: isAlign,
  },
  fixed: { type: Boolean, required: false, default: false },
});

const emit = defineEmits(["select", "blur"]);
/** Valor del texto de búsqueda (v-model). */
const searchValue = defineModel<string>({ default: "" });

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const searchText = ref(searchValue.value);
const selectedItem = ref<AutocompleteItem | null>(null);

watch(() => searchValue.value, (val) => {
  searchText.value = val;
}, { immediate: true });

const searchItems = computed(() => props.items);
const { filteredData: filteredItems } = useSearch(searchItems, {
  searchQuery: searchText,
  searchFields: ["label", "value"],
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
  const val = item.label || item.value;
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

/** Devuelve el texto actual. */
function get() { return searchValue.value; }
/** Setea el texto actual en el input. */
function set(val: string) {
  searchValue.value = val;
  searchText.value = val;
  if (inputRef.value) inputRef.value.set(val);
}
/** Limpia el texto de búsqueda. */
function reset() { searchValue.value = ""; searchText.value = ""; }
/** Enfoca el input. */
function focus() { inputRef.value?.focus(); }

defineExpose({
  get, set, reset, focus,
  /** Indica si el panel está abierto. */
  isOpen: () => dropdownRef.value?.isOpen || false,
  /** Devuelve el item seleccionado o null. */
  selectedItem: () => selectedItem.value,
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
