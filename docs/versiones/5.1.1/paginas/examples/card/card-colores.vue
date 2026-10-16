<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante solid.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuCard']">
    <div class="cu-demo-controls">
      <cu-card v-for="color in colors" :key="color" :color="color" variant="solid" :title="color">
        Contenido de la tarjeta.
      </cu-card>
    </div>
  </VanillaDemo>
</template>
