<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import Modal from "../overlay/Modal.vue";
import Input from "../form/Input.vue";
import Button from "../buttons/Button.vue";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
}

const props = defineProps({
  color: {
    type: String,
    default: "neutral",
  },
  title: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Buscar comandos…",
  },
  size: {
    type: String,
    default: "auto",
    validator: (value: string) => ["auto", "sm", "md", "lg", "xl", "full"].includes(value),
  },
  height: {
    type: String,
    default: "auto",
    validator: (value: string) => ["auto", "sm", "md", "lg", "xl", "full"].includes(value),
  },
  commands: {
    type: Array as () => CommandItem[],
    default: () => [],
  },
});

const emit = defineEmits(["select", "close"]);

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const search = ref("");
const activeIndex = ref(0);
const inputRef = ref<InstanceType<typeof Input> | null>(null);

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return props.commands;
  return props.commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.category?.toLowerCase().includes(q),
  );
});

const categories = computed(() => {
  const cats = new Set<string>();
  filtered.value.forEach((cmd) => cmd.category && cats.add(cmd.category));
  return Array.from(cats);
});

watch(filtered, () => {
  activeIndex.value = 0;
});

function open() {
  modalRef.value?.open();
  nextTick(() => inputRef.value?.focus());
}


function close() {
  modalRef.value?.close();
  search.value = "";
  activeIndex.value = 0;
}

function select(cmd: CommandItem) {
  cmd.action();
  emit("select", cmd);
  close();
}

function handleKeydown(event: KeyboardEvent) {
  if (!filtered.value.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % filtered.value.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + filtered.value.length) % filtered.value.length;
  } else if (event.key === "Enter") {
    event.preventDefault();
    const cmd = filtered.value[activeIndex.value];
    if (cmd) select(cmd);
  }
}

defineExpose({
  open,
  close,
  isOpen: () => modalRef.value?.isOpen() ?? false,
});
</script>

<template>
  <Modal ref="modalRef" :color="color" :title="title" :size="size" :height="height" @close="emit('close')">
    <div class="cu-command-palette" @keydown="handleKeydown">
      <div class="cu-command-palette-search">
        <Input
          ref="inputRef"
          v-model="search"
          :placeholder="placeholder"
          class="cu-command-palette-input"
        />
      </div>

      <div class="cu-command-palette-results">
        <template v-if="filtered.length">
          <Button
            v-for="(cmd, index) in filtered"
            :key="cmd.id"
            color="neutral"
            variant="ghost"
            class="cu-command-palette-item"
            :class="{ 'cu-command-palette-item--active': index === activeIndex }"
            @click="select(cmd)"
            @mouseenter="activeIndex = index"
          >
            <span v-if="cmd.icon" class="cu-command-palette-item-icon">{{ cmd.icon }}</span>
            <span class="cu-command-palette-item-label">{{ cmd.label }}</span>
            <span v-if="cmd.description" class="cu-command-palette-item-desc">{{ cmd.description }}</span>
            <span v-if="cmd.category" class="cu-command-palette-item-badge">{{ cmd.category }}</span>
            <span v-if="cmd.shortcut" class="cu-command-palette-item-shortcut">{{ cmd.shortcut }}</span>
          </Button>
            </template>
            <div v-else class="cu-command-palette-empty">
              No se encontraron comandos
            </div>
          </div>
        </div>
      </Modal>
    </template>

    <style scoped>
    .cu-command-palette {
      display: flex;
      flex-direction: column;
      max-height: 60vh;
    }

    .cu-command-palette-search {
      padding: 0.75rem;
      border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
    }

    .cu-command-palette-input {
      width: 100%;
    }

    .cu-command-palette-results {
      overflow-y: auto;
      padding: 0.5rem;
    }

    .cu-command-palette-item {
      width: 100%;
      text-align: left;
      border-radius: var(--cu-radius-sm);
      gap: 0.75rem;
    }

    .cu-command-palette-item--active {
      background-color: var(--cu-color-neutral-ghost-hover) !important;
    }

    .cu-command-palette-item :deep(.cu-command-palette-item-icon) {
      font-size: 1rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .cu-command-palette-item :deep(.cu-command-palette-item-label) {
      font-size: var(--cu-font-size-sm);
      color: var(--cu-color-neutral);
      flex: 1;
    }

    .cu-command-palette-item :deep(.cu-command-palette-item-desc) {
      font-size: var(--cu-font-size-xs);
      color: var(--cu-color-neutral);
      opacity: 0.5;
    }

    .cu-command-palette-item :deep(.cu-command-palette-item-badge) {
      font-size: var(--cu-font-size-xs);
      color: var(--cu-color-neutral);
      opacity: 0.6;
      padding: 0.125rem 0.5rem;
      border: var(--cu-border-thin) solid var(--cu-border-color);
      border-radius: var(--cu-radius-sm);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .cu-command-palette-item :deep(.cu-command-palette-item-shortcut) {
      font-family: var(--cu-font-mono);
      font-size: var(--cu-font-size-xs);
      color: var(--cu-color-neutral);
      opacity: 0.5;
      padding: 0.125rem 0.375rem;
      border: var(--cu-border-thin) solid var(--cu-border-color);
      border-radius: var(--cu-radius-sm);
      flex-shrink: 0;
    }

    .cu-command-palette-empty {
      padding: 1.5rem;
      text-align: center;
      font-size: var(--cu-font-size-sm);
      color: var(--cu-color-neutral);
      opacity: 0.5;
    }
    </style>
