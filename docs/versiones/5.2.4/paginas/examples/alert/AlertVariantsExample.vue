<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <Alert
    v-for="variant in variants"
    :key="variant"
    color="primary"
    :variant="variant"
    :title="variant"
  >
    Variante <code>{{ variant }}</code> sobre color primary.
  </Alert>

  <Alert
    v-for="color in colors"
    :key="color"
    :color="color"
    variant="soft"
    :title="color"
  >
    Color <code>{{ color }}</code> sobre variante soft.
  </Alert>
</template>
