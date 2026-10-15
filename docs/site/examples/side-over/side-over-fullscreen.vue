<script setup lang="ts">
// Refleja el ejemplo "Fullscreen": `fullscreen` ignora `size` y ocupa todo el viewport.
import { ref } from "vue";

type SideOverEl = HTMLElement & { open: () => void };

const full = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="full?.open()">Abrir fullscreen</button>
    </div>

    <cu-side-over ref="full" position="right" fullscreen title="Pantalla completa">
      <p>El panel ocupa el 100% del viewport.</p>
    </cu-side-over>
  </VanillaDemo>
</template>
