<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String,
    required: false,
    default: "soft",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "subtle", "ghost"].includes(value),
  },
});

const badgeStyles = computed(() => ({
  '--badge-bg': `var(--cu-color-${props.color})`,
  '--badge-text': `var(--cu-color-${props.color}-text)`,
  '--badge-soft': `var(--cu-color-${props.color}-soft)`,
  '--badge-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--badge-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--badge-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--badge-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));
</script>

<template>
  <span :class="['cu-badge', `cu-badge--${props.variant}`]" :style="badgeStyles">
    <slot />
  </span>
</template>

<style scoped>
.cu-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--cu-space-xs);
  padding: var(--cu-space-2xs) var(--cu-space-sm);
  border-radius: var(--cu-radius);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  line-height: var(--cu-line-height-tight);
  white-space: nowrap;
  box-sizing: border-box;
  border: var(--cu-border-thin) solid transparent;
}

/* solid */
.cu-badge.cu-badge--solid {
  background-color: var(--badge-bg);
  color: var(--cu-color-surface);
}

/* soft */
.cu-badge.cu-badge--soft {
  background-color: var(--badge-soft);
  color: var(--badge-text);
}

/* ghost */
.cu-badge.cu-badge--ghost {
  background-color: transparent;
  color: var(--badge-text);
}

/* subtle */
.cu-badge.cu-badge--subtle {
  background-color: var(--badge-subtle);
  color: var(--badge-text);
  border-color: var(--badge-subtle-border);
}

/* outlined */
.cu-badge.cu-badge--outlined {
  background-color: transparent;
  color: var(--badge-text);
  border-color: var(--badge-bg);
}
</style>
