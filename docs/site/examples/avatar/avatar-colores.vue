<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos y, sin `color`, el color
// determinístico que se elige por hash de las iniciales.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAvatar']">
    <div class="cu-demo-controls">
      <cu-avatar
        v-for="color in colors"
        :key="color"
        :initials="color.slice(0, 2)"
        :color="color"
        size="lg"
      ></cu-avatar>
    </div>
    <div class="cu-demo-controls">
      <cu-avatar initials="AP" size="lg"></cu-avatar>
      <cu-avatar initials="MR" size="lg"></cu-avatar>
      <cu-avatar initials="CD" size="lg"></cu-avatar>
    </div>
  </VanillaDemo>
</template>
