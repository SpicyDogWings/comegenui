<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Button size="sm">Chico</Button>
  <Button size="md">Medio (default)</Button>
  <Button size="lg">Grande</Button>
  <!-- En `link` el padding queda fijo en 0: `size` no lo cambia. -->
  <Button variant="link" size="lg">Link (size ignorado)</Button>
</template>
