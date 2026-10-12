<script setup lang="ts">
// Refleja el ejemplo "Sizes": el ancho del modal depende de `size`.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void };
const modal = ref<ModalEl | null>(null);
const size = ref("sm");

function abrir(value: string) {
  size.value = value;
  modal.value?.open();
}
</script>

<template>
  <VanillaDemo :use="['CuModal']">
    <div class="cu-demo-controls">
      <button type="button" @click="abrir('sm')">sm</button>
      <button type="button" @click="abrir('md')">md</button>
      <button type="button" @click="abrir('lg')">lg</button>
      <button type="button" @click="abrir('xl')">xl</button>
      <button type="button" @click="abrir('full')">full</button>
    </div>

    <cu-modal ref="modal" :size="size" :title="`Tamaño ${size}`">
      <p>El ancho del modal depende de <code>size</code>; <code>height</code> controla el alto.</p>
    </cu-modal>
  </VanillaDemo>
</template>
