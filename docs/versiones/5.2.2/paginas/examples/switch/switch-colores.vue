<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos, encendidos para que se
// vea el color del track (el color sólo se ve con el switch prendido).
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuSwitch']">
    <div class="cu-demo-controls">
      <cu-switch
        v-for="color in colors"
        :key="color"
        :color="color"
        :label="color"
        :model-value="true"
      ></cu-switch>
    </div>
  </VanillaDemo>
</template>
