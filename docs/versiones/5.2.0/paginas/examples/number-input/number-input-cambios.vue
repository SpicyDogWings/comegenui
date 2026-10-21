<script setup lang="ts">
// Refleja el ejemplo "Valor, eventos y confirmación": los cuatro eventos del CE.
import { ref, watch } from "vue";

const campo = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");
const names = ["update:modelValue", "change", "increment", "decrement"] as const;

watch(campo, (el) => {
  if (!el || el.dataset.listening === "1") return;
  el.dataset.listening = "1";
  for (const name of names) {
    el.addEventListener(name, (event) => {
      salida.value = `${name} → ${JSON.stringify((event as CustomEvent).detail)}`;
    });
  }
});
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input ref="campo" :min="0" :max="10" show-step-select></cu-number-input>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
