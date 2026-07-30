<script setup lang="ts">
import ToggleColorSheme from '@/components/buttons/ToggleColorSheme.vue'
import Navbar from '@/components/lab/collapse/navigation/Navbar.vue'
import Outline from '@/components/lab/collapse/navigation/Outline.vue'
import type { OutlineItem } from '@/components/lab/collapse/navigation/Outline.vue'

defineProps<{
  title?: string
  outlineItems?: OutlineItem[]
}>()

const navItems = [
  {
    label: 'Theme Builder',
    children: [
      { label: 'Editor', path: '/playground/theme-builder' },
    ]
  },
  {
    label: 'Components',
    children: [
      { label: 'Button', path: '/playground/components/button' },
      { label: 'ToggleColorScheme', path: '/playground/components/toggle-color-scheme' },
      { label: 'Alert', path: '/playground/components/alert' },
      { label: 'Badge', path: '/playground/components/badge' },
      { label: 'Modal', path: '/playground/components/modal' },
      { label: 'Switch', path: '/playground/components/switch' },
      { label: 'Checkbox', path: '/playground/components/checkbox' },
      { label: 'Input', path: '/playground/components/input' },
      { label: 'Textarea', path: '/playground/components/textarea' },
      { label: 'Select', path: '/playground/components/select' },
      { label: 'Autocomplete', path: '/playground/components/autocomplete' },
      { label: 'FileInput', path: '/playground/components/file-input' },
      { label: 'FileInputZone', path: '/playground/components/file-input-zone' },
      { label: 'Dropdown', path: '/playground/components/dropdown' },
      { label: 'DropdownMenu', path: '/playground/components/dropdown-menu' },
      { label: 'Pagination', path: '/playground/components/pagination' },
      { label: 'Table', path: '/playground/components/table' },
      { label: 'AdvancedTable', path: '/playground/components/advanced-table' },
    ]
  },
]
</script>

<template>
  <section class="playground">
    <div class="playground-headerbar">
      <h1>{{ title || 'Playground' }}</h1>
      <ToggleColorSheme />
    </div>
    <div class="playground-body">
      <aside class="playground-sidebar">
        <Navbar :items="navItems" />
      </aside>
      <div class="playground-box">
        <Outline v-if="outlineItems" :items="outlineItems" class="playground-outline" />
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.playground {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--cu-color-surface);
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.playground :is(h1, h2, h3, h4, h5, h6, p, span, a, li, label) {
  color: var(--cu-color-neutral);
}

.playground-headerbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.playground-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.playground-sidebar {
  width: 250px;
  padding: 1rem;
  border-right: 1px solid var(--cu-border-color);
  overflow-y: auto;
}

.playground-box {
  flex: 1;
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;
  padding: 3rem;
}

.playground-outline {
  position: sticky;
  top: 2rem;
  min-width: 180px;
  flex-shrink: 0;
}
</style>

<style>
/* Shared playground utility classes */
.playground-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-content h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.playground-row--center {
  justify-content: center;
}

.playground-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}

.playground-code {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  opacity: 0.7;
  margin: 0;
}

.playground-btn-sm {
  font-size: var(--cu-font-size-xs) !important;
  padding: var(--cu-space-xs) var(--cu-space-sm) !important;
}

.playground-btn-lg {
  font-size: var(--cu-font-size-lg) !important;
  padding: var(--cu-space-lg) var(--cu-space-xl) !important;
}

.playground-badge-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--cu-font-size-sm);
}

.playground-badge-table th,
.playground-badge-table td {
  padding: var(--cu-space-sm) var(--cu-space-md);
  text-align: left;
}

.playground-badge-table th {
  font-weight: var(--cu-font-weight-medium);
  opacity: 0.6;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.playground-badge-table td {
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.playground-badge-label {
  opacity: 0.6;
  font-weight: var(--cu-font-weight-medium);
}
</style>
