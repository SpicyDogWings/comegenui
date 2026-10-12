<script setup lang="ts">
// Refleja el ejemplo "Modo rango": `mode="range"` + `dual-calendar`, rango
// inicial por propiedad y el evento `select`.
import { ref } from "vue";

const seleccion = ref("(sin selección)");

function fmt(v: unknown): string {
  return v instanceof Date ? v.toISOString().slice(0, 10) : "—";
}

function onSelect(e: Event) {
  const detail = (e as CustomEvent).detail as
    | Date
    | { start: Date | null; end: Date | null }
    | null;
  if (detail && typeof detail === "object" && "start" in detail) {
    seleccion.value = `${fmt(detail.start)} → ${fmt(detail.end)}`;
  } else if (detail instanceof Date) {
    seleccion.value = fmt(detail);
  }
}
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      mode="range"
      label="Período"
      dual-calendar
      start-date="2026-09-03"
      end-date="2026-09-15"
      @select="onSelect"
    ></cu-date-picker>
    <p class="cu-demo-output">select → {{ seleccion }}</p>
  </VanillaDemo>
</template>
