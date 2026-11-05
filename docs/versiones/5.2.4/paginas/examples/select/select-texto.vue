<script setup lang="ts">
// Refleja el ejemplo "Texto y alineación": `text-align` (left/center/right) y `placeholder-wrap`.
// Alinea el label del trigger (placeholder o selección) y las opciones del panel.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[]; set?: (v: string) => void };

const izquierda = ref<CuSelectElement | null>(null);
const centro = ref<CuSelectElement | null>(null);
const derecha = ref<CuSelectElement | null>(null);
const wrap = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

// Los refs llegan cuando VanillaDemo renderiza el slot (después de registrar el CE).
for (const el of [izquierda, centro, derecha, wrap]) {
  watch(el, (node) => {
    if (node) node.options = options;
  });
}

// Una selección en el del centro: el label elegido también queda centrado.
watch(centro, (node) => {
  if (node) node.set?.("b");
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
