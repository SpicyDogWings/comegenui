<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- Slot toggle con scope: toggle() e isOpen -->
  <Popover>
    <template #toggle="{ toggle, isOpen }">
      <Button color="primary" variant="soft" @click="toggle">
        {{ isOpen ? "Cerrar" : "Abrir" }}
      </Button>
    </template>
    <!-- Slot default: contenido del panel -->
    <strong>Contenido rico</strong>
    <p>Con HTML y varios elementos.</p>
  </Popover>
</template>
