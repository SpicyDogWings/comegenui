import { computed, ref, watch, type Ref, unref } from "vue";

interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
}

export function usePagination(data: any[] | Ref<any[]>, options: UsePaginationOptions = {}) {
  // State
  const currentPage = ref(options.initialPage || 1);
  const itemsPerPage = ref(options.initialItemsPerPage || 10);
  
  // Computed properties
  const filteredData = computed(() => unref(data));
  
  const displayData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredData.value.slice(start, end);
  });

  const totalItems = computed(() => filteredData.value.length);
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
  const showPaginationControl = computed(() => totalPages.value > 1);

  // Methods
  const setCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const setItemsPerPage = (size: number) => {
    itemsPerPage.value = size;
    currentPage.value = 1; // Reset to first page when changing page size
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // Watch for data changes and reset pagination if needed
  watch([data, itemsPerPage], () => {
    // Reset to first page if current page exceeds total pages
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1;
    }
  });

  return {
    currentPage,
    itemsPerPage,
    displayData,
    totalItems,
    totalPages,
    showPaginationControl,
    setCurrentPage,
    setItemsPerPage,
    nextPage,
    prevPage,
  };
}

export type PaginationResult = ReturnType<typeof usePagination>;