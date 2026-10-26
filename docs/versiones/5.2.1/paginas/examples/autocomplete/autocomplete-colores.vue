<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const items = [{ label: "Opción A" }, { label: "Opción B" }, { label: "Opción C" }];
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <div class="cu-demo-controls">
      <cu-autocomplete
        v-for="color in colors"
        :key="color"
        :color="color"
        :placeholder="color"
        :items.prop="items"
      ></cu-autocomplete>
    </div>
  </VanillaDemo>
</template>
