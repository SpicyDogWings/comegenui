<script setup lang="ts">
// Refleja el ejemplo "Ejemplo con todos los controles".
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
      :current-page="pagina"
      :items-per-page="itemsPerPage"
      :total-pages="20"
      :total-items="195"
      show-page-size
      show-first-and-last
      color="primary"
      variant="outlined"
    ></cu-pagination>
    <p class="cu-demo-output">{{ log }}</p>
  </VanillaDemo>
</template>
