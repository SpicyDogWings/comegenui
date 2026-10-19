<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": abrir el panel con un botón externo.
// En 5.1.2 el método es `show()`: `open` es el atributo booleano y tapa al
// método homónimo en el custom element.
import { ref } from "vue";

type SideOverEl = HTMLElement & { show: () => void };
const side = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuSideOver']">
    <cu-button color="primary" variant="solid" @click="side?.show()">Abrir panel</cu-button>

    <cu-side-over ref="side" title="Filtros" position="right">
      <p>Contenido del panel.</p>
    </cu-side-over>
  </VanillaDemo>
</template>
