<script setup lang="ts">
// Refleja el ejemplo "Texto": `text-align` (left/center/right) y `placeholder-wrap`.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const izquierda = ref<CuSelectElement | null>(null);
const centro = ref<CuSelectElement | null>(null);
const derecha = ref<CuSelectElement | null>(null);
const wrap = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  for (const el of [izquierda.value, centro.value, derecha.value, wrap.value]) {
    if (el) el.options = options;
  }
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="izquierda" text-align="left" placeholder="text-align: left (default)"></cu-select>
    <cu-select ref="centro" text-align="center" placeholder="text-align: center"></cu-select>
    <cu-select ref="derecha" text-align="right" placeholder="text-align: right"></cu-select>
    <cu-select
      ref="wrap"
      placeholder-wrap
      placeholder="Un placeholder largo que se envuelve en varias líneas en vez de truncarse"
    ></cu-select>
  </VanillaDemo>
</template>
