<script setup lang="ts">
// `actions` como función por fila: se asigna como propiedad JS (no por atributo).
const columns = [
  { key: "producto", label: "Producto" },
  { key: "estado", label: "Estado" },
];

const data = [
  { producto: "Teclado mecánico", estado: "Activo", bloqueado: false },
  { producto: 'Monitor 27"', estado: "Pausado", bloqueado: false },
  { producto: "Mouse inalámbrico", estado: "Activo", bloqueado: true },
];

const actions = (row: any) => [
  { label: "Editar", color: "primary", variant: "ghost", onClick: (r: any) => console.log("Editar", r) },
  { label: "Publicar", hidden: (r: any) => r.estado === "Activo", color: "success", variant: "ghost", onClick: (r: any) => console.log("Publicar", r) },
  { divider: true },
  { label: "Eliminar", disabled: (r: any) => r.bloqueado, color: "danger", variant: "ghost", onClick: (r: any) => console.log("Eliminar", r) },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table
      color="primary"
      variant="soft"
      actions-label="Acciones"
      :columns="columns"
      :data="data"
      :actions="actions"
    ></cu-table>
  </VanillaDemo>
</template>
