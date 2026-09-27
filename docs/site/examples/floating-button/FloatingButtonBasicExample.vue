<script setup lang="ts">
import FloatingButton from "@/components/buttons/FloatingButton.vue";
</script>

<template>
  <!-- El FAB es `position: fixed`: se ve en la esquina inferior derecha.
       Este contenedor relativo lo mantiene dentro del demo. -->
  <div style="position: relative; height: 120px; width: 100%">
    <FloatingButton style="position: absolute; bottom: 16px; right: 16px">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </FloatingButton>
  </div>
</template>
