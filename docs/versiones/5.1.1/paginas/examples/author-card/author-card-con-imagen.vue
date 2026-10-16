<script setup lang="ts">
// Refleja el ejemplo "Con imagen": `src` reemplaza las iniciales del avatar.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#0ea5e9"/>
    <text x="48" y="60" font-family="sans-serif" font-size="34" fill="white" text-anchor="middle">LG</text>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuAuthorCard']">
    <cu-author-card name="Laura Gómez" role="Diseñadora" :src="photo"></cu-author-card>
  </VanillaDemo>
</template>
