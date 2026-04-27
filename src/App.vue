<script setup lang="ts">
import Input from "./components/Input.ce.vue";

const colors = ["primary", "neutral", "success", "warning", "danger"];
const variants = ["outlined", "soft", "ghost", "subtle"];
</script>

<template>
  <div class="w-screen h-screen flex flex-col gap-8 p-6">
    <h1 class="text-2xl font-bold">Inputs - Todos los colores y variantes</h1>
    
    <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
      <h2 class="text-lg font-medium capitalize">{{ color }}</h2>
      <div class="flex flex-wrap gap-4">
        <Input
          v-for="variant in variants"
          :key="`${color}-${variant}`"
          :color="color"
          :variant="variant"
          :placeholder="`${color} ${variant}`"
          class="w-64"
        />
      </div>
    </div>
  </div>
</template>
