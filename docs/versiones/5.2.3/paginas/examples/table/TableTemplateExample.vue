<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";
import Badge from "@/components/information/Badge.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
  { key: "estado", label: "Estado" },
]);

const data = ref([
  { producto: "Teclado mecánico", stock: 24, estado: "Activo" },
  { producto: 'Monitor 27"', stock: 6, estado: "Pausado" },
  { producto: "Mouse inalámbrico", stock: 41, estado: "Activo" },
]);
</script>

<template>
  <!-- #template reemplaza la fila completa; recibe { row, rowIndex, columns, getCellValue } -->
  <Table :columns="columns" :data="data">
    <template #template="{ row, columns }">
      <td v-for="col in columns" :key="col.key" class="cu-table-td">
        <Badge v-if="col.key === 'estado'" :color="row.estado === 'Activo' ? 'success' : 'warning'" variant="soft">
          {{ row.estado }}
        </Badge>
        <strong v-else-if="col.key === 'producto'">{{ row.producto }}</strong>
        <template v-else>{{ row[col.key] }}</template>
      </td>
    </template>
  </Table>
</template>