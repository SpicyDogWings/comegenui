<script setup lang="ts">
// Refleja el ejemplo "Estados": `disabled` y `loading` (acá, con la acción simulada).
import { ref } from "vue";

const loading = ref(false);

async function guardar() {
  loading.value = true;
  // await fetch('/api/guardar', { method: 'POST' });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  loading.value = false;
}
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <div class="cu-demo-controls">
      <cu-button disabled>Deshabilitado</cu-button>
      <cu-button color="primary" variant="solid" :loading="loading" @click="guardar">
        Guardando…
      </cu-button>
    </div>
  </VanillaDemo>
</template>
