<script setup lang="ts">
import { ref } from "vue";
import Pagination from "@/components/controls/Pagination.vue";

const pagina = ref(2);
const porPagina = ref(10);
</script>

<template>
  <div class="cu-demo-controls">
    <Pagination
      v-model:current-page="pagina"
      v-model:items-per-page="porPagina"
      show-page-size
      :total-pages="10"
      :total-items="95"
      color="primary"
    />
  </div>
  <p class="cu-demo-output">
    currentPage: {{ pagina }} · itemsPerPage: {{ porPagina }}
  </p>
</template>
