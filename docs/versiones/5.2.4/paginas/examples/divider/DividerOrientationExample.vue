<script setup lang="ts">
// Refleja el ejemplo "Orientación": horizontal a todo el ancho y dos verticales
// dentro de una fila con alto fijo (el vertical toma el alto del contenedor).
import Divider from "@/components/information/Divider.vue";
</script>

<template>
  <Divider orientation="horizontal" />

  <div style="display: flex; align-items: stretch; gap: 16px; height: 96px; padding: 0 8px">
    <span style="display: flex; align-items: center; color: var(--cu-color-neutral)">Izquierda</span>
    <Divider orientation="vertical" />
    <span style="display: flex; align-items: center; color: var(--cu-color-neutral)">Centro</span>
    <Divider orientation="vertical" />
    <span style="display: flex; align-items: center; color: var(--cu-color-neutral)">Derecha</span>
  </div>
</template>
