<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
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
});

const emit = defineEmits(["update:currentPage", "update:itemsPerPage"]);

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
  }
};

const handlePageSizeChange = (size: number) => {
  emit("update:itemsPerPage", size);
  emit("update:currentPage", 1);
};

const startItem = computed(() => {
  return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = props.totalPages;
  let current = props.currentPage;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");
    if (total > 1) pages.push(total);
  }

  return pages;
});
</script>

<template>
  <div
    v-if="totalPages > 1 || showPageSize"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 gap-3"
  >
    <div class="flex items-center gap-2 text-sm text-charcoal-600 font-sans">
      <span> Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }} </span>
    </div>

    <div class="flex items-center gap-2">
      <div v-if="showPageSize" class="flex items-center gap-2">
        <span class="text-sm text-charcoal-600 font-sans">Por página:</span>
        <select
          :value="itemsPerPage"
          @change="(e) => handlePageSizeChange(Number((e.target as HTMLSelectElement).value))"
          class="px-2 py-1 rounded border border-charcoal-200 text-sm font-sans bg-white text-charcoal-800 focus:outline-none focus:border-primary-500"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-sans"
        >
          Anterior
        </button>

        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span v-if="page === '...'" class="px-2 text-charcoal-500 text-sm font-sans">...</span>
          <button
            v-else
            @click="handlePageChange(Number(page))"
            :class="{
              'bg-primary-600 text-primary-50 border-primary-600': currentPage === page,
              'border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50': currentPage !== page,
            }"
            class="px-3 py-1 rounded border transition-colors text-sm font-sans min-w-8"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-sans"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
