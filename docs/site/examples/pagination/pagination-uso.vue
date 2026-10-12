<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": escucha update:currentPage y
// update:itemsPerPage, y asigna pageSizeOptions como propiedad JS.
import { onMounted, ref } from "vue";

const pagina = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = [10, 25, 50, 100];
const log = ref("(cambiá de página o el tamaño)");
const paginacion = ref<HTMLElement | null>(null);

onMounted(() => {
  const p = paginacion.value;
  if (!p) return;
  p.addEventListener("update:currentPage", (e) => {
    pagina.value = (e as CustomEvent<number>).detail;
    log.value = `Página: ${pagina.value}`;
  });
  p.addEventListener("update:itemsPerPage", (e) => {
    itemsPerPage.value = (e as CustomEvent<number>).detail;
    log.value = `Items por página: ${itemsPerPage.value}`;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination
      ref="paginacion"
      id="paginacion"
      :current-page="pagina"
      :items-per-page="itemsPerPage"
      :total-pages="10"
      :total-items="100"
      color="primary"
      variant="soft"
      show-page-size
      :pageSizeOptions.prop="pageSizeOptions"
    ></cu-pagination>
    <p class="cu-demo-output">{{ log }}</p>
  </VanillaDemo>
</template>
