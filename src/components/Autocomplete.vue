<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "./Dropdown.vue";
import Input from "./form/Input.vue";
import Button from "./Button.vue";

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  disabled: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  minChars: { type: Number, required: false, default: 3 },
  items: { type: Array as () => AutocompleteItem[], required: false, default: () => [] },
  menuBg: { type: String, required: false, default: "#ffffff" },
});

const emit = defineEmits(["select"]);

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const searchText = ref("");

function onInput() {
  if (!inputRef.value) return;
  searchText.value = inputRef.value.get();

  if (searchText.value.length < props.minChars) {
    dropdownRef.value?.close();
    return;
  }

  dropdownRef.value?.open();
}

function onItemClick(item: AutocompleteItem) {
  searchText.value = item.value || item.label;
  if (inputRef.value) inputRef.value.set(searchText.value);
  emit("select", item);
  dropdownRef.value?.close();
}

function get() { return searchText.value; }
function set(val: string) {
  searchText.value = val;
  if (inputRef.value) inputRef.value.set(val);
}
function focus() { inputRef.value?.focus(); }

defineExpose({ get, set, focus, get isOpen() { return dropdownRef.value?.isOpen || false } });
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    :color="color"
    :disabled="disabled"
    :hight-contrast="hightContrast"
    placement="bottom-start"
    :offset="4"
    :menu-bg="menuBg"
  >
    <template #toggle>
      <Input
        ref="inputRef"
        :model-value="searchText"
        :placeholder="placeholder"
        :disabled="disabled"
        color="#888"
        variant="outlined"
        style="width:100%"
        @update:model-value="onInput"
        @input="onInput"
      />
    </template>
    <template #default>
      <div v-if="items && items.length > 0" class="max-h-[240px] overflow-y-auto">
        <Button
          v-for="(item, i) in items"
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
