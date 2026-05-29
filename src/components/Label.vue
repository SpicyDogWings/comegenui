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
    class="inline-block font-sans flex flex-col gap-2 text-[var(--label-fg)]"
  >
    <span v-if="props.label" @click="handleClick" class="font-sans w-fit cursor-pointer">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style>
@unocss-placeholder;
</style>
