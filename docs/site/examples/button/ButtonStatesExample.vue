<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";

const loading = ref(false);
const evento = ref("Sin eventos todavía.");

// El botón emite `loading-change` cada vez que cambia `loading`.
function onLoadingChange(value: boolean) {
  evento.value = `loading-change → ${value}`;
}

async function guardar() {
  if (loading.value) return;
  loading.value = true;
  // Reemplazá esto por tu llamada real (fetch, etc.).
  await new Promise((resolve) => setTimeout(resolve, 1800));
  loading.value = false;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button color="primary" variant="solid" :loading="loading" @click="guardar">
      {{ loading ? "Guardando…" : "Guardar (async)" }}
    </Button>
    <Button color="neutral" variant="outlined" disabled>Deshabilitado</Button>
    <Button color="danger" variant="soft" disabled>Eliminar</Button>
  </div>

  <div class="cu-demo-controls">
    <Button to="/componentes/vue/card" variant="link">Link interno (to)</Button>
    <Button to="https://example.com" target="_blank" variant="link">
      Link externo (target="_blank")
    </Button>
  </div>

  <p class="cu-demo-output">{{ evento }}</p>
</template>
