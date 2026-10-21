<script setup lang="ts">
// Refleja el ejemplo "Colores": los seis nombres semánticos.
import Divider from "@/components/information/Divider.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <Divider v-for="color in colors" :key="color" :color="color" :label="color" />
</template>
