<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";
import { getBgClasses, getFgClasses } from "../utils/palette";

const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></svg>`;
const ICON_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/></svg>`;
const ICON_TEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
const ICON_SPREADSHEET = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`;

const props = defineProps({
  files: {
    type: null as any,
    required: false,
    default: null,
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits<{
  remove: [index: number];
}>();

const fgClass = computed(() =>
  getFgClasses(props.color, "none", props.hightContrast),
);
const bgClass = computed(() =>
  getBgClasses(props.color, "none", props.hightContrast),
);

function getFileIcon(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"].includes(ext)) return ICON_IMAGE;
  if (["pdf", "doc", "docx", "txt", "rtf", "odt", "md"].includes(ext)) return ICON_TEXT;
  if (["xls", "xlsx", "csv", "ods", "numbers"].includes(ext)) return ICON_SPREADSHEET;
  return ICON_FILE;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

const fileList = computed(() => {
  if (!props.files) return [];
  if (props.files instanceof File) return [props.files];
  if (Array.isArray(props.files)) return props.files;
  return [];
});
</script>

<template>
  <div v-if="fileList.length > 0" class="text-start w-full max-w-xs mx-auto">
    <div
      v-for="(file, i) in fileList"
      :key="i"
      class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-cu"
      :class="{ 'bg-[var(--btn-bg-hover)]': i % 2 === 0 }"
      :style="{
        '--btn-fg': fgClass.main,
        '--btn-bg-hover': bgClass.hover,
      }"
    >
      <span v-html="getFileIcon(file)"></span>
      <span class="truncate font-medium flex-1 min-w-0 text-[var(--btn-fg)]">{{ file.name }}</span>
      <span class="shrink-0 opacity-60 text-xs whitespace-nowrap text-[var(--btn-fg)]">{{ formatSize(file.size) }}</span>
      <Button
        v-if="!props.disabled"
        :color="props.color"
        variant="ghost"
        class="!p-0.5 !min-w-0 !h-auto !gap-0 shrink-0 opacity-50 hover:opacity-100"
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
@unocss-placeholder;
</style>
