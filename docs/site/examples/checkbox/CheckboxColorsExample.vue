<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
</script>

<template>
  <Checkbox color="primary" label="primary" :model-value="true" />
  <Checkbox color="success" label="success" :model-value="true" />
  <Checkbox color="warning" label="warning" :model-value="true" />
  <Checkbox color="danger" label="danger" :model-value="true" />
</template>
