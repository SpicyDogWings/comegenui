<script setup lang="ts">
import { computed, ref } from "vue";
import Autocomplete from "./Autocomplete.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  theme: { type: String, required: false, default: "", validator: isValidTheme },
  color: { type: String, required: false, default: "neutral" },
  disabled: { type: Boolean, required: false, default: false },
  hightContrast: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  minChars: { type: Number, required: false, default: 0 },
  items: { type: Array, required: false, default: () => [] },
});

const emit = defineEmits(["select"]);

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const surfaceBg = computed(() =>
  effectiveTheme.value === "dark" ? "#1e1e2e" : "#ffffff",
);

const autocompleteRef = ref<InstanceType<typeof Autocomplete> | null>(null);

defineExpose({
  get: () => autocompleteRef.value?.get(),
  set: (val: string) => autocompleteRef.value?.set(val),
  focus: () => autocompleteRef.value?.focus(),
  get isOpen() { return autocompleteRef.value?.isOpen || false },
});
</script>

<template>
  <Autocomplete
    ref="autocompleteRef"
    :color="hexColor"
    :disabled="props.disabled"
    :hight-contrast="props.hightContrast"
    :placeholder="props.placeholder"
    :min-chars="props.minChars"
    :items="props.items"
    :menu-bg="surfaceBg"
    @select="emit('select', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
