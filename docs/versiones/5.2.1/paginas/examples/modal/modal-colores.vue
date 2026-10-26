<script setup lang="ts">
// Refleja el ejemplo "Colores": el color tiñe el título y el acento del header.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void };
const modal = ref<ModalEl | null>(null);
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const color = ref<string>("primary");

function abrir(value: string) {
  color.value = value;
  modal.value?.open();
}
</script>

<template>
  <VanillaDemo :use="['CuModal']">
    <div class="cu-demo-controls">
      <button v-for="c in colors" :key="c" type="button" @click="abrir(c)">{{ c }}</button>
    </div>

    <cu-modal ref="modal" :color="color" :title="`Color ${color}`">
      <p>El color tiñe el título y el acento de la cabecera.</p>
    </cu-modal>
  </VanillaDemo>
</template>
