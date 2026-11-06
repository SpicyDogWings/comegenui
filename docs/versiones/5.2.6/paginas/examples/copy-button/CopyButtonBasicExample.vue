<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
</script>

<template>
  <CopyButton text="Contenido copiado al portapapeles" label="Copiar" />
  <CopyButton text="https://ejemplo.com" label="Copiar URL" color="primary" variant="solid" />
</template>
