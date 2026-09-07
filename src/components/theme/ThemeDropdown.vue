<script setup lang="ts">
import { computed, ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import LucideChevronDown from "@/components/icons/LucideChevronDown.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";
import { theme, loaded, setTheme, getThemeNames, allThemes } from "@/plugins/cu-tokens";

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const searchQuery = ref("");

const themeNames = computed(() => (loaded.value ? getThemeNames() : []));
const current = computed(() => theme.value);

const filteredThemes = computed(() => {
  if (!searchQuery.value) return themeNames.value;
  const q = searchQuery.value.toLowerCase();
  return themeNames.value.filter((name) => name.toLowerCase().includes(q));
});

function label(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getThemeColor(name: string): string {
  return allThemes.value[name]?.colors?.primary || '#888888';
}

function select(name: string) {
  setTheme(name);
  searchQuery.value = "";
  dropdownRef.value?.close();
}
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    color="neutral"
    variant="ghost"
    position="bottom"
    align="end"
    panel-width="200px"
  >
    <template #toggle="{ toggle, isOpen }">
      <Button variant="ghost" color="neutral" @click="toggle" aria-label="Seleccionar tema">
        <span class="theme-dropdown-label">{{ current ? label(current) : "Tema" }}</span>
        <LucideChevronDown
          :class="['theme-dropdown-chevron', { 'theme-dropdown-chevron--open': isOpen }]"
        />
      </Button>
    </template>

    <div class="theme-dropdown-search">
      <Input
        v-model="searchQuery"
        placeholder="Buscar tema..."
        size="sm"
      />
    </div>

    <button
      v-for="name in filteredThemes"
      :key="name"
      type="button"
      role="menuitem"
      class="theme-dropdown-item"
      :class="{ 'theme-dropdown-item--active': current === name }"
      @click="select(name)"
    >
      <span class="theme-dropdown-item-label">
        <svg
          class="theme-dropdown-dot"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 32 32"
          :style="{ color: getThemeColor(name) }"
        >
          <path fill="currentColor" d="M16 0C7.161 0 0 7.161 0 16s7.161 16 16 16s16-7.161 16-16S24.839 0 16 0"/>
        </svg>
        {{ label(name) }}
      </span>
      <LucideCheck v-if="current === name" class="theme-dropdown-check" />
    </button>
  </Dropdown>
</template>

<style scoped>
.theme-dropdown-label {
  font-size: var(--cu-font-size-sm);
}

.theme-dropdown-search {
  padding: var(--cu-space-sm);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  margin-bottom: var(--cu-space-xs);
}

.theme-dropdown-chevron {
  transition: transform 150ms ease;
}

.theme-dropdown-chevron--open {
  transform: rotate(180deg);
}

.theme-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
  background: transparent;
  border: none;
  border-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  cursor: pointer;
  text-align: left;
}

.theme-dropdown-item:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.theme-dropdown-item--active {
  font-weight: var(--cu-font-weight-semibold);
}

.theme-dropdown-item-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-dropdown-dot {
  flex-shrink: 0;
}

.theme-dropdown-check {
  color: var(--cu-color-primary);
  flex-shrink: 0;
}
</style>
