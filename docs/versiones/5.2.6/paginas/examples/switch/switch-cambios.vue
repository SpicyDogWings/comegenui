<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": `update:modelValue` y `change` (payload boolean).
import { onMounted, ref } from "vue";

const toggle = ref<HTMLElement | null>(null);
const salida = ref("(sin cambios todavía)");

onMounted(() => {
  toggle.value?.addEventListener("update:modelValue", (e) => {
    salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
  toggle.value?.addEventListener("change", (e) => {
    salida.value = `change → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch ref="toggle"></cu-switch>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
