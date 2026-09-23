<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  color?: string;
  variant?: string;
  title?: string;
}>();

const styles = computed(() => ({
  "--badge-bg": `var(--cu-color-${props.color ?? "neutral"})`,
  "--badge-text": `var(--cu-color-${props.color ?? "neutral"}-text)`,
  "--badge-soft": `var(--cu-color-${props.color ?? "neutral"}-soft)`,
  "--badge-subtle": `var(--cu-color-${props.color ?? "neutral"}-subtle)`,
  "--badge-subtle-border": `var(--cu-color-${props.color ?? "neutral"}-subtle-border)`,
}));
</script>

<template>
  <span
    class="khadgar-badge"
    :class="`khadgar-badge--${variant ?? 'soft'}`"
    :title="title"
    :style="styles"
  >
    <slot />
  </span>
</template>

<style scoped>
.khadgar-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: var(--cu-radius-full);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  line-height: var(--cu-line-height-normal);
  white-space: nowrap;
}

.khadgar-badge--solid {
  background: var(--badge-bg);
  color: var(--badge-text);
}

.khadgar-badge--soft {
  background: var(--badge-soft);
  color: var(--cu-color-neutral);
}

.khadgar-badge--subtle {
  background: var(--badge-subtle);
  color: var(--cu-color-neutral);
  border: var(--cu-border-thin) solid var(--badge-subtle-border);
}
</style>