<script setup lang="ts">
// Refleja el ejemplo de slot "header-rol": personaliza el encabezado de la
// columna `rol` desde el light DOM.
const columns = [
  { key: "producto", label: "Producto" },
  { key: "rol", label: "Rol" },
];

const data = [
  { producto: "Teclado", rol: "Admin" },
  { producto: "Monitor", rol: "Usuario" },
];
</script>

<template>
  <VanillaDemo :use="['CuTable']">
    <cu-table :columns="columns" :data="data">
      <span slot="header-rol" style="color: var(--primary)">ROL</span>
    </cu-table>
  </VanillaDemo>
</template>
