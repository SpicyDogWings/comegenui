<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 5 variantes de botón.
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="outlined"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="soft"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="ghost"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="subtle"></cu-pagination>
    <cu-pagination :current-page="5" :total-pages="10" :total-items="95" color="primary" variant="none"></cu-pagination>
  </VanillaDemo>
</template>
