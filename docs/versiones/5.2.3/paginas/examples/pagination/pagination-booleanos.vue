<script setup lang="ts">
// Refleja el ejemplo "Atributos booleanos en HTML".
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
      :current-page="pagina"
      show-page-size
      show-first-and-last
      :total-pages="5"
    ></cu-pagination>
    <p class="cu-demo-output">Página: {{ pagina }}</p>
  </VanillaDemo>
</template>
