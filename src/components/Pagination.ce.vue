<script setup lang="ts">
import { computed } from "vue";
import Pagination from "./Pagination.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme } from "../config/theme";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
    validator: isValidTheme,
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  currentPage: {
    type: Number,
    required: false,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: false,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: false,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  showPageSize: {
    type: Boolean,
    required: false,
    default: false,
  },
  pageSizeOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [5, 10, 20, 50],
  },
  showFirstAndLast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:currentPage", "update:itemsPerPage"]);

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});
</script>

<template>
  <Pagination
    :color="hexColor"
    :variant="props.variant"
    :currentPage="props.currentPage"
    :totalPages="props.totalPages"
    :totalItems="props.totalItems"
    :itemsPerPage="props.itemsPerPage"
    :showPageSize="props.showPageSize"
    :pageSizeOptions="props.pageSizeOptions"
    :showFirstAndLast="props.showFirstAndLast"
    @update:currentPage="emit('update:currentPage', $event)"
    @update:itemsPerPage="emit('update:itemsPerPage', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
