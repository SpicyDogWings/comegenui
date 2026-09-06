<script setup lang="ts">
import { computed, type PropType } from "vue";

const PALETTE: Array<'primary' | 'secondary' | 'success' | 'neutral'> = [
  'primary', 'secondary', 'success', 'neutral',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "",
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md", "lg"].includes(value),
  },
  initials: {
    type: String,
    required: false,
    default: "",
  },
  src: {
    type: String,
    required: false,
    default: "",
  },
});

const ALL_COLORS: Array<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'> = [
  'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
];

const resolvedColors = computed(() => {
  if (props.color) {
    const idx = ALL_COLORS.indexOf(props.color as typeof PALETTE[number]);
    return { bg: props.color, gradient: ALL_COLORS[(idx + 1) % ALL_COLORS.length] };
  }
  const key = (props.initials || props.name || 'x').toLowerCase();
  const idx = hashString(key) % PALETTE.length;
  return { bg: PALETTE[idx], gradient: PALETTE[(idx + 1) % PALETTE.length] };
});

const avatarStyles = computed(() => ({
  '--avatar-bg': `var(--cu-color-${resolvedColors.value.bg}, #6366f1)`,
  'background-color': `var(--cu-color-${resolvedColors.value.bg}, #6366f1)`,
}));

const sizeClass = computed(() => `cu-avatar--${props.size}`);
</script>

<template>
  <div :class="['cu-avatar', sizeClass]" :style="avatarStyles">
    <img v-if="props.src" :src="props.src" class="cu-avatar-img" alt="" />
    <span v-else-if="props.initials" class="cu-avatar-initials">{{ props.initials }}</span>
    <slot />
  </div>
</template>

<style scoped>
.cu-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--avatar-bg);
  color: white;
  font-weight: var(--cu-font-weight-semibold);
  flex-shrink: 0;
}

.cu-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: var(--cu-font-size-xs);
}

.cu-avatar--md {
  width: 36px;
  height: 36px;
  font-size: var(--cu-font-size-sm);
}

.cu-avatar--lg {
  width: 48px;
  height: 48px;
  font-size: var(--cu-font-size-md);
}

.cu-avatar-initials {
  line-height: 1;
}

.cu-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
