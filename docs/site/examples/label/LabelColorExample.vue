<script setup lang="ts">
import Label from "@/components/form/Label.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <Label v-for="color in colors" :key="color" :label="color" :color="color" />
  <!-- `hightContrast` está declarado en el componente, pero hoy no se aplica al render. -->
  <Label label="hightContrast (declarado, sin efecto)" color="neutral" :hight-contrast="true" />
</template>
