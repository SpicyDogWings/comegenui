<script setup lang="ts">
// Refleja el ejemplo "Opciones deshabilitadas": las opciones con `disabled: true`
// se ven atenuadas y no responden al click.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Documento", disabled: true },
  { value: "csv", label: "CSV", disabled: true },
  { value: "xlsx", label: "Excel" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" placeholder="Elige un formato"></cu-select>
  </VanillaDemo>
</template>
