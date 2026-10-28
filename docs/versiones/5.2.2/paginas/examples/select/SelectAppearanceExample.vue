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
    variant="outlined"
    text-align="left"
    placeholder="text-align=left (default)"
  />
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
    placeholder="text-align=right y un texto largo que sí se envuelve"
  />
  <Select :options="options" variant="subtle" placeholder="variant=subtle" />
</template>
