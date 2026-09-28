<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const allDisabled = ref(false);
// rowDisabled acepta boolean (todas) o función (por fila).
const rowDisabled = ref<boolean | ((row: any) => boolean)>((row: any) => row.stock === 0);

const columns = ref([
  { key: "producto", label: "Producto", editable: true, singleClick: true },
  { key: "stock", label: "Stock", align: "right" },
  { key: "estado", label: "Estado" },
]);

const data = ref([
  { producto: "Teclado", stock: 12, estado: "Disponible" },
  { producto: "Monitor", stock: 0, estado: "Sin stock" },
  { producto: "Mouse", stock: 8, estado: "Disponible" },
  { producto: "Webcam", stock: 0, estado: "Sin stock" },
]);

function toggleAll() {
  allDisabled.value = !allDisabled.value;
  rowDisabled.value = allDisabled.value ? true : (row: any) => row.stock === 0;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="toggleAll">
      {{ allDisabled ? "rowDisabled = función (sin stock)" : "rowDisabled = true (todas)" }}
    </Button>
  </div>
  <AdvancedTable :columns="columns" :data="data" :row-disabled="rowDisabled" :pagination="false" />
</template>
