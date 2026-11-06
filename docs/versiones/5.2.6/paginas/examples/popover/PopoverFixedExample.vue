<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- fixed: el panel se posiciona respecto del viewport y se recalcula en scroll/resize -->
  <Popover fixed position="bottom" align="start" :offset="8">
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">fixed</Button>
    </template>
    <p>position: fixed, reposicionado en scroll y resize.</p>
  </Popover>
</template>
