<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.ce.vue";

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
  showFirstAndLast: {
    type: Boolean,
    required: false,
    default: false,
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
    if (props.showFirstAndLast) {
      pages.push(1);
      if (current > 3) pages.push("...");
    }

    let midStart = current - 1;
    let midEnd = current + 1;

    if (props.showFirstAndLast) {
      midStart = Math.max(2, midStart);
      midEnd = Math.min(total - 1, midEnd);
    } else {
      midStart = Math.max(1, midStart);
      midEnd = Math.min(total, midEnd);
    }

    if (midEnd - midStart < 2) {
      if (midStart === (props.showFirstAndLast ? 2 : 1)) {
        midEnd = midStart + 2;
      } else {
        midStart = midEnd - 2;
      }
    }

    for (let i = midStart; i <= midEnd; i++) pages.push(i);

    if (props.showFirstAndLast) {
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

const selectClasses = [
  "py-1",
  "px-2",
  "rounded-cu",
  "font-sans",
  "border-none",
  "text-charcoal-800",
  "bg-charcoal-50",
  "hover:bg-charcoal-100",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-300",
  "border-solid",
  "border-1",
  "border-charcoal-300",
];
</script>

<template>
  <div
    v-if="totalPages > 1 || showPageSize"
    class="w-full flex flex-wrap items-center justify-between p-3 gap-3 box-border"
  >
    <span class="hidden md:inline text-sm text-charcoal-600 font-sans">
      Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }}
    </span>

    <div class="flex flex-wrap items-center justify-center gap-2">
      <div v-if="showPageSize" class="flex items-center gap-2">
        <span class="text-sm text-charcoal-600 font-sans">Por página:</span>
        <select
          :value="itemsPerPage"
          @change="(e) => handlePageSizeChange(Number((e.target as HTMLSelectElement).value))"
          :class="selectClasses"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <Button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          color="neutral"
          variant="soft"
        >
          Anterior
        </Button>

        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span v-if="page === '...'" class="py-1 px-2 text-charcoal-500 text-sm font-sans"
            >...</span
          >
          <Button
            v-else
            @click="handlePageChange(Number(page))"
            :color="currentPage === page ? 'primary' : 'neutral'"
            :variant="currentPage === page ? 'solid' : 'ghost'"
          >
            {{ page }}
          </Button>
        </template>

        <Button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          color="neutral"
          variant="soft"
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
