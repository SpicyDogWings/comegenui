<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
</script>

<template>
  <Switch label="deshabilitado" disabled :model-value="true" />
  <Switch label="deshabilitado" disabled :model-value="false" />
</template>
