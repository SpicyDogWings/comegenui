<script setup lang="ts">
import { computed, type PropType } from "vue";
import { isSize } from '@/utils/validators'
import Avatar from "./Avatar.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "",
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
    validator: isSize,
  },
  src: {
    type: String,
    required: false,
    default: "",
  },
});

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || "";
});
</script>

<template>
  <div class="cu-author">
    <Avatar :initials="initials" :color="props.color" :size="props.size" :src="props.src" />
    <div class="cu-author-info">
      <span class="cu-author-name">{{ props.name }}</span>
      <span v-if="props.role" class="cu-author-role">{{ props.role }}</span>
    </div>
  </div>
</template>

<style scoped>
.cu-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cu-author-info {
  display: flex;
  flex-direction: column;
}

.cu-author-name {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  line-height: var(--cu-line-height-tight);
}

.cu-author-role {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.5;
  line-height: var(--cu-line-height-tight);
}
</style>
