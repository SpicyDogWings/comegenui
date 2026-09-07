<script setup lang="ts">
import Tooltip from "../../overlay/Tooltip.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  text: { type: String, default: "" },
  color: { type: String, default: "neutral" },
  position: { type: String, default: "top" },
  align: { type: String, default: "center" },
  offset: { type: Number, default: 6 },
  delay: { type: Number, default: 200 },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <Tooltip
    :text="props.text"
    :color="props.color"
    :position="props.position"
    :align="props.align"
    :offset="props.offset"
    :delay="props.delay"
    :disabled="props.disabled"
  >
    <slot></slot>
  </Tooltip>
</template>