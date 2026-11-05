<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Badge from "@/components/information/Badge.vue";

const cover = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160">
    <rect width="480" height="160" fill="#14b8a6"/>
  </svg>`,
)}`;
</script>

<template>
  <Card color="neutral" variant="outlined">
    <!-- `media` reemplaza a la prop `image`. -->
    <template #media>
      <img :src="cover" alt="" style="display: block; width: 100%" />
    </template>

    <!-- `header` reemplaza al título/subtítulo automáticos. -->
    <template #header>
      <h3 style="margin: 0">Header por slot</h3>
      <p style="margin: 0; opacity: 0.75">Reemplaza a title + subtitle</p>
    </template>

    Contenido del slot <strong>default</strong>.

    <!-- `footer` sólo se renderiza si tiene contenido. -->
    <template #footer>
      <Badge color="success" variant="solid">Activo</Badge>
      <Badge color="neutral" variant="subtle">v2.0</Badge>
    </template>
  </Card>
</template>
