<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const items = [
  { label: "Una opción" },
  { label: "Otra opción" },
];
</script>

<template>
  <DropdownMenu label="primary" color="primary" variant="solid" :items="items" />
  <DropdownMenu label="secondary" color="secondary" variant="soft" :items="items" />
  <DropdownMenu label="success" color="success" variant="outlined" :items="items" />
  <DropdownMenu label="danger" color="danger" variant="subtle" :items="items" />

  <DropdownMenu label="bottom / end" position="bottom" align="end" :offset="10" :items="items" />
  <DropdownMenu label="top / center" position="top" align="center" :items="items" />
  <DropdownMenu label="fixed" fixed :items="items" />
  <DropdownMenu label="textAlign right" text-align="right" :items="items" />
</template>
