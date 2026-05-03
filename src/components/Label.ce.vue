<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: "",
  },
});

const handleClick = (e: Event) => {
  const target = e.currentTarget as HTMLElement;
  const host = target.getRootNode()?.host as HTMLElement | null;

  if (!host) return;

  const allChildren = Array.from(host.children);

  for (const child of allChildren) {
    let input: HTMLElement | null = null;

    if (child.tagName === "CU-INPUT" || child.tagName === "INPUT") {
      input = child;
    } else {
      input = child.querySelector("cu-input, input");
    }

    if (input) {
      if (typeof (input as any).focus === "function") {
        (input as any).focus();
        return;
      }
      input.focus();
      return;
    }
  }
};
</script>

<template>
  <label
    @click="handleClick"
    class="cursor-pointer inline-block font-sans flex flex-col gap-2"
  >
    <span v-if="props.label" class="font-sans text-charcoal-800">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style>
@unocss-placeholder;
</style>
