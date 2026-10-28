<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": las props de datos (`current-page`,
// `total-pages`, `total-items`) y el listener que mantiene la página.
import { onMounted, ref } from "vue";

const pagina = ref(1);
const paginacion = ref<HTMLElement | null>(null);

onMounted(() => {
  paginacion.value?.addEventListener("update:currentPage", (e) => {
    pagina.value = (e as CustomEvent<number>).detail;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuPagination']">
    <cu-pagination
      ref="paginacion"
      id="paginacion"
      :current-page="pagina"
      :total-pages="10"
      :total-items="100"
      color="primary"
      variant="soft"
    ></cu-pagination>
    <p class="cu-demo-output">Página: {{ pagina }} de 10</p>
  </VanillaDemo>
</template>
