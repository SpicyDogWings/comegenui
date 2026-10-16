<script setup lang="ts">
// Refleja el ejemplo "Tamaño de página": `show-page-size`, `items-per-page` y
// `page-size-options` (array → se asigna como propiedad).
import { onMounted, ref } from "vue";

const pagina = ref(1);
const itemsPerPage = ref(20);
const pageSizeOptions = [10, 20, 50, 100];
const paginacion = ref<HTMLElement | null>(null);

onMounted(() => {
  const p = paginacion.value;
  if (!p) return;
  p.addEventListener("update:currentPage", (e) => {
    pagina.value = (e as CustomEvent<number>).detail;
  });
  p.addEventListener("update:itemsPerPage", (e) => {
    itemsPerPage.value = (e as CustomEvent<number>).detail;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination
      ref="paginacion"
      :current-page="pagina"
      :items-per-page="itemsPerPage"
      :page-size-options.prop="pageSizeOptions"
      show-page-size
      :total-pages="10"
      :total-items="195"
      color="primary"
    ></cu-pagination>
    <p class="cu-demo-output">Página: {{ pagina }} · por página: {{ itemsPerPage }}</p>
  </VanillaDemo>
</template>
