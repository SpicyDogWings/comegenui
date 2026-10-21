<script setup lang="ts">
// Refleja el ejemplo "Control programático": `set`/`get`/`selectedItem`/`reset`/`isOpen`/`focus`.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & {
  options?: unknown[];
  get?: () => string;
  set?: (value: string) => void;
  reset?: () => void;
  isOpen?: () => boolean;
  selectedItem?: () => unknown;
  focus?: () => void;
};

const select = ref<CuSelectElement | null>(null);
const salida = ref("(sin llamadas todavía)");

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });

function leer() {
  salida.value = `get() → ${JSON.stringify(select.value?.get?.())}\nisOpen() → ${select.value?.isOpen?.()}\nselectedItem() → ${JSON.stringify(select.value?.selectedItem?.() ?? null)}`;
}

function setear() {
  select.value?.set?.("a");
  leer();
}

function limpiar() {
  select.value?.reset?.();
  leer();
}

function enfocar() {
  select.value?.focus?.();
  salida.value = "focus() → el trigger tomó foco";
}
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" placeholder="Elegí una letra"></cu-select>
    <div class="cu-demo-controls">
      <button type="button" @click="leer">get() / isOpen() / selectedItem()</button>
      <button type="button" @click="setear">set('a')</button>
      <button type="button" @click="limpiar">reset()</button>
      <button type="button" @click="enfocar">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
