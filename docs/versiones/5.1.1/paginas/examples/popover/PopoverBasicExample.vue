<script setup lang="ts">
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Popover>
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">Abrir popover</Button>
    </template>
    <p>Contenido del panel. Click afuera o Escape para cerrar.</p>
  </Popover>

  <Popover disabled>
    <template #toggle>
      <Button color="neutral" variant="outlined" disabled>Deshabilitado</Button>
    </template>
    <p>No debería abrirse.</p>
  </Popover>
</template>
