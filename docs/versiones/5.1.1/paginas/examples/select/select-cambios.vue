<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": eventos `select`, `update:modelValue` y `change`.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);
const salida = ref("(sin eventos todavía)");

const options = [
  { value: "op1", label: "Opción 1" },
  { value: "op2", label: "Opción 2" },
];

onMounted(async () => {
  if (select.value) {
    select.value.addEventListener("select", (e) => {
      const detail = (e as CustomEvent).detail;
      salida.value = `select → ${JSON.stringify(detail) ?? "{}"}`;
    });
    select.value.addEventListener("update:modelValue", (e) => {
      salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
    });
    select.value.addEventListener("change", (e) => {
      salida.value = `change → ${JSON.stringify((e as CustomEvent).detail)}`;
    });
  }
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select"></cu-select>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
