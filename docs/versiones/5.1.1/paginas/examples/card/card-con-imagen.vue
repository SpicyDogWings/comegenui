<script setup lang="ts">
// Refleja el ejemplo "Con imagen": `image` renderiza la media arriba del cuerpo.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const cover = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">
    <rect width="480" height="240" fill="#22c55e"/>
    <circle cx="240" cy="120" r="56" fill="#ffffff" fill-opacity="0.25"/>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuCard']">
    <cu-card
      title="Proyecto"
      subtitle="Equipo de desarrollo"
      :image="cover"
      color="success"
    >
      Descripción del proyecto.
    </cu-card>
  </VanillaDemo>
</template>
