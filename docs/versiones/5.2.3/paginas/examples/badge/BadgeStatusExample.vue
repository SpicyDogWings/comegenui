<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <div class="cu-demo-controls">
    <Badge color="success" variant="soft">Activo</Badge>
    <Badge color="warning" variant="soft">Pendiente</Badge>
    <Badge color="danger" variant="solid">Caído</Badge>
    <Badge color="primary" variant="outlined">Nuevo</Badge>
    <Badge color="secondary" variant="subtle">Beta</Badge>
    <Badge color="neutral" variant="ghost">12 sin leer</Badge>
  </div>
</template>
