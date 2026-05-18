import { usePagination } from "./usePagination";
import { computed, ref } from "vue";

describe("usePagination", () => {
  const testData = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    { id: 7, name: "Item 7" },
    { id: 8, name: "Item 8" },
    { id: 9, name: "Item 9" },
    { id: 10, name: "Item 10" },
  ];

  test("should initialize with correct default values", () => {
    const pagination = usePagination(testData);
    
    expect(pagination.currentPage.value).toBe(1);
    expect(pagination.itemsPerPage.value).toBe(10);
    expect(pagination.totalItems.value).toBe(10);
    expect(pagination.totalPages.value).toBe(1);
    expect(pagination.displayData.value.length).toBe(10);
  });

  test("should respect initial page and items per page", () => {
    const pagination = usePagination(testData, {
      initialPage: 2,
      initialItemsPerPage: 3,
    });
    
    expect(pagination.currentPage.value).toBe(2);
    expect(pagination.itemsPerPage.value).toBe(3);
    expect(pagination.totalPages.value).toBe(4);
    expect(pagination.displayData.value.length).toBe(3); // Items 4-6
  });

  test("should calculate pagination correctly", () => {
    const pagination = usePagination(testData, { initialItemsPerPage: 3 });
    
    expect(pagination.totalPages.value).toBe(4); // 10 items / 3 per page = 4 pages
    
    pagination.setCurrentPage(2);
    expect(pagination.displayData.value.length).toBe(3); // Items 4-6
    expect(pagination.displayData.value[0].id).toBe(4);
    
    pagination.setCurrentPage(4);
    expect(pagination.displayData.value.length).toBe(1); // Only item 10
    expect(pagination.displayData.value[0].id).toBe(10);
  });

  test("should handle page changes correctly", () => {
    const pagination = usePagination(testData, { initialItemsPerPage: 4 });
    
    expect(pagination.currentPage.value).toBe(1);
    
    pagination.nextPage();
    expect(pagination.currentPage.value).toBe(2);
    
    pagination.nextPage();
    expect(pagination.currentPage.value).toBe(3);
    
    // Should not go beyond total pages
    pagination.nextPage();
    expect(pagination.currentPage.value).toBe(3); // Still on last page
    
    pagination.prevPage();
    expect(pagination.currentPage.value).toBe(2);
    
    pagination.prevPage();
    expect(pagination.currentPage.value).toBe(1);
    
    // Should not go below page 1
    pagination.prevPage();
    expect(pagination.currentPage.value).toBe(1);
  });

  test("should handle items per page changes", () => {
    const pagination = usePagination(testData, { initialItemsPerPage: 5 });
    
    expect(pagination.totalPages.value).toBe(2);
    expect(pagination.displayData.value.length).toBe(5);
    
    pagination.setItemsPerPage(3);
    expect(pagination.itemsPerPage.value).toBe(3);
    expect(pagination.currentPage.value).toBe(1); // Should reset to page 1
    expect(pagination.totalPages.value).toBe(4);
    expect(pagination.displayData.value.length).toBe(3);
  });

  test("should handle empty data", () => {
    const pagination = usePagination([], { initialItemsPerPage: 5 });
    
    expect(pagination.totalItems.value).toBe(0);
    expect(pagination.totalPages.value).toBe(0);
    expect(pagination.displayData.value.length).toBe(0);
    expect(pagination.showPaginationControl.value).toBe(false);
  });

  test("should handle single page data", () => {
    const singlePageData = testData.slice(0, 3);
    const pagination = usePagination(singlePageData, { initialItemsPerPage: 5 });
    
    expect(pagination.totalPages.value).toBe(1);
    expect(pagination.showPaginationControl.value).toBe(false);
    expect(pagination.displayData.value.length).toBe(3);
  });

  test("should work with computed ref data", () => {
    const filteredData = computed(() => testData.filter(item => item.id <= 6));
    const pagination = usePagination(filteredData, { initialItemsPerPage: 3 });

    expect(pagination.totalItems.value).toBe(6);
    expect(pagination.totalPages.value).toBe(2);
    expect(pagination.displayData.value.length).toBe(3);
    expect(pagination.displayData.value[0].id).toBe(1);

    pagination.setCurrentPage(2);
    expect(pagination.displayData.value.length).toBe(3);
    expect(pagination.displayData.value[0].id).toBe(4);
  });

  test("should work with ref data", () => {
    const dataRef = ref(testData.slice(0, 5));
    const pagination = usePagination(dataRef, { initialItemsPerPage: 2 });

    expect(pagination.totalItems.value).toBe(5);
    expect(pagination.totalPages.value).toBe(3);
    expect(pagination.displayData.value.length).toBe(2);

    // Update the ref and check if pagination updates
    dataRef.value = testData.slice(0, 8);
    expect(pagination.totalItems.value).toBe(8);
    expect(pagination.totalPages.value).toBe(4);
  });
});