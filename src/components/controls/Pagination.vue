<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "../buttons/Button.vue";
import Select from "../form/Select.vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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

const pageSizeValue = ref(String(props.itemsPerPage));

watch(() => props.itemsPerPage, (val) => {
  pageSizeValue.value = String(val);
});

const pageSizeOptionsFormatted = computed(() =>
  props.pageSizeOptions.map(opt => ({ value: String(opt), label: String(opt) }))
);

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
  }
};

const handlePageSizeChange = (val: string) => {
  pageSizeValue.value = val;
  emit("update:itemsPerPage", Number(val));
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
</script>

<template>
  <div
    v-if="totalPages > 1 || showPageSize"
    class="cu-pagination"
  >
    <span class="cu-pagination-info">
      Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }}
    </span>

    <div class="cu-pagination-controls">
      <div v-if="showPageSize" class="cu-pagination-page-size">
        <span class="cu-pagination-label">Por página:</span>
        <Select
          :model-value="pageSizeValue"
          :options="pageSizeOptionsFormatted"
          :color="props.color"
          style="width: 80px"
          @select="(opt) => handlePageSizeChange(opt.value)"
        />
      </div>

      <div class="cu-pagination-pages">
        <Button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          :color="props.color"
          :variant="props.variant"
        >
          Anterior
        </Button>

        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span v-if="page === '...'" class="cu-pagination-ellipsis">...</span>
          <Button
            v-else
            @click="handlePageChange(Number(page))"
            :color="props.color"
            :variant="currentPage === page ? 'solid' : props.variant"
          >
            {{ page }}
          </Button>
        </template>

        <Button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          :color="props.color"
          :variant="props.variant"
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cu-pagination {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: var(--cu-space-md);
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-pagination-info {
  display: none;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  font-family: var(--cu-font-sans);
}

@media (min-width: 768px) {
  .cu-pagination-info {
    display: inline;
  }
}

.cu-pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--cu-space-sm);
}

.cu-pagination-page-size {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-pagination-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  font-family: var(--cu-font-sans);
}

.cu-pagination-pages {
  display: flex;
  align-items: center;
  gap: var(--cu-space-xs);
}

.cu-pagination-ellipsis {
  padding: var(--cu-space-xs) var(--cu-space-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.5;
  font-size: var(--cu-font-size-sm);
  font-family: var(--cu-font-sans);
}
</style>
