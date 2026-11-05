<script setup lang="ts">
// Refleja el ejemplo "Slots custom": `media`, contenido por defecto y `footer`.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const banner = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160">
    <rect width="480" height="160" fill="#14b8a6"/>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuCard', 'CuBadge']">
    <cu-card color="neutral">
      <div slot="media">
        <img :src="banner" alt="Banner" style="width:100%;display:block" />
      </div>
      <h3 style="margin:0">Título custom</h3>
      <p style="margin:0">Contenido.</p>
      <div slot="footer">
        <cu-badge color="success" variant="solid">Activo</cu-badge>
      </div>
    </cu-card>
  </VanillaDemo>
</template>
