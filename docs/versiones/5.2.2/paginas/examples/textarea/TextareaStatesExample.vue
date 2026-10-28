<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
</script>

<template>
  <Textarea model-value="deshabilitado" disabled />
  <Textarea model-value="solo lectura (readOnly)" read-only />
  <Textarea placeholder="habilitado" />
</template>
