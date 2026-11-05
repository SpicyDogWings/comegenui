<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label label="Correo electrónico">
    <Input type="email" placeholder="correo@ejemplo.com" />
  </Label>
  <Label label="Búsqueda">
    <Input type="search" placeholder="Buscar..." />
  </Label>
</template>
