<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div v-for="color in colors" :key="color" class="cu-demo-controls">
    <AuthorCard :name="`Autor ${color}`" role="Rol del autor" :color="color" />
  </div>
</template>
