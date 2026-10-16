<script setup lang="ts">
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Input model-value="deshabilitado" disabled />
  <Input model-value="solo lectura (readOnly)" readOnly />
  <Input placeholder="habilitado" />
</template>
