<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <!-- loading: muestra un spinner en lugar del contenido -->
  <Dropdown label="loading" color="primary" loading>
    <p>No se ve mientras carga.</p>
  </Dropdown>

  <!-- cooldown: muestra un loader de enfriamiento ; cooldownKey lo remonta -->
  <Dropdown label="cooldown (2s)" color="warning" cooldown :delay="2000" :cooldown-key="1">
    <p>El loader de cooldown dura 2 segundos.</p>
  </Dropdown>

  <Dropdown label="cooldown key 2" color="danger" cooldown :delay="3000" :cooldown-key="2">
    <p>Cambiar <code>cooldownKey</code> reinicia la animación.</p>
  </Dropdown>
</template>
