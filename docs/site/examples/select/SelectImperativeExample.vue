<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/form/Select.vue";

const sel = ref<InstanceType<typeof Select> | null>(null);
const salida = ref("(sin llamadas todavía)");

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

function leer() {
  salida.value = `get() → ${JSON.stringify(sel.value?.get())}\nisOpen() → ${sel.value?.isOpen()}\nselectedItem() → ${JSON.stringify(sel.value?.selectedItem())}`;
}

function setear() {
  sel.value?.set("br");
  leer();
}

function limpiar() {
  sel.value?.reset();
  leer();
}

function enfocar() {
  sel.value?.focus();
  salida.value = "focus() → el trigger tomó foco";
}
</script>

<template>
  <Select ref="sel" :options="options" placeholder="Elegí un país" />
  <div class="cu-demo-controls">
    <button type="button" @click="leer">get() / isOpen() / selectedItem()</button>
    <button type="button" @click="setear">set('br')</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
