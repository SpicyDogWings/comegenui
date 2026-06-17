<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dropdown from "../Dropdown.vue";
import Button from "../Button.vue";

interface SelectOption {
  value: string;
  label: string;
}

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  variant: { type: String, required: false, default: "ghost" },
  disabled: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
  menuBg: { type: String, required: false, default: "#ffffff" },
});

const emit = defineEmits(["update:modelValue", "select"]);
const selectedValue = ref(props.modelValue);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === selectedValue.value);
  return opt ? opt.label : props.placeholder || "Seleccionar...";
});

watch(() => props.modelValue, (val) => {
  selectedValue.value = val;
}, { immediate: true });

function onSelect(option: SelectOption) {
  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("select", option);
  dropdownRef.value?.close();
}

function get() { return selectedValue.value; }
function set(value: string) { selectedValue.value = value; }
function reset() { selectedValue.value = ""; }
function focus() { }

defineExpose({
  get, set, reset, focus,
  get isOpen() { return dropdownRef.value?.isOpen || false },
  get selectedItem() {
    return props.options.find(o => o.value === selectedValue.value) || null;
  },
});
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
    style="width:100%"
  >
    <template #toggle="{ toggle, isOpen }">
      <Button
        :color="color"
        :variant="variant"
        :disabled="disabled"
        :hight-contrast="hightContrast"
        style="width:100%;justify-content:space-between"
        class="box-border"
        @click="toggle"
      >
        <span>{{ selectedLabel }}</span>
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
          :class="{ 'rotate-180': isOpen }"
          class="transition-transform duration-200 shrink-0"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </Button>
    </template>
    <template #default>
      <div v-if="options.length > 0" class="max-h-[240px] overflow-y-auto">
        <Button
          v-for="(opt, i) in options"
          :key="i"
          :color="opt.value === selectedValue ? color : '#888'"
          :variant="opt.value === selectedValue ? 'soft' : 'ghost'"
          style="width:100%;justify-content:flex-start"
          @click="onSelect(opt)"
        >
          {{ opt.label }}
        </Button>
      </div>
      <div v-else class="p-3 font-sans text-sm opacity-60 text-center">
        Sin opciones
      </div>
    </template>
  </Dropdown>
</template>

<style>
@unocss-placeholder;
</style>
