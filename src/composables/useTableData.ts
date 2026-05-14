import { ref, type Ref, watch } from "vue";

export interface TableDataMethods<T = Record<string, any>> {
  data: Ref<T[]>;
  updateRow: (index: number, newData: Partial<T>) => void;
  getData: (filterFn?: (item: T) => boolean) => T[];
  getRow: (index: number) => T | undefined;
  removeRow: (index: number) => boolean;
  addRow: (newItem: T) => boolean;
  pushData: (items: T[]) => boolean;
}

export function useTableData<T = Record<string, any>>(propsData: Ref<T[]>) {
  const data = ref<T[]>([...propsData.value]);

  // Sync with external data changes
  watch(
    propsData,
    (newData) => {
      data.value = [...newData];
    },
    { deep: true, immediate: true }
  );

  const updateRow = (index: number, newData: Partial<T>): void => {
    if (index >= 0 && index < data.value.length && data.value[index]) {
      Object.assign(data.value[index], newData);
    }
  };

  const getData = (filterFn?: (item: T) => boolean): T[] => {
    let result = data.value.map((item) => JSON.parse(JSON.stringify(item)));
    if (filterFn) {
      result = result.filter(filterFn);
    }
    return result;
  };

  const getRow = (index: number): T | undefined => {
    if (index >= 0 && index < data.value.length) {
      return JSON.parse(JSON.stringify(data.value[index]));
    }
    return undefined;
  };

  const removeRow = (index: number): boolean => {
    if (index >= 0 && index < data.value.length) {
      data.value.splice(index, 1);
      return true;
    }
    return false;
  };

  const addRow = (newItem: T): boolean => {
    if (data.value.length === 0) {
      data.value.push(JSON.parse(JSON.stringify(newItem)));
      return true;
    }
    const firstRowKeys = Object.keys(data.value[0] || {});
    const newItemKeys = Object.keys(newItem as object || {});
    const isValid = firstRowKeys.every((key) => newItemKeys.includes(key));
    if (isValid) {
      data.value.push(JSON.parse(JSON.stringify(newItem)));
      return true;
    }
    return false;
  };

  const pushData = (items: T[]): boolean => {
    if (data.value.length === 0) {
      data.value.push(...items.map((item) => JSON.parse(JSON.stringify(item))));
      return true;
    }
    const firstRowKeys = Object.keys(data.value[0] || {});
    const allValid = items.every((item) =>
      firstRowKeys.every((key) => Object.keys(item as object || {}).includes(key))
    );
    if (allValid) {
      data.value.push(...items.map((item) => JSON.parse(JSON.stringify(item))));
      return true;
    }
    return false;
  };

  return {
    data,
    updateRow,
    getData,
    getRow,
    removeRow,
    addRow,
    pushData,
  };
}
