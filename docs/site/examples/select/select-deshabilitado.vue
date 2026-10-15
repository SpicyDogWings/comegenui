<script setup lang="ts">
// Refleja el ejemplo "Estado deshabilitado": `disabled` bloquea la apertura del dropdown.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" disabled placeholder="disabled"></cu-select>
  </VanillaDemo>
</template>
