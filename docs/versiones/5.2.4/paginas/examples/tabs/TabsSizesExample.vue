<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

const tabs = [
  { key: "a", label: "Chico" },
  { key: "b", label: "sm" },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="solid" size="sm">
    <template #a>Tamaño sm.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" size="md">
    <template #a>Tamaño md (default).</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" size="lg">
    <template #a>Tamaño lg.</template>
    <template #b>Segundo panel.</template>
  </Tabs>
</template>
