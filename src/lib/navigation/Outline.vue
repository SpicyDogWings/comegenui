<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface OutlineItem {
  label: string
  id: string
}

const props = defineProps<{
  items: OutlineItem[]
  container?: string
}>()

const activeId = ref<string>('')

let observer: IntersectionObserver | null = null

onMounted(() => {
  const root = props.container ? document.querySelector(props.container) : null

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    {
      root: root,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  )

  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <nav class="cu-outline">
    <a
      v-for="item in items"
      :key="item.id"
      :href="`#${item.id}`"
      class="cu-outline-link"
      :class="{ 'is-active': activeId === item.id }"
    >
      {{ item.label }}
    </a>
  </nav>
</template>

<style scoped>
.cu-outline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
}

.cu-outline-link {
  padding: 0.375rem 0.75rem;
  border-radius: var(--cu-radius-md);
  text-decoration: none;
  color: var(--cu-color-neutral);
  font-size: var(--cu-font-size-sm);
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
}

.cu-outline-link:hover {
  background-color: var(--cu-color-primary-subtle-hover);
  color: var(--cu-color-primary);
}

.cu-outline-link.is-active {
  background-color: var(--cu-color-primary-soft);
  color: var(--cu-color-primary);
  font-weight: var(--cu-font-weight-medium);
  border-left-color: var(--cu-color-primary);
}
</style>
