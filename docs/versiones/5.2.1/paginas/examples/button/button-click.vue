<script setup lang="ts">
// Refleja el ejemplo "Eventos": el `click` (del DOM) y `loading-change` (propio).
// Ojo: en el marcado de un custom element el payload llega en `e.detail`, no como primer
// argumento (eso es sólo para emits de componentes Vue).
import { ref } from "vue";

const clicks = ref(0);
const loading = ref(false);
const ultimoCambio = ref<boolean | null>(null);

async function onClick() {
  clicks.value += 1;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  loading.value = false;
}
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <cu-button
      color="primary"
      variant="solid"
      :loading="loading"
      @click="onClick"
      @loading-change="(e: CustomEvent) => (ultimoCambio = e.detail)"
    >
      Haz clic
    </cu-button>
    <p class="cu-demo-output">
      clicks: {{ clicks }} · loading-change: {{ ultimoCambio ?? "—" }}
    </p>
  </VanillaDemo>
</template>
