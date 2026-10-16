<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": las tres variantes y, sobre el
// segundo input, `set()` / `get()` y el evento `update:modelValue`.
import { onMounted, ref } from "vue";

const input = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");

type FiEl = HTMLElement & { set: (file: File) => void; get: () => File | null };

function el(): FiEl | null {
  return input.value as unknown as FiEl | null;
}

function setear() {
  el()?.set(new File(["contenido"], "ejemplo.txt", { type: "text/plain" }));
  salida.value = `get() → ${el()?.get()?.name ?? "null"}`;
}

onMounted(async () => {
  await customElements.whenDefined("cu-file-input");
  input.value?.addEventListener("update:modelValue", (e) => {
    const file = (e as CustomEvent<File | null>).detail;
    salida.value = `update:modelValue → ${file?.name ?? "null"}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuFileInput']">
    <cu-file-input placeholder="Elige un archivo..." color="primary"></cu-file-input>
    <cu-file-input ref="input" accept="image/*" variant="outlined"></cu-file-input>
    <cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set(new File(...))</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
