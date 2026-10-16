<script setup lang="ts">
// Refleja el ejemplo "Contenido e iconos": el icono es un `<svg>` inline del slot.
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <cu-button color="success" variant="soft">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Aceptar
    </cu-button>
  </VanillaDemo>
</template>
