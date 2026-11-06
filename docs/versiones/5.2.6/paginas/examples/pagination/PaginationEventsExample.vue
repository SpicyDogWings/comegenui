<script setup lang="ts">
import { ref } from "vue";
import Pagination from "@/components/controls/Pagination.vue";

const pagina = ref(1);
const porPagina = ref(10);
const log = ref("(cambiá de página o el tamaño)");

function onUpdatePage(value: number) {
  pagina.value = value;
  log.value = `update:currentPage → ${value}`;
}

function onUpdateItemsPerPage(value: number) {
  porPagina.value = value;
  log.value = `update:itemsPerPage → ${value}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Pagination
      :current-page="pagina"
      :items-per-page="porPagina"
      show-page-size
      :total-pages="10"
      :total-items="95"
      color="primary"
      @update:current-page="onUpdatePage"
      @update:items-per-page="onUpdateItemsPerPage"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
