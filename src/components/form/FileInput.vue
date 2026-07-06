<script setup lang="ts">
import { computed, ref, watch, onUnmounted, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { useFocus } from "@vueuse/core";
import Button from "../Button.vue";

const value = defineModel<File | null>({ default: null });

const fileUrl = ref("");
watch(value, (newFile, oldFile) => {
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
  fileUrl.value = newFile ? URL.createObjectURL(newFile) : "";
}, { immediate: true });
onUnmounted(() => { if (fileUrl.value) URL.revokeObjectURL(fileUrl.value); });

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInput");
const containerRef = useTemplateRef("container");
const { focused: containerFocus } = useFocus(containerRef);

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

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
    class="flex items-center gap-2 py-2 px-3 rounded-cu font-sans text-sm cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--btn-bd)]"
    :class="{
      'cursor-not-allowed opacity-70 ph-op-50': props.disabled,
      'bg-[var(--btn-bg)]': true,
      'hover:bg-[var(--btn-bg-hover)]': !props.disabled,
      'bg-transparent border-solid border-1 border-[var(--btn-bd)]': props.variant === 'none',
      'bg-transparent border-solid border-2 border-[var(--btn-bd)] hover:bg-[var(--btn-bg-hover)]': props.variant === 'outlined',
      'hover:bg-[var(--btn-bg-hover)]': props.variant === 'soft' || props.variant === 'ghost',
      'bg-transparent border-solid border-1 border-[var(--btn-bd)]': props.variant === 'subtle',
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border || fgClass.main,
    }"
    @click="value ? handleFileClick() : trigger()"
    @keydown.enter="value ? handleFileClick() : trigger()"
    @keydown.space.prevent="value ? handleFileClick() : trigger()"
    tabindex="0"
    role="button"
    :aria-disabled="props.disabled"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="props.accept"
      class="hidden"
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
      class="shrink-0 opacity-60 text-[var(--btn-fg)]"
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>

    <span v-if="!value" class="flex-1 truncate opacity-60 text-[var(--btn-fg)]">{{ props.placeholder }}</span>

    <Button
      v-else
      :to="fileUrl"
      target="_blank"
      :color="props.color"
      variant="link"
      class="!p-0 !h-auto !min-w-0 flex-1 truncate font-medium justify-start"
      @click.stop
    >
      {{ value.name }}
    </Button>

    <span v-if="value" class="shrink-0 opacity-80 text-xs whitespace-nowrap text-[var(--btn-fg)]">{{ formatSize(value.size) }}</span>

    <Button
      v-if="value && !props.disabled"
      :color="props.color"
      variant="ghost"
      class="!p-0.5 !min-w-0 !h-auto !gap-0 shrink-0 opacity-70 hover:opacity-100"
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
@unocss-placeholder;
</style>
