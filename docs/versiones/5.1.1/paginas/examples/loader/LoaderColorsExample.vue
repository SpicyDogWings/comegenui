<script setup lang="ts">
import Loader from "@/components/information/Loader.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <!-- Loader es `position: absolute`; el contenedor necesita `position: relative`. -->
  <div v-for="color in colors" :key="color" class="cu-demo-controls">
    <code style="min-width: 72px">{{ color }}</code>
    <div style="position: relative; flex: 1; height: 12px">
      <Loader :color="color" />
    </div>
  </div>
</template>
