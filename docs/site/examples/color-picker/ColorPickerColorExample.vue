<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <ColorPicker v-for="color in colors" :key="color" :color="color" model-value="#3b82f6" />
  <ColorPicker color="neutral" model-value="#888888" disabled />
</template>
