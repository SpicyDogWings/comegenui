<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
]);
</script>

<template>
  <!-- empty: texto por defecto cuando data está vacío -->
  <Table :columns="columns" :data="[]" empty="No hay registros cargados" />
  <!-- #empty: reemplaza el contenido por defecto -->
  <Table :columns="columns" :data="[]">
    <template #empty>
      <strong>Sin resultados</strong> — probá con otro filtro.
    </template>
  </Table>
</template>
