<script setup lang="ts">
// Refleja el ejemplo "Uso básico": columnas con edición, validación por regex,
// badges y botones por celda; búsqueda y paginación por atributo.
const columns = [
  { key: "nombre", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  {
    key: "rol",
    label: "Rol",
    badges: (row: any) => [
      { value: row.rol, color: row.rol === "Admin" ? "danger" : "primary", variant: "soft" },
    ],
  },
  {
    key: "acciones",
    label: "",
    buttons: (row: any) => [
      { label: "Editar", color: "primary", variant: "ghost", onClick: (r: any) => console.log("Editar", r) },
      { label: "Eliminar", color: "danger", variant: "ghost", onClick: (r: any) => console.log("Eliminar", r) },
    ],
  },
];

const data = [
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Admin" },
  { nombre: "María García", email: "maria@ejemplo.com", rol: "Usuario" },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table
      color="primary"
      variant="soft"
      search-enabled
      pagination
      items-per-page="5"
      :columns="columns"
      :data="data"
    ></cu-table>
  </VanillaDemo>
</template>
