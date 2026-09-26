<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";

const loading = ref(false);

async function guardar() {
  loading.value = true;
  try {
    // Reemplazá esto por tu llamada real (fetch, etc.).
    await new Promise((resolve) => setTimeout(resolve, 1500));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Button color="primary" variant="solid" :loading="loading" @click="guardar">
    {{ loading ? "Guardando…" : "Guardar" }}
  </Button>
</template>
