<script setup lang="ts">
import ToggleColorSheme from '@/components/buttons/ToggleColorSheme.vue'
import Navbar from '@/lib/navigation/Navbar.vue'

defineProps<{
  title?: string
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
    label: 'Components',
    children: [
      { label: 'Alert', path: '/playground/components/alert' },
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
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>
