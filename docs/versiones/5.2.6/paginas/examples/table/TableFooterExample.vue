<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "cantidad", label: "Cantidad", align: "right" },
  { key: "subtotal", label: "Subtotal", align: "right" },
]);

const data = ref([
  { producto: "Widget A", cantidad: 2, subtotal: 500.0 },
  { producto: "Widget B", cantidad: 3, subtotal: 526.5 },
]);

// footer como prop (FooterRow[])
const footer = ref([
  {
    cells: [
      { value: "Total", colspan: 1 },
      { value: "$ 1026.50", colspan: 2, align: "right" },
    ],
  },
]);
</script>

<template>
  <Table :columns="columns" :data="data" :footer="footer" />
  <!-- El slot #footer tiene prioridad sobre la prop footer -->
  <Table :columns="columns" :data="data">
    <template #footer="{ columns }">
      <tr>
        <td :colspan="columns.length">Total desde el slot #footer: $ 1026.50</td>
      </tr>
    </template>
  </Table>
</template>
