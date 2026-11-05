<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";

const items = [
  { label: "Opción disponible", value: "a" },
  { label: "Otra opción", value: "b" },
];
</script>

<template>
  <Autocomplete :items="items" disabled placeholder="disabled" />
  <Autocomplete :items="items" read-only placeholder="readOnly" />
</template>
