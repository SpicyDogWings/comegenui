<script setup lang="ts">
import { ref } from "vue";
import Pagination from "@/components/controls/Pagination.vue";

const porPagina = ref(20);
</script>

<template>
  <div class="cu-demo-controls">
    <Pagination
      v-model:items-per-page="porPagina"
      show-page-size
      :page-size-options="[10, 20, 50, 100]"
      :current-page="1"
      :total-pages="10"
      :total-items="195"
      color="primary"
    />
  </div>
  <p class="cu-demo-output">itemsPerPage: {{ porPagina }}</p>
</template>
