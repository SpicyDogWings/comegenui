<script setup lang="ts">
import NavbarMenu from "@/components/navigation/NavbarMenu.vue";

const items = [
  { label: "Uno", path: "#uno" },
  {
    label: "Submenú",
    children: [{ label: "Hijo", path: "#hijo" }],
  },
];
</script>

<template>
  <NavbarMenu :items="items" trigger="click" />
  <NavbarMenu :items="items" trigger="hover" />
</template>
