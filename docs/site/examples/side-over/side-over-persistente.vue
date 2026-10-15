<script setup lang="ts">
// Refleja el ejemplo "Persistente": `persistent` no cierra por backdrop, Escape ni el botón.
import { ref } from "vue";

type SideOverEl = HTMLElement & { open: () => void; close: () => void };

const persistente = ref<SideOverEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="persistente?.open()">Abrir persistente</button>
    </div>

    <cu-side-over ref="persistente" position="right" persistent title="Sin cierre accidental">
      <p>No hay botón de cerrar: se cierra sólo por código, con <code>close()</code>.</p>
      <button type="button" @click="persistente?.close()">Cerrar desde adentro</button>
    </cu-side-over>
  </VanillaDemo>
</template>
