<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios": el evento `update:modelValue` del CE.
import { onMounted, ref } from "vue";

const campo = ref<HTMLElement | null>(null);
const salida = ref("(sin cambios todavía)");

onMounted(() => {
  campo.value?.addEventListener("update:modelValue", (e) => {
    salida.value = `update:modelValue → ${JSON.stringify((e as CustomEvent).detail)}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuInput']">
    <cu-input ref="campo" placeholder="Tu nombre"></cu-input>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
