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
    label: 'Buttons',
    children: [
      { label: 'Button', path: '/playground/buttons/button' },
      { label: 'ToggleColorScheme', path: '/playground/buttons/toggle-color-scheme' },
    ]
  },
  {
    label: 'Information',
    children: [
      { label: 'Alert', path: '/playground/information/alert' },
      { label: 'Badge', path: '/playground/information/badge' },
    ]
  },
  {
    label: 'Overlay',
    children: [
      { label: 'Modal', path: '/playground/overlay/modal' },
    ]
  },
  {
    label: 'Form',
    children: [
      { label: 'Switch', path: '/playground/form/switch' },
      { label: 'Checkbox', path: '/playground/form/checkbox' },
      { label: 'FileInput', path: '/playground/form/file-input' },
      { label: 'FileInputZone', path: '/playground/form/file-input-zone' },
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
