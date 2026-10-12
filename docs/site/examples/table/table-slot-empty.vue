<script setup lang="ts">
// Refleja el ejemplo de slot "empty": contenido propio cuando no hay datos
// (incluye un `<cu-button>` real, por eso también se carga ese bundle).
const columns = [
  { key: "producto", label: "Producto" },
  { key: "stock", label: "Stock", align: "right" },
];
</script>

<template>
  <VanillaDemo :use="['CuTable', 'CuButton']">
    <cu-table :columns="columns" :data="[]">
      <div slot="empty" style="padding: 24px; text-align: center;">
        <p>No hay datos para mostrar.</p>
        <cu-button color="primary" variant="soft">Crear registro</cu-button>
      </div>
    </cu-table>
  </VanillaDemo>
</template>
