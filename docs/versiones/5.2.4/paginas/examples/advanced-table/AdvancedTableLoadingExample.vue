<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const loading = ref(false);

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "precio", label: "Precio", align: "right" },
]);

const data = ref([
  { producto: "Teclado mecánico", stock: 24, precio: 89.9 },
  { producto: "Monitor 27\"", stock: 6, precio: 249.0 },
  { producto: "Mouse inalámbrico", stock: 41, precio: 34.5 },
]);
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="loading = !loading">
      {{ loading ? "loading = false" : "loading = true" }}
    </Button>
  </div>
  <AdvancedTable :columns="columns" :data="data" :loading="loading" :pagination="false" />
</template>
