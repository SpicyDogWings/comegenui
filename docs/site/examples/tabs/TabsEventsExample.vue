<script setup lang="ts">
import { ref } from "vue";
import Tabs from "@/components/Tabs.vue";

const active = ref("general");
const salida = ref("Elegí una pestaña…");

const tabs = [
  { key: "general", label: "General" },
  { key: "avanzado", label: "Avanzado" },
  { key: "peligro", label: "Peligro" },
];

function onChange(key: string) {
  salida.value = `@change → "${key}"  (v-model: "${active.value}")`;
}
</script>

<template>
  <Tabs v-model="active" :tabs="tabs" variant="soft" color="primary" @change="onChange">
    <template #general>Configuración general.</template>
    <template #avanzado>Opciones avanzadas.</template>
    <template #peligro>Zona de riesgo.</template>
  </Tabs>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
