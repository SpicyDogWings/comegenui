<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div class="cu-demo-controls">
    <Avatar v-for="color in colors" :key="color" :initials="color.slice(0, 2)" :color="color" size="lg" />
  </div>

  <div class="cu-demo-controls">
    <!-- Sin `color`: el color se elige determinísticamente desde las iniciales. -->
    <Avatar initials="AP" size="lg" />
    <Avatar initials="MR" size="lg" />
    <Avatar initials="CD" size="lg" />
  </div>
</template>
