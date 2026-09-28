<script setup lang="ts">
import Select from "@/components/form/Select.vue";

const options = [
  { value: "a", label: "Primera" },
  { value: "b", label: "Segunda" },
];
</script>

<template>
  <Select
    :options="options"
    color="primary"
    variant="outlined"
    text-align="center"
    placeholder="text-align=center"
  />
  <Select
    :options="options"
    color="success"
    variant="soft"
    text-align="right"
    placeholder-wrap
    placeholder="Una opción con texto largo que sí se envuelve"
  />
  <Select :options="options" variant="subtle" placeholder="variant=subtle" />
</template>
