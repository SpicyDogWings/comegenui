<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const columns = ref([
  { key: "producto", label: "Producto" },
  { key: "categoria", label: "Categoría" },
  {
    key: "estado",
    label: "Estado",
    badges: (row: any) => [
      {
        value: row.estado,
        color: row.estado === "Activo" ? "success" : row.estado === "Pausado" ? "warning" : "danger",
        variant: "soft",
      },
    ],
  },
  {
    key: "precio",
    label: "Precio (cell custom)",
    align: "right",
    cell: (row: any) => `$ ${row.precio.toFixed(2)}`,
  },
  {
    key: "acciones",
    label: "",
    buttons: (row: any) => [
      {
        label: "Ver",
        color: "primary",
        variant: "ghost",
        onClick: (r: any) => log(`Botón de celda: Ver ${r.producto}`),
      },
    ],
  },
]);

const data = ref([
  { producto: "Teclado mecánico", categoria: "Periféricos", estado: "Activo", precio: 89.9 },
  { producto: "Monitor 27\"", categoria: "Pantallas", estado: "Pausado", precio: 249.0 },
  { producto: "Mouse inalámbrico", categoria: "Periféricos", estado: "Activo", precio: 34.5 },
  { producto: "Webcam HD", categoria: "Video", estado: "Descontinuado", precio: 59.99 },
  { producto: "Auriculares USB", categoria: "Audio", estado: "Activo", precio: 45.0 },
]);

const filters = ref<Record<string, any>>({});
const lastAction = ref("—");

function log(message: string) {
  lastAction.value = message;
}
function onlyActive() {
  filters.value = { estado: "Activo" };
}
function clearFilters() {
  filters.value = {};
}

// actions: la tabla agrega al final una columna con un dropdown "...".
const actions = ref([
  {
    label: "Editar",
    color: "primary",
    variant: "ghost",
    onClick: (row: any) => log(`Acción: Editar ${row.producto}`),
  },
  {
    label: "Duplicar",
    color: "neutral",
    variant: "ghost",
    onClick: (row: any) => log(`Acción: Duplicar ${row.producto}`),
  },
  {
    label: "Eliminar",
    color: "danger",
    variant: "ghost",
    onClick: (row: any) => log(`Acción: Eliminar ${row.producto}`),
  },
]);
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="onlyActive">filters = { estado: "Activo" }</Button>
    <Button variant="ghost" @click="clearFilters">Sin filtros</Button>
  </div>
  <AdvancedTable :columns="columns" :data="data" :filters="filters" :actions="actions" :pagination="false" />
  <pre class="cu-demo-output">{{ lastAction }}</pre>
</template>
