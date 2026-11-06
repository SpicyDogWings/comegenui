<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
]);
</script>

<template>
  <!-- empty: texto que se muestra cuando data está vacío -->
  <AdvancedTable :columns="columns" :data="[]" empty="No hay registros cargados" :pagination="false" />
</template>
