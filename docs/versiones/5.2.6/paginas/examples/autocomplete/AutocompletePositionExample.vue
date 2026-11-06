<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";

const items = [
  { label: "Panel arriba / alineado al final", value: "a" },
  { label: "Segunda opción", value: "b" },
  { label: "Tercera opción", value: "c" },
];
</script>

<template>
  <!-- position: bottom | top | left | right · align: start | center | end -->
  <Autocomplete
    :items="items"
    position="top"
    align="end"
    :fixed="true"
    placeholder="position=top / align=end / fixed"
  />
</template>
