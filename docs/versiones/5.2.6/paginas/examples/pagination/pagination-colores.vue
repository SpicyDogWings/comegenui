<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos, en la página 5 de 10 para
// que se vea el botón activo y los puntos suspensivos.
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="secondary"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="neutral"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="success"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="warning"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="danger"></cu-pagination>
  </VanillaDemo>
</template>
