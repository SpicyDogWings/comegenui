<script setup lang="ts">
// Refleja el ejemplo "Deshabilitado": una tab individual y el grupo completo.
const parcial = [
  { key: "a", label: "Habilitada" },
  { key: "b", label: "Deshabilitada", disabled: true },
  { key: "c", label: "Habilitada" },
];
const todas = [
  { key: "a", label: "Una" },
  { key: "b", label: "Otra" },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs variant="ghost" color="primary" :tabs.prop="parcial">
      <div slot="a">Tab activa.</div>
      <div slot="b">No se puede seleccionar.</div>
      <div slot="c">Otra tab activa.</div>
    </cu-tabs>
    <cu-tabs variant="soft" color="primary" disabled :tabs.prop="todas">
      <div slot="a">Grupo deshabilitado.</div>
      <div slot="b">Grupo deshabilitado.</div>
    </cu-tabs>
  </VanillaDemo>
</template>
