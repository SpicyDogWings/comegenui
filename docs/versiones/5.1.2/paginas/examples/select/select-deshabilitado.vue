<script setup lang="ts">
// Refleja el ejemplo "Estado deshabilitado": `disabled` bloquea la apertura del dropdown.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
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
    <cu-select ref="select" disabled placeholder="disabled"></cu-select>
  </VanillaDemo>
</template>
