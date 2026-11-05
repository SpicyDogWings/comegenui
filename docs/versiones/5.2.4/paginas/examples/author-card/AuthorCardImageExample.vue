<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#0ea5e9"/>
    <text x="48" y="60" font-family="sans-serif" font-size="34" fill="white" text-anchor="middle">LG</text>
  </svg>`,
)}`;
</script>

<template>
  <div class="cu-demo-controls">
    <AuthorCard name="Laura Gómez" role="Diseñadora" :src="photo" size="lg" />
    <AuthorCard name="Laura Gómez" role="Diseñadora" :src="photo" size="md" />
    <AuthorCard name="Laura Gómez" role="Diseñadora" :src="photo" size="sm" />
  </div>
</template>
