<script setup lang="ts">
// Refleja el ejemplo "Ejemplo completo": mostrar/ocultar la alerta (la doc lo
// hace con botones nativos y la propiedad `show`).
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <div class="cu-demo-controls">
      <button type="button" @click="show = true">Mostrar alerta</button>
      <button type="button" @click="show = false">Ocultar alerta</button>
    </div>
    <cu-alert color="warning" title="Atención" close :show="show">
      Este es un mensaje de advertencia.
    </cu-alert>
  </VanillaDemo>
</template>
