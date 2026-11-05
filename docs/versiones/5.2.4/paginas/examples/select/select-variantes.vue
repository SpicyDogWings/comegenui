<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 4 variantes de campo.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const outlined = ref<CuSelectElement | null>(null);
const soft = ref<CuSelectElement | null>(null);
const ghost = ref<CuSelectElement | null>(null);
const subtle = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch([outlined, soft, ghost, subtle], async (els) => {
  await customElements.whenDefined("cu-select");
  for (const el of els) {
    if (el) el.options = options;
  }
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="outlined" variant="outlined" placeholder="outlined"></cu-select>
    <cu-select ref="soft" variant="soft" placeholder="soft (default)"></cu-select>
    <cu-select ref="ghost" variant="ghost" placeholder="ghost"></cu-select>
    <cu-select ref="subtle" variant="subtle" placeholder="subtle"></cu-select>
  </VanillaDemo>
</template>
