<script setup lang="ts">
// Refleja el ejemplo "Posiciones": `position` en los 4 bordes.
import { ref } from "vue";

type SideOverEl = HTMLElement & { show: () => void };

const derecha = ref<SideOverEl | null>(null);
const izquierda = ref<SideOverEl | null>(null);
const arriba = ref<SideOverEl | null>(null);
const abajo = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="derecha?.show()">position right (default)</button>
      <button type="button" @click="izquierda?.show()">position left</button>
      <button type="button" @click="arriba?.show()">position top</button>
      <button type="button" @click="abajo?.show()">position bottom</button>
    </div>

    <cu-side-over ref="derecha" position="right" title="Desde la derecha">
      <p>Desliza desde el borde derecho.</p>
    </cu-side-over>
    <cu-side-over ref="izquierda" position="left" title="Desde la izquierda">
      <p>Desliza desde el borde izquierdo.</p>
    </cu-side-over>
    <cu-side-over ref="arriba" position="top" size="40vh" title="Desde arriba">
      <p>Desliza desde el borde superior.</p>
    </cu-side-over>
    <cu-side-over ref="abajo" position="bottom" size="40vh" title="Desde abajo">
      <p>Desliza desde el borde inferior.</p>
    </cu-side-over>
  </VanillaDemo>
</template>
