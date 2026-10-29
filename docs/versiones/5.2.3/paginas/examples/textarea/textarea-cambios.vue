<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": el evento `update:modelValue` del CE.
import { onMounted, ref } from "vue";

const bio = ref<HTMLElement | null>(null);
const salida = ref("(sin cambios todavía)");

onMounted(() => {
  bio.value?.addEventListener("update:modelValue", (e) => {
    salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea ref="bio" placeholder="Biografía"></cu-textarea>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
