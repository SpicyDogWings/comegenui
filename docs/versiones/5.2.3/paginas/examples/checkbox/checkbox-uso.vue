<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": dos checkboxes y el control por métodos
// (`set`/`get`) del custom element.
import { ref } from "vue";

type CuCheckboxElement = HTMLElement & {
  get?: () => boolean;
  set?: (value: boolean) => void;
};

const chk = ref<CuCheckboxElement | null>(null);
const salida = ref("(sin llamadas todavía)");

function marcar() {
  chk.value?.set?.(true);
  salida.value = "set(true)";
}

function leer() {
  salida.value = `get() → ${JSON.stringify(chk.value?.get?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCheckbox']">
    <cu-checkbox ref="chk" label="Acepto los términos" color="primary"></cu-checkbox>
    <cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>
    <div class="cu-demo-controls">
      <button type="button" @click="marcar">set(true)</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
