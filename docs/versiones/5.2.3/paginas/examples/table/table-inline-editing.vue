<script setup lang="ts">
// Refleja el ejemplo "Columna siempre editable en HTML plano": `inlineEdit` por
// columna (nombre y rol siempre visibles; email en modo lápiz).
const columns = [
  { key: "nombre", label: "Nombre", editable: true, inlineEdit: true },
  { key: "email", label: "Correo", editable: true },
  {
    key: "rol",
    label: "Rol",
    editable: true,
    inlineEdit: true,
    inputType: "select",
    selectOptions: [
      { value: "admin", label: "Administrador" },
      { value: "editor", label: "Editor" },
    ],
  },
];

const data = [
  { nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "admin" },
  { nombre: "María García", email: "maria@ejemplo.com", rol: "editor" },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table :columns="columns" :data="data"></cu-table>
  </VanillaDemo>
</template>
