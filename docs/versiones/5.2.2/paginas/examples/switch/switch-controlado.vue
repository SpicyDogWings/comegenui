<script setup lang="ts">
// Refleja el ejemplo "Estado y modo controlado": sólo permite dejarlo encendido;
// si el usuario lo apaga, se vuelve a encender asignando `modelValue`.
import { onMounted, ref } from "vue";

type CuSwitchElement = HTMLElement & { modelValue?: boolean };

const sw = ref<CuSwitchElement | null>(null);

onMounted(() => {
  sw.value?.addEventListener("update:modelValue", (e) => {
    if ((e as CustomEvent).detail || !sw.value) return;
    // Forzamos un cambio de la prop para que el CE vuelva a encenderse.
    sw.value.modelValue = false;
    setTimeout(() => {
      if (sw.value) sw.value.modelValue = true;
    });
  });
});
</script>

<template>
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch ref="sw"></cu-switch>
    <p class="cu-demo-output">Intentá apagarlo: se vuelve a encender solo.</p>
  </VanillaDemo>
</template>
