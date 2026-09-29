<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";
</script>

<template>
  <ColorPicker color="primary" model-value="#22c55e" />
  <ColorPicker color="danger" model-value="#ef4444" />
  <ColorPicker color="neutral" model-value="#888888" disabled />
</template>
