<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";
</script>

<template>
  <div class="cu-demo-controls">
    <!-- Sin `initials` ni `src`, el slot `default` es el contenido del avatar. -->
    <Avatar color="success" size="lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </Avatar>

    <Avatar color="primary" size="lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a6 6 0 0 1 16 0v2" />
      </svg>
    </Avatar>
  </div>
</template>
