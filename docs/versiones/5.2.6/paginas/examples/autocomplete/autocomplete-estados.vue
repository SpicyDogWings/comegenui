<script setup lang="ts">
const items = [{ label: "Opción A" }, { label: "Opción B" }, { label: "Opción C" }];
</script>

<template>
  <!-- Refleja el ejemplo "Estados": `disabled` (no abre el panel) y `readonly` (abre, pero no escribe). -->
  <VanillaDemo :use="['CuAutocomplete']">
    <div class="cu-demo-controls">
      <cu-autocomplete placeholder="habilitado" :items.prop="items"></cu-autocomplete>
      <cu-autocomplete disabled placeholder="disabled" :items.prop="items"></cu-autocomplete>
      <cu-autocomplete readonly placeholder="readonly" :items.prop="items"></cu-autocomplete>
    </div>
  </VanillaDemo>
</template>
