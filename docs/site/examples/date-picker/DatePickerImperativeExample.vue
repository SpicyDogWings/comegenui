<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const single = ref<InstanceType<typeof DatePicker> | null>(null);
const range = ref<InstanceType<typeof DatePicker> | null>(null);
const singleModel = ref<Date | null>(null);
const rStart = ref<Date | null>(null);
const rEnd = ref<Date | null>(null);
const salida = ref("(sin llamadas todavía)");

const fmt = (v: Date | null | undefined) => (v ? v.toISOString().slice(0, 10) : "null");

function abrir() {
  single.value?.open();
  salida.value = "open() → panel abierto";
}
function cerrar() {
  single.value?.close();
  salida.value = `close() · isOpen()=${single.value?.isOpen()}`;
}
function alternar() {
  single.value?.toggle();
  salida.value = `toggle() · isOpen()=${single.value?.isOpen()}`;
}
function leerValor() {
  salida.value = `getValue() → ${fmt(single.value?.getValue())}`;
}
function setearValor() {
  single.value?.setValue("2026-12-24");
  leerValor();
}
function limpiar() {
  single.value?.clear();
  leerValor();
}
function leerRango() {
  salida.value = `getStartDate() → ${fmt(range.value?.getStartDate())}\ngetEndDate() → ${fmt(range.value?.getEndDate())}`;
}
function setearRango() {
  range.value?.setRange("2026-12-01", "2026-12-31");
  leerRango();
}
</script>

<template>
  <DatePicker ref="single" v-model="singleModel" placeholder="Instancia single" />
  <DatePicker
    ref="range"
    mode="range"
    v-model:start-date="rStart"
    v-model:end-date="rEnd"
    placeholder="Instancia range"
  />
  <div class="cu-demo-controls">
    <button type="button" @click="abrir">open()</button>
    <button type="button" @click="cerrar">close()</button>
    <button type="button" @click="alternar">toggle()</button>
    <button type="button" @click="leerValor">getValue()</button>
    <button type="button" @click="setearValor">setValue()</button>
    <button type="button" @click="limpiar">clear()</button>
    <button type="button" @click="leerRango">getStartDate() / getEndDate()</button>
    <button type="button" @click="setearRango">setRange()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
