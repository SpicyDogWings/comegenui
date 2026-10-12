<script setup lang="ts">
// Refleja el ejemplo "Escuchar eventos": el evento `toggle` trae el estado en `e.detail`.
import { ref } from "vue";

const log = ref("(abrí y cerrá el collapse)");

function onToggle(e: Event) {
  log.value = `toggle → ${(e as CustomEvent).detail}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse id="miCollapse" label="Escuchá el toggle" color="primary" @toggle="onToggle">
      <p>El estado se registra abajo.</p>
    </cu-collapse>
    <p class="cu-demo-output">{{ log }}</p>
  </VanillaDemo>
</template>
