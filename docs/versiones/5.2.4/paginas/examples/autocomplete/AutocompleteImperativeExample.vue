<script setup lang="ts">
import { ref } from "vue";
import Autocomplete from "@/components/form/Autocomplete.vue";

const ac = ref<InstanceType<typeof Autocomplete> | null>(null);
const salida = ref("(sin llamadas todavía)");

const items = [
  { label: "Argentina", value: "ar" },
  { label: "Brasil", value: "br" },
  { label: "Chile", value: "cl" },
];

function leer() {
  salida.value = `get() → ${JSON.stringify(ac.value?.get())}\nisOpen() → ${ac.value?.isOpen()}\nselectedItem() → ${JSON.stringify(ac.value?.selectedItem())}`;
}

function setear() {
  ac.value?.set("Chile");
  leer();
}

function limpiar() {
  ac.value?.reset();
  leer();
}

function enfocar() {
  ac.value?.focus();
  salida.value = `focus() → isOpen() = ${ac.value?.isOpen()}`;
}

function abrir() {
  ac.value?.open();
  leer();
}

function cerrar() {
  ac.value?.close();
  leer();
}

function alternar() {
  ac.value?.toggle();
  leer();
}
</script>

<template>
  <Autocomplete ref="ac" :items="items" :min-chars="0" placeholder="Elegí un país" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get() / isOpen() / selectedItem()</button>
    <button type="button" @click="setear">set('Chile')</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
    <button type="button" @click="abrir">open()</button>
    <button type="button" @click="cerrar">close()</button>
    <button type="button" @click="alternar">toggle()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
