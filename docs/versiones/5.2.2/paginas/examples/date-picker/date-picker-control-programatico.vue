<script setup lang="ts">
// Refleja el ejemplo "Control programático": open/close/toggle, getValue/setValue/clear
// (single) y getStartDate/getEndDate/setRange (range).
import { ref } from "vue";

type DatePickerEl = HTMLElement & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  getValue: () => Date | null;
  setValue: (v: string | number | Date | null) => void;
  clear: () => void;
  getStartDate: () => Date | null;
  getEndDate: () => Date | null;
  setRange: (a: string | number | Date | null, b: string | number | Date | null) => void;
};

const single = ref<DatePickerEl | null>(null);
const range = ref<DatePickerEl | null>(null);
const salida = ref("(sin llamadas todavía)");

const fmt = (v: Date | null | undefined) => (v ? v.toISOString().slice(0, 10) : "null");

function abrir() {
  single.value?.open();
  salida.value = "open() → panel abierto";
}
function cerrar() {
  single.value?.close();
  salida.value = "close()";
}
function alternar() {
  single.value?.toggle();
  salida.value = "toggle()";
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
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker ref="single" placeholder="Instancia single"></cu-date-picker>
    <cu-date-picker ref="range" mode="range" placeholder="Instancia range"></cu-date-picker>

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
  </VanillaDemo>
</template>
