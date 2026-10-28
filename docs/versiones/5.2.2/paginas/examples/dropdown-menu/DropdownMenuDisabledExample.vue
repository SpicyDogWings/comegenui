<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const items = [
  { label: "No clickeable" },
  { label: "Tampoco" },
];
</script>

<template>
  <DropdownMenu label="Deshabilitado" disabled :items="items" />
</template>
