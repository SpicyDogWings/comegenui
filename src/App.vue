<script setup lang="ts">
import Input from "./components/form/Input.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4">
    <div class="flex flex-col gap-2 w-64">
      <Input placeholder="Default input" />
      <Input variant="none" placeholder="None variant input" />
      <Input variant="none" placeholder="Disabled input" disabled />
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
