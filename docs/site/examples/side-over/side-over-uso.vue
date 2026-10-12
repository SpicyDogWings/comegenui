<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": abrir el panel con un botón externo.
import { ref } from "vue";

type SideOverEl = HTMLElement & { open: () => void };
const side = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuSideOver']">
    <cu-button color="primary" variant="solid" @click="side?.open()">Abrir panel</cu-button>

    <cu-side-over ref="side" title="Filtros" position="right">
      <p>Contenido del panel.</p>
    </cu-side-over>
  </VanillaDemo>
</template>
