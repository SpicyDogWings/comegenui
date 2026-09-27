<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/data/Table.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "center" },
  { key: "estado", label: "Estado" },
]);

// Con htmlCells=true el contenido de cada celda se interpreta como HTML.
const data = ref([
  {
    producto: "<strong>Teclado</strong> <em>mecánico</em>",
    stock: "<span style=\"color: var(--cu-color-success)\">24</span>",
    estado: '<span style="color: var(--cu-color-success)">● Activo</span>',
  },
  {
    producto: "<strong>Monitor</strong> 27&quot;",
    stock: "<span style=\"color: var(--cu-color-warning)\">6</span>",
    estado: '<span style="color: var(--cu-color-warning)">● Pausado</span>',
  },
  {
    producto: "<strong>Mouse</strong> inalámbrico",
    stock: "<span style=\"color: var(--cu-color-danger)\">0</span>",
    estado: '<span style="color: var(--cu-color-danger)">● Sin stock</span>',
  },
]);
</script>

<template>
  <!-- htmlCells: el valor de la celda se renderiza como HTML -->
  <Table :columns="columns" :data="data" html-cells />
  <!-- Sin htmlCells el mismo dato se muestra escapado -->
  <Table :columns="columns" :data="data" />
</template>
