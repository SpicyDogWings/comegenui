<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
</script>

<template>
  <Checkbox size="sm" label="sm" :model-value="true" />
  <Checkbox size="md" label="md (default)" :model-value="true" />
</template>
