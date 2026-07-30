<script setup lang="ts">
import { computed, ref, watch, onUnmounted, useTemplateRef, type PropType } from "vue";
import { useFocus } from "@vueuse/core";
import Button from "../buttons/Button.vue";
import { getFileIconSvg, formatFileSize } from "../../utils/fileIcons";

const value = defineModel<File | null>({ default: null });

const fileUrl = ref("");
watch(value, (newFile, oldFile) => {
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
  fileUrl.value = newFile ? URL.createObjectURL(newFile) : "";
}, { immediate: true });
onUnmounted(() => { if (fileUrl.value) URL.revokeObjectURL(fileUrl.value); });

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "outlined",
    validator: (value: string) => ["outlined", "soft", "ghost", "subtle"].includes(value),
  },
  placeholder: {
    type: String,
    required: false,
    default: "Seleccionar archivo",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  accept: {
    type: String,
    required: false,
  },
  maxSize: {
    type: Number,
    required: false,
  },
});

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInput");
const containerRef = useTemplateRef("container");
const { focused: containerFocus } = useFocus(containerRef);
const isDragOver = ref(false);

const inputStyles = computed(() => ({
  '--input-bg': `var(--cu-color-${props.color})`,
  '--input-soft': `var(--cu-color-${props.color}-soft)`,
  '--input-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--input-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--input-text': `var(--cu-color-${props.color}-text)`,
}));

function formatAcceptList(accept: string): string {
  if (!accept) return '';
  return accept
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(p => {
      if (p === 'image/*') return 'Imagen';
      if (p === 'application/*') return 'Documento';
      if (p === 'video/*') return 'Video';
      if (p === 'audio/*') return 'Audio';
      if (p.startsWith('.')) return p.slice(1).toUpperCase();
      return p.split('/').pop()?.replace('*', '').toUpperCase() || p;
    })
    .join(', ');
}

const formatosStr = computed(() => formatAcceptList(props.accept));
const maxSizeStr = computed(() => (props.maxSize ? formatFileSize(props.maxSize) : ''));

function matchesAccept(file: File): boolean {
  if (!props.accept) return true;
  const patterns = props.accept.split(",").map((s) => s.trim());
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    if (pattern.endsWith("/*")) return file.type.startsWith(pattern.slice(0, -1));
    return file.type === pattern;
  });
}

function isValidFile(file: File): boolean {
  if (file.size === 0 && !file.type) return false;
  if (props.maxSize && file.size > props.maxSize) return false;
  if (!matchesAccept(file)) return false;
  return true;
}

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (isValidFile(file)) value.value = file;
  }
}

function removeFile() {
  value.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
}

function onDragOver(e: DragEvent) {
  if (props.disabled || props.readOnly) return;
  e.preventDefault();
  isDragOver.value = true;
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
  if (props.disabled || props.readOnly) return;
  const file = e.dataTransfer?.files?.[0];
  if (file && isValidFile(file)) value.value = file;
}

function trigger() {
  if (props.disabled || props.readOnly) return;
  fileInputRef.value?.click();
}

const get = () => value.value;
const set = (file: File | null) => { value.value = file; };
const reset = () => {
  value.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};
const focus = () => { containerFocus.value = true; };

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <div
    ref="container"
    class="cu-file-input"
    :class="[
      `cu-file-input--${props.variant}`,
      {
        'cu-file-input--disabled': props.disabled,
        'cu-file-input--drag-over': isDragOver,
        'cu-file-input--has-file': !!value,
      }
    ]"
    :style="inputStyles"
    @click="trigger"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @keydown.enter="trigger"
    @keydown.space.prevent="trigger"
    tabindex="0"
    role="button"
    :aria-disabled="props.disabled"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="props.accept"
      class="cu-file-input-hidden"
      @change="handleInputChange"
    />

    <svg
      v-if="!value"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="cu-file-input-icon"
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
    <span v-if="!value" class="cu-file-input-placeholder">
      {{ props.placeholder }}
      <template v-if="formatosStr">&nbsp;— {{ formatosStr }}</template>
      <template v-if="maxSizeStr">&nbsp;(máx {{ maxSizeStr }})</template>
    </span>

    <span v-if="value" v-html="getFileIconSvg(value, 16)" class="cu-file-input-icon"></span>

    <div v-if="value" class="cu-file-input-name" @click="trigger">
      <a
        :href="fileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="cu-file-input-link"
        @click.stop
      >
        {{ value.name }}
      </a>
    </div>

    <span v-if="value" class="cu-file-input-size">{{ formatFileSize(value.size) }}</span>

    <Button
      v-if="value && !props.disabled"
      :color="color"
      variant="ghost"
      class="cu-file-input-remove"
      @click.stop="removeFile"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
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
</template>

<style>
.cu-file-input {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
  padding: var(--cu-space-sm) var(--cu-space-md);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  cursor: pointer;
  transition: all 200ms ease;
  width: 100%;
  box-sizing: border-box;
  color: var(--input-text);
}

/* outlined (default) */
.cu-file-input--outlined {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background-color: var(--cu-color-surface);
}

.cu-file-input--outlined:hover:not(.cu-file-input--disabled) {
  border-color: var(--input-bg);
  background-color: var(--input-ghost-hover);
}

/* soft */
.cu-file-input--soft {
  border: var(--cu-border-thin) solid transparent;
  background-color: var(--input-soft);
}

.cu-file-input--soft:hover:not(.cu-file-input--disabled) {
  background-color: var(--input-soft-hover);
}

/* ghost */
.cu-file-input--ghost {
  border: var(--cu-border-thin) solid transparent;
  background-color: transparent;
}

.cu-file-input--ghost:hover:not(.cu-file-input--disabled) {
  background-color: var(--input-ghost-hover);
}

/* subtle */
.cu-file-input--subtle {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background-color: transparent;
}

.cu-file-input--subtle:hover:not(.cu-file-input--disabled) {
  border-color: var(--input-bg);
  background-color: var(--input-ghost-hover);
}

.cu-file-input:focus {
  outline: none;
  border-color: var(--input-bg);
  box-shadow: 0 0 0 2px var(--input-bg);
}

.cu-file-input--disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.cu-file-input--drag-over {
  border-color: var(--input-bg);
  background-color: var(--input-ghost-hover);
}

.cu-file-input-hidden {
  display: none;
}

.cu-file-input-icon {
  flex-shrink: 0;
  opacity: 0.6;
  color: var(--input-text);
}

.cu-file-input-placeholder {
  flex: 1;
  opacity: 0.6;
  color: var(--input-text);
}

.cu-file-input-name {
  flex: 1;
  min-width: 0;
}

.cu-file-input-link {
  font-weight: var(--cu-font-weight-medium);
  color: var(--input-text);
  text-decoration: none;
  transition: text-decoration 150ms ease;
}

.cu-file-input-link:hover {
  text-decoration: underline;
}

.cu-file-input-size {
  flex-shrink: 0;
  opacity: 0.8;
  font-size: var(--cu-font-size-xs);
  white-space: nowrap;
  color: var(--input-text);
}

.cu-file-input-remove {
  padding: var(--cu-space-2xs) !important;
  min-width: 0 !important;
  height: auto !important;
  gap: 0 !important;
  flex-shrink: 0;
  opacity: 0.7;
}

.cu-file-input-remove:hover {
  opacity: 1;
}
</style>
