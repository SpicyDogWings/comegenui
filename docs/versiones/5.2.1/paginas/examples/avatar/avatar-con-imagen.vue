<script setup lang="ts">
// Refleja el ejemplo "Con imagen": `src` reemplaza a las iniciales.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#6366f1"/>
    <circle cx="48" cy="38" r="18" fill="white" fill-opacity="0.9"/>
    <ellipse cx="48" cy="86" rx="30" ry="26" fill="white" fill-opacity="0.9"/>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuAvatar']">
    <div class="cu-demo-controls">
      <cu-avatar :src="photo" size="sm"></cu-avatar>
      <cu-avatar :src="photo" size="md"></cu-avatar>
      <cu-avatar :src="photo" size="lg"></cu-avatar>
    </div>
  </VanillaDemo>
</template>
