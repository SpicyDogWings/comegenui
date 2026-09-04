<script setup lang="ts">
import { computed, ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import LucideChevronDown from "@/components/icons/LucideChevronDown.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";
import { theme, loaded, setTheme, getThemeNames } from "@/plugins/cu-tokens";

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

const themeNames = computed(() => (loaded.value ? getThemeNames() : []));
const current = computed(() => theme.value);

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function select(name: string) {
  setTheme(name);
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
    panel-width="180px"
  >
    <template #toggle="{ toggle, isOpen }">
      <Button variant="ghost" color="neutral" @click="toggle" aria-label="Seleccionar tema">
        <span class="theme-dropdown-label">{{ current ? capitalize(current) : "Tema" }}</span>
        <LucideChevronDown
          :class="['theme-dropdown-chevron', { 'theme-dropdown-chevron--open': isOpen }]"
        />
      </Button>
    </template>

    <button
      v-for="name in themeNames"
      :key="name"
      type="button"
      role="menuitem"
      class="theme-dropdown-item"
      :class="{ 'theme-dropdown-item--active': current === name }"
      @click="select(name)"
    >
      <span>{{ capitalize(name) }}</span>
      <LucideCheck v-if="current === name" class="theme-dropdown-check" />
    </button>
  </Dropdown>
</template>

<style scoped>
.theme-dropdown-label {
  font-size: var(--cu-font-size-sm);
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

.theme-dropdown-check {
  color: var(--cu-color-primary);
  flex-shrink: 0;
}
</style>
