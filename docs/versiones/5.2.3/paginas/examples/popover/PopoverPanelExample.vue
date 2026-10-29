<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- panelWidth, role y panelClass del panel -->
  <Popover panel-width="280px" role="dialog" :panel-class="['cu-popover-demo']">
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">panel ancho</Button>
    </template>
    <p>panelWidth="280px", role="dialog", panelClass="cu-popover-demo".</p>
  </Popover>
</template>
