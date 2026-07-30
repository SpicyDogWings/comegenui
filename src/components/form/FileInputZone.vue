<script setup lang="ts">
import { computed, ref, useTemplateRef, type PropType } from "vue";
import { useFocus } from "@vueuse/core";
import FileList from "../FileList.vue";

const value = defineModel<File | File[] | null>({ default: null });

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
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
  directoryDeep: {
    type: Number,
    required: false,
    default: 0,
  },
  maxHeight: {
    type: String,
    required: false,
    default: "",
  },
});

const effectiveMultiple = computed(() => props.multiple || props.directory);

const isDragOver = ref(false);
const dropZoneRef = useTemplateRef("dropZone");
const { focused: dropFocus } = useFocus(dropZoneRef);
const fileInputRef = useTemplateRef<HTMLInputElement>("fileInput");

const zoneStyles = computed(() => ({
  '--zone-bg': `var(--cu-color-${props.color})`,
  '--zone-ghost-hover': `var(--cu-color-${props.color}-ghost-hover)`,
  '--zone-text': `var(--cu-color-${props.color}-text)`,
}));

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
  if (props.directory && props.directoryDeep >= 0) {
    validFiles = validFiles.filter((f) => {
      if (!f.webkitRelativePath) return true;
      const subdirLevels = f.webkitRelativePath.split("/").length - 2;
      return subdirLevels <= props.directoryDeep;
    });
  }
  if (validFiles.length === 0) return;
  if (effectiveMultiple.value) {
    value.value = validFiles;
  } else {
    value.value = validFiles[0];
  }
}

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    setFiles(Array.from(input.files));
  }
}

function handleFileClick(index: number) {
  const files = fileList.value;
  const file = files[index];
  if (!file) return;
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
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
          readDirectory(entry as FileSystemDirectoryEntry, props.directoryDeep).then((files) => {
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
    class="cu-file-zone"
    :class="{
      'cu-file-zone--disabled': props.disabled,
      'cu-file-zone--drag-over': isDragOver,
      'cu-file-zone--empty': fileList.length === 0,
      'cu-file-zone--has-files': fileList.length > 0,
    }"
    :style="zoneStyles"
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
      class="cu-file-zone-hidden"
      @change="handleInputChange"
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
      class="cu-file-zone-icon"
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>

    <div v-if="fileList.length === 0" class="cu-file-zone-text">
      <p class="cu-file-zone-placeholder">{{ props.placeholder }}</p>
      <p v-if="props.accept" class="cu-file-zone-formats">
        Formatos aceptados: {{ props.accept }}
      </p>
    </div>

    <FileList
      v-else
      :files="value"
      :color="props.color"
      :disabled="props.disabled"
      :max-height="props.maxHeight"
      @remove="removeFile"
      @select="handleFileClick"
    />
  </div>
</template>

<style>
.cu-file-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
  padding: var(--cu-space-xl) var(--cu-space-2xl);
  border-radius: var(--cu-radius);
  border: var(--cu-border-thick) dashed var(--cu-border-color);
  cursor: pointer;
  transition: all 200ms ease;
  min-height: 160px;
  font-family: var(--cu-font-sans);
  user-select: none;
  color: var(--zone-text);
  box-sizing: border-box;
}

.cu-file-zone:focus {
  outline: none;
  border-color: var(--zone-bg);
  box-shadow: 0 0 0 2px var(--zone-bg);
}

.cu-file-zone:hover:not(.cu-file-zone--disabled) {
  border-color: var(--zone-bg);
  background-color: var(--zone-ghost-hover);
}

.cu-file-zone--disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.cu-file-zone--drag-over {
  border-color: var(--zone-bg);
  background-color: var(--zone-ghost-hover);
}

.cu-file-zone--empty {
  align-items: center;
  justify-content: center;
}

.cu-file-zone--has-files {
  align-items: flex-start;
  justify-content: flex-start;
}

.cu-file-zone-hidden {
  display: none;
}

.cu-file-zone-icon {
  color: var(--zone-text);
  opacity: 0.6;
  flex-shrink: 0;
}

.cu-file-zone-text {
  text-align: center;
}

.cu-file-zone-placeholder {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--zone-text);
  margin: 0;
}

.cu-file-zone-formats {
  font-size: var(--cu-font-size-xs);
  margin-top: var(--cu-space-2xs);
  color: var(--zone-text);
  opacity: 0.5;
}
</style>
