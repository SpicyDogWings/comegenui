<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const options = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
  { value: "delta", label: "Delta" },
];
</script>

<template>
  <!-- Escribí con el select abierto: filtra y muestra el loader de cooldown. -->
  <Select
    :options="options"
    search-enabled
    search-mode="includes"
    :search-reset-delay="1500"
    cooldown-variant="soft"
    placeholder="Buscá por nombre"
  />
  <Select :options="options" :loading="true" placeholder="Cargando opciones…" />
</template>
