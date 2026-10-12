<script setup lang="ts">
// Refleja el ejemplo "Búsqueda por teclado (searchEnabled)": al escribir, la lista
// hace scroll a la primera opción que coincide.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "mx", label: "México" },
  { value: "pe", label: "Perú" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" search-enabled placeholder="Escribí para buscar"></cu-select>
  </VanillaDemo>
</template>
