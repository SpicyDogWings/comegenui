<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

const tabs = [
  { key: "a", label: "Colores" },
  { key: "b", label: "Semánticos" },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="solid" color="primary">
    <template #a>Color primary.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="secondary">
    <template #a>Color secondary.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="success">
    <template #a>Color success.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="warning">
    <template #a>Color warning.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="danger">
    <template #a>Color danger.</template>
    <template #b>Segundo panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="neutral">
    <template #a>Color neutral.</template>
    <template #b>Segundo panel.</template>
  </Tabs>
</template>
