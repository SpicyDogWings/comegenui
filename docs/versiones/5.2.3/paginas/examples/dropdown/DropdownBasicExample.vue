<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <Dropdown label="Opciones" color="primary" variant="soft">
    <p>El slot <code>default</code> es el contenido del panel.</p>
    <p>El toggle por defecto es un botón con <code>label</code>.</p>
  </Dropdown>
</template>
