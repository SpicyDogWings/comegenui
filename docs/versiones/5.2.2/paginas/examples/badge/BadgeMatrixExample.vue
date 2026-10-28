<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div v-for="variant in variants" :key="variant" class="cu-demo-controls">
    <code>{{ variant }}</code>
    <Badge v-for="color in colors" :key="color" :color="color" :variant="variant">
      {{ color }}
    </Badge>
  </div>
</template>
