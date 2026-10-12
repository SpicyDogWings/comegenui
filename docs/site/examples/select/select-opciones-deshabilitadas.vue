<script setup lang="ts">
// Refleja el ejemplo "Opciones deshabilitadas": las opciones con `disabled: true`
// se ven atenuadas y no responden al click.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Documento", disabled: true },
  { value: "csv", label: "CSV", disabled: true },
  { value: "xlsx", label: "Excel" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" placeholder="Elige un formato"></cu-select>
  </VanillaDemo>
</template>
