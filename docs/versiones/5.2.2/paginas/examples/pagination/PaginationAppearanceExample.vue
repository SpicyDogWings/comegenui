<script setup lang="ts">
import Pagination from "@/components/controls/Pagination.vue";
</script>

<template>
  <Pagination color="primary" variant="soft" :total-pages="5" :total-items="45" />
  <Pagination color="success" variant="outlined" :total-pages="5" :total-items="45" />
  <Pagination color="warning" variant="ghost" :total-pages="5" :total-items="45" />
  <Pagination color="danger" variant="subtle" :total-pages="5" :total-items="45" />
  <Pagination color="neutral" variant="none" :total-pages="5" :total-items="45" />
</template>
