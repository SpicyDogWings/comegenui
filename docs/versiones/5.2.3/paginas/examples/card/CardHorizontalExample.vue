<script setup lang="ts">
import Card from "@/components/information/Card.vue";

const cover = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="300" height="300" fill="#0ea5e9"/>
    <circle cx="150" cy="150" r="70" fill="#ffffff" fill-opacity="0.25"/>
  </svg>`,
)}`;
</script>

<template>
  <Card
    layout="horizontal"
    color="secondary"
    title="Perfil"
    subtitle="Información del usuario"
    :image="cover"
  >
    Con <code>layout="horizontal"</code> la media va al costado y el contenido a la derecha.
  </Card>
</template>
