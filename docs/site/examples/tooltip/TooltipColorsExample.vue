<script setup lang="ts">
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Tooltip text="primary" color="primary">
    <Button variant="outlined">primary</Button>
  </Tooltip>
  <Tooltip text="success" color="success">
    <Button variant="outlined">success</Button>
  </Tooltip>
  <Tooltip text="warning" color="warning">
    <Button variant="outlined">warning</Button>
  </Tooltip>
  <Tooltip text="danger" color="danger">
    <Button variant="outlined">danger</Button>
  </Tooltip>
  <Tooltip text="neutral" color="neutral">
    <Button variant="outlined">neutral</Button>
  </Tooltip>
</template>
