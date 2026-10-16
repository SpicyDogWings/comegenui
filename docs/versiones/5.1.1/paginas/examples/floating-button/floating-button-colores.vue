<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos del FAB.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuFloatingButton']">
    <div class="cu-demo-controls">
      <!-- El FAB es `position: fixed`; cada celda con `transform` lo contiene. -->
      <div
        v-for="color in colors"
        :key="color"
        style="position: relative; width: 88px; height: 88px; transform: translateZ(0)"
      >
        <cu-floating-button :color="color" variant="solid" size="sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </cu-floating-button>
      </div>
    </div>
  </VanillaDemo>
</template>
