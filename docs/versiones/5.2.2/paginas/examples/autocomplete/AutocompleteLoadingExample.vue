<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Button from "@/components/buttons/Button.vue";

const ac = ref<InstanceType<typeof Autocomplete> | null>(null);
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const items = [
  { label: "María López" },
  { label: "Juan Pérez" },
  { label: "Ana Gómez" },
];

/** Simula una búsqueda: abre el panel con el spinner y, a los 2s, muestra los items. */
function cargar() {
  loading.value = true;
  ac.value?.open();
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    loading.value = false;
  }, 2000);
}

onMounted(() => {
  setTimeout(cargar, 400);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div style="display: flex; gap: var(--cu-space-sm); align-items: center; width: 100%">
    <Autocomplete
      ref="ac"
      :items="items"
      :loading="loading"
      placeholder="Buscá una persona (2s de carga)"
      style="flex: 1"
    />
    <Button @click="cargar">Volver a cargar</Button>
  </div>
</template>
