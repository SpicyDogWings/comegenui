<script setup lang="ts">
import { computed, ref, watch, nextTick, type PropType } from 'vue';
import { isModalSize } from '@/utils/validators'
import Modal from "../overlay/Modal.vue";
import Input from "../form/Input.vue";
import Button from "../buttons/Button.vue";
import { useSearch } from "@/composables/useSearch";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  badges?: string[];
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
    type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>,
    default: "auto",
    validator: isModalSize,
  },
  height: {
    type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>,
    default: "auto",
    validator: isModalSize,
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

const searchItems = computed(() => props.commands);
const { filteredData: filtered } = useSearch(searchItems, {
  searchQuery: search,
  searchFields: ["label", "category"],
});

const grouped = computed(() => {
  const groups: { category: string; items: { cmd: CommandItem; index: number }[] }[] = [];
  const map = new Map<string, { cmd: CommandItem; index: number }[]>();
  let idx = 0;
  for (const cmd of filtered.value) {
    const key = cmd.category || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push({ cmd, index: idx });
    idx++;
  }
  for (const [category, items] of map.entries()) {
    groups.push({ category, items });
  }
  return groups;
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

/** Ejecuta el comando con ese id. */
function run(id: string): CommandItem | null {
  const cmd = props.commands.find((c) => c.id === id);
  if (!cmd) return null;
  cmd.action();
  emit("select", cmd);
  return cmd;
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
  run,
  getCommands: () => props.commands,
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
          <template v-for="group in grouped" :key="group.category">
            <div v-if="group.category" class="cu-command-palette-group-label">
              {{ group.category }}
            </div>
            <Button
              v-for="item in group.items"
              :key="item.cmd.id"
              color="neutral"
              variant="ghost"
              class="cu-command-palette-item"
              :class="{ 'cu-command-palette-item--active': item.index === activeIndex }"
              @click="select(item.cmd)"
              @mouseenter="activeIndex = item.index"
            >
              <span v-if="item.cmd.icon" class="cu-command-palette-item-icon">{{ item.cmd.icon }}</span>
              <span class="cu-command-palette-item-label">{{ item.cmd.label }}</span>
              <span v-if="item.cmd.description" class="cu-command-palette-item-desc">{{ item.cmd.description }}</span>
              <span
                v-for="badge in item.cmd.badges"
                :key="badge"
                class="cu-command-palette-item-badge"
              >{{ badge }}</span>
              <span v-if="item.cmd.shortcut" class="cu-command-palette-item-shortcut">{{ item.cmd.shortcut }}</span>
            </Button>
          </template>
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

    .cu-command-palette-group-label {
      padding: 0.5rem 0.75rem 0.25rem;
      font-size: var(--cu-font-size-xs);
      font-weight: var(--cu-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--cu-color-neutral);
      opacity: 0.5;
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
