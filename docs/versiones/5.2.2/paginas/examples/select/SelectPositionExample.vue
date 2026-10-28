<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const options = [
  { value: "a", label: "Panel arriba / alineado al final" },
  { value: "b", label: "Otra opción" },
];
</script>

<template>
  <!-- position: bottom | top | left | right · align: start | center | end -->
  <Select
    :options="options"
    position="top"
    align="end"
    :fixed="true"
    placeholder="position=top / align=end / fixed"
  />
</template>
