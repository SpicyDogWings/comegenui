<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": las opciones se asignan como propiedad
// JS y el valor se controla con `set()`/`get()`.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & {
  options?: unknown[];
  get?: () => string;
  set?: (value: string) => void;
};

const select = ref<CuSelectElement | null>(null);
const salida = ref("(sin llamadas todavía)");

const options = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE; un `onMounted`
// del demo corre antes y vería `select.value === null`.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });

function setear() {
  select.value?.set?.("pdf");
  salida.value = "set('pdf')";
}

function leer() {
  salida.value = `get() → ${JSON.stringify(select.value?.get?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set('pdf')</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
