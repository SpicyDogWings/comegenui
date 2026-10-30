<script setup lang="ts">
// Refleja el ejemplo "Variantes": el mismo contenido con cada variante.
const tabs = [
  { key: "uno", label: "Uno" },
  { key: "dos", label: "Dos" },
  { key: "tres", label: "Tres" },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs variant="ghost" :tabs.prop="tabs">
      <div slot="uno">Variante ghost (underline).</div>
      <div slot="dos">Segundo panel.</div>
      <div slot="tres">Tercer panel.</div>
    </cu-tabs>
    <cu-tabs variant="solid" :tabs.prop="tabs">
      <div slot="uno">Variante solid (pills redondeadas).</div>
      <div slot="dos">Segundo panel.</div>
      <div slot="tres">Tercer panel.</div>
    </cu-tabs>
    <cu-tabs variant="boxed" :tabs.prop="tabs">
      <div slot="uno">Variante boxed (contenedor con borde).</div>
      <div slot="dos">Segundo panel.</div>
      <div slot="tres">Tercer panel.</div>
    </cu-tabs>
    <cu-tabs variant="soft" :tabs.prop="tabs">
      <div slot="uno">Variante soft (contenedor soft + activo solid).</div>
      <div slot="dos">Segundo panel.</div>
      <div slot="tres">Tercer panel.</div>
    </cu-tabs>
  </VanillaDemo>
</template>
