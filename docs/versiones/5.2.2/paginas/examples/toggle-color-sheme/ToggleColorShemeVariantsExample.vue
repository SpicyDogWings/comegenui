<script setup lang="ts">
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;
</script>

<template>
  <div class="cu-demo-controls">
    <ToggleColorSheme v-for="variant in variants" :key="variant" :variant="variant" />
  </div>
</template>
