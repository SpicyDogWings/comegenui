<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Input from "@/components/form/Input.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "categoria", label: "Categoría" },
  { key: "stock", label: "Stock", align: "right" },
]);

const data = ref([
  { producto: "Teclado mecánico", categoria: "Periféricos", stock: 24 },
  { producto: "Monitor 27\"", categoria: "Pantallas", stock: 6 },
  { producto: "Mouse inalámbrico", categoria: "Periféricos", stock: 41 },
  { producto: "Webcam HD", categoria: "Video", stock: 12 },
]);
</script>

<template>
  <!-- El slot #search recibe { query, update }: reemplazá el input por defecto. -->
  <AdvancedTable :columns="columns" :data="data" search-enabled :search-fields="['producto']" :pagination="false">
    <template #search="{ query, update }">
      <Input
        :model-value="query"
        placeholder="Slot #search: buscá un producto…"
        @update:model-value="update"
      />
    </template>
  </AdvancedTable>
</template>
