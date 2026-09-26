<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- No hay slots con nombre: los íconos van como SVG inline dentro del slot default. -->
  <Button color="success" variant="soft">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      style="vertical-align: middle"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
    Aceptar
  </Button>

  <Button color="primary" variant="solid">
    Guardar
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      style="vertical-align: middle"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </Button>
</template>
