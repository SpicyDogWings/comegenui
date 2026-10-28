<script setup lang="ts">
import { ref } from "vue";
import Pagination from "@/components/controls/Pagination.vue";

const pagina = ref(10);
</script>

<template>
  <div class="cu-demo-controls">
    <Pagination
      v-model:current-page="pagina"
      show-first-and-last
      :total-pages="20"
      :total-items="195"
      color="primary"
    />
  </div>
  <p class="cu-demo-output">currentPage: {{ pagina }}</p>
</template>
