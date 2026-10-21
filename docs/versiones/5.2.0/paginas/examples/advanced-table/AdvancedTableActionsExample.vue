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
  { producto: "Teclado mecánico", categoria: "Periféricos", estado: "Activo", precio: 89.9, bloqueado: false },
  { producto: "Monitor 27\"", categoria: "Pantallas", estado: "Pausado", precio: 249.0, bloqueado: false },
  { producto: "Mouse inalámbrico", categoria: "Periféricos", estado: "Activo", precio: 34.5, bloqueado: true },
  { producto: "Webcam HD", categoria: "Video", estado: "Descontinuado", precio: 59.99, bloqueado: false },
  { producto: "Auriculares USB", categoria: "Audio", estado: "Activo", precio: 45.0, bloqueado: false },
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

// actions: función por fila → decide qué acciones ve cada fila.
//  • "Publicar" sólo aparece cuando la fila no está activa (`hidden`).
//  • "Eliminar" queda deshabilitado en las filas bloqueadas (`disabled`).
const actions = (row: any) => [
  {
    label: "Editar",
    color: "primary",
    variant: "ghost",
    onClick: (r: any) => log(`Acción: Editar ${r.producto}`),
  },
  {
    label: "Duplicar",
    color: "neutral",
    variant: "ghost",
    onClick: (r: any) => log(`Acción: Duplicar ${r.producto}`),
  },
  {
    label: "Publicar",
    hidden: (r: any) => r.estado === "Activo",
    color: "success",
    variant: "ghost",
    onClick: (r: any) => log(`Acción: Publicar ${r.producto}`),
  },
  { divider: true },
  {
    label: "Eliminar",
    disabled: (r: any) => r.bloqueado,
    color: "danger",
    variant: "ghost",
    onClick: (r: any) => log(`Acción: Eliminar ${r.producto}`),
  },
];
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="onlyActive">filters = { estado: "Activo" }</Button>
    <Button variant="ghost" @click="clearFilters">Sin filtros</Button>
  </div>
  <AdvancedTable
    :columns="columns"
    :data="data"
    :filters="filters"
    :actions="actions"
    actions-label="Acciones"
    :pagination="false"
  />
  <p class="cu-demo-output">
    Acciones condicionales: las filas «Activo» no muestran «Publicar» (<code>hidden</code>) y
    «Mouse inalámbrico» tiene «Eliminar» deshabilitado (<code>disabled</code>).
  </p>
  <pre class="cu-demo-output">{{ lastAction }}</pre>
</template>
