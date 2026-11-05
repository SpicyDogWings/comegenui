<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <Checkbox
    v-for="color in colors"
    :key="color"
    :color="color"
    :label="color"
    :model-value="true"
  />
</template>
