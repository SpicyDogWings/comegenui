<script setup lang="ts">
const props = defineProps({
  for: {
    type: String,
    required: false,
    default: "",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const handleClick = () => {
  if (!props.for) return;
  const target = document.getElementById(props.for);
  if (target) target.focus();
};
</script>

<template>
  <label
    :style="{ '--label-fg': props.color }"
    class="cu-label"
  >
    <span v-if="props.label" @click="handleClick" class="cu-label-text">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style scoped>
.cu-label {
  display: inline-flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
  font-family: var(--cu-font-sans);
  color: var(--label-fg);
}

.cu-label-text {
  width: fit-content;
  cursor: pointer;
  font-family: var(--cu-font-sans);
}
</style>
