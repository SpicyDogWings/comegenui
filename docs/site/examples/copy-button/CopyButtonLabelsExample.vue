<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
</script>

<template>
  <CopyButton text="Solo ícono" />
  <CopyButton text="Con label" label="Copiar código" />
  <CopyButton text="Personalizado" label="Copiar" copied-label="¡Listo!" color="success" variant="solid" />
</template>
