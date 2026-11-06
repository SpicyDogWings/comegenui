<script setup lang="ts">
// Refleja el ejemplo "Interacción": `update:currentPage` y `update:itemsPerPage`.
import { onMounted, ref } from "vue";

const pagina = ref(1);
const itemsPerPage = ref(10);
const log = ref("(cambiá de página o el tamaño)");
const paginacion = ref<HTMLElement | null>(null);

onMounted(() => {
  const p = paginacion.value;
  if (!p) return;
  p.addEventListener("update:currentPage", (e) => {
    pagina.value = (e as CustomEvent<number>).detail;
    log.value = `update:currentPage → ${pagina.value}`;
  });
  p.addEventListener("update:itemsPerPage", (e) => {
    itemsPerPage.value = (e as CustomEvent<number>).detail;
    log.value = `update:itemsPerPage → ${itemsPerPage.value}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination
      ref="paginacion"
      :current-page="pagina"
      :items-per-page="itemsPerPage"
      show-page-size
      :total-pages="10"
      :total-items="95"
      color="primary"
    ></cu-pagination>
    <p class="cu-demo-output">{{ log }}</p>
  </VanillaDemo>
</template>
