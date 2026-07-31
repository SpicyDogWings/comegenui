<script setup lang="ts">
import Pagination from "../Pagination.vue";

const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
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
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:currentPage", "update:itemsPerPage"]);
</script>

<template>
  <Pagination
    :color="props.color"
    :variant="props.variant"
    :currentPage="props.currentPage"
    :totalPages="props.totalPages"
    :totalItems="props.totalItems"
    :itemsPerPage="props.itemsPerPage"
    :showPageSize="props.showPageSize"
    :pageSizeOptions="props.pageSizeOptions"
    :showFirstAndLast="props.showFirstAndLast"
    :hight-contrast="props.hightContrast"
    @update:currentPage="emit('update:currentPage', $event)"
    @update:itemsPerPage="emit('update:itemsPerPage', $event)"
  />
</template>

<style scoped>
</style>
