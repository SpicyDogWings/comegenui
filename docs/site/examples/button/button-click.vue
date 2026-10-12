<script setup lang="ts">
// Refleja el ejemplo "Escuchar clicks": el evento nativo `click` del CE.
import { ref } from "vue";

const clicks = ref(0);
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <cu-button color="primary" variant="solid" @click="clicks++">Haz clic</cu-button>
    <p class="cu-demo-output">{{ clicks ? `¡Click! (${clicks})` : "(sin clicks todavía)" }}</p>
  </VanillaDemo>
</template>
