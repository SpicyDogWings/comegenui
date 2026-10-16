<script setup lang="ts">
// Refleja el ejemplo "Navegación": `to` interno y `to` + `target` externo.
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <cu-button to="/componentes/cu-button" variant="link">Volver a esta página</cu-button>
    <cu-button to="https://developer.mozilla.org" target="_blank" variant="link">
      Sitio externo
    </cu-button>
  </VanillaDemo>
</template>
