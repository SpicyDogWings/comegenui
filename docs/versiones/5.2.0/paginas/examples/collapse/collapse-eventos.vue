<script setup lang="ts">
// Refleja el ejemplo "Escuchar eventos": `toggle` trae el estado en `e.detail`,
// y `open`/`close` identifican la acción que ocurrió.
import { ref } from "vue";

const log = ref("(abrí y cerrá el collapse)");

function onToggle(e: Event) {
  log.value = `toggle → ${(e as CustomEvent).detail}`;
}

function onOpen() {
  log.value = "open → se abrió";
}

function onClose() {
  log.value = "close → se cerró";
}
</script>

<template>
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse
      id="miCollapse"
      label="Escuchá los eventos"
      color="primary"
      @toggle="onToggle"
      @open="onOpen"
      @close="onClose"
    >
      <p>La acción se registra abajo.</p>
    </cu-collapse>
    <p class="cu-demo-output">{{ log }}</p>
  </VanillaDemo>
</template>
