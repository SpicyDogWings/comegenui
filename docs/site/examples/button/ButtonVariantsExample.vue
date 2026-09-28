<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";

// Matriz completa: una fila por variante, con los 6 colores semánticos.
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <div v-for="variant in variants" :key="variant" class="cu-demo-controls">
    <code>{{ variant }}</code>
    <Button v-for="color in colors" :key="color" :color="color" :variant="variant">
      {{ color }}
    </Button>
  </div>

  <div class="cu-demo-controls">
    <code>sizes</code>
    <Button v-for="size in sizes" :key="size" :size="size">
      {{ size }}
    </Button>
  </div>
</template>
