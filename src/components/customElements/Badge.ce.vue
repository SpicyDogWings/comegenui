<script setup lang="ts">
import { type PropType } from "vue";
import Badge from "../information/Badge.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  variant: {
    type: String,
    default: "soft",
  },
});
</script>

<template>
  <Badge
    :color="props.color"
    :variant="props.variant"
  >
    <slot></slot>
  </Badge>
</template>

<style>
@unocss-placeholder;
</style>
