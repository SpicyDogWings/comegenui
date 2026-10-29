<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "cantidad", label: "Cantidad", align: "right" },
  { key: "precio", label: "Precio", align: "right" },
  { key: "subtotal", label: "Subtotal", align: "right" },
]);

const data = ref([
  { producto: "Widget A", cantidad: 2, precio: 250.0, subtotal: 500.0 },
  { producto: "Widget B", cantidad: 3, precio: 175.5, subtotal: 526.5 },
  { producto: "Widget C", cantidad: 1, precio: 320.0, subtotal: 320.0 },
]);

const total = data.value.reduce((sum, row) => sum + row.subtotal, 0);

// footer como prop (FooterRow[]): filas programáticas.
const footer = ref([
  {
    cells: [
      { value: "Total", colspan: 1 },
      { value: `$ ${total.toFixed(2)}`, colspan: 3, align: "right" },
    ],
  },
  {
    cells: [{ value: "* Precios sin IVA", colspan: 4 }],
  },
]);
</script>

<template>
  <AdvancedTable :columns="columns" :data="data" :footer="footer" :pagination="false" />
  <!-- El slot #footer tiene prioridad sobre la prop footer. -->
  <AdvancedTable :columns="columns" :data="data" :pagination="false">
    <template #footer="{ columns }">
      <tr>
        <td :colspan="columns.length">Total desde el slot #footer: $ 1346.50</td>
      </tr>
    </template>
  </AdvancedTable>
</template>
