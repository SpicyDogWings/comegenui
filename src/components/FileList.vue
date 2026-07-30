<script setup lang="ts">
import { computed } from "vue";
import Button from "./buttons/Button.vue";
import { getBgClasses, getFgClasses } from "../utils/palette";
import { getFileIconSvg, formatFileSize } from "../utils/fileIcons";

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
  maxHeight: {
    type: String,
    required: false,
    default: "",
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits<{
  remove: [index: number];
  select: [index: number];
}>();

const fgClass = computed(() =>
  getFgClasses(props.color, "none", props.hightContrast),
);
const bgClass = computed(() =>
  getBgClasses(props.color, "none", props.hightContrast),
);



const fileList = computed(() => {
  if (!props.files) return [];
  if (props.files instanceof File) return [props.files];
  if (Array.isArray(props.files)) return props.files;
  return [];
});
</script>

<template>
  <div v-if="fileList.length > 0" class="text-start w-full" :style="{ maxHeight: props.maxHeight || undefined, overflowY: props.maxHeight ? 'auto' : 'visible' }">
    <div
      v-for="(file, i) in fileList"
      :key="i"
      class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-cu hover:bg-[var(--btn-bg-hover)] transition-colors duration-150 cursor-pointer"
      @click.stop="emit('select', i)"
      :style="{
        '--btn-fg': fgClass.main,
        '--btn-bg-hover': bgClass.hover,
      }"
    >
      <span v-html="getFileIconSvg(file)"></span>
      <span class="truncate font-medium flex-1 min-w-0 text-[var(--btn-fg)]">{{ file.name }}</span>
      <span class="shrink-0 opacity-80 text-xs whitespace-nowrap text-[var(--btn-fg)]">{{ formatFileSize(file.size) }}</span>
      <Button
        v-if="!props.disabled"
        :color="props.color"
        variant="ghost"
        class="!p-0.5 !min-w-0 !h-auto !gap-0 shrink-0 opacity-70 hover:opacity-100"
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
