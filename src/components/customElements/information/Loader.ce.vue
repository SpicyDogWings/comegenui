<script setup lang="ts">
import Loader from "../../information/Loader.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String, default: "primary" },
  animation: { type: String, default: "loading" },
  delay: { type: Number, default: 2000 },
});
</script>

<template>
  <Loader :color="props.color" :animation="props.animation" :delay="props.delay" />
</template>

<style>
@unocss-placeholder;
/* El loader interno es position:absolute — el host lo ancla */
:host {
  display: block;
  position: relative;
}
</style>
