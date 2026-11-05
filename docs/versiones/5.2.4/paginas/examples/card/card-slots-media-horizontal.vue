<script setup lang="ts">
// Refleja el ejemplo "Layout horizontal" con el slot `media`: el slot pisa a `image`
// y la media va al costado, también en el custom element.
// Imagen embebida (data URI) para que el demo no dependa de la red.
const avatar = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="300" height="300" fill="#6366f1"/>
    <circle cx="150" cy="130" r="56" fill="#ffffff" fill-opacity="0.3"/>
    <rect x="60" y="210" width="180" height="18" rx="9" fill="#ffffff" fill-opacity="0.3"/>
  </svg>`,
)}`;
</script>

<template>
  <VanillaDemo :use="['CuCard', 'CuBadge']">
    <cu-card layout="horizontal" color="primary" variant="outlined">
      <div slot="media">
        <img :src="avatar" alt="Perfil" style="width:100%;height:100%;display:block;object-fit:cover" />
      </div>
      <h3 style="margin:0">Título custom</h3>
      <p style="margin:0">El slot <code>media</code> reemplaza a <code>image</code>.</p>
      <div slot="footer">
        <cu-badge color="success" variant="solid">Activo</cu-badge>
      </div>
    </cu-card>
  </VanillaDemo>
</template>
