<script setup lang="ts">
import { ref } from "vue";
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";

const log = ref("(arrastrá el label o usá ←/→)");

function onNavigate(direction: number) {
  log.value = `navigate → ${direction > 0 ? "siguiente" : "anterior"} (${direction})`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <!-- threshold bajo (40px) y steps=2 para que el gesto se note -->
    <MonthSliderLabel
      label="Septiembre"
      year="2026"
      color="primary"
      draggable
      :threshold="40"
      :steps="2"
      @navigate="onNavigate"
    />
  </div>
  <p class="cu-demo-output">{{ log }}</p>
</template>
