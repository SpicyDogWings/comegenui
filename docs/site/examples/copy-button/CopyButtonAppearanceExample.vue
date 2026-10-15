<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;
</script>

<template>
  <CopyButton
    v-for="color in colors"
    :key="color"
    :text="color"
    :label="color"
    :color="color"
    variant="solid"
  />
  <CopyButton
    v-for="variant in variants"
    :key="variant"
    :text="variant"
    :label="variant"
    color="primary"
    :variant="variant"
  />
</template>
