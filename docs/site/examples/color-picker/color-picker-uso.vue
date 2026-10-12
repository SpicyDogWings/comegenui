<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `set()` / `get()` y el evento `change`.
import { onMounted, ref } from "vue";

const cp = ref<HTMLElement | null>(null);
const salida = ref("(sin llamadas todavía)");

type CpEl = HTMLElement & { set: (val: string) => void; get: () => string };

function el(): CpEl | null {
  return cp.value as unknown as CpEl | null;
}

function onCambio(e: Event) {
  salida.value = `change → ${(e as CustomEvent).detail}`;
}

function setear() {
  el()?.set("#ff5733");
  leer();
}

function leer() {
  salida.value = `get() → ${el()?.get()}`;
}

onMounted(async () => {
  await customElements.whenDefined("cu-color-picker");
  el()?.set("#ff5733");
});
</script>

<template>
  <VanillaDemo :use="['CuColorPicker']">
    <cu-color-picker ref="cp" color="primary" @change="onCambio"></cu-color-picker>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set('#ff5733')</button>
      <button type="button" @click="leer">get()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
