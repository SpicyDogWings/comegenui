import { computed, type Ref, unref } from "vue";

/**
 * Search options interface
 */
interface UseSearchOptions {
  /**
   * The search query (reactive reference)
   */
  searchQuery: Ref<string>;
  
  /**
   * Specific fields to search in. If empty, searches all fields.
   */
  searchFields?: string[];
  
  /**
   * Whether search should be case sensitive (default: false)
   */
  caseSensitive?: boolean;
}

/**
 * Simple search composable for filtering data
 * 
 * @param data - The data array to search through
 * @param options - Search configuration options
 * @returns Filtered data based on search query
 */
export function useSearch(data: any[] | Ref<any[]>, options: UseSearchOptions) {
  const { searchQuery, searchFields = [], caseSensitive = false } = options;

  const filteredData = computed(() => {
    const unrefedData = unref(data);
    // If no search query, return all data
    if (!searchQuery.value.trim()) {
      return unrefedData;
    }

    const query = caseSensitive ? searchQuery.value : searchQuery.value.toLowerCase();
    
    return unrefedData.filter((item) => {
      // Ensure item is an object and has keys
      if (typeof item !== 'object' || item === null) {
        return false;
      }
      
      // Determine which fields to search
      const fieldsToSearch = searchFields && searchFields.length > 0 
        ? searchFields 
        : Object.keys(item);

      // Ensure fieldsToSearch is an array
      if (!Array.isArray(fieldsToSearch)) {
        return false;
      }

      return fieldsToSearch.some((key) => {
        const value = item[key];
        
        // Handle different data types
        if (value == null) {
          return false;
        }

        if (typeof value === "string") {
          const target = caseSensitive ? value : value.toLowerCase();
          return target.includes(query);
        }

        if (typeof value === "number") {
          const target = String(value);
          return caseSensitive 
            ? target.includes(query) 
            : target.toLowerCase().includes(query);
        }

        if (typeof value === "boolean") {
          const target = String(value);
          return caseSensitive 
            ? target.includes(query) 
            : target.toLowerCase().includes(query);
        }

        // For other types (objects, arrays), convert to string
        if (typeof value === "object") {
          const target = JSON.stringify(value);
          return caseSensitive 
            ? target.includes(query) 
            : target.toLowerCase().includes(query);
        }

        // Fallback: convert to string
        const target = String(value);
        return caseSensitive 
          ? target.includes(query) 
          : target.toLowerCase().includes(query);
      });
    });
  });

  return {
    filteredData,
  };
}

/**
 * Type for the search result
 */
export type UseSearchResult = ReturnType<typeof useSearch>;