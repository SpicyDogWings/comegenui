<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano" de la ficha: `items` va como array y
// se escucha el evento `select`.
import { ref } from "vue";

const seleccionado = ref("");

const items = [
  { label: "Administrador" },
  { label: "Editor de contenido" },
  { label: "Visor de reportes" },
  { label: "Invitado externo" },
  { label: "Supervisor" },
  { label: "Analista de datos" },
  { label: "Gestor de usuarios" },
];

function onSelect(e: Event) {
  const item = (e as CustomEvent).detail;
  if (item) seleccionado.value = item.label ?? String(item);
}
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      placeholder="Buscá un rol..."
      color="primary"
      :items.prop="items"
      @select="onSelect"
    ></cu-autocomplete>
    <p class="cu-demo-output">Seleccionado: {{ seleccionado || "(ninguno)" }}</p>
  </VanillaDemo>
</template>
