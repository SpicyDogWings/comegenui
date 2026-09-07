<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  color: { type: String, required: false, default: "primary" },
  animation: { type: String, required: false, default: "loading" },
  delay: { type: Number, required: false, default: 2000 },
});

const loaderStyles = computed(() => ({
  "--cu-loader-color": `var(--cu-color-${props.color})`,
  "--cu-loader-delay": `${props.delay}ms`,
}));
</script>

<template>
  <div class="cu-loader">
    <div
      class="cu-loader-bar"
      :class="`cu-loader-bar--${props.animation}`"
      :style="loaderStyles"
    />
  </div>
</template>

<style scoped>
.cu-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  overflow: hidden;
  height: 3px;
}

.cu-loader-bar {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--cu-loader-color);
}

.cu-loader-bar--loading {
  width: 60%;
  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);
  animation: cu-loader-slide 1.5s ease-in-out infinite;
}

.cu-loader-bar--cooldown {
  left: 0;
  width: 100%;
  animation: cu-loader-cooldown var(--cu-loader-delay) linear forwards;
}

@keyframes cu-loader-slide {
  0% { left: -100%; }
  50% { left: 0%; }
  100% { left: 100%; }
}

@keyframes cu-loader-cooldown {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
