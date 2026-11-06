<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": el FAB escucha el click nativo.
import { ref } from "vue";

const clicks = ref(0);
</script>

<template>
  <VanillaDemo :use="['CuFloatingButton']">
    <!-- El FAB es `position: fixed`; un ancestro con `transform` lo contiene dentro del demo. -->
    <div style="position: relative; height: 140px; transform: translateZ(0)">
      <cu-floating-button color="primary" @click="clicks++">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </cu-floating-button>
    </div>
    <p class="cu-demo-output">{{ clicks ? `FAB clickeado (${clicks})` : "(sin clicks todavía)" }}</p>
  </VanillaDemo>
</template>
