<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
</script>

<template>
  <Tooltip>
    <Button variant="outlined">Tooltip con HTML</Button>
    <!-- El slot #content tiene prioridad sobre la prop text. -->
    <template #content>
      <strong>Rich content</strong><br />
      <span>Con salto de línea y formato.</span>
    </template>
  </Tooltip>

  <Tooltip position="right" align="start">
    <Button color="primary" variant="soft">Sin prop text</Button>
    <template #content>
      <em>El contenido sale solo del slot.</em>
    </template>
  </Tooltip>
</template>
