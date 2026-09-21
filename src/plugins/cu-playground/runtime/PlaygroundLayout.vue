<script setup lang="ts">
import { computed, inject } from 'vue'
import { chromeKey, type NavItem } from '../chrome'
import { playgroundKey } from '../keys'
import { useLibStatus } from './useLibStatus'
import type { OutlineItem } from './outline'

defineProps<{
  title?: string
  outlineItems?: OutlineItem[]
}>()

// Chrome inyectado por el plugin (fallbacks mínimos si el host no pasa nada).
const chrome = inject(chromeKey)!

// Badge "En lib / No en lib": solo si el host configura libStatus.
const registry = inject(playgroundKey, null)
const { libKey, inLib, enabled } = useLibStatus(registry?.libStatus)

// Nav derivado del registry del plugin (categorías → componentes). Sin
// hardcodear entradas: se sincroniza solo con las stories registradas.
const navItems = computed<NavItem[]>(() => [
  { label: 'Components', children: registry?.nav() ?? [] },
])
</script>

<template>
  <component :is="chrome.appLayout">
    <template #title>
      <span class="playground-topbar-divider" aria-hidden="true"></span>
      <span class="playground-topbar-title">{{ title || 'Playground' }}</span>
    </template>
    <template #actions>
      <component
        :is="chrome.badge"
        v-if="enabled"
        :color="inLib ? 'success' : 'neutral'"
        variant="subtle"
        :title="`Entry point en src/lib: ${libKey}`"
      >
        {{ inLib ? 'En lib' : 'No en lib' }}
      </component>
    </template>
    <div class="playground">
      <aside class="playground-sidebar">
        <component :is="chrome.navbar" :items="navItems" search />
      </aside>
      <div class="playground-box">
        <component
          :is="chrome.outline"
          v-if="outlineItems"
          :items="outlineItems"
          class="playground-outline"
        />
        <slot />
      </div>
    </div>
  </component>
</template>

<style scoped>
.playground {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.playground :is(h1, h2, h3, h4, h5, h6, p, span, a, li, label) {
  color: var(--cu-color-neutral);
}

.playground-topbar-divider {
  width: 1px;
  height: 1.1rem;
  background: var(--cu-border-color);
}

.playground-topbar-title {
  font-size: var(--cu-font-size-sm);
  opacity: 0.55;
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

.playground-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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