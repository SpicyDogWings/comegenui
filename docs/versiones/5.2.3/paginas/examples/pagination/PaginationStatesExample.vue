<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
</script>

<template>
  <!-- totalPages = 1 y sin showPageSize: no renderiza nada -->
  <Pagination :total-pages="1" :total-items="4" />
  <!-- Una sola página: sólo se ve con showPageSize activo -->
  <Pagination :total-pages="1" :total-items="4" show-page-size />
</template>
