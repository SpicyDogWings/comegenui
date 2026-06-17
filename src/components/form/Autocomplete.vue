<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from "../Dropdown.vue";
import Input from "./Input.vue";
import Button from "../Button.vue";

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  disabled: { type: Boolean, required: false, default: false },
  readOnly: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  variant: { type: String, required: false, default: "outlined" },
  type: { type: String, required: false, default: "text" },
  minChars: { type: Number, required: false, default: 0 },
  items: { type: Array as () => AutocompleteItem[], required: false, default: () => [] },
  menuBg: { type: String, required: false, default: "#ffffff" },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
});

const emit = defineEmits(["select"]);

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const searchText = ref("");
const selectedItem = ref<AutocompleteItem | null>(null);

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

function onInput() {
  if (!inputRef.value) return;
  searchText.value = inputRef.value.get();

  if (searchText.value.length < props.minChars || filteredItems.value.length === 0) {
    dropdownRef.value?.close();
    return;
  }

  dropdownRef.value?.open();
}

function onItemClick(item: AutocompleteItem) {
  searchText.value = item.value || item.label;
  if (inputRef.value) inputRef.value.set(searchText.value);
  selectedItem.value = item;
  emit("select", item);
  dropdownRef.value?.close();
}

function get() { return searchText.value; }
function set(val: string) {
  searchText.value = val;
  if (inputRef.value) inputRef.value.set(val);
}
function focus() { inputRef.value?.focus(); }

defineExpose({
  get,
  set,
  focus,
  get isOpen() { return dropdownRef.value?.isOpen || false },
  get selectedItem() { return selectedItem.value },
});
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    :color="color"
    :disabled="disabled"
    :hight-contrast="hightContrast"
    :position="position"
    :align="align"
    :placement="placement"
    :offset="4"
    :menu-bg="menuBg"
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
        :hight-contrast="hightContrast"
        style="width:100%"
        @update:model-value="onInput"
        @input="onInput"
        @focus="onFocus"
      />
    </template>
    <template #default>
      <div v-if="filteredItems.length > 0" class="max-h-[240px] overflow-y-auto">
        <Button
          v-for="(item, i) in filteredItems"
          :key="i"
          color="#888"
          variant="ghost"
          style="width:100%;justify-content:flex-start"
          @click="onItemClick(item)"
        >
          <span v-if="item.icon" v-html="item.icon" class="transform translate-y-0.5" style="opacity:.6"></span>
          <span v-if="item.label">{{ item.label }}</span>
        </Button>
      </div>
    </template>
  </Dropdown>
</template>

<style>
@unocss-placeholder;
</style>
