<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": tooltip sobre un botón.
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuTooltip']">
    <cu-tooltip text="Guardar cambios" color="primary">
      <cu-button color="primary" variant="soft">Guardar</cu-button>
    </cu-tooltip>
  </VanillaDemo>
</template>
