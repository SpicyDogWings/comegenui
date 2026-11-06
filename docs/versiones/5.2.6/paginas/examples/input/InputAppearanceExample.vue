<script setup lang="ts">
import Input from "@/components/form/Input.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <Input v-for="color in colors" :key="color" :color="color" :placeholder="color" />
  <Input
    v-for="variant in variants"
    :key="variant"
    color="primary"
    :variant="variant"
    :placeholder="variant === 'soft' ? 'soft (default)' : variant"
  />
</template>
