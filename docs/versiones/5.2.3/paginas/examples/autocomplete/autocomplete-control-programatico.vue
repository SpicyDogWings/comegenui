<script setup lang="ts">
// Refleja el ejemplo "Control programático": los métodos expuestos del CE
// (`set`, `get`, `focus`, `open`, `close`, `toggle`, `isOpen`, `selectedItem`).
import { ref } from "vue";

const ac = ref<HTMLElement | null>(null);
const salida = ref("(sin llamadas todavía)");

const items = [
  { label: "Argentina" },
  { label: "Brasil" },
  { label: "Chile" },
];

type AcEl = HTMLElement & {
  get: () => string;
  set: (val: string) => void;
  focus: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  selectedItem: () => unknown;
};

function el(): AcEl | null {
  return ac.value as unknown as AcEl | null;
}

function leer() {
  const e = el();
  salida.value = `get() → ${JSON.stringify(e?.get())}\nisOpen() → ${e?.isOpen()}\nselectedItem() → ${JSON.stringify(e?.selectedItem())}`;
}

function setear() {
  el()?.set("Admin");
  leer();
}

function enfocar() {
  el()?.focus();
  salida.value = `focus() → isOpen() = ${el()?.isOpen()}`;
}

function abrir() {
  el()?.open();
  leer();
}

function cerrar() {
  el()?.close();
  leer();
}

function alternar() {
  el()?.toggle();
  leer();
}
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      ref="ac"
      placeholder="Buscá..."
      color="primary"
      :items.prop="items"
    ></cu-autocomplete>
    <div class="cu-demo-controls">
      <button type="button" @click="leer">get() / isOpen() / selectedItem()</button>
      <button type="button" @click="setear">set('Admin')</button>
      <button type="button" @click="enfocar">focus()</button>
      <button type="button" @click="abrir">open()</button>
      <button type="button" @click="cerrar">close()</button>
      <button type="button" @click="alternar">toggle()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
