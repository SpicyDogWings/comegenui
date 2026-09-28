<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
</script>

<template>
  <Tooltip text="Guardar cambios">
    <Button color="primary" variant="soft">Guardar</Button>
  </Tooltip>

  <Tooltip text="Eliminar definitivamente" color="danger">
    <Button color="danger" variant="outlined">Eliminar</Button>
  </Tooltip>
</template>
