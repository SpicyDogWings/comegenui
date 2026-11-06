<script setup lang="ts">
// Refleja los ejemplos "Colores", "Variantes" y "Tamaños".
import NumberInput from "@/components/form/NumberInput.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <NumberInput v-for="color in colors" :key="color" :color="color" :placeholder="color" />
  <NumberInput
    v-for="variant in variants"
    :key="variant"
    color="primary"
    :variant="variant"
    :placeholder="variant === 'soft' ? 'soft (default)' : variant"
  />
  <NumberInput
    v-for="size in sizes"
    :key="size"
    :size="size"
    :placeholder="size === 'md' ? 'md (default)' : size"
  />
</template>
