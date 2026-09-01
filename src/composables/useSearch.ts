import { computed, type Ref, type MaybeRef, unref } from "vue";

interface Column {
  key: string;
  inputType?: "input" | "textarea" | "select";
  selectOptions?: { value: string; label: string }[] | ((row: any) => { value: string; label: string }[]);
}

interface UseSearchOptions {
  searchQuery: Ref<string>;
  searchFields?: MaybeRef<string[]>;
  caseSensitive?: boolean;
  columns?: MaybeRef<Column[]>;
}

const normalize = (s: string, caseSensitive = false) => {
  const normalized = s.normalize("NFD").replace(/[\u0300-\u0302\u0304-\u036f]/g, "");
  return caseSensitive ? normalized : normalized.toLowerCase();
};

export function useSearch(data: any[] | Ref<any[]>, options: UseSearchOptions) {
  const { searchQuery, caseSensitive = false } = options;

  const filteredData = computed(() => {
    const unrefedData = unref(data);
    const query = searchQuery.value.trim();
    if (!query) return unrefedData;

    const normalizedQuery = normalize(query, caseSensitive);
    const fields = unref(options.searchFields) || [];
    const columns = unref(options.columns) || [];

    return unrefedData.filter((item) => {
      if (typeof item !== "object" || item === null) return false;

      const keys = fields.length > 0 ? fields : Object.keys(item);

      return keys.some((key) => {
        const raw = item[key];
        if (raw == null) return false;

        const col = columns.find((c) => c.key === key);
        if (col?.inputType === "select") {
          const opts = typeof col.selectOptions === "function"
            ? col.selectOptions(item)
            : col.selectOptions || [];
          const opt = opts.find((o: any) => o.value === raw);
          if (opt) return normalize(opt.label, caseSensitive).includes(normalizedQuery);
        }

        return normalize(String(raw), caseSensitive).includes(normalizedQuery);
      });
    });
  });

  return { filteredData };
}

export type UseSearchResult = ReturnType<typeof useSearch>;