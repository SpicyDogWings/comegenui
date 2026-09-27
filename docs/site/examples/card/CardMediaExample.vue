<script setup lang="ts">
import Card from "@/components/information/Card.vue";

// Imagen embebida (data URI) para que el demo no dependa de la red.
const cover = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">
    <rect width="480" height="240" fill="#6366f1"/>
    <circle cx="240" cy="120" r="56" fill="#ffffff" fill-opacity="0.25"/>
  </svg>`,
)}`;
</script>

<template>
  <Card
    color="primary"
    title="Proyecto Atlas"
    subtitle="Equipo de desarrollo"
    :image="cover"
  >
    La prop <code>image</code> renderiza la media arriba del cuerpo; el título y el
    subtítulo arman el header.
  </Card>
</template>
