<script setup lang="ts">
// Refleja el ejemplo "Layout horizontal": la media va al costado del contenido.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const cover = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="300" height="300" fill="#0ea5e9"/>
    <circle cx="150" cy="150" r="70" fill="#ffffff" fill-opacity="0.25"/>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuCard']">
    <cu-card layout="horizontal" title="Perfil" subtitle="Información del usuario" :image="cover">
      Datos del perfil.
    </cu-card>
  </VanillaDemo>
</template>
