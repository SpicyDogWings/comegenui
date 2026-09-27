<script setup lang="ts">
import Card from "@/components/information/Card.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div v-for="variant in variants" :key="variant" class="cu-demo-controls">
    <Card
      v-for="color in colors"
      :key="color"
      :variant="variant"
      :color="color"
      :title="variant"
      :subtitle="color"
    >
      Contenido de la tarjeta.
    </Card>
  </div>
</template>
