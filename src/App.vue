<script setup lang="ts">
import Input from "./components/Input.ce.vue";

const inputConfigs = [
  // Primary
  { color: "primary", variant: "outlined", placeholder: "Primary Outlined" },
  { color: "primary", variant: "soft", placeholder: "Primary Soft" },
  { color: "primary", variant: "ghost", placeholder: "Primary Ghost" },
  { color: "primary", variant: "subtle", placeholder: "Primary Subtle" },
  // Neutral
  { color: "neutral", variant: "outlined", placeholder: "Neutral Outlined" },
  { color: "neutral", variant: "soft", placeholder: "Neutral Soft" },
  { color: "neutral", variant: "ghost", placeholder: "Neutral Ghost" },
  { color: "neutral", variant: "subtle", placeholder: "Neutral Subtle" },
  // Success
  { color: "success", variant: "outlined", placeholder: "Success Outlined" },
  { color: "success", variant: "soft", placeholder: "Success Soft" },
  { color: "success", variant: "ghost", placeholder: "Success Ghost" },
  { color: "success", variant: "subtle", placeholder: "Success Subtle" },
  // Warning
  { color: "warning", variant: "outlined", placeholder: "Warning Outlined" },
  { color: "warning", variant: "soft", placeholder: "Warning Soft" },
  { color: "warning", variant: "ghost", placeholder: "Warning Ghost" },
  { color: "warning", variant: "subtle", placeholder: "Warning Subtle" },
  // Danger
  { color: "danger", variant: "outlined", placeholder: "Danger Outlined" },
  { color: "danger", variant: "soft", placeholder: "Danger Soft" },
  { color: "danger", variant: "ghost", placeholder: "Danger Ghost" },
  { color: "danger", variant: "subtle", placeholder: "Danger Subtle" },
];
</script>

<template>
  <div class="w-screen h-screen flex flex-col gap-8 p-6">
    <h1 class="text-2xl font-bold">Inputs - Todas las combinaciones</h1>
    
    <div class="flex flex-wrap gap-4">
      <Input
        v-for="(config, index) in inputConfigs"
        :key="index"
        :color="config.color"
        :variant="config.variant"
        :placeholder="config.placeholder"
        class="w-64"
      />
    </div>
  </div>
</template>
