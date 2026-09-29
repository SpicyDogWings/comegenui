<script setup lang="ts">
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Tooltip text="Arriba" position="top" align="center" :offset="6">
    <Button variant="outlined">top</Button>
  </Tooltip>
  <Tooltip text="Abajo" position="bottom" align="center">
    <Button variant="outlined">bottom</Button>
  </Tooltip>
  <Tooltip text="Izquierda" position="left" align="start">
    <Button variant="outlined">left</Button>
  </Tooltip>
  <Tooltip text="Derecha" position="right" align="end">
    <Button variant="outlined">right</Button>
  </Tooltip>
</template>
