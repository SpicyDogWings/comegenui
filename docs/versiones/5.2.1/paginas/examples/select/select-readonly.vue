<script setup lang="ts">
// Refleja el ejemplo "Estado de solo lectura": no abre ni cambia por click;
// `set()` programático sigue funcionando.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & {
  options?: unknown[];
  set?: (value: string) => void;
};

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

// El ref aparece recién cuando `VanillaDemo` termina de cargar el CE; un
// `onMounted` del demo corre antes y vería `select.value === null`.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
  el.set?.("a");
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" read-only placeholder="Solo lectura"></cu-select>
  </VanillaDemo>
</template>
