<script setup lang="ts">
// Refleja el ejemplo "Tamaños": los 5 presets (`sm`/`md`/`lg`/`xl`/`full`) y un valor CSS libre.
import { ref } from "vue";

type SideOverEl = HTMLElement & { show: () => void };

const sm = ref<SideOverEl | null>(null);
const md = ref<SideOverEl | null>(null);
const lg = ref<SideOverEl | null>(null);
const xl = ref<SideOverEl | null>(null);
const full = ref<SideOverEl | null>(null);
const css = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="sm?.show()">size sm (320px)</button>
      <button type="button" @click="md?.show()">size md (400px)</button>
      <button type="button" @click="lg?.show()">size lg (512px)</button>
      <button type="button" @click="xl?.show()">size xl (640px)</button>
      <button type="button" @click="full?.show()">size full (100%)</button>
      <button type="button" @click="css?.show()">size "40vw"</button>
    </div>

    <cu-side-over ref="sm" position="right" size="sm" title="sm (320px)"></cu-side-over>
    <cu-side-over ref="md" position="right" size="md" title="md (400px)"></cu-side-over>
    <cu-side-over ref="lg" position="right" size="lg" title="lg (512px)"></cu-side-over>
    <cu-side-over ref="xl" position="right" size="xl" title="xl (640px)"></cu-side-over>
    <cu-side-over ref="full" position="right" size="full" title="full (100%)"></cu-side-over>
    <cu-side-over ref="css" position="right" size="40vw" title="40vw"></cu-side-over>
  </VanillaDemo>
</template>
