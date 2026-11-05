<script setup lang="ts">
import { computed, type PropType } from "vue";
import { isColor, isVariant } from '@/utils/validators'

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isVariant,
  },
});

/** Un color fuera del set no tiene tokens: la variante solid quedaría sin fondo
 *  y con el texto del tema encima (invisible). Cae al color seguro. */
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));

const badgeStyles = computed(() => ({
  '--badge-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--badge-border': `var(--cu-color-${safeColor.value}-border)`,
  '--badge-solid-text': `var(--cu-color-${safeColor.value}-solid-text)`,
  '--badge-text': `var(--cu-color-${safeColor.value}-text)`,
  '--badge-text-soft': `var(--cu-color-${safeColor.value}-text-on-soft)`,
  '--badge-text-subtle': `var(--cu-color-${safeColor.value}-text-on-subtle)`,
  '--badge-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--badge-soft-hover': `var(--cu-color-${safeColor.value}-soft-hover)`,
  '--badge-ghost-hover': `var(--cu-color-${safeColor.value}-ghost-hover)`,
  '--badge-subtle': `var(--cu-color-${safeColor.value}-subtle)`,
  '--badge-subtle-border': `var(--cu-color-${safeColor.value}-subtle-border)`,
}));
</script>

<template>
  <span :class="['cu-badge', `cu-badge--${props.variant}`]" :style="badgeStyles">
    <!-- Contenido textual o ícono del badge -->
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

/* solid: el borde (`-border`, ≥3:1 contra la superficie) delimita el badge
   cuando el relleno por sí solo no alcanza ese piso. */
.cu-badge.cu-badge--solid {
  background-color: var(--badge-solid);
  color: var(--badge-solid-text);
  border-color: var(--badge-border);
}

/* soft */
.cu-badge.cu-badge--soft {
  background-color: var(--badge-soft);
  color: var(--badge-text-soft);
}

/* ghost */
.cu-badge.cu-badge--ghost {
  background-color: transparent;
  color: var(--badge-text);
}

/* subtle */
.cu-badge.cu-badge--subtle {
  background-color: var(--badge-subtle);
  color: var(--badge-text-subtle);
  border-color: var(--badge-subtle-border);
}

/* outlined */
.cu-badge.cu-badge--outlined {
  background-color: transparent;
  color: var(--badge-text);
  border-color: var(--badge-border);
}
</style>
