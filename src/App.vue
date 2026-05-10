<script setup lang="ts">
import Button from "./components/Button.vue";
const color = "#093C5D";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <Button variant="solid" :color="color">Click me</Button>
    <Button variant="outlined" :color="color">Click me</Button>
    <Button variant="soft" :color="color">Click me</Button>
    <Button :color="color">Click me</Button>
    <Button variant="subtle" :color="color">Click me</Button>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
