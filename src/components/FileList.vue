<script setup lang="ts">
import { computed, type PropType } from "vue";
import Button from "./buttons/Button.vue";
import { getFileIconSvg, formatFileSize } from "../utils/fileIcons";

const props = defineProps({
  files: {
    type: null as any,
    required: false,
    default: null,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxHeight: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits<{
  remove: [index: number];
  select: [index: number];
}>();

const listStyles = computed(() => ({
  '--list-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--list-text': `var(--cu-color-${props.color}-text)`,
}));

const fileList = computed(() => {
  if (!props.files) return [];
  if (props.files instanceof File) return [props.files];
  if (Array.isArray(props.files)) return props.files;
  return [];
});
</script>

<template>
  <div
    v-if="fileList.length > 0"
    class="cu-file-list"
    :style="{ ...listStyles, maxHeight: props.maxHeight || undefined, overflowY: props.maxHeight ? 'auto' : 'visible' }"
  >
    <div
      v-for="(file, i) in fileList"
      :key="i"
      class="cu-file-list-item"
      @click.stop="emit('select', i)"
    >
      <span v-html="getFileIconSvg(file)" class="cu-file-list-icon"></span>
      <span class="cu-file-list-name">{{ file.name }}</span>
      <span class="cu-file-list-size">{{ formatFileSize(file.size) }}</span>
      <Button
        v-if="!props.disabled"
        :color="color"
        variant="ghost"
        class="cu-file-list-remove"
        @click.stop="emit('remove', i)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </Button>
    </div>
  </div>
</template>

<style>
.cu-file-list {
  width: 100%;
}

.cu-file-list-item {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
  padding: var(--cu-space-xs) var(--cu-space-md);
  font-size: var(--cu-font-size-sm);
  border-radius: var(--cu-radius-md);
  cursor: pointer;
  transition: background-color 150ms ease;
}

.cu-file-list-item:hover {
  background-color: var(--list-ghost-hover);
}

.cu-file-list-icon {
  flex-shrink: 0;
}

.cu-file-list-name {
  flex: 1;
  min-width: 0;
  font-weight: var(--cu-font-weight-medium);
  color: var(--list-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cu-file-list-size {
  flex-shrink: 0;
  opacity: 0.8;
  font-size: var(--cu-font-size-xs);
  white-space: nowrap;
  color: var(--list-text);
}

.cu-file-list-remove {
  padding: var(--cu-space-2xs) !important;
  min-width: 0 !important;
  height: auto !important;
  gap: 0 !important;
  flex-shrink: 0;
  opacity: 0.7;
}

.cu-file-list-remove:hover {
  opacity: 1;
}
</style>
