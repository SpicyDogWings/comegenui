<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

const tabsConDeshabilitada = [
  { key: "a", label: "Habilitada" },
  { key: "b", label: "Deshabilitada", disabled: true },
  { key: "c", label: "Habilitada" },
];

const tabs = [
  { key: "a", label: "Una" },
  { key: "b", label: "Otra" },
];
</script>

<template>
  <Tabs :tabs="tabsConDeshabilitada" variant="ghost" color="primary">
    <template #a>Tab activa.</template>
    <template #b>No se puede seleccionar.</template>
    <template #c>Otra tab activa.</template>
  </Tabs>

  <!-- `disabled` global: deshabilita todo el grupo -->
  <Tabs :tabs="tabs" variant="soft" color="primary" disabled>
    <template #a>Grupo deshabilitado.</template>
    <template #b>Grupo deshabilitado.</template>
  </Tabs>
</template>
