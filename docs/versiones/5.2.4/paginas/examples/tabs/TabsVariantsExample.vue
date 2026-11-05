<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

const tabs = [
  { key: "uno", label: "Uno" },
  { key: "dos", label: "Dos" },
  { key: "tres", label: "Tres" },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="ghost" color="primary">
    <template #uno>Panel de la variante ghost.</template>
    <template #dos>Segundo panel.</template>
    <template #tres>Tercer panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="solid" color="primary">
    <template #uno>Panel de la variante solid.</template>
    <template #dos>Segundo panel.</template>
    <template #tres>Tercer panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="boxed" color="primary">
    <template #uno>Panel de la variante boxed.</template>
    <template #dos>Segundo panel.</template>
    <template #tres>Tercer panel.</template>
  </Tabs>

  <Tabs :tabs="tabs" variant="soft" color="primary">
    <template #uno>Panel de la variante soft.</template>
    <template #dos>Segundo panel.</template>
    <template #tres>Tercer panel.</template>
  </Tabs>
</template>
