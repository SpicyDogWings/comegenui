<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";

const items = [
  { label: "Opción Alpha", value: "a" },
  { label: "Opción Beta", value: "b" },
  { label: "Opción Gamma", value: "c" },
];
</script>

<template>
  <Autocomplete
    :items="items"
    color="primary"
    variant="outlined"
    type="search"
    placeholder="primary / outlined / search"
  />
  <Autocomplete
    :items="items"
    color="success"
    variant="subtle"
    type="text"
    placeholder="success / subtle / text"
  />
</template>
