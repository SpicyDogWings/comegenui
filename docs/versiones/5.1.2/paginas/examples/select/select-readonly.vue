<script setup lang="ts">
// Refleja el ejemplo "Estado de solo lectura": no abre ni cambia por click;
// `set()` programático sigue funcionando.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & {
  options?: unknown[];
  set?: (value: string) => void;
};

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) {
    select.value.options = options;
    select.value.set?.("a");
  }
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" read-only placeholder="Solo lectura"></cu-select>
  </VanillaDemo>
</template>
