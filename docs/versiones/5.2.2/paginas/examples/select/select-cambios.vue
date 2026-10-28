<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": eventos `select`, `update:modelValue` y `change`.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);
const salida = ref("(sin eventos todavía)");

const options = [
  { value: "op1", label: "Opción 1" },
  { value: "op2", label: "Opción 2" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch(select, async (el) => {
  if (!el) return;
  el.addEventListener("select", (e) => {
    const detail = (e as CustomEvent).detail;
    salida.value = `select → ${JSON.stringify(detail) ?? "{}"}`;
  });
  el.addEventListener("update:modelValue", (e) => {
    salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
  el.addEventListener("change", (e) => {
    salida.value = `change → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select"></cu-select>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
