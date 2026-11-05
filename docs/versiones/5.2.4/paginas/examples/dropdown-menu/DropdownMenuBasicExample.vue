<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const items = [
  { label: "Perfil" },
  { label: "Configuración" },
  { label: "Cerrar sesión" },
];
</script>

<template>
  <DropdownMenu label="Cuenta" color="primary" variant="solid" :items="items" />
</template>
