<script setup lang="ts">
// Refleja el ejemplo "Variantes": outlined, soft (default), ghost y subtle.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const items = [{ label: "Opción A" }, { label: "Opción B" }, { label: "Opción C" }];
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <div class="cu-demo-controls">
      <cu-autocomplete
        v-for="variant in variants"
        :key="variant"
        color="primary"
        :variant="variant"
        :placeholder="variant"
        :items.prop="items"
      ></cu-autocomplete>
    </div>
  </VanillaDemo>
</template>
