<script setup lang="ts">
// Refleja el ejemplo "Mínimo de caracteres": `min-chars` y el control
// programático de `set()`, `focus()` y `open()`.
import { ref } from "vue";

const ac = ref<HTMLElement | null>(null);
const salida = ref("(sin llamadas todavía)");

const items = [
  { label: "Argentina" },
  { label: "Brasil" },
  { label: "Chile" },
  { label: "Uruguay" },
  { label: "Paraguay" },
];

type AcEl = HTMLElement & {
  set: (val: string) => void;
  focus: () => void;
  open: () => void;
};

function el(): AcEl | null {
  return ac.value as unknown as AcEl | null;
}

function setChile() {
  el()?.set("Chile");
  salida.value = "set('Chile') · 5 caracteres (cumple min-chars=2)";
}

function enfocar() {
  el()?.focus();
  salida.value = "focus() → el panel se abre porque el texto cumple min-chars";
}

function abrir() {
  el()?.open();
  salida.value = "open() → abre el panel ignorando min-chars";
}
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      ref="ac"
      min-chars="2"
      placeholder="Escribí al menos 2 letras..."
      :items.prop="items"
    ></cu-autocomplete>
    <div class="cu-demo-controls">
      <button type="button" @click="setChile">set('Chile')</button>
      <button type="button" @click="enfocar">focus()</button>
      <button type="button" @click="abrir">open()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
