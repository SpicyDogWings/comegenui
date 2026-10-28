<script setup lang="ts">
import Blockquote from "@/components/markdown/Blockquote.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <Blockquote v-for="color in colors" :key="color" :color="color">
    Cita con color <code>{{ color }}</code>; el borde izquierdo toma el color semántico.
  </Blockquote>
</template>
