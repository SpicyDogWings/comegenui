<script setup lang="ts">
// Refleja el ejemplo "zIndex": `z-index` define la capa del overlay (default 1100).
import { ref } from "vue";

type SideOverEl = HTMLElement & { show: () => void };

const alto = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="alto?.show()">Abrir con z-index 2000</button>
    </div>

    <cu-side-over ref="alto" position="right" :z-index="2000" title="z-index alto">
      <p>Este panel se apila por encima de otros overlays con menor <code>z-index</code>.</p>
    </cu-side-over>
  </VanillaDemo>
</template>
