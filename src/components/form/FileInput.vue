<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { useFocus } from "@vueuse/core";
import FileList from "../FileList.vue";

const value = defineModel<File | File[] | null>({ default: null });

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
    default: "Selecciona un archivo o arrastra aquí",
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
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxSize: {
    type: Number,
    required: false,
  },
  directory: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxDepth: {
    type: Number,
    required: false,
    default: 0,
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const effectiveMultiple = computed(() => props.multiple || props.directory);

const isDragOver = ref(false);
const dropZoneRef = useTemplateRef("dropZone");
const { focused: dropFocus } = useFocus(dropZoneRef);
const fileInputRef = useTemplateRef<HTMLInputElement>("fileInput");

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

const fileList = computed(() => {
  if (!value.value) return [];
  if (value.value instanceof File) return [value.value];
  if (Array.isArray(value.value)) return value.value;
  return [];
});

function matchesAccept(file: File): boolean {
  if (!props.accept) return true;
  const patterns = props.accept.split(",").map((s) => s.trim());
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    if (pattern.endsWith("/*")) {
      return file.type.startsWith(pattern.slice(0, -1));
    }
    return file.type === pattern;
  });
}

function isValidFile(file: File): boolean {
  if (file.size === 0 && !file.type) return false;
  if (props.maxSize && file.size > props.maxSize) return false;
  if (!matchesAccept(file)) return false;
  return true;
}

function readDirectory(entry: FileSystemDirectoryEntry, depth: number): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const reader = entry.createReader();
    const allEntries: FileSystemEntry[] = [];

    function readBatch() {
      reader.readEntries((entries) => {
        if (entries.length === 0) {
          resolve(processEntries(allEntries, depth));
        } else {
          allEntries.push(...entries);
          readBatch();
        }
      }, reject);
    }

    readBatch();
  });
}

async function processEntries(entries: FileSystemEntry[], depth: number): Promise<File[]> {
  const files: File[] = [];
  for (const entry of entries) {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) =>
        (entry as FileSystemFileEntry).file(resolve),
      );
      files.push(file);
    } else if (entry.isDirectory) {
      if (depth < 0 || depth > 0) {
        const next = depth < 0 ? -1 : depth - 1;
        const subFiles = await readDirectory(entry as FileSystemDirectoryEntry, next);
        files.push(...subFiles);
      }
    }
  }
  return files;
}

function setFiles(files: File[]) {
  if (props.disabled || props.readOnly) return;
  let validFiles = files.filter(isValidFile);
  if (props.directory && props.maxDepth >= 0) {
    validFiles = validFiles.filter((f) => {
      if (!f.webkitRelativePath) return true;
      const subdirLevels = f.webkitRelativePath.split("/").length - 2;
      return subdirLevels <= props.maxDepth;
    });
  }
  if (validFiles.length === 0) return;
  if (effectiveMultiple.value) {
    value.value = validFiles;
  } else {
    value.value = validFiles[0];
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    setFiles(Array.from(input.files));
  }
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

async function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
  if (props.disabled || props.readOnly) return;

  const items = e.dataTransfer?.items;
  if (items) {
    const allFiles: File[] = [];
    const promises: Promise<void>[] = [];

    for (let i = 0; i < items.length; i++) {
      const entry = items[i]?.webkitGetAsEntry?.();

      if (!entry) {
        const file = items[i].getAsFile();
        if (file) allFiles.push(file);
      } else if (entry.isFile) {
        promises.push(new Promise((resolve) => {
          (entry as FileSystemFileEntry).file((f) => {
            allFiles.push(f);
            resolve();
          });
        }));
      } else if (entry.isDirectory && props.directory) {
        promises.push(
          readDirectory(entry as FileSystemDirectoryEntry, props.maxDepth).then((files) => {
            allFiles.push(...files);
          }),
        );
      }
    }

    await Promise.all(promises);
    if (allFiles.length > 0) setFiles(allFiles);
  }
}

function trigger() {
  if (props.disabled || props.readOnly) return;
  fileInputRef.value?.click();
}

function removeFile(index: number) {
  if (!value.value) return;
  if (value.value instanceof File) {
    value.value = null;
    return;
  }
  if (Array.isArray(value.value)) {
    const arr = [...value.value];
    arr.splice(index, 1);
    value.value = arr.length > 0 ? arr : null;
  }
}

const get = () => value.value;
const set = (files: File | File[] | null) => { value.value = files as any; };
const reset = () => {
  value.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};
const focus = () => { dropFocus.value = true; };

defineExpose({ get, set, reset, focus, trigger });
</script>

<template>
  <div
    ref="dropZone"
    class="relative flex flex-col items-center justify-center gap-3 py-10 px-8 rounded-cu border-4 border-dashed cursor-pointer transition-all duration-200 min-h-[160px] font-sans select-none text-[var(--btn-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--btn-bd)]"
    :class="{
      'cursor-not-allowed opacity-70 ph-op-50': props.disabled,
      'bg-[var(--btn-bg-hover)] !border-[var(--btn-fg)]': isDragOver,
      'bg-[var(--btn-bg)] border-[var(--btn-bd)]': !isDragOver,
      'hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-fg)]': !props.disabled && !isDragOver,
      'bg-transparent border-none': props.variant === 'ghost',
      'bg-transparent': props.variant === 'none' || props.variant === 'outlined',
      'items-start justify-start': fileList.length > 0,
    }"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border || fgClass.main,
    }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="trigger"
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
      :multiple="effectiveMultiple"
      :webkitdirectory="props.directory || undefined"
      class="hidden"
      @change="handleFileSelect"
    />

    <svg
      v-if="fileList.length === 0"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-[var(--btn-fg)] opacity-60 shrink-0"
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>

    <div v-if="fileList.length === 0" class="text-center">
      <p class="text-sm font-medium text-[var(--btn-fg)]">{{ props.placeholder }}</p>
      <p v-if="props.accept" class="text-xs mt-1 text-[var(--btn-fg)] opacity-50">
        Formatos aceptados: {{ props.accept }}
      </p>
    </div>

    <FileList
      v-else
      :files="value"
      :color="props.color"
      :disabled="props.disabled"
      :hight-contrast="props.hightContrast"
      @remove="removeFile"
    />
  </div>
</template>

<style>
@unocss-placeholder;
</style>
