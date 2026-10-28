<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <!-- trigger "click" (default): abre al hacer clic en el toggle -->
  <Dropdown label="click" trigger="click" color="primary" variant="soft">
    <p>Se abre con un click.</p>
  </Dropdown>

  <!-- trigger "hover": abre al pasar el mouse (hoverDelay interno = 0) -->
  <Dropdown label="hover" trigger="hover" color="secondary" variant="soft">
    <p>Se abre al pasar el mouse y cierra al salir.</p>
  </Dropdown>

  <!-- disabled: no responde a click/hover -->
  <Dropdown label="disabled" disabled>
    <p>No se abre.</p>
  </Dropdown>
</template>
