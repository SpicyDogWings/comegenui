<script setup lang="ts">
// Refleja el ejemplo "Rango (modo `range`)": el primer click marca el inicio y
// el segundo el fin; `select` entrega `{ start, end }`.
import { ref } from "vue";

type Rango = { start: Date | null; end: Date | null };

const rango = ref("(tocá dos días)");

function fmt(value: Date | null): string {
  return value ? value.toISOString().slice(0, 10) : "null";
}

function onSelect(e: CustomEvent) {
  const { start, end } = e.detail as Rango;
  rango.value = `{ ${fmt(start)}, ${fmt(end)} }`;
}
</script>

<template>
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar mode="range" @select="onSelect"></cu-calendar>
    <p class="cu-demo-output">select → {{ rango }}</p>
  </VanillaDemo>
</template>
