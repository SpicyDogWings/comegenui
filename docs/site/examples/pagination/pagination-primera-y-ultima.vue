<script setup lang="ts">
// Refleja el ejemplo "Primera y última": `show-first-and-last` agrega los saltos a 1 y al final.
import { onMounted, ref } from "vue";

const pagina = ref(10);
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
      :current-page="pagina"
      show-first-and-last
      :total-pages="20"
      :total-items="195"
      color="primary"
    ></cu-pagination>
    <p class="cu-demo-output">Página: {{ pagina }}</p>
  </VanillaDemo>
</template>
