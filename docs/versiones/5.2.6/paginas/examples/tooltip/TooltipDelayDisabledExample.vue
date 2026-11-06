<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
</script>

<template>
  <Tooltip text="Aparece casi al instante" :delay="0">
    <Button>delay 0</Button>
  </Tooltip>
  <Tooltip text="Aparece tras 1 segundo" :delay="1000">
    <Button>delay 1000</Button>
  </Tooltip>
  <!-- `disabled`: el tooltip no aparece al hacer hover -->
  <Tooltip text="No deberías verme" disabled>
    <Button variant="ghost">disabled</Button>
  </Tooltip>
</template>
