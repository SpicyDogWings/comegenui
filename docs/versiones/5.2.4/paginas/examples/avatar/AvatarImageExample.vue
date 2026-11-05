<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#6366f1"/>
    <circle cx="48" cy="38" r="18" fill="white" fill-opacity="0.9"/>
    <ellipse cx="48" cy="86" rx="30" ry="26" fill="white" fill-opacity="0.9"/>
  </svg>`,
)}`;
</script>

<template>
  <div class="cu-demo-controls">
    <Avatar :src="photo" size="sm" />
    <Avatar :src="photo" size="md" />
    <Avatar :src="photo" size="lg" />
  </div>
</template>
