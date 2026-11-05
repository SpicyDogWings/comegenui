<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": `update:modelValue` y `change` (payload boolean).
import { onMounted, ref } from "vue";

const notif = ref<HTMLElement | null>(null);
const salida = ref("(sin cambios todavía)");

onMounted(() => {
  notif.value?.addEventListener("update:modelValue", (e) => {
    salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
  notif.value?.addEventListener("change", (e) => {
    salida.value = `change → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuCheckbox']">
    <cu-checkbox ref="notif" label="Notificaciones"></cu-checkbox>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
