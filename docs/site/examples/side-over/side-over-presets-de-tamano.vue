<script setup lang="ts">
// Refleja el ejemplo "Presets de tamaño": cada panel con su `position`/`size`.
import { ref } from "vue";

type SideOverEl = HTMLElement & { open: () => void };
const sm = ref<SideOverEl | null>(null);
const lg = ref<SideOverEl | null>(null);
const md = ref<SideOverEl | null>(null);
const full = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="sm?.open()">sm (derecha)</button>
      <button type="button" @click="lg?.open()">lg (izquierda)</button>
      <button type="button" @click="md?.open()">md (arriba)</button>
      <button type="button" @click="full?.open()">fullscreen (abajo)</button>
    </div>

    <cu-side-over ref="sm" position="right" size="sm" title="Angosto"></cu-side-over>
    <cu-side-over ref="lg" position="left" size="lg" title="Ancho"></cu-side-over>
    <cu-side-over ref="md" position="top" size="md" title="Desde arriba"></cu-side-over>
    <cu-side-over ref="full" position="bottom" fullscreen title="Pantalla completa"></cu-side-over>
  </VanillaDemo>
</template>
