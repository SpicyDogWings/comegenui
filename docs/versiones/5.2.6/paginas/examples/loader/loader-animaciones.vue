<script setup lang="ts">
// Refleja "Animaciones": loading vs cooldown. `cooldown` se agota una vez;
// para repetirlo se remonta el custom element con otra `key`.
import { ref } from "vue";

const run = ref(0);

function repetir() {
  run.value++;
}
</script>

<template>
  <VanillaDemo :use="['CuLoader', 'CuButton']">
    <div class="cu-demo-controls">
      <code style="min-width: 120px">animation="loading"</code>
      <div style="position: relative; flex: 1; height: 12px">
        <cu-loader animation="loading" color="primary"></cu-loader>
      </div>
    </div>

    <div class="cu-demo-controls">
      <code style="min-width: 120px">animation="cooldown"</code>
      <div style="position: relative; flex: 1; height: 12px">
        <cu-loader :key="run" animation="cooldown" delay="3000" color="success"></cu-loader>
      </div>
      <cu-button size="sm" variant="outlined" @click="repetir">Repetir</cu-button>
    </div>
  </VanillaDemo>
</template>
