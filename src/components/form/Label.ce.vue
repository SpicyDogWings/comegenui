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
  const rootNode = target.getRootNode();
  if (!rootNode || !(rootNode instanceof ShadowRoot)) return;
  const host = rootNode.host;
  const allChildren = Array.from(host.children) as HTMLElement[];
  for (const child of allChildren) {
    let input: HTMLElement | null = null;
    if (child.tagName === "CU-INPUT" || child.tagName === "INPUT") {
      input = child as HTMLElement;
    } else {
      const found = child.querySelector("cu-input, input");
      input = found as HTMLElement | null;
    }
    if (input) {
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
    <span class="font-sans text-charcoal-800">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style>
@unocss-placeholder;
</style>
