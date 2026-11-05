<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- hover: abre con mouseenter y cierra con mouseleave -->
  <Popover hover :hover-delay="0">
    <template #toggle>
      <Button color="primary" variant="soft">hover (delay 0)</Button>
    </template>
    <p>Aparece al instante.</p>
  </Popover>

  <Popover hover :hover-delay="600">
    <template #toggle>
      <Button color="primary" variant="soft">hover (delay 600)</Button>
    </template>
    <p>Aparece tras 600 ms.</p>
  </Popover>
</template>
