<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <!-- `to` interno: se renderiza como <a href> con un <button> adentro. -->
  <Button to="/componentes/vue/card" variant="link">Ir a Card</Button>
  <!-- `to` externo: target sólo tiene efecto si hay `to`. -->
  <Button to="https://example.com" target="_blank" variant="link">
    Sitio externo
  </Button>
</template>
